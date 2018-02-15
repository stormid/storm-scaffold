(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormPasswordToggle = require('./libs/storm-password-toggle');

var _stormPasswordToggle2 = _interopRequireDefault(_stormPasswordToggle);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    _stormPasswordToggle2.default.init('.js-password__toggle');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
    onDOMContentLoadedTasks.forEach(function (fn) {
        return fn();
    });
});

},{"./libs/storm-password-toggle":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @name storm-password-toggle: 
 * @version 0.1.1: Tue, 06 Jun 2017 08:07:16 GMT
 * @author stormid
 * @license MIT
 */
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

exports.default = { init: init };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLXBhc3N3b3JkLXRvZ2dsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQztrQ0FBQSxBQUFlLEtBQWYsQUFBb0IsQUFDdkI7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7O0FDTmpDOzs7Ozs7QUFNQSxJQUFNO21CQUFOLEFBQWlCLEFBQ0U7QUFERixBQUNoQjs7QUFHRCxJQUFNLGlCQUFpQixDQUFBLEFBQUMsU0FBeEIsQUFBdUIsQUFBVTtJQUNoQyxtQkFBbUIsQ0FBQSxBQUFDLElBRHJCLEFBQ29CLEFBQUs7O0FBRXpCLElBQU07QUFBaUIsdUJBQ2hCO2NBQ0w7O2lCQUFBLEFBQWUsUUFBUSxtQkFBVyxBQUFFO1NBQUEsQUFBSyxLQUFMLEFBQVUsaUJBQVYsQUFBMkIsU0FBUyxNQUFBLEFBQUssZ0JBQUwsQUFBcUIsS0FBekQsQUFBc0U7QUFBMUcsQUFDQTtTQUFBLEFBQU8sQUFDUDtBQUpxQixBQUt0QjtBQUxzQiwyQ0FBQSxBQUtOLEdBQUUsQUFDakI7TUFBRyxDQUFDLENBQUMsRUFBRixBQUFJLFdBQVcsQ0FBQyxDQUFDLGlCQUFBLEFBQWlCLFFBQVEsRUFBN0MsQUFBb0IsQUFBMkIsVUFBVSxBQUN6RDtPQUFBLEFBQUssQUFDTDtBQVJxQixBQVN0QjtBQVRzQiwyQkFTZCxBQUNEO09BQUEsQUFBSyxNQUFMLEFBQVcsYUFBWCxBQUF3QixRQUFRLEtBQUEsQUFBSyxNQUFMLEFBQVcsYUFBWCxBQUF3QixZQUF4QixBQUFvQyxTQUFwQyxBQUE2QyxhQUE3RSxBQUEwRixBQUNoRztPQUFBLEFBQUssS0FBTCxBQUFVLFVBQVYsQUFBb0IsT0FBTyxLQUFBLEFBQUssU0FBaEMsQUFBeUMsQUFDekM7QUFaRixBQUF1QjtBQUFBLEFBQ3RCOztBQWNELElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksTUFBTSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUFqQyxBQUFVLEFBQWMsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxBQUVoQjs7WUFBTyxBQUFJLElBQUksY0FBQTtnQkFBTSxBQUFPLE9BQU8sT0FBQSxBQUFPLE9BQXJCLEFBQWMsQUFBYztTQUFpQixBQUN6RCxBQUNOO1VBQU8sR0FGd0QsQUFFckQsQUFDVjthQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQixVQUhWLEFBQTZDLEFBR3JELEFBQTRCO0FBSHlCLEFBQy9ELEdBRGtCLEVBQU4sQUFBTSxBQUloQjtBQUpMLEFBQU8sQUFLUCxFQUxPO0FBTFI7O2tCQVllLEVBQUUsTSxBQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYXNzd29yZFRvZ2dsZSBmcm9tICcuL2xpYnMvc3Rvcm0tcGFzc3dvcmQtdG9nZ2xlJztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIFBhc3N3b3JkVG9nZ2xlLmluaXQoJy5qcy1wYXNzd29yZF9fdG9nZ2xlJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsIi8qKlxuICogQG5hbWUgc3Rvcm0tcGFzc3dvcmQtdG9nZ2xlOiBcbiAqIEB2ZXJzaW9uIDAuMS4xOiBUdWUsIDA2IEp1biAyMDE3IDA4OjA3OjE2IEdNVFxuICogQGF1dGhvciBzdG9ybWlkXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgZGVmYXVsdHMgPSB7XG5cdHZpc2JpbGVDbGFzc05hbWU6ICdpcy0tdmlzaWJsZSdcbn07XG5cbmNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ10sXG5cdFRSSUdHRVJfS0VZQ09ERVMgPSBbMTMsIDMyXTtcblxuY29uc3QgUGFzc3dvcmRUb2dnbGUgPSB7XG5cdGluaXQoKXtcblx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKHRyaWdnZXIgPT4geyB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0cmlnZ2VyLCB0aGlzLmhhbmRsZVRyaWdnZXJlZC5iaW5kKHRoaXMpKTt9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aGFuZGxlVHJpZ2dlcmVkKGUpe1xuXHRcdGlmKCEhZS5rZXlDb2RlICYmICF+VFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUua2V5Q29kZSkpIHJldHVybjtcblx0XHR0aGlzLnRvZ2dsZSgpO1xuXHR9LFxuXHR0b2dnbGUoKXtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCB0aGlzLmlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndGV4dCcgPyAncGFzc3dvcmQnIDogJ3RleHQnKTtcblx0XHR0aGlzLm5vZGUuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLnZpc2JpbGVDbGFzc05hbWUpO1xuXHR9XG59O1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHJldHVybjtcblxuXHRyZXR1cm4gZWxzLm1hcChlbCA9PiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoUGFzc3dvcmRUb2dnbGUpLCB7XG5cdFx0XHRcdG5vZGU6IGVsLFxuXHRcdFx0XHRpbnB1dDogZWwucHJldmlvdXNFbGVtZW50U2libGluZyxcblx0XHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdFx0fSkuaW5pdCgpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyJdfQ==
