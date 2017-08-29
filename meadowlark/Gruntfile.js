module.exports = function (grunt) {

	[
		"grunt-mocha-test",
		"grunt-eslint"
	].forEach(function (task) {
		grunt.loadNpmTasks(task);
	});

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: "spec",
					captureFile: "results.txt",
				},
				src: ["public/qa/tests-randomNum.js"]
			}
		},
		eslint: {
			target: ["index.js"]
		}
	});

	grunt.registerTask("default", ["mochaTest", "eslint"]);
};