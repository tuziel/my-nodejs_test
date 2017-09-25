// 引入全局模块
var express = require("express"),
	handlebars = require("express3-handlebars")
		.create({
			defaultLayout: "main",
			extname: "hbs"
		}),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	random = require("./lib/random.js"),
	getWeatherData = require("./lib/getWeatherData.js");

// 创建express实例
var app = express();

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
		_csrf = req.body._csrf || "",
		name = req.body.name || "",
		email = req.body.email || "";

	console.log("----------",
		"\n表单: ", form,
		"\nCSRF: ", _csrf,
		"\n用户名: ", name,
		"\n邮箱: ", email
	);

	req.session.flash = {
		type: "success",
		intro: "thank you",
		message: "感谢您的注册"
	};
	res.redirect(303, "/thank-you");
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
	console.log("Server is running");
});