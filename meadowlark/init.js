var
	Vacation = require("./models/vacation.js");

module.exports = function () {
	Vacation.find(function (err, vacations) {
		if (vacations.length) {
			return;
		}

		new Vacation({
			name: "广州",
			category: "一日游",
			description: "广州一日游，大城市",
			price: 15888,
			tags: ["一日游", "广州", "买买买"],
			available: true,
			maxGuest: 30
		}).save();

		new Vacation({
			name: "深圳",
			category: "一日游",
			description: "享受快节奏生活",
			price: 18888,
			tags: ["一日游", "深圳"],
			available: false,
			maxGuest: 20
		}).save();

		new Vacation({
			name: "东莞",
			category: "三日游",
			description: "极致服务",
			price: 99999,
			tags: ["三日游", "东莞", "大保健"],
			available: true,
			maxGuest: 10,
			notes: "并没有特殊服务"
		}).save();
	});
};