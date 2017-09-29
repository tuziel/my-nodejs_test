// 引入全局模块
var cp = require("child_process"),

	express = require("express"),
	handlebars = require("express3-handlebars")
		.create({
			defaultLayout: "main",
			extname: "hbs"
		}),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	mongoose = require("mongoose"),

	random = require("./lib/random.js"),
	getWeatherData = require("./lib/getWeatherData.js"),

	Vacation = require("./models/vacation.js"),
	User = require("./models/user.js"),

	DB_URL = "mongodb://localhost:27017/meadowlark",

	// 创建express实例
	app = express();

// 使用handlebars模版引擎
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

// 设置服务器监听3000端口
app.set("port", process.env.PORT || 3000);

// 网站路径重定向到/public文件夹
app.use(express.static(__dirname + "/public"));

// 使用bodyParser解析请求
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 使用cookieParser解析cookie
app.use(cookieParser());

// 使用session管理会话
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true,
	cookie: {}
}));

// 检测test参数切换开发/生产版本
app.use(function (req, res, next) {
	res.locals.showTests =
		app.get("env") !== "production" && req.query.test === "1";
	next();
});

// 添加中间件getWeatherData
app.use(function (req, res, next) {
	if (!res.locals.partials) {
		res.locals.partials = {};
	}
	res.locals.partials.weather = getWeatherData();
	next();
});

// 即显消息？？？
app.use(function (req, res, next) {
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

// 设置主页
app.get("/", function (req, res) {
	req.session.userName = "tuziel";
	res.render("index", {
		randomNum: random.number(0, 1000)
	});
});

// 其他页面
app.get("/about", function (req, res) {
	res.render("about", {
		pageTestScript: "/qa/tests-about.js"
	});
});

app.get("/contact", function (req, res) {
	res.render("contact");
});

app.get("/block", function (req, res) {
	res.render("block", {
		currency: {
			name: "人民币",
			abbrev: "RMB"
		},
		tours: [
			{
				name: "广东",
				price: "￥159.95"
			},
			{
				name: "广西",
				price: "￥99.95"
			}
		],
		contact: "/contact",
		currencies: ["RMB", "HKD", "USD"]
	});
});

app.get("/headers", function (req, res) {
	var headers = req.headers,
		str = "";
	for (var name in req.headers) {
		str += name + ": " + headers[name] + "\n";
	}
	res.set("Content-Type", "text/plain")
		.send(str);
});

app.get("/signup", function (req, res) {
	res.render("signup", {
		csrf: "CSRF"
	});
});

app.get("/vacations", function (req, res) {
	Vacation.find({ available: true }, function (err, vacations) {
		var context = {
			vacations: vacations.map(function (vacation) {
				return {
					name: vacation.name,
					description: vacation.description,
					price: vacation.getDsiplayPrice(),
					available: vacation.available
				};
			})
		};
		res.render("vacations", context);
	});
});

app.get("/thank-you", function (req, res) {
	res.render("thank-you");
});

app.get("/error", function (req, res) {
	res.status(500)
		.render("500");
});

// 接口
app.post("/post", function (req, res) {
	var data = req.body;
	res.status(303)
		.render("post-success", {
			name: data.name,
			email: data.email
		});
});

app.post("/process", function (req, res) {
	var form = req.query.form || "",
		name = req.body.name || "",
		email = req.body.email || "";

	User.update(
		{
			email: email
		}, {
			name: name
		}, {
			upsert: true
		},
		function (err) {
			if (err) {
				console.error(err.stack);
				return res.redirect(500, "/error");
			}

			req.session.flash = {
				type: "success",
				intro: "thank you",
				message: "感谢您的注册"
			};
			return res.redirect(303, "/thank-you");
		}
	);
});

// 错误路径
app.use(function (req, res) {
	res.status(404)
		.render("404");
});

app.use(function (err, req, res) {
	console.error(err.stack);
	res.status(500)
		.render("500");
});

// 开启服务器监听端口
app.listen(app.get("port"), function () {
	var uri = "http://localhost:" + app.get("port");

	console.log("服务已启动\n" +
		"工作环境为: " + app.get("env") + "\n" +
		"主页地址: " + uri + "\n" +
		"按下 Ctrl-C 停止服务" + "\n");

	cp.exec("start " + uri);
});

// 连接数据库
mongoose.connect(DB_URL, {
	useMongoClient: true,
});

// 连接成功
mongoose.connection.on("connected", function () {
	console.log("连接到数据库 " + DB_URL);
});

// 连接异常
mongoose.connection.on("error", function (err) {
	console.log("连接数据库发生错误: " + err);
});

// 连接断开
mongoose.connection.on("disconnected", function () {
	console.log("与数据库连接断开");
});

Vacation.find(function (err, vacations) {
	if (vacations.length) {
		return;
	}

	new Vacation({
		name: "广州",
		category: "一日游",
		description: "广州一日游，大城市",
		price: 15888,
		tags: ["一日游", "广州", "买买买"],
		available: true,
		maxGuest: 30
	}).save();

	new Vacation({
		name: "深圳",
		category: "一日游",
		description: "享受快节奏生活",
		price: 18888,
		tags: ["一日游", "深圳"],
		available: false,
		maxGuest: 20
	}).save();

	new Vacation({
		name: "东莞",
		category: "三日游",
		description: "极致服务",
		price: 99999,
		tags: ["三日游", "东莞", "大保健"],
		available: true,
		maxGuest: 10,
		notes: "并没有特殊服务"
	}).save();
});