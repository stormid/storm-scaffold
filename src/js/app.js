/*global $, window, document, console, FastClick*/
var APP = (function(w, d) {
	'use strict';
	
	function init() {
		console.log('Running...');
		FastClick.attach(document.body);
		$('.banner').on('click', function() { console.log('here'); });
	}
	
	return {
		init: init
	};
	
})(window, document, undefined);

$(document).ready(function () {
  APP.init();
});