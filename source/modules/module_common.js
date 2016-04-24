var doc = document;
GUIp.$id = function(id) {
    return doc.getElementById(id);
};
GUIp.$C = function(classname) {
    return doc.getElementsByClassName(classname);
};
GUIp.$c = function(classname) {
    return doc.getElementsByClassName(classname)[0];
};
GUIp.$Q = function(sel, el) {
    return (el || doc).querySelectorAll(sel);
};
GUIp.$q = function(sel, el) {
    return (el || doc).querySelector(sel);
};

window.GUIp = window.GUIp || {};

GUIp.common = GUIp.common || {};

GUIp.common.init = function() {};

GUIp.common.addCSSFromURL = function(aHref, aId) {
    document.getElementById('guip').insertAdjacentHTML('beforeend', '<link id="' + aId + '" type="text/css" href="' + aHref + '" rel="stylesheet" media="screen">');
};
GUIp.common.addCSSFromString = function(aText, aId) {
    if (!document.getElementById(aId)) {
        document.getElementById('guip').insertAdjacentHTML('beforeend', '<style id="' + aId + '" />');
    }
    document.getElementById(aId).textContent = aText;
};
GUIp.common.mapIteration = function(MapData, iPointer, jPointer, step, specway) {
    if (++step > MapData.maxStep) {
        return;
    }
    for (var iStep = -1; iStep <= 1; iStep++) {
        for (var jStep = -1; jStep <= 1; jStep++) {
            if (iStep !== jStep && (iStep === 0 || jStep === 0)) {
                var iNext = iPointer + iStep,
                    jNext = jPointer + jStep;
                if (iNext >= -1 && iNext <= MapData.kRow && jNext >= -1 && jNext <= MapData.kColumn) {
                    if (MapData[iNext + ':' + jNext] && !MapData[iNext + ':' + jNext].wall) {
                        if (!MapData[iNext + ':' + jNext].step || MapData[iNext + ':' + jNext].step > step) {
                            var tspecway = specway;
                            if (MapData[iPointer + ':' + jPointer].unknown) {
                                tspecway = true;
                            }
                            MapData[iNext + ':' + jNext].specway = tspecway;
                            MapData[iNext + ':' + jNext].step = step;
                            GUIp.common.mapIteration(MapData, iNext, jNext, step, tspecway);
                        }
                    }
                }
            }
        }
    }
};
GUIp.common.mapSubIteration = function(MapData, iPointer, jPointer, step, limit, specway) {
    step++;
    if (step >= limit || step > 3) {
        return;
    }
    for (var iStep = -1; iStep <= 1; iStep++) {
        for (var jStep = -1; jStep <= 1; jStep++) {
            if (iStep !== jStep && (iStep === 0 || jStep === 0)) {
                var iNext = iPointer + iStep,
                    jNext = jPointer + jStep;
                if (iNext >= -1 && iNext <= MapData.kRow && jNext >= -1 && jNext <= MapData.kColumn) {
                    if (!MapData[iNext + ':' + jNext].wall) {
                        if (!MapData[iNext + ':' + jNext].substep || MapData[iNext + ':' + jNext].substep >= step) {
                            var tspecway = specway;
                            if (MapData[iPointer + ':' + jPointer].unknown) {
                                tspecway = true;
                            }
                            if (MapData[iNext + ':' + jNext].explored && !MapData[iNext + ':' + jNext].scanned) {
                                MapData[iNext + ':' + jNext].scanned = true;
                                MapData.scanList.push({ i: iNext, j: jNext, lim: limit - step });
                            }
                            if (!MapData[iNext + ':' + jNext].explored && MapData[iNext + ':' + jNext].specway && (step < 3 || !tspecway)) {
                                MapData[iNext + ':' + jNext].specway = false;
                            }
                            MapData[iNext + ':' + jNext].substep = step;
                            GUIp.common.mapSubIteration(MapData, iNext, jNext, step, limit, tspecway);
                        }
                    }
                }
            }
        }
    }
};

GUIp.common.showMessage = function(aMessageId, aMessage, aCloseCallback) {
    var id = 'msg' + aMessageId;
    document.getElementById('guip').insertAdjacentHTML('beforeend',
        '<div id="' + id + '" class="guip_message hint_bar transparent" default_message_style="true">'+
            '<div class="hint_bar_capt"><b>' + aMessage.title + '</b></div>'+
            '<div class="hint_bar_content">' + aMessage.content + '</div>'+
            '<div class="hint_bar_close"><a id="' + id + '_close">' + GUIp.i18n.close + '</a></div>' +
        '</div>'
    );
    if (typeof aMessage.callback === 'function') {
        aMessage.callback();
    }
    var messageEl = document.getElementById(id);
    document.getElementById(id + '_close').onclick = function() {
        messageEl.classList.add('transparent');
        setTimeout(function() {
            messageEl.remove();
            if (typeof aCloseCallback === 'function') {
                aCloseCallback();
            }
        }, 1500);
        return false;
    };

    setTimeout(function() {
        messageEl.classList.remove('transparent');
    }, 1000);
};

GUIp.common.loaded = true;

document.currentScript.remove();
