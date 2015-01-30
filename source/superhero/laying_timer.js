// ui_laying_timer
var ui_laying_timer = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "laying_timer"}) : worker.GUIp.laying_timer = {};

ui_laying_timer.init = function() {
	if (ui_data.hasTemple && !ui_data.isBattle && !ui_data.isDungeon && !ui_storage.get('Option:disableLayingTimer')) {
		document.querySelector('#imp_button').insertAdjacentHTML('afterend', '<div id=\"laying_timer\" class=\"fr_new_badge\" />');
		for (var key in worker) {
			if (key.match(/^diary/)) {
				this.third_eye = key;
				break;
			}
		}
		this.tick();
		worker.setInterval(this.tick.bind(this), 60000);
	}
};
ui_laying_timer.tick = function() {
	var temp, cur, latest, earliest, lastLaying = 0,
		latestFromStorage = ui_storage.get('thirdEyeLatestEntry') && new Date(ui_storage.get('thirdEyeLatestEntry')),
		earliestFromStorage = ui_storage.get('thirdEyeEarliestEntry') && new Date(ui_storage.get('thirdEyeEarliestEntry')),
		lastLayingFromStorage = ui_storage.get('thirdEyeLastLayingEntry') && new Date(ui_storage.get('thirdEyeLastLayingEntry'));
	for (var msg in worker[this.third_eye]) {
		temp = new Date(worker[this.third_eye][msg].time);
		if (msg.match(/^(?:Возложила?|Выставила? тридцать золотых столбиков|I placed \w+? bags of gold)/)) {
			lastLaying = temp > lastLaying ? temp : lastLaying;
		}
		if (!latest || latest < temp) {
			latest = temp;
		}
		if (!earliest || earliest > temp) {
			earliest = temp;
		}
	}
	if (latestFromStorage >= earliest) {
		earliest = earliestFromStorage;
		if (lastLaying) {
			ui_storage.set('thirdEyeLastLayingEntry', lastLaying);
		} else {
			lastLaying = lastLayingFromStorage;
		}
	} else {
		ui_storage.set('thirdEyeEarliestEntry', earliest);
		ui_storage.set('thirdEyeLastLayingEntry', lastLaying ? lastLaying : '');
	}
	ui_storage.set('thirdEyeLatestEntry', latest);
	var $timer = document.querySelector('#laying_timer');
	$timer.classList.remove('green');
	$timer.classList.remove('yellow');
	$timer.classList.remove('red');
	$timer.classList.remove('grey');
	var hours, minutes;
	if (lastLaying) {
		hours = Math.floor(24 - (Date.now() - lastLaying)/1000/60/60);
		minutes = Math.floor(60 - (Date.now() - lastLaying)/1000/60%60);
		if (hours < 0) {
			$timer.textContent = '✓';
			$timer.classList.add('green');
			$timer.title = worker.GUIp_i18n.gte_no_penalty;
		} else {
			$timer.textContent = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
			if (hours >= 12) {
				$timer.classList.add('red');
				$timer.title = worker.GUIp_i18n.gte_major_penalty;
			} else {
				$timer.classList.add('yellow');
				$timer.title = worker.GUIp_i18n.gte_minor_penalty;
			}
		}
	} else {
		if (Math.floor((Date.now() - earliest)/1000/60/60) >= 24) {
			$timer.textContent = '✓';
			$timer.classList.add('green');
			$timer.title = worker.GUIp_i18n.gte_no_penalty;
		} else {
			hours = Math.floor(24 - (Date.now() - earliest)/1000/60/60);
			minutes = Math.floor(60 - (Date.now() - earliest)/1000/60%60);
			$timer.textContent = '?';
			$timer.classList.add('grey');
			$timer.title = worker.GUIp_i18n.gte_unknown_penalty + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
		}
	}
};
