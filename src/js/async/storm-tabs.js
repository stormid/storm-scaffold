/**
 * @name storm-tabs: For multi-panelled content areas
 * @version 0.5.1: Tue, 28 Jun 2016 16:46:01 GMT
 * @author stormid
 * @license MIT
 */(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormTabs = factory();
  }
}(this, function() {
	'use strict';
    
    var KEY_CODES = {
            RETURN: 13,
            TAB: 9
        },
        instances = [],
        triggerEvents = ['click', 'keydown', 'touchstart'],
        defaults = {
            titleClass: '.js-tabs__link',
            currentClass: 'active',
            active: 0,
			styles: [
				{
					position: 'absolute',
            		clip: 'rect(0, 0, 0, 0)'
				},
				{
					position: 'relative',
					clip:'auto'
				}]
        },
        hash = location.hash.slice(1) || null,
        StormTabs = {
            init: function() {
                this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
                this.targets = this.links.map(function(el){
                    return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
                 });

                this.current = this.settings.active;
				this.targets.forEach(function(target, i){
                    if(target.getAttribute('id') === hash) {
                         this.current = i;
                    }
                }.bind(this));
                this.initAria()
                    .initTitles()
					.setStyles()
                    .open(this.current);
            },
            initAria: function() {
                this.links.forEach(function(el, i){
                    STORM.UTILS.attributelist.set(el, {
                        'role' : 'tab',
                        'aria-expanded' : false,
                        'aria-selected' : false,
                        'aria-controls' : this.targets[i].getAttribute('id')
                    });
                }.bind(this));

                this.targets.forEach(function(el){
                    STORM.UTILS.attributelist.set(el, {
                        'role' : 'tabpanel',
                        'aria-hidden' : true,
                        'tabIndex': '-1'
                    });
                }.bind(this));
                return this;
            },
            initTitles: function() {
                var handler = function(i){
                    this.toggle(i);
                };

                this.links.forEach(function(el, i){
                    triggerEvents.forEach(function(ev){
                        el.addEventListener(ev, function(e){
                            if(!!e.keyCode && e.keyCode === KEY_CODES.TAB) { return; }
                            if(!!!e.keyCode || e.keyCode === KEY_CODES.RETURN){
                                e.preventDefault();
                                handler.call(this, i);
                            }
                        }.bind(this), false);
                    }.bind(this));
                    
                }.bind(this));

                return this;
            },
			setStyles: function() {
				this.targets.forEach(function(target, i){
					for(var s in this.settings.styles[Number(i === this.current)]) {
						target.style[s] = this.settings.styles[Number(i === this.current)][s];
					}
				}.bind(this));
				
				return this;
			},
            change: function(type, i) {
                var methods = {
                    open: {
                        classlist: 'add',
                        tabIndex: {
                            target: this.targets[i],
                            value: '0'
                        }
                    },
                    close: {
                        classlist: 'remove',
                        tabIndex: {
                            target: this.targets[this.current],
                            value: '-1'
                        }
                    }
                };

                this.links[i].classList[methods[type].classlist](this.settings.currentClass);
                this.targets[i].classList[methods[type].classlist](this.settings.currentClass);
                STORM.UTILS.attributelist.toggle(this.targets[i], 'aria-hidden');
                STORM.UTILS.attributelist.toggle(this.links[i], ['aria-selected', 'aria-expanded']);
                STORM.UTILS.attributelist.set(methods[type].tabIndex.target, {
                    'tabIndex': methods[type].tabIndex.value
                });
            },
            open: function(i) {
                this.change('open', i);
                this.current = i;
				this.setStyles();
                return this;
            },
            close: function(i) {
                this.change('close', i);
				this.setStyles();
                return this;
            },
            toggle: function(i) {
                if(this.current === i) { return; }
                if(this.current === null) { 
                    this.open(i);
                    return this;
                }

                var nextNode = this.targets[i].getAttribute('id');
                window.history.pushState({ URL: '#' + nextNode}, '', '#' + nextNode);
                    this.close(this.current)
                    .open(i);
                return this;
            }
        };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
            throw new Error('Tabs cannot be initialised, no augmentable elements found');
        }
        
        els.forEach(function(el, i){
            instances[i] = Object.assign(Object.create(StormTabs), {
                DOMElement: el,
                settings: Object.assign({}, defaults, opts)
            });
            
            instances[i].init();
        });
        return instances;
    }
    
    function reload(els, opts) {
        destroy();
        init(els, opts);
    }
    
    function destroy() {
        instances = [];  
    }
    
	return {
		init: init,
        reload: reload,
        destroy: destroy
	};
	
 }));