var
	User = require("../models/user.js"),
	Attraction = require("../models/attraction.js");

function signup(req, res) {
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

function login(req, res) {
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

function logout(req, res) {
	delete req.session.name;
	req.session.flash = {
		type: "success",
		intro: "logout",
		message: "已退出登录"
	};
	return res.redirect(303, "/message");
}

module.exports = {

	// 联系我们
	post: function (req, res) {
		var data = req.body;
		res.status(303)
			.render("post-success", {
				name: data.name,
				email: data.email
			});
	},

	// 账户
	process: function (req, res) {
		var form = req.query.form || "";

		if (form === "signup") {
			signup(req, res);
		} else if (form === "login") {
			login(req, res);
		} else if (form === "logout") {
			logout(req, res);
		}
	},

	// 获取景点列表
	getAttractionList: function (req, res) {
		Attraction.find({
			approved: true
		}, function (err, attractions) {
			if (err) {
				return res.send(500, "数据库发生错误");
			}
			res.json(attractions.map(function (a) {
				return {
					name: a.name,
					id: a._id,
					description: a.description,
					location: a.location
				};
			}));
		}
		);
	},

	// 获取景点信息
	getAttraction: function (req, res) {
		Attraction.findById(
			req.params.id,
			function (err, a) {
				if (err) {
					return res.send(500, "数据库发生错误");
				}
				res.json({
					name: a.name,
					id: a._id,
					description: a.description,
					location: a.location
				});
			});
	},

	// 添加景点
	addAttraction: function (req, res) {
		var
			data = req.body,
			a = new Attraction({
				name: data.name,
				description: data.description,
				location: {
					lat: data.lat,
					lng: data.lng
				},
				history: {
					event: "created",
					email: data.email,
					date: new Date()
				},
				approved: false
			});
		a.save(function (err, a) {
			if (err) {
				return res.send(500, "数据库发生错误");
			}
			res.json({
				id: a._id
			});
		});
	}
};