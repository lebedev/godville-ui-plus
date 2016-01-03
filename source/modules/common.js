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

GUIp.common.loaded = true;
