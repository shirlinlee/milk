const sass = require('node-sass')
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			options: {
				livereload: 35730,
				livereloadOnError: false,
				spawn: false,
			},
			scss: {
				files: ['src/sass/**/*.sass', 'src/sass/**/*.scss'],
				tasks: ['sass', 'postcss'],
				options: {
					interrupt: true,
				},
			},
			pug: {
				files: ['src/pug/**/*.pug'],
				tasks: ['pug'],
				options: {
					interrupt: true,
				},
			},
		},
		pug: {
			compile: {
				options: {
					pretty: true,
				},
				files: [
					{
						src: [
							'**/*.pug',
							'!**/_*.pug',
							'!**/{examples,includes,layouts,mixins,components}/*.pug',
						],
						dest: 'www/',
						ext: '.html',
						cwd: 'src/pug/',
						expand: true,
					},
				],
			},
		},
		sass: {
			dist: {
				options: {
					implementation: sass,
					outputStyle: 'expanded',
					sourceMap: false,
				},
				files: [
					{
						expand: true,
						cwd: 'src/sass/',
						src: ['*.scss'],
						dest: 'www/css/',
						ext: '.css',
					},
				],
			},
		},
		postcss: {
			options: {
				map: false,
				processors: [require('autoprefixer')],
			},
			dist: {
				src: ['www/css/*.css'],
			},
		},
	})

	// Load the Grunt plugins.
	grunt.loadNpmTasks('grunt-sass')
	grunt.loadNpmTasks('grunt-postcss')
	grunt.loadNpmTasks('grunt-contrib-pug')
	grunt.loadNpmTasks('grunt-contrib-watch')

	// Set task aliases
	grunt.registerTask('default', ['watch'])
	grunt.registerTask('build', ['pug', 'sass', 'postcss'])
}
