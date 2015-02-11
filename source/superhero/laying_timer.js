// ui_laying_timer
var ui_laying_timer = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "laying_timer"}) : worker.GUIp.laying_timer = {};

ui_laying_timer.init = function() {
	if (ui_data.hasTemple && !ui_data.isFight && !ui_data.isDungeon && !ui_storage.get('Option:disableLayingTimer')) {
		document.querySelector('#imp_button').insertAdjacentHTML('afterend', '<div id=\"laying_timer\" class=\"fr_new_badge\" />');
		for (var key in worker) {
			if (key.match(/^diary/)) {
				this._third_eye = key;
				break;
			}
		}
		ui_laying_timer._tick();
		worker.setInterval(ui_laying_timer._tick.bind(ui_laying_timer), 60000);
	}
};
ui_laying_timer._tick = function() {
	var latestEntryDateFS = ui_storage.get('thirdEyeLatestEntry') && new Date(ui_storage.get('thirdEyeLatestEntry')),
		earliestEntryDateFS = ui_storage.get('thirdEyeEarliestEntry') && new Date(ui_storage.get('thirdEyeEarliestEntry')),
		lastLayingDateFS = ui_storage.get('thirdEyeLastLayingEntry') && new Date(ui_storage.get('thirdEyeLastLayingEntry'));
	this._lastLayingDate = 0;
	for (var msg in worker[this._third_eye]) {
		var curEntryDate = new Date(worker[this._third_eye][msg].time);
		if (msg.match(/^(?:Возложила?|Выставила? тридцать золотых столбиков|I placed \w+? bags of gold)/)) {
			this._lastLayingDate = curEntryDate > this._lastLayingDate ? curEntryDate : this._lastLayingDate;
		}
		if (!this._latestEntryDate || this._latestEntryDate < curEntryDate) {
			this._latestEntryDate = curEntryDate;
		}
		if (!this._earliestEntryDate || this._earliestEntryDate > curEntryDate) {
			this._earliestEntryDate = curEntryDate;
		}
	}
	if (latestEntryDateFS >= this._earliestEntryDate) {
		this._earliestEntryDate = earliestEntryDateFS;
		if (this._lastLayingDate) {
			ui_storage.set('thirdEyeLastLayingEntry', this._lastLayingDate);
		} else {
			this._lastLayingDate = lastLayingDateFS;
		}
	} else {
		ui_storage.set('thirdEyeEarliestEntry', this._earliestEntryDate);
		ui_storage.set('thirdEyeLastLayingEntry', this._lastLayingDate || '');
	}
	ui_storage.set('thirdEyeLatestEntry', this._latestEntryDate);
	ui_laying_timer._calculateTime();
};
ui_laying_timer._calculateTime = function() {
	var $timer = document.querySelector('#laying_timer');
	$timer.className = $timer.className.replace(/green|yellow|red|grey/g, '');
	if (this._lastLayingDate) {
		this._total_minutes = Math.ceil((Date.now() + 1 - this._lastLayingDate)/1000/60);
		ui_laying_timer._setTimer(this._total_minutes > 36*60 ? 'green' : this._total_minutes > 18*60 ? 'yellow' : 'red');
	} else {
		this._total_minutes = Math.floor((Date.now() - this._earliestEntryDate)/1000/60);
		ui_laying_timer._setTimer(this._total_minutes > 36*60 ? 'green' : 'grey');
	}
};
ui_laying_timer._formatTime = function() {
	var hours = Math.floor(36 - this._total_minutes/60),
		minutes = Math.floor(60 - this._total_minutes%60);
	return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
};
ui_laying_timer._calculateExp = function() {
	var base_exp = Math.min(this._total_minutes/36/60*2, 2),
		amount_multiplier = [1, 2, 2.5],
		half_multiplier = ui_stats.get('Level') >= 100 ? 0.5 : 1,
		title = [];
	for (var i = 1; i <= 3; i++) {
		title.push(i + '0k gld -> ' + ((i + base_exp*amount_multiplier[i - 1])*half_multiplier).toFixed(1) + '% exp');
	}
	return title.join('\n');
};
ui_laying_timer._setTimer = function(color) {
	var $timer = document.querySelector('#laying_timer');
	$timer.classList.add(color);
	if (color === 'grey') {
		$timer.textContent = '?';
		$timer.title = worker.GUIp_i18n.gte_unknown_penalty + ui_laying_timer._formatTime();
	} else {
		$timer.textContent = color === 'green' ? '✓' : ui_laying_timer._formatTime();
		$timer.title = ui_laying_timer._calculateExp();
	}
};