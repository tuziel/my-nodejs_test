module.exports = function (grunt) {

	[
		"grunt-mocha-test",
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
				src: ["public/qa/tests-*.js"]
			}
		},
		eslint: {
			target: ["*.js", "lib/**/*.js"]
		}
	});

	grunt.registerTask("default", ["mochaTest", "eslint"]);
};