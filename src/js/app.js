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
                    t.src = src;
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
				initTogglers = function() {
                    if(!(d.querySelector('.js-toggle')) && !(d.querySelector('.js-toggle'))) { return; } 
					Toggler.init('.js-toggle');
                    !!d.querySelector('.js-toggle') && Toggler.init('.js-toggle-local', {targetLocal: true});
				},
                init = function() {
                    //classList, promise, object.assign
                    if(!!Object.assign && !!Promise && !!('classList' in document.documentElement)){ 
                        run(); 
                    } else {
                        LoadScript('/content/js/async/polyfills.js', run);
                    }
                },
                run = function(){
                    initFonts();
                    initTogglers();
                },
                loaded = function(){};

            //Interface with/entry point to site JS
            return {
                init: init,
				loaded: loaded
            };

        }(window, document, undefined));

global.STORM = {
    UI: UI,
    UTILS: UTILS
};

//Cut the mustard
//Don't run any JS if the browser can't handle it
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.init, false);
if('addEventListener' in window) window.addEventListener('load', STORM.UI.loaded, false);
