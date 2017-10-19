import { PATHS} from './constants';
import 'es6-promise/auto';
// import 'storm-outliner';
//import 'lazysizes' from 'lazysizes';
import Toggler from './require/toggler';
import AsyncHelper from './require/async-helper';
// import FontFaceObserver from './require/fontfaceobserver';
import Load from 'storm-load';

const onInit = [
	Toggler,
	AsyncHelper('tabs'),
	// AsyncComponentHelper('google-map').bind(null, () => {
	// 	GoogleMap.init(GOOGLE_MAP.SELECTOR, window.event_location, {
	// 		key: GOOGLE_MAP.KEY
	// 	});
	// }),
	// FontFaceObserver,
];

const onLoad = [];

{
	if(!Object.assign || !('classList' in document.createElement('_'))) 
		Load(`${PATHS.JS_ASYNC}/polyfills.min.js`)
			.then(() => { 
				onInit.forEach(fn => fn());
			});
	else onInit.forEach(fn => fn());

	onLoad.length && window.addEventListener('load', [].forEach.bind(onLoad, fn => fn()));

	//if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
}