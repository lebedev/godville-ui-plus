(function() {
	var prefix = 'chrome://godville-ui-plus/content/';
	var scripts = {
		common: prefix + 'common.js',
		superhero: prefix + 'superhero.js',
		phrases_ru: prefix + 'phrases_ru.js',
		phrases_en: prefix + 'phrases_en.js',
		guip_firefox: prefix + 'guip_firefox.js',
		jquery: '/javascripts/jquery-1.10.2.min.js',
		options_page: prefix + 'options-page.js',
		options: prefix + 'options.js',
		forum: prefix + 'forum.js',
		log: prefix + 'log.js'
	};

	var loader = {
		createScripts: function(doc, uris) {
			var scr, head = doc.getElementsByTagName('head')[0];
			for (var i = 0, len = uris.length; i < len; i++) {
				scr = doc.createElement('script');
				scr.type = 'text/javascript';
				scr.src = uris[i];
				scr.id = 'godville-ui-plus';
				head.appendChild(scr);
			}
		},

		checkRu: function(doc) {
			if (doc.location.href.match(/^https?:\/\/godville.net/)) {
				var windowStats = new WeakMap(),
					path = doc.location.pathname;
				if (!windowStats.get(doc)) {
					if (path.match(/^\/superhero/)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.common, scripts.guip_firefox, scripts.phrases_ru, scripts.superhero]);
					} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.common, scripts.jquery, scripts.guip_firefox, scripts.phrases_ru, scripts.options_page, scripts.options]);
					} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.common, scripts.guip_firefox, scripts.phrases_ru, scripts.forum]);
					} else if (path.match(/^\/duels\/log\//)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.log]);
					}
				}
			}
		},

		checkEn: function(doc) {
			if (doc.location.href.match(/^https?:\/\/godvillegame.com/)) {
				var windowStats = new WeakMap(),
					path = doc.location.pathname;
				if (!windowStats.get(doc)) {
					if (path.match(/^\/superhero/)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.common, scripts.guip_firefox, scripts.phrases_en, scripts.superhero]);
					} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.common, scripts.jquery, scripts.guip_firefox, scripts.phrases_en, scripts.options_page, scripts.options]);
					} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
						windowStats.set(doc, 'scriptsLoaded');
						loader.createScripts(doc, [scripts.common, scripts.guip_firefox, scripts.phrases_en, scripts.forum]);
					}
				}
			}
		},

		contentLoad: function(event) {
			var doc = event.originalTarget;
			loader.checkRu(doc);
			loader.checkEn(doc);
		}
	};

	window.gBrowser.addEventListener("load", loader.contentLoad, true);
})();