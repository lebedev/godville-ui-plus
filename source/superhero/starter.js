// ui_starter
var ui_starter = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "starter"}) : worker.GUIp.starter = {};

ui_starter._init = function() {
	ui_data.init();
	ui_storage.migrate();
	ui_utils.addCSS();
	ui_utils.inform();
	ui_words.init();
	ui_logger.create();
	ui_timeout.create();
	ui_help.init();
	ui_informer.init();
	ui_forum.init();
	ui_inventory.init();
	ui_improver.improve();
	ui_timers.init();
	ui_observers.init();
	ui_improver.initOverrides();
};
ui_starter.start = function() {
	if (worker.$ && (worker.$('#m_info').length || worker.$('#stats').length) && worker.GUIp_browser && worker.GUIp_i18n && worker.GUIp_addCSSFromURL && worker.so.state) {
		worker.clearInterval(starterInt);
		worker.console.time('Godville UI+ initialized in');

		ui_starter._init();

		if (!ui_data.isFight) {
			worker.onmousemove = worker.onscroll = worker.ontouchmove = ui_improver.activity;
		}

		// svg for #logger fade-out in FF
		var is5c = document.getElementsByClassName('page_wrapper_5c').length;
		document.body.insertAdjacentHTML('beforeend',
			'<svg id="fader">' +
				'<defs>' +
					'<linearGradient id="gradient" x1="0" y1="0" x2 ="100%" y2="0">' +
						'<stop stop-color="black" offset="0"></stop>' +
						'<stop stop-color="white" offset="0.0' + (is5c ? '2' : '3') + '"></stop>' +
					'</linearGradient>' +
					'<mask id="fader_masking" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">' +
						'<rect x="0.0' + (is5c ? '2' : '3') + '" width="0.9' + (is5c ? '8' : '7') + '" height="1" fill="url(#gradient)" />' +
					'</mask>' +
				'</defs>' +
			'</svg>'
		);

		worker.console.timeEnd('Godville UI+ initialized in');
	}
};
