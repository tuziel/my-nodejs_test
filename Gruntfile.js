module.exports = function (grunt) {

	// 引入中间件
	[
		"grunt-contrib-less",
		"grunt-contrib-uglify",
		"grunt-contrib-cssmin",
		"grunt-mocha-test",
		"grunt-eslint"
	].forEach(function (task) {
		grunt.loadNpmTasks(task);
	});

	// 设置grunt默认任务
	grunt.initConfig({
		// 设置less任务
		less: {
			development: {
				files: {
					"public/css/style.css": "less/style.less",
					"public/css/theme.css": "less/theme.less",
				}
			}
		},

		// 压缩css文件
		cssmin: {
			combine: {
				files: {
					"public/css/main.cb.css": [
						"public/css/**/*.css",
						"!public/css/main*.css"
					]
				}
			},
			minify: {
				src: "public/css/main.css",
				dest: "public/css/main.min.css"
			}
		},

		// 压缩js文件
		uglify: {
			all: {
				files: {
					"public/js/main.min.js": [
						"public/js/**/*.js"
					]
				}
			}
		},

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

	grunt.registerTask("default", ["less", "cssmin", "uglify"]);
	grunt.registerTask("test", ["mochaTest", "eslint"]);
};