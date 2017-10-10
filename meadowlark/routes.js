var
	main = require("./handles/main.js"),
	api = require("./handles/api.js");

module.exports = function (app) {

	// 页面
	app.get("/", main.index);
	app.get("/about", main.about);
	app.get("/contact", main.contact);
	app.get("/block", main.block);
	app.get("/headers", main.headers);
	app.get("/signup", main.signup);
	app.get("/login", main.login);
	app.get("/vacations", main.vacations);
	app.get("/message", main.message);
	app.get("/error", main.error);

	// 接口
	app.post("/post", api.post);
	app.post("/process", api.process);
	app.get("/api/getAttractionList", api.getAttractionList);
	app.get("/api/getAttraction", api.getAttraction);
	app.post("/api/addAttraction", api.addAttraction);

	// 错误页面
	app.use(function (req, res) {
		res.status(404)
			.render("404");
	});

	// 服务器错误
	app.use(function (err, req, res) {
		console.error(err.stack);
		res.status(500)
			.render("500");
	});
};