/*global window, document, require, define, STORM, module*/
/**
 * @name Toggler
 * @version 0.1.0: Wed, 09 Jun 2015
 * @author mjbp
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Toggler = factory();
  }
}(this, function() {
	'use strict';
    
    var defaults = {
            delay: 200
        };
    
    function Toggler(el, opts) {
        var ariaControls;
        
        this.settings = STORM.UTILS.merge({}, defaults, opts);
        
        this.btn = el;
        this.docEl = document.documentElement;
        this.target = (el.getAttribute('href')|| el.getAttribute('data-target')).substr(1);
        this.statusClass = ['on--', this.target].join('');
        this.animatingClass = ['animating--', this.target].join('');
        
        ariaControls = this.target;
        
        STORM.UTILS.attributelist.add(this.btn, {
            'role' : 'button',
            'aria-controls' : ariaControls,
            'aria-expanded' : 'false'
        });
        
        this.btn.addEventListener('click', function(e) { this.toggle(e); }.bind(this), false);
    }
    Toggler.prototype.toggle = function(e) {
        var delay = !!document.querySelector('.' + this.statusClass) ? this.settings.delay : 0;
        
        e.preventDefault();
        e.stopImmediatePropagation();
        
        STORM.UTILS.classlist.add(this.docEl, this.animatingClass);
        
        window.setTimeout(function() {
            STORM.UTILS.classlist.remove(this.docEl, this.animatingClass)
                    .toggle(this.docEl, this.statusClass);
            STORM.UTILS.attributelist.toggle(this.btn, 'aria-expanded');
        }.bind(this), delay);
    };
    
    function init(els, opts) {
        if(els.length === 0 || !('querySelectorAll' in document)) {
            throw new Error('Toggler cannot be initialised');
        }
        var togglers = [];
        
        [].slice.call(els).forEach(function(el){
            togglers.push(new Toggler(el, opts));
        });
        return togglers;
    }

	
	return {
		init: init
	};
	
 }));