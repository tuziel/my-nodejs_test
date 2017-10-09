var
	User = require("../models/user.js");

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
};