var mongoose = require("mongoose"),

	users = mongoose.Schema({
		name: String,
		email: String
	});

module.exports = mongoose.model("User", users);