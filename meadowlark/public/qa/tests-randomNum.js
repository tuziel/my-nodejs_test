var getRandomNum = require("../../lib/getRandomNum.js").getRandomNum,
	expect = require("chai").expect;

suite("随机数测试", function () {
	test("输出是否为数字", function () {
		expect(typeof getRandomNum() === "number");
	});
});