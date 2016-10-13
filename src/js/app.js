import Polyfill from './polyfills';
import Outliner from './require/outliner';
import FontFaceObserver from 'FontFaceObserver';
import Picturefill from 'picturefill';
import * as Toggler from './require/toggler';
import Load from './require/loader.js';

//when DOMContentLoaded, run these tasks
const onDOMContentLoadedTasks = [
        () => {
            //togglers
            if(!(document.querySelector('.js-toggle, .js-toggle-local'))) return; 
            !!document.querySelector('.js-toggle') && Toggler.init('.js-toggle');
            !!document.querySelector('.js-toggle-local') && Toggler.init('.js-toggle-local', {targetLocal: true});
        },
        () => {
            //font face observer
            let ffo = new FontFaceObserver('', {})
                .load()
                .then(function () {
                    d.documentElement.className = document.documentElement.className.replace(/\bno-webfonts\b/,'');
                }, function () {
                    console.log('Font is not available after waiting 3 seconds');
                });
        },
        () => {
            //tabs
            if(!(document.querySelector('.js-tabs'))) return;

            Load('/content/js/async/storm-tabs.js').then(() => {
                StormTabs.init('.js-tabs');
            });
        }
    ];

//when page Loaded, run these tasks
const onLoadTasks = [];

if('addEventListener' in window) 
    Polyfill()
        .then(() => {
            !!onDOMContentLoadedTasks.length && window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn.call()); });
            !!onLoadTasks.length && window.addEventListener('load', () => { onLoadTasks.forEach((fn) => fn.call()); });
        });