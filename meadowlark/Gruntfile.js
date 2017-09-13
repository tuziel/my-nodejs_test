module.exports = function (grunt) {

	// 引入中间件
	[
		"grunt-mocha-test",
		"grunt-eslint"
	].forEach(function (task) {
		grunt.loadNpmTasks(task);
	});

	// 设置grunt默认任务
	grunt.initConfig({
		// 设置mocha任务
		mochaTest: {
			test: {
				options: {
					reporter: "spec",

					// 输出报表
					captureFile: "log/mocha-report.txt",
				},
				src: ["public/qa/tests-randomNum.js"]
			}
		},

		// 设置eslint任务
		eslint: {
			options: {
				// 配置文件
				configFile: "../.eslintrc.js",
				ignorePath: "../.eslintignore",

				// 是否只显示错误
				quiet: true,

				// 输出报表
				// outputFile: "log/eslint-report.txt"
			},
			target: ["**/*.js"]
		}
	});

	grunt.registerTask("default", ["mochaTest", "eslint"]);
};