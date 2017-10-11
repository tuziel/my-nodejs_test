/* global describe it */

var random = require("../../lib/random.js"),
	expect = require("chai").expect;

describe("随机数测试", function () {
	it("输出是否为数字", function () {
		expect(typeof random.number() === "number");
	});
});