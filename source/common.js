var worker = window.wrappedJSObject || window;
worker.GUIp_addCSSFromURL = function(href, id) {
	document.head.insertAdjacentHTML('beforeend', '<link id="' + id + '" type="text/css" href="' + href + '" rel="stylesheet" media="screen">');
};
worker.GUIp_addCSSFromString = function(text) {
	if (!document.getElementById('guip_user_css')) {
		document.head.insertAdjacentHTML('beforeend', '<style id="guip_user_css" />');
	}
	document.getElementById('guip_user_css').textContent = text;
};
worker.GUIp_mapIteration = function(MapData, iPointer, jPointer, step, specway) {
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
							worker.GUIp_mapIteration(MapData, iNext, jNext, step, tspecway);
						}
					}
				}
			}
		}
	}
};
worker.GUIp_mapSubIteration = function(MapData, iPointer, jPointer, step, limit, specway) {
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
							worker.GUIp_mapSubIteration(MapData, iNext, jNext, step, limit, tspecway);
						}
					}
				}
			}
		}
	}
};
worker.GUIp_github_link = '<a target="_blank" href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/';
