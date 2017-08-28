describe("全局测试", function () {
	it("页面标题", function () {
		assert(document.title &&
			document.title.match(/\S/) &&
			document.title.toUpperCase() !== "TODO");
	});
});