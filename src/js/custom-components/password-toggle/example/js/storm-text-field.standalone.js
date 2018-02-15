/**
 * @name storm-text-field: Input/textarea wrapper module to surface state and validity to the UI
 * @version 0.1.0: Tue, 11 Apr 2017 16:12:15 GMT
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
       root.StormTextField = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	labelClassName: 'label',
	fieldClassName: 'field',
	focusClassName: 'is--focused',
	dirtyClassName: 'is--dirty',
	invalidClassName: 'is--invalid',
	errorMsgClassName: 'form__error'
};

var StormTextField = {
	init: function init() {
		this.label = this.node.querySelector('.' + this.settings.labelClassName);
		this.input = this.node.querySelector('.' + this.settings.fieldClassName);

		this.boundSetState = this.setState.bind(this);
		this.boundChangeHandler = this.changeHandler.bind(this);

		this.input.addEventListener('change', this.boundChangeHandler);
		this.input.addEventListener('focus', this.focusHandler.bind(this));
		this.input.addEventListener('blur', this.blurHandler.bind(this));

		this.setState();

		return this;
	},
	changeHandler: function changeHandler() {
		this.setState();
		this.input.removeEventListener('change', this.boundChangeHandler);
		this.input.addEventListener('input', this.boundSetState);
	},
	setState: function setState() {
		this.checkDirty();
		this.validate();
	},
	focusHandler: function focusHandler() {
		this.node.classList.add(this.settings.focusClassName);
	},
	blurHandler: function blurHandler() {
		this.node.classList.remove(this.settings.focusClassName);
	},
	checkDirty: function checkDirty() {
		if (this.input.value && this.input.value.length > 0) {
			this.isDirty = true;
			this.node.classList.add(this.settings.dirtyClassName);
		} else {
			this.node.classList.remove(this.settings.dirtyClassName);
			this.isDirty = false;
		}
	},
	addError: function addError() {
		this.errorMsg = document.createElement('div');
		this.errorMsg.classList.add(this.settings.errorMsgClassName);
		this.errorMsg.innerText = this.input.validationMessage || this.input.setCustomValidity;
		this.node.parentNode.appendChild(this.errorMsg);
	},
	removeError: function removeError() {
		if (this.errorMsg) {
			this.errorMsg.parentNode.removeChild(this.errorMsg);
			this.errorMsg = false;
		}
	},
	validate: function validate() {
		this.input.setCustomValidity = this.settings.customConstraint && !this.settings.customConstraint.check(this.input) ? this.settings.customConstraint.customValidity : '';

		this.removeError();
		if (this.input.validity && this.isDirty) {
			if (this.input.validity.valid && this.input.setCustomValidity === '') this.node.classList.remove(this.settings.invalidClassName);else {
				this.node.classList.add(this.settings.invalidClassName);
				this.addError();
			}
		}
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) return;

	return els.map(function (el) {
		return Object.assign(Object.create(StormTextField), {
			node: el,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

exports.default = { init: init };;
}));
