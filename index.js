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

	getWeatherData = require("./lib/getWeatherData.js"),

	init = require("./init.js"),
	routes = require("./routes.js"),

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
	cookie: {
		maxAge: 36e5
	}
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

// 路由
routes(app);

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

// 数据初始化
init();