// 引入全局模块
var cp = require("child_process"),

	express = require("express"),
	// connect = require("connect"),
	handlebars = require("express3-handlebars")
		.create({
			defaultLayout: "main",
			extname: "hbs"
		}),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	// SessionStore = require("session-mongoose")(connect),

	random = require("./lib/random.js"),
	getWeatherData = require("./lib/getWeatherData.js"),

	Vacation = require("./models/vacation.js"),
	User = require("./models/user.js"),

	DB_URL = "mongodb://localhost:27017/meadowlark",

	// store = new SessionStore({ url: DB_URL }),

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
	// store: store,
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

// 显示用户名
app.use(function (req, res, next) {
	var name = req.session.name;
	name && (res.locals.name = req.session.name);
	next();
});

// 设置主页
app.get("/", function (req, res) {
	res.render("index", {
		randomNum: random.number(0, 100)
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
	var code = random.number(0, 1e6);
	req.session.code = code;
	res.render("signup", {
		code: code
	});
});

app.get("/login", function (req, res) {
	res.render("login");
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

app.get("/message", function (req, res) {
	res.render("message");
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
	var form = req.query.form || "";

	function signup() {
		var name = req.body.name || "",
			email = req.body.email || "",
			code = req.body.code || "";

		if (!name || !email) {
			req.session.flash = {
				type: "error",
				intro: "empty value",
				message: "请输入完整的信息"
			};
			return res.redirect(303, "/message");
		}

		if (+code !== req.session.code) {
			req.session.flash = {
				type: "error",
				intro: "code error",
				message: "验证码不正确"
			};
			return res.redirect(303, "/message");
		}

		User.find({
			email: email
		}, function (err, users) {
			if (users.length) {
				req.session.flash = {
					type: "error",
					intro: "already exists",
					message: "该邮箱已被使用"
				};
				return res.redirect(303, "/message");

			} else {
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

						req.session.name = name;
						req.session.flash = {
							type: "success",
							intro: "thank you",
							message: "感谢您的注册"
						};
						return res.redirect(303, "/message");
					}
				);
			}
		});
	}

	function login() {
		var name = req.body.name || "",
			email = req.body.email || "";

		User.find({
			email: email
		}, function (err, users) {
			if (!users.length) {
				req.session.flash = {
					type: "error",
					intro: "user error",
					message: "该邮箱不存在"
				};
				return res.redirect(303, "/message");
			}

			if (users[0].name === name) {
				req.session.name = name;
				req.session.flash = {
					type: "success",
					intro: "login",
					message: "登录成功"
				};
				return res.redirect(303, "/message");

			} else {
				req.session.flash = {
					type: "error",
					intro: "input error",
					message: "用户名与邮箱不匹配"
				};
				return res.redirect(303, "/message");
			}
		});
	}

	function logout() {
		delete req.session.name;
		req.session.flash = {
			type: "success",
			intro: "logout",
			message: "已退出登录"
		};
		return res.redirect(303, "/message");
	}

	if (form === "signup") {
		signup();
	} else if (form === "login") {
		login();
	} else if (form === "logout") {
		logout();
	}
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
		"按下 Ctrl-C 停止服务");

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