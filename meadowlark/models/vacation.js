var mongoose = require("mongoose"),
	DB_URL = "mongodb://localhost:27017/meadowlark",

	vacations = mongoose.Schema({
		name: String,
		category: String,
		description: String,
		price: Number,
		tags: [String],
		available: Boolean,
		maxGuest: Number,
		notes: String
	});

vacations.methods.getDsiplayPrice = function () {
	return "￥" + (this.price / 100).toFixed(2);
};

module.exports = mongoose.model("Vacation", vacations);