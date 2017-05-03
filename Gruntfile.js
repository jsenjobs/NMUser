// for test

module.exports = function(grunt) {
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		concat:{
			options:{
				separator:';'
			},
			dist:{
				src:['app/**/*.js'],
				dest:'build/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files:{
					'build/<%= pkg.name %>.min.js':['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files:['Gruntfile.js', 'app/**/*.js'],
			options:{
				globals:{
					jQuery:true,
					console:true,
					module:true,
					document:true
				}
			}
		}
	});

	// 加载uglify任务所需要的插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// 导出任务
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};