var express = require("express"),
	handlebars = require("express3-handlebars")
		.create({ defaultLayout: "main" }),
	bodyParser = require("body-parser"),
	getRandomNum = require("./lib/getRandomNum.js").getRandomNum;


var app = express();

app.engine("handlebars", handlebars.engine);

app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.locals.showTests =
		app.get("env") !== "production" && req.query.test === "1";
	next();
});

app.get("/", function (req, res) {
	res.render("index", {
		randomNum: getRandomNum(0, 1000)
	});
});

app.get("/about", function (req, res) {
	res.render("about", {
		pageTestScript: "/qa/tests-about.js"
	});
});

app.get("/contact", function (req, res) {
	res.render("contact");
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

app.get("/error", function (req, res) {
	res.status(500)
		.render("500");
});

app.post("/post", function (req, res) {
	var data = req.body;
	res.status(303)
		.render("post-success", {
			name: data.name,
			email: data.email
		});
});

app.use(function (req, res) {
	res.status(404)
		.render("404");
});

app.use(function (err, req, res) {
	console.error(err.stack);
	res.status(500)
		.render("500");
});

app.listen(app.get("port"), function () {
	console.log("Server is running");
});