(function() {
	'use strict';
	var pmSoundJammerInt = setInterval(function() {
		if (window.so && window.so.play_sound) {
			clearInterval(pmSoundJammerInt);
			window.so.play_sound_old = window.so.play_sound;
			window.so.play_sound = function(a, b) {
				if (a != 'msg.mp3') {
					window.so.play_sound_old(a, b);
				}
			};
			console.info('Godville UI+ log: PM sound is jammed');
		}
	}, 100);
})();