describe("关于页面", function () {
	it("联系我们链接", function () {
		assert($('a[href="/contact"]').length);
	});
});