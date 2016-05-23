/**
 * @name Forrm: Clientside form validation framework using contraintValidation
 * @version 0.2.0 Mon, 02 Feb 2015 16:24:09 GMT
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
		prefix: 'forrm-',
		successClass : 'success',
		errorClass : 'error',
		errorMessageClass : 'error-message',
		errorListClass : 'error-list',
		disabledClass : 'disabled',
		hiddenClass : 'hidden',
		buttonClass : 'btn',
		buttonNextClass : 'btn--submit',
		buttonPreviousClass : 'btn--previous',
		stepPrefix : 'step-'
	},
	listMessages : false,
	listTitle : 'We couldn\'t submit the form, please check your answers:',
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
			'valueMissing' : 'Choose a file'
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
 * Utility functions, smoothing cross-browser inconsistencies
 *
 */
var UTILS = {
	extend: function (){
		for(var i = 1; i < arguments.length; i++) {
			for(var key in arguments[i]) {
				if(arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		return arguments[0];
	},
	forEach: function (a, fn, scope) {
		var i, l = a.length;
		if ([].forEach) {
			return a.forEach(fn);
		}
		for (i = 0; i < l; i += 1) {
			if (a.hasOwnProperty(i)) {
				fn.call(scope, a[i], i, a);
			}
		}
	},
	on : function (element, events, fn) {
		var evts = events.split(' ');
		for (var i = 0; i < evts.length; i++) {
			if (element.addEventListener) {
				element.addEventListener(evts[i], fn, false);
			} else {
				element.attachEvent('on' + evts[i], fn);
			}
		}
	},
	preventDefault : function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return;
	},
	stopImmediatePropagation :function (e) {
		if (e.stopImmediatePropagation) {
			e.stopImmediatePropagation();
		} else {
			e.cancelBubble = true;
		}
		return;
	}
};
/*
 * ForrmElement wrapper class
 *
 * @param  {DOM node} a single form input element
 * @param  {instance of ForrmStep class} reference to parent step
 *
 */
function ForrmElement(element, parent) {
	this.DOMElement = element;
	this.parent = parent;
	this.forrm = parent.parent;
	this.init();
}

ForrmElement.prototype = {
	init : function () {
		var updateEvent,
			self = this,
			liveValidate = function (e) {
				if (!self.forrm.liveValidating) {
					return;
				}
				UTILS.stopImmediatePropagation(e);
				self.parent.validationList[self.errorGroup].element.validate();
				if (!self.forrm.options.listMessages) {
					self.forrm.UI.updateInlineErrors(self);
				} else {
					self.forrm.UI.listErrorMessages();
				}
			};

		if (this.DOMElement.getAttribute('required') !== null) {
			this.type = (this.DOMElement.tagName.toLowerCase() === 'input') && this.DOMElement.getAttribute('type') || (this.DOMElement.tagName.toLowerCase() === 'textarea') && 'text' || this.DOMElement.tagName.toLowerCase();

			//if customMessages is set, check if type exists in errorMessages object, otherwise set to default text field error
			if(!!(this.forrm.options.customErrorMessage) && !(this.type in this.forrm.options.errorMessages)) {
				this.type = 'text';
			}

			this.testCustomConstraint = (!!this.DOMElement.getAttribute('data-forrm-custom-constraint') && this.forrm.options.customConstraint[this.DOMElement.getAttribute('data-forrm-custom-constraint')]) || false;

			this.errorGroup = this.DOMElement.getAttribute('id');
			this.validity = this.DOMElement.validity || this.defaultValidity();

			if ('autocomplete' in this.DOMElement && !this.forrm.options.autocomplete) {
				this.DOMElement.setAttribute('autocomplete', 'off');
			}
			if (this.DOMElement.getAttribute('data-forrm-conditional') !== null) {
				this.addConditional();
			}
			UTILS.on(this.DOMElement, 'click keyup input paste change', liveValidate);
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
			pattern = this.DOMElement.getAttribute('pattern') || this.forrm.options.patterns[this.type],
			list;

		this.validationMessage = null;
		if (this.DOMElement.value.replace( /^\s+/g, '' ).replace( /\s+$/g, '' ) === "" || ((this.type === 'radio' || this.type === 'checkbox') && !this.DOMElement.checked)) {
			this.validity.valid = false;
			this.validity.valueMissing = true;
			this.validationMessage = this.forrm.options.errorMessages[this.type].valueMissing;
		} else {
			this.validity.valueMissing = false;
			regExp = new RegExp(pattern, "");
			if (!regExp.test(this.DOMElement.value)) {
				this.validity.valid = false;
				if (this.type === 'text') {
					this.validity.patternMismatch = true;
				} else {
					this.validity.typeMismatch = true;
				}
				this.validationMessage = this.forrm.options.errorMessages[this.type].patternMismatch;
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
		this.DOMElement.parentNode.className = this.DOMElement.parentNode.className.split(' ' + this.forrm.options.css.prefix + this.forrm.options.css.successClass).join('');
		if (this.DOMElement.parentNode.className.indexOf(this.forrm.options.css.prefix + this.forrm.options.css.errorClass) === -1) {
			this.DOMElement.parentNode.className += ' ' + this.forrm.options.css.prefix + this.forrm.options.css.errorClass;
		}
		this.DOMElement.setAttribute('aria-invalid', 'true');
		if (!groupPartial) {
			this.parent.manageValidationList(this.errorGroup, error);
		}
		return this;
	},
	removeError : function (groupPartial) {
		this.DOMElement.parentNode.className = this.DOMElement.parentNode.className.split(' ' + this.forrm.options.css.prefix + this.forrm.options.css.errorClass).join('');
		this.DOMElement.setAttribute('aria-invalid', 'false');
		this.DOMElement.removeAttribute('aria-labelledby');
		if (!groupPartial) {
			this.parent.manageValidationList(this.errorGroup, null);
		}
		return this;
	},
	addSuccess : function (groupPartial) {
		this.removeError(groupPartial);
		if (this.DOMElement.parentNode.className.indexOf(this.forrm.options.css.prefix + this.forrm.options.css.successClass) === -1) {
			this.DOMElement.parentNode.className += ' ' + this.forrm.options.css.prefix + this.forrm.options.css.successClass;
		}
		return this;
	},
	test : function () {
		if (!this.forrm.HTML5) {
			this.setValidity();
		}
		if (!!this.testCustomConstraint) {
			if (!!this.forrm.HTML5) {
				this.DOMElement.setCustomValidity(this.testCustomConstraint.call(this.DOMElement));
			} else {
				if (this.testCustomConstraint.call(this.DOMElement) !== '') {
					this.validity.valid = false;
					this.validity.customError = this.testCustomConstraint.call(this.DOMElement);
					if (!this.forrm.HTML5) {
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
		if (this.forrm.options.customErrorMessage) {
			return (this.forrm.options.errorMessages[this.type][this.validity.valueMissing && 'valueMissing' || this.validity.patternMismatch && 'patternMismatch' || this.validity.typeMismatch && 'typeMismatch']);
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
				UTILS.stopImmediatePropagation(e);
				if (!!self.conditionalConstraint.call(self.DOMElement)) {
					self.forrm.UI.toggleEnabled(self.dependents, true);
				} else {
					self.forrm.UI.toggleEnabled(self.dependents, null);
				}
			};
		self.dependents = document.querySelectorAll('.' + dc + ' input, ' + '.' + dc + ' textarea, ' + '.' + dc + 'select');
		self.conditionalConstraint = !!(self.forrm.options.conditionalConstraint) && self.forrm.options.conditionalConstraint[dc] || function () { return this.value !== ''; };
		UTILS.on(self.DOMElement, 'change', openSesame);
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
	  if (!!this.parent.options.displayMessages) {
		  this.write = !!this.parent.options.listMessages ? this.listErrorMessages : this.displayInlineErrorMessages;
	  } else {
		  this.write = function () {return this;};
	  }
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
  listErrorMessages : function () {
	  var i = 0,
		  oldListHolder = this.parent.DOMElement.querySelector('.' + this.parent.options.css.prefix +  this.parent.options.css.errorListClass),
		  listHolder = document.createElement('dl'),
		  listTitle = document.createElement('dt'),
		  listDescription = document.createElement('dd'),
		  list = document.createElement('ol'),
		  listItem = document.createElement('li'),
		  link = document.createElement('a'),
		  item = null,
		  itemLink = null;

	  this.errorListHolder = listHolder;

	  if (oldListHolder) {
		  oldListHolder.parentElement.removeChild(oldListHolder);
	  }
	  if (this.parent.steps[this.parent.currentStep].countErrors() === 0) {
		  return this;
	  }
	  listTitle.innerHTML = this.parent.options.listTitle;
	  listHolder.appendChild(listTitle);
	  listHolder.appendChild(listDescription);
	  listHolder.className = this.parent.options.css.prefix +  this.parent.options.css.errorListClass;
	  listHolder.setAttribute('role', 'alert');
	  listDescription.appendChild(list);

	  for (var er in this.parent.validationList) {
		  if (this.parent.validationList.hasOwnProperty(er)) {
			  if (!!this.parent.validationList[er].error) {
				  item = listItem.cloneNode(true);
				  itemLink = link.cloneNode(true);
				  itemLink.setAttribute('href', '#' + this.parent.validationList[er].id);
				  itemLink.setAttribute('id', er + '-error');
				  itemLink.innerHTML = this.parent.validationList[er].error;
				  item.appendChild(itemLink);
				  list.appendChild(item);
			  }
		  }
	  }

	  this.parent.DOMElement.insertBefore(listHolder, this.parent.DOMElement.firstChild);
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
	  //reinitialize the whole forrm
	  this.parent.build();
  }
};
/*
 * ForrmStep class
 *
 * @param {String} DOM node containing fields for the step
 * @param {Forrm} array of nodes
 * @param {Number} Number in step sequence
 *
 */
function ForrmStep(el, parent, num) {
	this.stepNum = num;
	this.parent = parent;
	this.DOMElement = el;

	this.init();
}

ForrmStep.prototype = {
	init : function () {
		var tmpGroups = [],
			self = this;

		this.fields = this.DOMElement.querySelectorAll('input, textarea, select');
		this.validatebleElements = {};
		this.unvalidatebleElements = {};
		this.groups = {};

		for (var i = 0, field; field = this.fields[i]; i++) {
			if (field.getAttribute('type') !== 'submit' &&
				field.getAttribute('type') !== 'reset' &&
				field.getAttribute('type') !== 'button' &&
				field.getAttribute('type') !== 'hidden' &&
				(field.getAttribute('disabled') === null || field.getAttribute('disabled') === '')&&
				(field.getAttribute('novalidate') === null || field.getAttribute('novalidate') === '')) {
				if (field.getAttribute('required') !== null || field.getAttribute('required') !== '') {
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

		if (this.parent.numSteps > 1) {
			this.addButtons();
		}

		this.makeValidationList();
		this.parent.UI = new ForrmUI(this.parent);
		return this;
	},
	hide : function () {
		this.DOMElement.className = this.DOMElement.className + ' ' + this.parent.options.css.prefix + this.parent.options.css.hiddenClass;
	},
	show : function () {
		this.DOMElement.className = this.DOMElement.className.split(' ' + this.parent.options.css.prefix + this.parent.options.css.hiddenClass).join('');
	},
	addButtons : function () {
		var self = this,
			sbmt,
			prv,
			tpl = document.createElement('button');

		sbmt = tpl.cloneNode(true);

		if (this.stepNum + 1 !== this.parent.numSteps) {
			sbmt.className = this.parent.options.css.prefix + this.parent.options.css.buttonClass + ' ' +  this.parent.options.css.prefix + this.parent.options.css.buttonNextClass;
			sbmt.innerHTML = 'Submit';
			UTILS.on(sbmt, 'click onkeypress', function (e) {
					self.parent.handleEvent.call(self.parent, e);
				});
			this.DOMElement.appendChild(sbmt);
		}

		if (this.stepNum !== 0) {
			prv = tpl.cloneNode(true);
			prv.className = this.parent.options.css.prefix + this.parent.options.css.buttonClass + ' ' + this.parent.options.css.prefix + this.parent.options.css.buttonPreviousClass;
			prv.innerHTML = 'Previous';
			UTILS.on(prv, 'click onkeypress', function (e) {
				self.parent.changeStep.call(self.parent, false, e);
			});
			this.DOMElement.appendChild(prv);
		}

		return this;
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
    this.options = UTILS.extend({}, defaults, options);

    this.init();
}

ForrmForm.prototype = {
    HTML5 : false,
    build : function () {
        var steps, stepElements;

        stepElements = this.DOMElement.querySelectorAll('[data-forrm-step]');
        this.numSteps = stepElements.length || 1;
        this.steps = [];

        stepElements = (stepElements.length > 0 && stepElements) || [this.DOMElement];
        this.currentStep = 0;
        if (this.numSteps > 1) {
            this.DOMElement.className += ' ' + this.options.css.prefix + this.options.css.stepPrefix + '1';
        }
        for (var i = 0; i < stepElements.length; ++i) {
            this.steps.push(new ForrmStep(stepElements[i], this, i));
            if (i !== 0) {
                this.steps[i].hide();
            }
        }
        return this;
    },
    init: function () {
        var self = this;
        this.HTML5 = 'noValidate' in document.createElement('form');
        this.liveValidating = false;
        this.go = this.options.pass || this.DOMElement.submit;

        if (!this.HTML5 || this.options.augmentHTML5) {
            if ('autocomplete' in this.DOMElement && !this.options.autocomplete) {
                this.DOMElement.setAttribute('autocomplete', 'off');
            }

            this.build();

            if (this.DOMElement.querySelector('input[type=submit]') !== null) {
                UTILS.on(this.DOMElement.querySelector('input[type=submit]'), 'click onkeypress', function (e) {
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
                UTILS.preventDefault(e);
                UTILS.stopImmediatePropagation(e);
                this.test.call(this);
            }
        }
    },
    changeStep : function (forward, e) {
        var next = !!forward && this.currentStep + 1 || this.currentStep - 1;

        if(!!e) {UTILS.preventDefault(e);}

        this.steps[this.currentStep].hide();
        this.DOMElement.className = this.DOMElement.className.split(' ' +
                                                                    this.options.css.prefix +
                                                                    this.options.css.stepPrefix +
                                                                    (+this.currentStep + 1)).join(' ' +
                                                                    this.options.css.prefix +
                                                                    this.options.css.stepPrefix + (+next + 1));
        this.steps[next].show();
        this.currentStep = next;

        return this;
    },
    test : function () {
        var el = null,
            er = null,
            vList,
            self = this;
        this.validationList = this.steps[this.currentStep].makeValidationList();

        for (var i in this.validationList) {
            this.validationList[i].element.validate();
            if (!!this.options.firstErrorOnly && !!this.validationList[i].error) {
                break;
            }
        }

        if (this.steps[this.currentStep].countErrors() > 0) {
            self.UI.write();
            if (!this.options.listMessages) {
                document.querySelector('.' + this.options.css.prefix + this.options.css.errorMessageClass).focus();
            } else {
                this.UI.errorListHolder.focus();
            }
            if (typeof this.options.fail === 'function') {
                this.options.fail.call();
            }
        } else {
            if (this.currentStep === this.numSteps - 1) {
                this.go.call(this.DOMElement);
            } else {
                this.changeStep(true);
            }
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
