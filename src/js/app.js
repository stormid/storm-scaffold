import { PATHS } from './constants';
import Promise from 'promise-polyfill';
import Load from 'storm-load';
const initStack = [];

{
    window.Promise = window.Promise ? window.Promise : Promise;
    document.documentElement.className = document.documentElement.className.split('no-js').join('');

    if (!Object.assign) Load(`${PATHS.JS_ASYNC}/polyfills.min.js`).then(() => initStack.map(fn => fn()));
    else initStack.map(fn => fn());
}
