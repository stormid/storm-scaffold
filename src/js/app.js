//Closure to encapsulate all JS
var STORM,
    UTILS = {
		assign: require('object-assign'),
		merge: require('merge'),
		attributelist: require('storm-attributelist'),
		classlist: require('dom-classlist'),
		loadScript: require('load-script')
	},
    UI = (function(w, d) {
            'use strict';

            var ffo = require('FontFaceObserver'),
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
				initTogglers = function() {
                    if(!(d.querySelector('.js-toggle'))) { return; } 
					Toggler.init('.js-toggle');
                    Toggler.init('.js-toggle-local', {targetLocal: true});
				},
				load = function(){},
                init = function() {
                    //initialise everything
                    initFonts();
                    initForrms();
                    initTogglers();
                };

            //Interface with/entry point to site JS
            return {
                init: init,
				load: load
            };

        }(window, document, undefined));

STORM = {
    UTILS: UTILS,
    UI: UI
};

//Cut the mustard
//Don't run any JS if the browser can't handle it
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.init, false);
if('addEventListener' in window) window.addEventListener('load', STORM.UI.load, false);
