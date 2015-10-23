/**
 * @name Forrm: Clientside form validation framework using contraintValidation
 * @version 0.2.0 Tue, 04 Aug 2015 13:33:13 GMT
 * @author mjbp
 * @license 
 * @url https://github.com/mjbp/forrm/
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Forrm = factory();
  }
}(this, function() {
'use strict';
/*
 * Default configuration
 *
 */
var defaults = {
	augmentHTML5 : true,
	autocomplete : true,
	customErrorMessage : false,
	displayMessages : true,
	firstErrorOnly : false,
	css : {
		prefix: 'form-',
		successClass : 'success',
		errorClass : 'error',
		errorMessageClass : 'error-message',
		errorListClass : 'error-list',
		disabledClass : 'disabled',
		hiddenClass : 'hidden'
	},
	errorMessageElement : 'span',
	errorMessages : {
		'text': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Match the requested format'
		},
		'url': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Enter a valid URL',
			'typeMismatch' : 'Enter a valid URL'
		},
		'search': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Match the requested format'
		},
		'email': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Enter a valid email address',
			'typeMismatch' : 'Enter a valid email address'
		},
		'tel': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Enter a valid phone number'
		},
		'password': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Enter a valid password'
		},
		'select': {
			'valueMissing' : 'Choose an option'
		},
		'checkbox': {
			'valueMissing' : 'Check at least one of the required boxes'
		},
		'radio': {
			'valueMissing' : 'Select one of the required radio options'
		},
		'number': {
			'valueMissing' : 'This field is required',
			'patternMismatch' : 'Enter a valid number',
			'typeMismatch' : 'Enter a valid number'
		},
		'file': {
			'valueMissing' : 'Choose a file',
			'typeMismatch' : 'Please use a Microsoft Word or PDF file'
		},
		'group': {
			'valueMissing' : 'One of these fields is required',
			'patternMismatch' : 'Match the requested format one on of these fields'
		}
	},
	fail : false,
	pass : false,
	conditionalConstraint : false,
	customConstraint : false,
	patterns : {
		email : '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?',
		tel : '[\\w\\d\\s\\(\\)\\.+-]+',
		number : '[\\d]'
	}
};
/*
 * ForrmElement wrapper class
 *
 * @param  {DOM node} a single form input element
 * @param  {instance of ForrmElement class} reference to parent forrm
 *
 */
function ForrmElement(element, parent) {
	this.DOMElement = element;
	this.parent = parent;
	this.init();
}

ForrmElement.prototype = {
	init : function () {
		var updateEvent,
			self = this,
			liveValidate = function (e) {
				if (!self.parent.liveValidating) {
					return;
				}
				e.stopImmediatePropagation();
				self.parent.validationList[self.errorGroup].element.validate();
                self.parent.UI.updateInlineErrors(self);
			};

		if (this.DOMElement.getAttribute('required') !== null) {
			this.type = (this.DOMElement.tagName.toLowerCase() === 'input') && this.DOMElement.getAttribute('type') || (this.DOMElement.tagName.toLowerCase() === 'textarea') && 'text' || this.DOMElement.tagName.toLowerCase();

			//if customMessages is set, check if type exists in errorMessages object, otherwise set to default text field error
			if(!!(this.parent.options.customErrorMessage) && !(this.type in this.parent.options.errorMessages)) {
				this.type = 'text';
			}

			this.testCustomConstraint = (!!this.DOMElement.getAttribute('data-forrm-custom-constraint') && this.parent.options.customConstraint[this.DOMElement.getAttribute('data-forrm-custom-constraint')]) || false;

			this.errorGroup = this.DOMElement.getAttribute('id');
			this.validity = this.DOMElement.validity || this.defaultValidity();

			if ('autocomplete' in this.DOMElement && !this.parent.options.autocomplete) {
				this.DOMElement.setAttribute('autocomplete', 'off');
			}
			if (this.DOMElement.getAttribute('data-forrm-conditional') !== null) {
				this.addConditional();
			}
			STORM.UTILS.on(this.DOMElement, 'click keyup input paste change', liveValidate);
		}
	},
	defaultValidity : function () {
		return {
			valid: false,
			stepMismatch: false,
			customError: false,
			patternMismatch: false,
			rangeOverflow: false,
			rangeUnderflow: false,
			tooLong: false,
			typeMismatch: false,
			valueMissing: true
		};
	},
	getValidity : function () {
		return this.validity.valid;
	},
	setValidity : function () {
		var regExp,
			pattern = this.DOMElement.getAttribute('pattern') || this.parent.options.patterns[this.type],
			list;

		this.validationMessage = null;
		if (this.DOMElement.value.replace( /^\s+/g, '' ).replace( /\s+$/g, '' ) === "" || ((this.type === 'radio' || this.type === 'checkbox') && !this.DOMElement.checked)) {
            //null string test
			this.validity.valid = false;
			this.validity.valueMissing = true;
			this.validationMessage = this.parent.options.errorMessages[this.type].valueMissing;
		} else {
			this.validity.valueMissing = false;
            //pattern test
			regExp = new RegExp(pattern, "");
			if (!regExp.test(this.DOMElement.value)) {
				this.validity.valid = false;
				if (this.type === 'text') {
					this.validity.patternMismatch = true;
				} else {
					this.validity.typeMismatch = true;
				}
				this.validationMessage = this.parent.options.errorMessages[this.type].patternMismatch;
			} else {
				this.validity.valid = true;
			}
		}
		return this;
	},
	setGroup : function (g) {
		this.group = g;
		this.errorGroup = g.name;
		this.type = (g.type === 'custom') && 'group' || this.type;
		return this;
	},
	addError : function (error, groupPartial) {
		this.DOMElement.parentNode.className = this.DOMElement.parentNode.className.split(' ' + this.parent.options.css.prefix + this.parent.options.css.successClass).join('');
		if (this.DOMElement.parentNode.className.indexOf(this.parent.options.css.prefix + this.parent.options.css.errorClass) === -1) {
			this.DOMElement.parentNode.className += ' ' + this.parent.options.css.prefix + this.parent.options.css.errorClass;
		}
		this.DOMElement.setAttribute('aria-invalid', 'true');
		if (!groupPartial) {
			this.parent.manageValidationList(this.errorGroup, error);
		}
		return this;
	},
	removeError : function (groupPartial) {
		this.DOMElement.parentNode.className = this.DOMElement.parentNode.className.split(' ' + this.parent.options.css.prefix + this.parent.options.css.errorClass).join('');
		this.DOMElement.setAttribute('aria-invalid', 'false');
		this.DOMElement.removeAttribute('aria-labelledby');
		if (!groupPartial) {
			this.parent.manageValidationList(this.errorGroup, null);
		}
		return this;
	},
	addSuccess : function (groupPartial) {
		this.removeError(groupPartial);
		if (this.DOMElement.parentNode.className.indexOf(this.parent.options.css.prefix + this.parent.options.css.successClass) === -1) {
			this.DOMElement.parentNode.className += ' ' + this.parent.options.css.prefix + this.parent.options.css.successClass;
		}
		return this;
	},
	test : function () {
		if (!this.parent.HTML5) {
			this.setValidity();
		}
		if (!!this.testCustomConstraint && (!!this.getValidity() || !!this.validity.customError)) {
			if (!!this.parent.HTML5) {
				this.DOMElement.setCustomValidity(this.testCustomConstraint.call(this.DOMElement));
			} else {
				if (this.testCustomConstraint.call(this.DOMElement) !== '') {
					this.validity.valid = false;
					this.validity.customError = this.testCustomConstraint.call(this.DOMElement);
					if (!this.parent.HTML5) {
						this.validationMessage = this.validity.customError;
					}
				}
			}
		}
		return (this.DOMElement.checkValidity instanceof Function && this.DOMElement.checkValidity()) || this.getValidity();
	},
	validate : function () {
		if (!this.test()) {
			this.addError(this.getError());
		} else {
			this.addSuccess();
		}
	},
	getError : function () {
		if (this.parent.options.customErrorMessage) {
			return (this.parent.options.errorMessages[this.type][this.validity.valueMissing && 'valueMissing' || this.validity.patternMismatch && 'patternMismatch' || this.validity.typeMismatch && 'typeMismatch']);
		} else {
			if (this.DOMElement.getAttribute('data-forrm-custom-error') !== null) {
				return this.DOMElement.getAttribute('data-forrm-custom-error');
			} else {
				return this.DOMElement.validationMessage || this.validationMessage;
			}
		}
	},
	addConditional : function () {
		var self = this,
			dc = this.DOMElement.getAttribute('data-forrm-conditional'),
			openSesame = function (e) {
				e.stopImmediatePropagation();
				if (!!self.conditionalConstraint.call(self.DOMElement)) {
					self.parent.UI.toggleEnabled(self.dependents, true);
				} else {
					self.parent.UI.toggleEnabled(self.dependents, null);
				}
			};
		self.dependents = document.querySelectorAll('.' + dc + ' input, ' + '.' + dc + ' textarea, ' + '.' + dc + 'select');
		self.conditionalConstraint = !!(self.parent.options.conditionalConstraint) && self.parent.options.conditionalConstraint[dc] || function () { return this.value !== ''; };
		STORM.UTILS.on(self.DOMElement, 'change', openSesame);
	}
};
/*
 * ForrmGroup wrapper class
 *
 * @param {String} Name of the group from child elements name attribute or forrm-group data attribute
 * @param {Array} Array of ForrmElements in the group
 * @param {String} Custom group or checkbox/radio group
 * @param {Number} Minimum number of valid elements to satisfy constraint
 * @param {Number} Maximum number of valid elements to satisfy constraint
 *
 */
function ForrmGroup(name, els, type, min, max) {
	this.name = name;
	this.elements = els;
	this.type = type;
	this.min = +min || 1;
	this.max = +max || null;
	this.parent = els[0].parent;

	this.init(els);
}

ForrmGroup.prototype = {
	init : function () {
		this.valid = true;
	},
	addError : function (error) {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].addError(error);
		}
		return this;
	},
	removeError : function () {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].removeError();
		}
	},
	addSuccess : function () {
		this.removeError();
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].addSuccess();
		}
		return this;
	},
	validate : function () {
		var error = null;
		this.numValid = 0;
		for (var i = 0; i < this.elements.length; i++) {
			if (!this.elements[i].test()) {
				this.elements[i].addError(null, true);
				this.valid = false;
				error = this.elements[i].getError();
			} else {
				this.numValid++;
			}
		}
		if ((this.numValid >= +this.min && this.max === null) || (this.numValid >= +this.min && !!this.max && this.numValid <= +this.max)) {
			this.valid = true;
			this.addSuccess();
			return;
		} else {

			if (!!error) {
				this.addError(error);
			}
		}
	},
	getName : function() {
		return this.name;
	}
};
/*
 * ForrmUI wrapper class
 *
 * @param   {Form} Parent forrm
 *
 * @roadMap Improve DOM manipulation horrorshow, add interface for templating systems
 *
 */

function ForrmUI(form) {
  this.parent = form;
  this.init();
}

ForrmUI.prototype = {
  init : function () {
      this.write = this.displayInlineErrorMessages;
  },
  addInlineError : function (erId) {
	  var el,
		  msg = document.createElement(this.parent.options.errorMessageElement);
	  msg.innerHTML = this.parent.validationList[erId].error;
	  msg.className = this.parent.options.css.prefix + this.parent.options.css.errorMessageClass;
	  msg.setAttribute('role', 'alert');
	  msg.setAttribute('id', erId + '-error');
	  el = document.getElementById(this.parent.validationList[erId].id);
	  el.setAttribute('aria-labelledBy', erId + '-error');
	  el.parentNode.appendChild(msg);

	  return;
  },
  clearInlineErrors : function () {
	  var errorMessages = this.parent.DOMElement.querySelectorAll('.' + this.parent.options.css.prefix + this.parent.options.css.errorMessageClass);

	  if (errorMessages.length === 0) {
		  return;
	  }
	  for(var i = 0; i < errorMessages.length; i++) {
		  errorMessages[i].parentNode.removeChild(errorMessages[i]);
	  }

	  return this;
  },
  updateInlineErrors : function (el) {
	  var errorField = document.getElementById(el.errorGroup + '-error');
	  if (!el.parent.validationList[el.errorGroup].error) {
		  if (!errorField) {
			  return this;
		  } else {
			  errorField.parentNode.removeChild(errorField);
			  return this;
		  }
	  } else {
		  if (!errorField) {
			  this.addInlineError(el.errorGroup);
			  return this;
		  } else {
			  errorField.textContent = el.parent.validationList[el.errorGroup].error;
			  return this;
		  }
	  }
  },
  displayInlineErrorMessages : function () {
	  this.clearInlineErrors();
	  for (var er in this.parent.validationList) {
		  if (this.parent.validationList.hasOwnProperty(er)) {
			  if (!!this.parent.validationList[er].error) {
				  this.addInlineError(er);
			  }
		  }
	  }
  },
  toggleEnabled : function (els, reveal) {
	  for (var i = 0, el; el = els[i];++i) {
		  if (reveal !== null) {
			  el.parentNode.className = el.parentNode.className.split(' ' + this.parent.options.css.prefix + this.parent.options.css.disabledClass).join('');
			  el.removeAttribute('disabled');
		  } else {
			  el.parentNode.className = el.parentNode.className + ' ' + this.parent.options.css.prefix + this.parent.options.css.disabledClass;
			  el.setAttribute('disabled', 'disabled');
		  }
	  }
  }
};
/*
 * Forrm wrapper class
 *
 * @param {DOM node} a single form element
 * @param  {object} to extend defaults {}
 *
 */
function ForrmForm(element, options) {
    if (element === 'undefined') {
        throw new Error('No element has been supplied');
    }
    this.DOMElement = element;
    this.options = STORM.UTILS.merge({}, defaults, options);

    this.init();
}

ForrmForm.prototype = {
    HTML5 : false,
    init: function () {
        var self = this,
            tmpGroups = [];
        this.HTML5 = 'noValidate' in document.createElement('form');
        this.liveValidating = false;
        this.go = this.options.pass || this.DOMElement.submit;

        if (!this.HTML5 || this.options.augmentHTML5) {
            if ('autocomplete' in this.DOMElement && !this.options.autocomplete) {
                this.DOMElement.setAttribute('autocomplete', 'off');
            }

            this.fields = this.DOMElement.querySelectorAll('input, textarea, select');
            this.validatebleElements = {};
            this.unvalidatebleElements = {};
            this.groups = {};

                for (var i = 0, field; field = this.fields[i]; i++) {
                    if (field.getAttribute('type') !== 'submit' &&
                        field.getAttribute('type') !== 'reset' &&
                        field.getAttribute('type') !== 'button' &&
                        field.getAttribute('type') !== 'hidden' &&
                        (!field.hasAttribute('disabled'))&&
                        (!field.hasAttribute('novalidate'))) {
                        if (!!field.hasAttribute('required')) {
                            this.validatebleElements[field.getAttribute('id')] = new ForrmElement(field, this);
                            if (field.getAttribute('type') === 'checkbox' || field.getAttribute('type') === 'radio' || field.getAttribute('data-forrm-group') !== null) {
                                tmpGroups.push(this.validatebleElements[field.getAttribute('id')]);
                            }

                            if ((this.fields[i + 1] === undefined || !(field.getAttribute('data-forrm-group')) && (field.getAttribute('name') !== this.fields[i + 1].getAttribute('name')) || i - 1 === this.fields.length) || field.getAttribute('data-forrm-group') !== this.fields[i + 1].getAttribute('data-forrm-group')) {
                                if (tmpGroups.length > 0) {
                                    var groupName = field.getAttribute('data-forrm-group') || field.getAttribute('name'),
                                        groupType = field.getAttribute('data-forrm-group') ? 'custom' : 'checked',
                                        groupMin = field.getAttribute('data-forrm-group-min') || 1,
                                        groupMax = field.getAttribute('data-forrm-group-max') || null;
                                    this.groups[groupName] = new ForrmGroup(groupName, tmpGroups, groupType, groupMin, groupMax);
                                    for (var j = 0; j < tmpGroups.length; j++) {

                                       tmpGroups[j].setGroup(this.groups[groupName]);
                                    }
                                    tmpGroups = [];
                                }
                            }
                        } else {
                            this.unvalidatebleElements[field.getAttribute('id')] = new ForrmElement(field, this);
                        }
                    }
                }
                this.makeValidationList();
                this.UI = new ForrmUI(this);

                if (this.DOMElement.querySelector('input[type=submit]') !== null) {
                        STORM.UTILS.on(this.DOMElement.querySelector('input[type=submit]'), 'click onkeypress', function (e) {
                            self.handleEvent.call(self, e);
                    }   );
                }
        }
        return this;
    },
    handleEvent : function (e) {
        if (!this.HTML5 || this.options.augmentHTML5) {
            this.liveValidating = true;
            if (e.type === 'click' || e.type === 'onkeypress') {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.test.call(this);
            }
        }
    },
	makeValidationList : function () {
		this.validationList = {};

		for (var i in this.validatebleElements) {
			if (this.validatebleElements.hasOwnProperty(i)) {
				this.validationList[this.validatebleElements[i].errorGroup] = {
					'error': null,
					'element': (this.groups[this.validatebleElements[i].errorGroup] || this.validatebleElements[i]),
					'id': !!(this.groups[this.validatebleElements[i].errorGroup]) ?
							this.groups[this.validatebleElements[i].errorGroup].elements[0].DOMElement.getAttribute('id') :
					document.getElementById(this.validatebleElements[i].errorGroup).getAttribute('id')
				};
			}
		}
		return this.validationList;
	},
	manageValidationList : function (erId, er) {
		this.validationList[erId].error = er;
		return this;
	},
	countErrors : function () {
		var errors = 0;

		for (var i in this.validationList) {
			if (this.validationList.hasOwnProperty(i)) {
				if (this.validationList[i].error !== null) {
					errors++;
				}
			}
		}
		return errors;
	},
    test : function () {
        var el = null,
            er = null,
            vList,
            self = this;
        
        this.validationList = this.makeValidationList();

        for (var i in this.validationList) {
            this.validationList[i].element.validate();
            if (!!this.options.firstErrorOnly && !!this.validationList[i].error) {
                break;
            }
        }

        if (this.countErrors() > 0) {
            this.UI.write();
            document.querySelector('.' + this.options.css.prefix + this.options.css.errorMessageClass).focus();
            
            if (typeof this.options.fail === 'function') {
                this.options.fail.call();
            }
        } else {
            this.go.call(this.DOMElement);
        }
    }
};
var Forrm = {
	init : function (el, options) {
		if (!('querySelectorAll' in document)) {
			throw new Error('Sorry, your browser is not supported.');
		} else {
			var elements = document.querySelectorAll(el),
				forrms = [],
				i = null,
				l = elements.length;

			for (i = 0; i < l; i += 1) {
				if (!elements[i].hasAttribute('novalidate')) {
					forrms[i] = new ForrmForm(elements[i], options);
				}
			}
			return forrms;
		}
	}
};
return Forrm;
}));