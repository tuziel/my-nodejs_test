var express = require("express"),
	handlebars = require("express3-handlebars")
		.create({ defaultLayout: "main" }),
	getRandomNum = require("./lib/getRandomNum.js").getRandomNum;


var app = express();

app.engine("handlebars", handlebars.engine);

app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
	res.locals.showTests =
		app.get("env") !== "production" && req.query.test === "1";
	next();
})

app.get("/", function (req, res) {
	res.render("index", {
		randomNum: getRandomNum(0, 1000)
	});
})

app.get("/about", function (req, res) {
	res.render("about", {
		pageTestScript: "/qa/tests-about.js"
	});
})

app.use(function (req, res, next) {
	res.status(404);
	res.render("404");
})

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render("500");
})

app.listen(app.get("port"), function () {
	console.log("Server is running");
});