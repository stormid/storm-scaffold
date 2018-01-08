// Autoprefixer settings
const browsers = [
	'ie >= 9',
	'ie_mob >= 10',
	'ff >= 20',
	'chrome >= 4',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Build root destination / webroot for serve
const staticOutputDir = 'build';
const dynamicOutputDir = '../Production/src/';

const assets = '/static';

// Paths for source and destinations
const paths = {
	root: {
		static: staticOutputDir,
		dynamic: dynamicOutputDir
	},
	assets: assets,
	src: {
		css: 'src/scss/',
		js: 'src/js/',
		html: 'src/templates/',
		img: 'src/img/',
		fonts: 'src/fonts/',
		static: 'src/static/'
	},
	dest: {
		development: {
			css: `${staticOutputDir}${assets}/css/`,
			js:  `${staticOutputDir}${assets}/js/`,
			html: staticOutputDir,
			img: `${staticOutputDir}${assets}/img/`,
			static: `${staticOutputDir}${assets}/`
		},
		production: {
			css: `${dynamicOutputDir}${assets}/css/`,
			js:  `${dynamicOutputDir}${assets}/js/`,
			html: staticOutputDir,
			img: `${dynamicOutputDir}${assets}/img/`,
			static: `${dynamicOutputDir}${assets}/`
		},

	}
};

module.exports = {
    browsers,
    paths
};