const paths = {
	public: '../public',
	staticAssets: 'static',
	eject: '../ejected',
	artefacts: '../artefacts',
	src: {
		css: '../app/ui/scss',
		js: '../app/ui/js',
		html: '../app/ui/templates',
		img: '../app/ui/img',
		staticAssets: '../app/static-assets',
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