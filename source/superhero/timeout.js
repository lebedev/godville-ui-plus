// ui_timeout
ui_timeout.bar = null;
ui_timeout.timeout = 0;
ui_timeout._finishtDate = 0;
ui_timeout._tickInt = 0;
ui_timeout._tick = function() {
	if (Date.now() > this._finishDate) {
		clearInterval(this._tickInt);
		if (this.bar.style.transitionDuration) {
			this.bar.style.transitionDuration = '';
		}
		this.bar.classList.remove('running');
		ui_utils.setVoiceSubmitState(!(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) || document.querySelector('#god_phrase').value, false);
	}
};
// creates timeout bar element
ui_timeout.create = function() {
	this.bar = document.createElement('div');
	this.bar.id = 'timeout_bar';
	document.body.insertBefore(this.bar, document.body.firstChild);
};
// starts timeout bar
ui_timeout.start = function() {
	clearInterval(this._tickInt);
	this.bar.style.transitionDuration = '';
	this.bar.classList.remove('running');
	setTimeout(this._delayedStart, 10);
	this._finishtDate = Date.now() + this.timeout*1000;
	this._tickInt = setInterval(this._tick.bind(this), 100);
	ui_utils.setVoiceSubmitState(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice'), true);
};
ui_timeout._delayedStart = function() {
	var customTimeout = ui_storage.get('Option:voiceTimeout');
	if (!isNaN(customTimeout)) {
		ui_timeout.timeout = customTimeout;
		ui_timeout.bar.style.transitionDuration = customTimeout + 's';
	} else {
		ui_timeout.timeout = 30;
	}
	ui_timeout.bar.classList.add('running');
};
