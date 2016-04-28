// timers
window.GUIp = window.GUIp || {};

GUIp.timers = {};

GUIp.timers.init = function() {};
GUIp.timers.initOrig = function() {
    var thirdEyeEntriesGettingMethodWorks = !!GUIp.timers._getThirdEyeEntries();
    if (GUIp.stats.hasTemple() && !GUIp.stats.isSail() && thirdEyeEntriesGettingMethodWorks) {
        document.querySelector('#m_fight_log .block_h .l_slot, #diary .block_h .l_slot').insertAdjacentHTML('beforeend', '<div id=\"imp_timer\" class=\"fr_new_badge hidden\" />');
        if (GUIp.stats.isDungeon()) {
            GUIp.timers.logTimer = document.querySelector('#imp_timer');
            GUIp.timers.logTimerIsDisabled = GUIp.storage.get('Option:disableLogTimer');
            GUIp.utils.hideElem(GUIp.timers.logTimer, GUIp.timers.logTimerIsDisabled);
        } else {
            GUIp.timers.layingTimer = document.querySelector('#imp_timer');
            GUIp.timers.layingTimerIsDisabled = GUIp.storage.get('Option:disableLayingTimer');
            GUIp.utils.hideElem(GUIp.timers.layingTimer, GUIp.timers.layingTimerIsDisabled);
        }
        if (!GUIp.storage.get('Option:disableLayingTimer') && !GUIp.storage.get('Option:disableLogTimer')) {
            var curTimer = GUIp.timers.layingTimer ? GUIp.timers.layingTimer : GUIp.timers.logTimer;
            curTimer.style.cursor = 'pointer';
            curTimer.onclick = GUIp.timers.toggleTimers;
        }
        GUIp.timers.tick();
        setInterval(function() { GUIp.timers.tick(); }, 60000);
    }
};
GUIp.timers.getDate = function(entry) {
    return GUIp.storage.get('ThirdEye:' + entry) ? new Date(GUIp.storage.get('ThirdEye:' + entry)) : 0;
};
GUIp.timers._getThirdEyeEntries = function() {
    try {
        var rawThirdEye = localStorage.getItem('d_i_' + GUIp.stats.godName());
        var thirdEyeObject = JSON.parse(rawThirdEye);
        var thirdEye = [];
        for (var entry in thirdEyeObject) {
            thirdEye.push(thirdEyeObject[entry]);
        }
        thirdEye.sort(function(a, b) {
            if (a.pos && b.pos) {
                return +a.pos > +b.pos;
            } else if (a.time && b.time) {
                return Date(a.time) > Date(b.time);
            } else {
                throw 'Can\'t parse third eye entries';
            }
        });
        return thirdEye;
    } catch(e) {
        return;
    }
};
GUIp.timers.tick = function() {
    var thirdEye = GUIp.timers._getThirdEyeEntries();
    GUIp.timers._lastLayingDate = GUIp.timers.getDate('LastLaying');
    GUIp.timers._lastLogDate = GUIp.timers.getDate('LastLog');
    GUIp.timers._penultLogDate = GUIp.timers.getDate('PenultLog');


    for (var msg in thirdEye) {
        var curEntryDate = new Date(thirdEye[msg].time);
        if (msg.match(/^(?:Возложила?|Выставила? тридцать золотых столбиков|I placed \w+? bags of gold)/i) && curEntryDate > GUIp.timers._lastLayingDate) {
            GUIp.timers._lastLayingDate = curEntryDate;
        }
        var logs;
        if (msg.match(/^Выдержка из хроники подземелья:|Notes from the dungeon:/i) && (logs = (msg.match(/бревно для ковчега|ещё одно бревно|log for the ark/gi) || []).length)) {
            if (curEntryDate > GUIp.timers._lastLogDate) {
                while (logs--) {
                    GUIp.timers._penultLogDate = GUIp.timers._lastLogDate;
                    GUIp.timers._lastLogDate = curEntryDate;
                }
            } else if (curEntryDate < GUIp.timers._lastLogDate && curEntryDate > GUIp.timers._penultLogDate) {
                GUIp.timers._penultLogDate = curEntryDate;
            }
        }
        if (!GUIp.timers._latestEntryDate || GUIp.timers._latestEntryDate < curEntryDate) {
            GUIp.timers._latestEntryDate = curEntryDate;
        }
        if (!GUIp.timers._earliestEntryDate || GUIp.timers._earliestEntryDate > curEntryDate) {
            GUIp.timers._earliestEntryDate = curEntryDate;
        }
    }
    if (GUIp.timers.getDate('Latest') >= GUIp.timers._earliestEntryDate) {
        GUIp.timers._earliestEntryDate = GUIp.timers.getDate('Earliest');
        if (GUIp.timers._lastLayingDate) {
            GUIp.storage.set('ThirdEye:LastLaying', GUIp.timers._lastLayingDate);
        }
        if (GUIp.timers._lastLogDate) {
            GUIp.storage.set('ThirdEye:LastLog', GUIp.timers._lastLogDate);
        }
        if (GUIp.timers._penultLogDate) {
            GUIp.storage.set('ThirdEye:PenultLog', GUIp.timers._penultLogDate);
        }
    } else {
        GUIp.storage.set('ThirdEye:Earliest', GUIp.timers._earliestEntryDate);
        GUIp.storage.set('ThirdEye:LastLaying', GUIp.timers._lastLayingDate || '');
        GUIp.storage.set('ThirdEye:LastLog', GUIp.timers._lastLogDate || '');
        GUIp.storage.set('ThirdEye:PenultLog', GUIp.timers._penultLogDate || '');
    }
    GUIp.storage.set('ThirdEye:Latest', GUIp.timers._latestEntryDate);
    if (GUIp.timers.layingTimer && !GUIp.timers.layingTimerIsDisabled) {
        GUIp.timers._calculateTime(true, GUIp.timers._lastLayingDate);
    }
    if (GUIp.timers.logTimer && !GUIp.timers.logTimerIsDisabled) {
        GUIp.timers._calculateTime(false, GUIp.timers._penultLogDate);
    }
};
GUIp.timers._calculateTime = function(isLaying, fromDate) {
    var totalMinutes, greenHours = isLaying ? 36 : 24,
        yellowHours = isLaying ? 18 : 23;
    if (fromDate) {
        totalMinutes = Math.ceil((Date.now() + 1 - fromDate)/1000/60);
        GUIp.timers._setTimer(isLaying, totalMinutes, totalMinutes > greenHours*60 ? 'green' : totalMinutes > yellowHours*60 ? 'yellow' : 'red');
    } else {
        totalMinutes = Math.floor((Date.now() - GUIp.timers._earliestEntryDate)/1000/60);
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
    var timer = isLaying ? GUIp.timers.layingTimer : GUIp.timers.logTimer;
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
    if (!GUIp.timers.layingTimer && !GUIp.timers.logTimer) {
        return;
    }
    if (GUIp.timers.layingTimer) {
        GUIp.timers.logTimer = GUIp.timers.layingTimer;
        delete GUIp.timers.layingTimer;
    } else {
        GUIp.timers.layingTimer = GUIp.timers.logTimer;
        delete GUIp.timers.logTimer;
    }

    var timerElem = window.$('#imp_timer');
    timerElem.fadeOut(500, function() {
        GUIp.timers.tick();
        timerElem.fadeIn(500);
    });
};

GUIp.timers.loaded = true;

document.currentScript.remove();
