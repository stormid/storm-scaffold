const paths = {
	public: './public',
	staticAssets: 'static',
	eject: './ejected',
	artefacts: './artefacts',
	src: {
		css: './app/scss',
		js: './app/js',
		html: './app/templates',
		img: './app/img',
		staticAssets: './app/static-assets',
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