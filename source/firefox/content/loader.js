var scripts = {
	superhero: 'chrome://godville-ui-plus/content/superhero.js',
	phrases_ru: 'chrome://godville-ui-plus/content/phrases_ru.js',
	phrases_en: 'chrome://godville-ui-plus/content/phrases_en.js',
	guip_firefox: 'chrome://godville-ui-plus/content/guip_firefox.js',
	jquery: '/javascripts/jquery-1.10.2.min.js',
	options_page: 'chrome://godville-ui-plus/content/options-page.js',
	options: 'chrome://godville-ui-plus/content/options.js',
	forum: 'chrome://godville-ui-plus/content/forum.js'
};

var loader = {

createScripts: function(doc, uris) {
	var src, head = doc.getElementsByTagName('head')[0];
	for (var i = 0, len = uris.length; i < len; i++) {
		scr = doc.createElement('script');
		scr.type = 'text/javascript';
		scr.src = uris[i];
		scr.id = 'godville-ui-plus';
		head.appendChild(scr);
	}
},

contentLoad: function(event) {
	var doc = event.originalTarget,
		windowStats, path;
	if (doc.location.href.match(/^https?:\/\/godville.net/)) {
		windowStats = new WeakMap();
		path = doc.location.pathname;
		if (!windowStats.get(doc)) {
			if (path.match(/^\/superhero/)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.phrases_ru, scripts.guip_firefox, scripts.superhero]);
			} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.jquery, scripts.phrases_ru, scripts.guip_firefox, scripts.options_page, scripts.options]);
			} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.phrases_ru, scripts.guip_firefox, scripts.forum]);
			} else if (path.match(/^\/duels\/log\//)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.phrases_ru, scripts.log]);
			}
		}
	}
	if (doc.location.href.match(/^https?:\/\/godvillegame.com/)) {
		windowStats = new WeakMap();
		path = doc.location.pathname;
		if (!windowStats.get(doc)) {
			if (path.match(/^\/superhero/)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.phrases_en, scripts.guip_firefox, scripts.superhero]);
			} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.jquery, scripts.phrases_en, scripts.guip_firefox, scripts.options_page, scripts.options]);
			} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
				windowStats.set(doc, 'scriptsLoaded');
				loader.createScripts(doc, [scripts.phrases_en, scripts.guip_firefox, scripts.forum]);
			}
		}
	}
}
};

gBrowser.addEventListener("load", loader.contentLoad, true);