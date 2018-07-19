/**
 * @name storm-tabs: For multi-panelled content areas
 * @version 1.2.0: Mon, 09 Oct 2017 11:02:17 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
    var mod = {
        exports: {}
    };
    if (typeof exports !== 'undefined'){
        mod.exports = exports
        factory(mod.exports)
        module.exports = mod.exports.default
    } else {
        factory(mod.exports);
        root.Tabs = mod.exports.default
    }
 
 }(this, function(exports) {
    'use strict';
 
 Object.defineProperty(exports, "__esModule", {
     value: true
 });
 var defaults = {
     titleClass: '.js-tabs__link',
     currentClass: 'active',
     active: 0
 };
 
 var KEY_CODES = {
     SPACE: 32,
     ENTER: 13,
     TAB: 9,
     LEFT: 37,
     RIGHT: 39,
     DOWN: 40
 };
 
 var componentPrototype = {
     init: function init() {
         var _this = this;
 
         var hash = location.hash.slice(1) || false;
 
         this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
         this.panels = this.tabs.map(function (el) {
             return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
         });
         !!this.tabs.length && this.tabs[0].parentNode.setAttribute('role', 'tablist');
         this.current = this.settings.active;
 
         if (hash !== false) this.panels.forEach(function (target, i) {
             if (target.getAttribute('id') === hash) _this.current = i;
         });
 
         this.initAttributes().initTabs().open(this.current);
 
         return this;
     },
     initAttributes: function initAttributes() {
         var _this2 = this;
 
         this.tabs.forEach(function (tab, i) {
             tab.setAttribute('role', 'tab');
             tab.setAttribute('aria-selected', false);
             _this2.panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
             tab.setAttribute('tabindex', '-1');
             _this2.panels[i].setAttribute('role', 'tabpanel');
             _this2.panels[i].setAttribute('hidden', 'hidden');
             _this2.panels[i].setAttribute('tabindex', '-1');
             if (!_this2.panels[i].firstElementChild || _this2.panels[i].firstElementChild.hasAttribute('tabindex')) return;
             _this2.panels[i].firstElementChild.setAttribute('tabindex', '-1');
         });
         return this;
     },
     initTabs: function initTabs() {
         var _this3 = this;
 
         var change = function change(id) {
             _this3.toggle(id);
             window.setTimeout(function () {
                 _this3.tabs[_this3.current].focus();
             }, 16);
         },
             nextId = function nextId() {
             return _this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1;
         },
             previousId = function previousId() {
             return _this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1;
         };
 
         this.tabs.forEach(function (el, i) {
             el.addEventListener('keydown', function (e) {
                 switch (e.keyCode) {
                     case KEY_CODES.LEFT:
                         change.call(_this3, previousId());
                         break;
                     case KEY_CODES.DOWN:
                         e.preventDefault();
                         e.stopPropagation();
                         _this3.panels[i].focus();
                         break;
                     case KEY_CODES.RIGHT:
                         change.call(_this3, nextId());
                         break;
                     case KEY_CODES.ENTER:
                         change.call(_this3, i);
                         break;
                     case KEY_CODES.SPACE:
                         e.preventDefault();
                         change.call(_this3, i);
                         break;
                     default:
                         break;
                 }
             });
             el.addEventListener('click', function (e) {
                 e.preventDefault();
                 change.call(_this3, i);
             }, false);
         });
 
         return this;
     },
     change: function change(type, i) {
         this.tabs[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
         this.panels[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
         type === 'open' ? this.panels[i].removeAttribute('hidden') : this.panels[i].setAttribute('hidden', 'hidden');
         this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
         (type === 'open' ? this.tabs[i] : this.tabs[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
         (type === 'open' ? this.panels[i] : this.panels[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
     },
     open: function open(i) {
         this.change('open', i);
         this.current = i;
         return this;
     },
     close: function close(i) {
         this.change('close', i);
         return this;
     },
     toggle: function toggle(i) {
         if (this.current === i) return;
 
         window.history && window.history.pushState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));
 
         if (this.current === null) this.open(i);else this.close(this.current).open(i);
 
         return this;
     }
 };
 
 var init = function init(sel, opts) {
     var els = [].slice.call(document.querySelectorAll(sel));
 
     if (!els.length) throw new Error('Tabs cannot be initialised, no augmentable elements found');
 
     return els.map(function (el) {
         return Object.assign(Object.create(componentPrototype), {
             DOMElement: el,
             settings: Object.assign({}, defaults, el.dataset, opts)
         }).init();
     });
 };
 
 var index = { init: init };
 
 exports.default = index;;
 }));