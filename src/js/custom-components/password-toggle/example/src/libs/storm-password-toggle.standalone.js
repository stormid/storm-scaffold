/**
 * @name storm-password-toggle: 
 * @version 0.1.1: Tue, 06 Jun 2017 08:07:16 GMT
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
       root.StormPasswordToggle = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	visbileClassName: 'is--visible'
};

var TRIGGER_EVENTS = ['click', 'keydown'],
    TRIGGER_KEYCODES = [13, 32];

var PasswordToggle = {
	init: function init() {
		var _this = this;

		TRIGGER_EVENTS.forEach(function (trigger) {
			_this.node.addEventListener(trigger, _this.handleTriggered.bind(_this));
		});
		return this;
	},
	handleTriggered: function handleTriggered(e) {
		if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
		this.toggle();
	},
	toggle: function toggle() {
		this.input.setAttribute('type', this.input.getAttribute('type') === 'text' ? 'password' : 'text');
		this.node.classList.toggle(this.settings.visbileClassName);
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) return;

	return els.map(function (el) {
		return Object.assign(Object.create(PasswordToggle), {
			node: el,
			input: el.previousElementSibling,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

exports.default = { init: init };;
}));
