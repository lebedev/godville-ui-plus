(function() {
	if (+$('#hk_bricks_cnt .l_val').text() == 1000) {
		document.querySelector('#imp_button').insertAdjacentHTML('afterend', '<div id=\"laying_timer\" class=\"fr_new_badge\" />');
		var third_eye;
		for (var key in window) {
			if (key.match(/^diary/)) {
				third_eye = key;
				break;
			}
		}
		var laying_timer_tick = function() {
			var cur, first, last = 0;
			for (var msg in window[third_eye]) {
				temp = new Date(window[third_eye][msg].time);
				if (msg.match(/^Возложил/)) {
					last = temp > last ? temp : last;
				}
				if (!first || first > temp) {
					first = temp;
				}
			}
			var $timer = document.querySelector('#laying_timer');
			$timer.classList.remove('green');
			$timer.classList.remove('yellow');
			$timer.classList.remove('red');
			$timer.classList.remove('grey');
			var hours, minutes;
			if (last) {
				hours = Math.floor(24 - (Date.now() - first)/1000/60/60);
				minutes = Math.floor(60 - (Date.now() - first)/1000/60%60);
				if (hours < 0) {
					$timer.textContent = '00:00';
					$timer.classList.add('green');
					$timer.title = 'Сейчас можно сделать возложение без штрафов';
				} else {
					$timer.textContent = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
					if (hours >= 12) {
						$timer.classList.add('red');
						$timer.title = 'Сейчас на возложения действует штраф в две трети';
					} else {
						$timer.classList.add('yellow');
						$timer.title = 'Сейчас на возложения действует штраф в одну треть';
					}
				}
			} else {
				if (Math.floor((Date.now() - first)/1000/60/60) >= 24) {
					$timer.textContent = '00:00';
					$timer.classList.add('green');
					$timer.title = 'Сейчас можно сделать возложение без штрафов';
				} else {
					hours = Math.floor(24 - (Date.now() - first)/1000/60/60);
					minutes = Math.floor(60 - (Date.now() - first)/1000/60%60);
					$timer.textContent = '??:??';
					$timer.classList.add('grey');
					$timer.title = 'Нет информации о штрафах. Неопределенность разрешится после возложения или через ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
					console.log(Math.floor((Date.now() - first)/3600000), Math.floor((Date.now() - first)/60000%60));
				}
			}
		};
		laying_timer_tick();
		setInterval(laying_timer_tick, 60000);
	}
})();