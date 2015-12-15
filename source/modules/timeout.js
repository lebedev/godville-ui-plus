// timeout
window.GUIp = window.GUIp || {};

GUIp.timeout = {};

GUIp.timeout.init = function() {
    document.getElementById('guip').insertAdjacentHTML('beforeend', '<div id="timeout_bar"></div>');
    this.bar = document.getElementById('timeout_bar');
};

GUIp.timeout.timeout = 0;
GUIp.timeout._finishtDate = 0;
GUIp.timeout._tickInt = 0;
GUIp.timeout._tick = function() {
    if (Date.now() > this._finishDate) {
        clearInterval(this._tickInt);
        if (this.bar.style.transitionDuration) {
            this.bar.style.transitionDuration = '';
        }
        this.bar.classList.remove('running');
        GUIp.utils.setVoiceSubmitState(!GUIp.improver.freezeVoiceButton.match('when_empty') || document.querySelector('#god_phrase').value, false);
    }
};

// starts timeout bar
GUIp.timeout.start = function() {
    clearInterval(this._tickInt);
    this.bar.style.transitionDuration = '';
    this.bar.classList.remove('running');
    setTimeout(function() { GUIp.timeout._delayedStart(); }, 10);
    this._finishtDate = Date.now() + this.timeout*1000;
    this._tickInt = setInterval(function() { GUIp.timeout._tick(); }, 100);
    GUIp.utils.setVoiceSubmitState(GUIp.improver.freezeVoiceButton.match('after_voice'), true);
};

GUIp.timeout._delayedStart = function() {
    var customTimeout = GUIp.storage.get('Option:voiceTimeout');
    if (parseInt(customTimeout) > 0) {
        GUIp.timeout.timeout = customTimeout;
        GUIp.timeout.bar.style.transitionDuration = customTimeout + 's';
    } else {
        GUIp.timeout.timeout = 20;
    }
    GUIp.timeout.bar.classList.add('running');
};
