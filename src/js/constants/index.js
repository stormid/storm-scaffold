const extractPathName = () => {
	let scripts = document.getElementsByTagName('script'),
		pathName = scripts[scripts.length-1].src;
	
	return pathName.substr(0, pathName.lastIndexOf('/'));
};

export const PATHS = {
	JS_ASYNC: `${extractPathName()}/async`
};

export const AI = {
	META: 'data-ai'
};

export const FONTS = [''];

// export const TOGGLES = {
// 	SELECTOR:{
// 		GLOBAL: '.js-toggle',
// 		LOCAL: '.js-toggle-local'
// 	},
// 	OPTIONS: {
// 		LOCAL: {
// 			local: true
// 		}
// 	}
// };

// export const TABS = {
// 	SELECTOR: '.js-tabs'
// };

