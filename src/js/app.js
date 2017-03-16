import CONSTANTS from './constants';
import 'es6-promise/auto';
import './require/outliner';
import Toggler from './require/toggler';
// import FontFaceObserver from './require/fontfaceobserver';
import Load from 'storm-load';

const onDOMContentLoadedTasks = [
	Toggler,
	// FontFaceObserver,
	() => {
		if(!document.querySelector(CONSTANTS.TABS.SELECTOR)) return;

		Load(`${CONSTANTS.PATHS.JS_ASYNC}/storm-tabs.js`)
			.then(() => { StormTabs.init(CONSTANTS.TABS.SELECTOR); });
	}
];

//add post-load event tasks to this array
//const onLoadTasks = [];

const init = () => {
	if(!Object.assign || !('classList' in document.createElement('_'))) 
		Load(`${CONSTANTS.PATHS.JS_ASYNC}/polyfills.js`)
			.then(() => {
				onDOMContentLoadedTasks.forEach(fn => fn());
			});
	else onDOMContentLoadedTasks.forEach(fn => { fn(); });
};

//attach anything you wish to expose on a window level here
//global.UI = {};

if('addEventListener' in window)
	onDOMContentLoadedTasks.length && window.addEventListener('DOMContentLoaded', init);
	//onLoadTasks.length && window.addEventListener('load', () => { onLoadTasks.forEach((fn) => fn()); });