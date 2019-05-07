import { PATHS } from './constants';
import Promise from 'promise-polyfill';
import Load from 'storm-load';
const r = f => f();
const onInit = [];

{
    window.Promise = window.Promise ? window.Promise : Promise;
    document.documentElement.className = document.documentElement.className.split('no-js').join('');

    if (!Object.assign) {
        Load(`${PATHS.JS_ASYNC}/polyfills.min.js`).then(() => onInit.map(r));
    } else onInit.map(r);
}
