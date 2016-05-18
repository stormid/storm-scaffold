//Closure to encapsulate all JS
var STORM = (function(w, d) {
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
                    if(!(d.querySelector('form'))) { return; } 
                    //loaded async as required
                    loadScript('/content/js/libs/forrm.min.js', function(err){
                        if(err) {
                            return console.log(err);
                        }
                        Forrm.init('.js-forrm');
                    });
                },
                init = function() {
                    //initialise everything
                    initFonts();
                    initForrms();
                    Toggler.init(d.querySelectorAll('.js-toggle'));
                    Toggler.init(d.querySelectorAll('.js-toggle-sub'), {targetLocal: true});
                };

            //Interface with/entry point to site JS
            return {
                init: init
            };

        }(window, document, undefined));


//Cut the mustard
//Don't run any JS if the browser can't handle it
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.init, false);