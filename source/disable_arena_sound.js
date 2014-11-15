(function() {
	'use strict';
	var arenaSoundJammerInt = setInterval(function() {
		if (window.so && window.so.a_notify) {
			clearInterval(arenaSoundJammerInt);
			window.so.a_notify = function() {};
			console.info('Godville UI+ log: Arena sound is jammed');
		}
	}, 100);
})();