var
	random = require("../lib/random.js"),
	Vacation = require("../models/vacation.js");

module.exports = {

	// 主页
	index: function (req, res) {
		res.render("index", {
			title: "主页",
			randomNum: random.number(0, 100)
		});
	},

	// 请求内容
	headers: function (req, res) {
		var headers = req.headers,
			str = "";
		for (var name in req.headers) {
			str += name + ": " + headers[name] + "\n";
		}
		res.set("Content-Type", "text/plain")
			.send(str);
	},

	// 关于我们
	about: function (req, res) {
		res.render("about", {
			title: "关于我们",
			pageTestScript: "/qa/tests-about.js"
		});
	},

	// 联系我们
	contact: function (req, res) {
		res.render("contact", {
			title: "联系我们"
		});
	},

	// 我也不知道这是什么
	block: function (req, res) {
		res.render("block", {
			title: "？？？",
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
	},

	// 注册
	signup: function (req, res) {
		var code = random.number(0, 1e6);
		req.session.code = code;
		res.render("signup", {
			title: "注册",
			code: code
		});
	},

	// 登录
	login: function (req, res) {
		res.render("login", {
			title: "登录",
		});
	},

	// 旅游选择
	vacations: function (req, res) {
		Vacation.find({ available: true }, function (err, vacations) {
			var context = {
				title: "旅游",
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
	},

	// 消息提示
	message: function (req, res) {
		res.render("message", {
			title: "消息提示",

		});
	},

	// 错误页面
	error: function (req, res) {
		res.status(500)
			.render("500", {
				title: "错误",
			});
	}
};