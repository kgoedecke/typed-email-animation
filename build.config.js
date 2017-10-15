module.exports = {

	build_dir: 'build/',
	compile_dir: 'compile/',

	web: {
		js: [
			'assets/js/**/*.js',
		],
		less: 'assets/less/style.less',
		sass: '',
		assets: 'assets/img/*'
	},

	index: 'index.html',
	less_files: 'assets/less/**/*.less',
	assets: 'src/assets/**',
	components: [],

	vendor: {
		js: [
			'node_modules/typed.js/lib/typed.min.js'
		],
		assets: [
		],
		css: []
	},

};
