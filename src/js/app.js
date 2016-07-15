//Closure to encapsulate all JS
var STORM,
    UTILS = {
		attributelist: require('storm-attributelist')
	},
    UI = (function(w, d) {
            'use strict';

            var load = function(src, cb) {
                    var t = document.createElement('script'),
                        s = document.getElementsByTagName('script')[0];
                    t.async = true;
                    t.src = 'https://apis.google.com/js/plusone.js?onload=onLoadCallback';
                    s.parentNode.insertBefore(t, s);
                    t.onload = cb;
                },
                ffo = require('FontFaceObserver'),
                picturefill = require('picturefill'),
                loadScript = require('load-script'),
                Toggler = require('storm-toggler'),
                initFonts = function(){
                    var ffo = new FontFaceObserver('Name of your font', {})
                        .check()
                        .then(function () {
                            d.documentElement.className = document.documentElement.className.replace(/\bno-webfonts\b/,'');
                        }, function () {
                            console.log('Font is not available after waiting 5 seconds');
                        });
                },
                initForrms = function(){
                    //detect and return if not needed
                    if(!(d.querySelector('.js-forrm'))) { return; } 
                    //loaded async as required
                    UTILS.loadScript('/content/js/async/forrm.min.js', function(err){
                        if(err) {
                            return console.log(err);
                        }
                        Forrm.init('.js-forrm');
                    });
                },
                polyfill = function(){
                    load('https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Element.prototype.classList&gated=1', init);
                },
				initTogglers = function() {
                    if(!(d.querySelector('.js-toggle'))) { return; } 
					Toggler.init('.js-toggle');
                    Toggler.init('.js-toggle-local', {targetLocal: true});
				},
                init = function() {
                    //initialise everything
                    initFonts();
                    initForrms();
                    initTogglers();
                },
                run = function(){
                    
                };

            //Interface with/entry point to site JS
            return {
                polyfill: polyfill,
				load: load
            };

        }(window, document, undefined));

STORM = {
    UI: UI,
    UTILS: UTILS
};

//Cut the mustard
//Don't run any JS if the browser can't handle it
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.polyfill, false);
if('addEventListener' in window) window.addEventListener('load', STORM.UI.load, false);
