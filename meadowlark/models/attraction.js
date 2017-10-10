var mongoose = require("mongoose"),

	// 景点模型
	attractions = mongoose.Schema({
		name: String,
		description: String,
		location: {
			lat: Number,
			lng: Number
		},
		history: {
			event: String,
			notes: String,
			email: String,
			date: Date
		},
		updateId: String,
		approved: Boolean
	});

module.exports = mongoose.model("Attraction", attractions);