// timers
window.GUIp = window.GUIp || {};

GUIp.timers = {};

GUIp.timers.init = function() {
    if (GUIp.data.hasTemple && window.so.state.fight_type() !== "sail") {
        document.querySelector('#imp_button').insertAdjacentHTML('afterend', '<div id=\"imp_timer\" class=\"fr_new_badge hidden\" />');
        if (GUIp.data.isDungeon || (GUIp.data.isFight && GUIp.stats.Allies_Count() > 2)) {
            this.logTimer = document.querySelector('#imp_timer');
            this.logTimerIsDisabled = GUIp.storage.get('Option:disableLogTimer');
            GUIp.utils.hideElem(this.logTimer, this.logTimerIsDisabled);
        } else {
            this.layingTimer = document.querySelector('#imp_timer');
            this.layingTimerIsDisabled = GUIp.storage.get('Option:disableLayingTimer');
            GUIp.utils.hideElem(this.layingTimer, this.layingTimerIsDisabled);
        }
        if (!GUIp.storage.get('Option:disableLayingTimer') && !GUIp.storage.get('Option:disableLogTimer')) {
            var curTimer = this.layingTimer ? this.layingTimer : this.logTimer;
            curTimer.style.cursor = 'pointer';
            curTimer.onclick = GUIp.timers.toggleTimers.bind(GUIp.timers);
        }
        GUIp.timers.tick();
        setInterval(function() { GUIp.timers.tick(); }, 60000);
    }
};
GUIp.timers.getDate = function(entry) {
    return GUIp.storage.get('ThirdEye:' + entry) ? new Date(GUIp.storage.get('ThirdEye:' + entry)) : 0;
};
GUIp.timers.tick = function() {
    this._lastLayingDate = GUIp.timers.getDate('LastLaying');
    this._lastLogDate = GUIp.timers.getDate('LastLog');
    this._penultLogDate = GUIp.timers.getDate('PenultLog');
    for (var msg in window.so.state.diary_i) {
        var curEntryDate = new Date(window.so.state.diary_i[msg].time);
        if (msg.match(/^(?:Возложила?|Выставила? тридцать золотых столбиков|I placed \w+? bags of gold)/i) && curEntryDate > this._lastLayingDate) {
            this._lastLayingDate = curEntryDate;
        }
        var logs;
        if (msg.match(/^Выдержка из хроники подземелья:|Notes from the dungeon:/i) && (logs = (msg.match(/бревно для ковчега|ещё одно бревно|log for the ark/gi) || []).length)) {
            if (curEntryDate > this._lastLogDate) {
                while (logs--) {
                    this._penultLogDate = this._lastLogDate;
                    this._lastLogDate = curEntryDate;
                }
            } else if (curEntryDate < this._lastLogDate && curEntryDate > this._penultLogDate) {
                this._penultLogDate = curEntryDate;
            }
        }
        if (!this._latestEntryDate || this._latestEntryDate < curEntryDate) {
            this._latestEntryDate = curEntryDate;
        }
        if (!this._earliestEntryDate || this._earliestEntryDate > curEntryDate) {
            this._earliestEntryDate = curEntryDate;
        }
    }
    if (GUIp.timers.getDate('Latest') >= this._earliestEntryDate) {
        this._earliestEntryDate = GUIp.timers.getDate('Earliest');
        if (this._lastLayingDate) {
            GUIp.storage.set('ThirdEye:LastLaying', this._lastLayingDate);
        }
        if (this._lastLogDate) {
            GUIp.storage.set('ThirdEye:LastLog', this._lastLogDate);
        }
        if (this._penultLogDate) {
            GUIp.storage.set('ThirdEye:PenultLog', this._penultLogDate);
        }
    } else {
        GUIp.storage.set('ThirdEye:Earliest', this._earliestEntryDate);
        GUIp.storage.set('ThirdEye:LastLaying', this._lastLayingDate || '');
        GUIp.storage.set('ThirdEye:LastLog', this._lastLogDate || '');
        GUIp.storage.set('ThirdEye:PenultLog', this._penultLogDate || '');
    }
    GUIp.storage.set('ThirdEye:Latest', this._latestEntryDate);
    if (this.layingTimer && !this.layingTimerIsDisabled) {
        GUIp.timers._calculateTime(true, this._lastLayingDate);
    }
    if (this.logTimer && !this.logTimerIsDisabled) {
        GUIp.timers._calculateTime(false, this._penultLogDate);
    }
};
GUIp.timers._calculateTime = function(isLaying, fromDate) {
    var totalMinutes, greenHours = isLaying ? 36 : 24,
        yellowHours = isLaying ? 18 : 23;
    if (fromDate) {
        totalMinutes = Math.ceil((Date.now() + 1 - fromDate)/1000/60);
        GUIp.timers._setTimer(isLaying, totalMinutes, totalMinutes > greenHours*60 ? 'green' : totalMinutes > yellowHours*60 ? 'yellow' : 'red');
    } else {
        totalMinutes = Math.floor((Date.now() - this._earliestEntryDate)/1000/60);
        GUIp.timers._setTimer(isLaying, totalMinutes, totalMinutes > greenHours*60 ? 'green' : 'grey');
    }
};
GUIp.timers._formatTime = function(maxHours, totalMinutes) {
    var countdownMinutes = maxHours*60 - totalMinutes,
        hours = Math.floor(countdownMinutes/60),
        minutes = Math.floor(countdownMinutes%60);
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
};
GUIp.timers._calculateExp = function(totalMinutes) {
    var baseExp = Math.min(totalMinutes/36/60*2, 2),
        amountMultiplier = [1, 2, 2.5],
        level = GUIp.stats.Level(),
        levelMultiplier = level < 100 ? 1 : level < 125 ? 0.5 : 0.25,
        title = [];
    for (var i = 1; i <= 3; i++) {
        title.push(i + '0k gld → ' + ((i + baseExp*amountMultiplier[i - 1])*levelMultiplier).toFixed(1) + '% exp');
    }
    return title.join('\n');
};
GUIp.timers._setTimer = function(isLaying, totalMinutes, color) {
    var timer = isLaying ? this.layingTimer : this.logTimer;
    timer.className = timer.className.replace(/green|yellow|red|grey/g, '');
    timer.classList.add(color);
    if (color === 'grey') {
        timer.textContent = '?';
        timer.title = (isLaying ? GUIp.i18n.gte_unknown_penalty : GUIp.i18n.log_unknown_time) + GUIp.timers._formatTime(isLaying ? 36 : 24, totalMinutes);
    } else {
        timer.textContent = color === 'green' ? isLaying ? '✓' : '木' : (isLaying ? GUIp.timers._formatTime(36, totalMinutes) : '¦' + GUIp.timers._formatTime(24, totalMinutes) + '¦');
        timer.title = isLaying ? GUIp.timers._calculateExp(totalMinutes) : totalMinutes > 24*60 ? GUIp.i18n.log_is_guaranteed : GUIp.i18n.log_isnt_guaranteed;
    }
};
GUIp.timers.toggleTimers = function(e) {
    e.stopPropagation();
    if (!this.layingTimer && !this.logTimer) {
        return;
    }
    if (this.layingTimer) {
        this.logTimer = this.layingTimer;
        delete this.layingTimer;
    } else {
        this.layingTimer = this.logTimer;
        delete this.logTimer;
    }

    var timerElem = window.$('#imp_timer');
    timerElem.fadeOut(500, function() {
        GUIp.timers.tick();
        timerElem.fadeIn(500);
    });
};

GUIp.timers.loaded = true;
