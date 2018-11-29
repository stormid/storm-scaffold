const paths = {
	build: './build',
	assets: '/static',
	artefacts: './artefacts',
	src: {
		css: './src/scss',
		js: './src/js',
		html: './src/templates',
		dom: './src/dom',
		img: './src/img',
		staticAssets: './src/static-assets'
	}
};
const banner = [
	'/**',
	' * @name <%= pkg.name %>',
	' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
	' */'
].join('\n');

module.exports = {
	paths,
	banner
};