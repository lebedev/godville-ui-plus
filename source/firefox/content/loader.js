var loader = {

contentLoad: function(event) {
	var doc = event.originalTarget,
		path = doc.location.pathname;
	if (doc.location.href.match(/^https?:\/\/godville.net/)) {
		var windowStats = new WeakMap();
		if (path.match(/^\/superhero/)) {
			if (!windowStats.get(doc)) {
				windowStats.set(doc,'scriptsLoaded');
				loader.createScript(doc, 'chrome://godvilleui/content/phrases.js');
				loader.createScript(doc, 'chrome://godvilleui/content/gm_func.js');
				loader.createScript(doc, 'chrome://godvilleui/content/script.js');
			}
		}
		if (path.match(/^\/user\/(?:profile|rk_success)/)) {
			if (!windowStats.get(doc)) {
				windowStats.set(doc,'scriptsLoaded');
				loader.createScript(doc, 'chrome://godvilleui/content/jquery-2.1.0.min.js');
				loader.createScript(doc, 'chrome://godvilleui/content/phrases.js');
				loader.createScript(doc, 'chrome://godvilleui/content/gm_func.js');
				loader.createScript(doc, 'chrome://godvilleui/content/options-page.js');
				setTimeout(function(){loader.createScript(doc, 'chrome://godvilleui/content/options.js');}, 1000);
			}
		}
		if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
			if (!windowStats.get(doc)) {
				windowStats.set(doc,'scriptsLoaded');
				loader.createScript(doc, 'chrome://godvilleui/content/jquery-2.1.0.min.js');
				loader.createScript(doc, 'chrome://godvilleui/content/forum.js');
			}
		}
	}
},

createScript:function(doc, uri) {
	var head = doc.getElementsByTagName('head')[0];
	var scr1 = doc.createElement('script');
	scr1.type = 'text/javascript';
	scr1.src = uri;
	scr1.id = 'GodvilleUI';
	head.appendChild(scr1);
},
};

gBrowser.addEventListener("load", loader.contentLoad, true);