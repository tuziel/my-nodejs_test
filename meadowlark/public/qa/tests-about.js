/* global suite test assert $ */

suite("关于页面", function () {
	test("联系我们链接", function () {
		assert($("a[href='/contact']").length);
	});
});