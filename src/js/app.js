//Closure to encapsulate all JS
var UTILS = {
		attributelist: require('storm-attributelist')
	},
    UI = (function(w, d) {
            'use strict';

            var LoadScript = function(src, cb) {
                    var t = document.createElement('script'),
                        s = document.getElementsByTagName('script')[0];
                    t.async = true;
                    t.src = 'https://apis.google.com/js/plusone.js?onload=onLoadCallback';
                    s.parentNode.insertBefore(t, s);
                    t.onload = cb;
                },
                Skip = require('storm-skip'),
                Outliner = require('storm-outliner'),
                FontFaceObserver = require('FontFaceObserver'),
                Picturefill = require('picturefill'),
                Toggler = require('storm-toggler'),
                initFonts = function(){
                    var ffo = new FontFaceObserver('Font family name here', {})
                        .load()
                        .then(function () {
                            d.documentElement.className = document.documentElement.className.replace(/\bno-webfonts\b/,'');
                        }, function () {
                            console.log('Font is not available after waiting 3 seconds');
                        });
                },/*
                initAsyncExample = function(){
                    //detect and return if not needed
                    if(!(d.querySelector('.js-className'))) { return; } 
                    //loaded async as required
                    load('/content/js/async/module.min.js', function(err){
                        if(err) {
                            return console.log(err);
                        }
                        Module.init('.js-className');
                    });
                },*/
                polyfill = function(){
                    LoadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Element.prototype.classList&gated=1', init);
                },
				initTogglers = function() {
                    if(!(d.querySelector('.js-toggle'))) { return; } 
					Toggler.init('.js-toggle');
                    Toggler.init('.js-toggle-local', {targetLocal: true});
				},
                init = function() {
                    //if you want to use font-face observer, set the font-family names in the array on line 9
                    //otherwise delete all fonts/FontFaceObserver references from this file and the no-=webfonts className from the docElement and typography SCC 
                    initFonts();

                    initTogglers();

                    //initAsyncExample();
                },
                run = function(){
                    
                },
                load = function(){};

            //Interface with/entry point to site JS
            return {
                polyfill: polyfill,
				load: load
            };

        }(window, document, undefined));

global.STORM = {
    UI: UI,
    UTILS: UTILS
};

//Cut the mustard
//Don't run any JS if the browser can't handle it
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.polyfill, false);
if('addEventListener' in window) window.addEventListener('load', STORM.UI.load, false);
