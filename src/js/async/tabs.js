/**
 * @name storm-tabs: For multi-panelled content areas
 * @version 1.1.1: Tue, 12 Sep 2017 16:30:36 GMT
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
	 UP: 38,
	 DOWN: 40
 };
 
 var componentPrototype = {
	 init: function init() {
		 var _this = this;
 
		 var hash = location.hash.slice(1) || false;
 
		 this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
		 this.targets = this.links.map(function (el) {
			 return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
		 });
		 !!this.links.length && this.links[0].parentNode.setAttribute('role', 'tablist');
		 this.current = this.settings.active;
 
		 if (hash !== false) this.targets.forEach(function (target, i) {
			 if (target.getAttribute('id') === hash) _this.current = i;
		 });
 
		 this.initAria().initTitles().open(this.current);
 
		 return this;
	 },
	 initAria: function initAria() {
		 var _this2 = this;
 
		 this.links.forEach(function (el, i) {
			 el.setAttribute('role', 'tab');
			 el.setAttribute('aria-expanded', false);
			 el.setAttribute('aria-selected', false);
			 el.setAttribute('aria-controls', _this2.targets[i].getAttribute('id'));
			 _this2.targets[i].setAttribute('role', 'tabpanel');
			 _this2.targets[i].setAttribute('aria-hidden', true);
			 _this2.targets[i].setAttribute('tabIndex', '-1');
		 });
		 return this;
	 },
	 initTitles: function initTitles() {
		 var _this3 = this;
 
		 var change = function change(id) {
			 _this3.toggle(id);
			 window.setTimeout(function () {
				 _this3.links[_this3.current].focus();
			 }, 16);
		 },
			 nextId = function nextId() {
			 return _this3.current === _this3.links.length - 1 ? 0 : _this3.current + 1;
		 },
			 previousId = function previousId() {
			 return _this3.current === 0 ? _this3.links.length - 1 : _this3.current - 1;
		 };
 
		 this.lastFocusedTab = 0;
 
		 this.links.forEach(function (el, i) {
			 el.addEventListener('keydown', function (e) {
				 switch (e.keyCode) {
					 case KEY_CODES.UP:
						 e.preventDefault();
						 change.call(_this3, previousId());
						 break;
					 case KEY_CODES.LEFT:
						 change.call(_this3, previousId());
						 break;
					 case KEY_CODES.DOWN:
						 e.preventDefault();
						 change.call(_this3, nextId());
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
					 case KEY_CODES.TAB:
						 if (!_this3.getFocusableChildren(_this3.targets[i]).length || _this3.current !== i || e.shiftKey) return;
 
						 e.preventDefault();
						 e.stopPropagation();
						 _this3.lastFocusedTab = _this3.getLinkIndex(e.target);
						 _this3.setTargetFocus(_this3.lastFocusedTab);
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
	 getLinkIndex: function getLinkIndex(link) {
		 for (var i = 0; i < this.links.length; i++) {
			 if (link === this.links[i]) return i;
		 }return null;
	 },
	 getFocusableChildren: function getFocusableChildren(node) {
		 var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
		 return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
	 },
	 setTargetFocus: function setTargetFocus(tabIndex) {
		 this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);
		 if (!this.focusableChildren.length) return false;
 
		 window.setTimeout(function () {
			 this.focusableChildren[0].focus();
			 this.keyEventListener = this.keyListener.bind(this);
 
			 document.addEventListener('keydown', this.keyEventListener);
		 }.bind(this), 1);
	 },
	 keyListener: function keyListener(e) {
		 if (e.keyCode !== KEY_CODES.TAB) return;
		 var focusedIndex = this.focusableChildren.indexOf(document.activeElement);
 
		 if (focusedIndex < 0) {
			 document.removeEventListener('keydown', this.keyEventListener);
			 return;
		 }
 
		 if (e.shiftKey && focusedIndex === 0) {
			 if (this.lastFocusedTab !== 0) {
				 e.preventDefault();
				 this.links[this.lastFocusedTab].focus();
			 }
		 } else {
			 if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				 document.removeEventListener('keydown', this.keyEventListener);
				 if (this.lastFocusedTab !== this.links.length - 1) {
					 e.preventDefault();
					 this.lastFocusedTab = this.lastFocusedTab + 1;
					 this.links[this.lastFocusedTab].focus();
				 }
			 }
		 }
	 },
	 change: function change(type, i) {
		 this.links[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
		 this.targets[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
		 this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
		 this.links[i].setAttribute('aria-selected', this.links[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
		 this.links[i].setAttribute('aria-expanded', this.links[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
		 (type === 'open' ? this.targets[i] : this.targets[this.current]).setAttribute('tabIndex', type === 'open' ? '0' : '-1');
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
 
		 window.history && window.history.pushState({ URL: this.links[i].getAttribute('href') }, '', this.links[i].getAttribute('href'));
 
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