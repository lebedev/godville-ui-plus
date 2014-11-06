var loader = {

contentLoad: function(event) {
	var doc = event.originalTarget;
	if (doc.location.href.match(/^https?:\/\/godville.net/)) {
		var windowStats = new WeakMap(),
			path = doc.location.pathname;
		if (path.match(/^\/superhero/) && !windowStats.get(doc)) {
			windowStats.set(doc,'scriptsLoaded');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/phrases.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/guip_firefox.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/godville-ui-plus.js');
		}
		if (path.match(/^\/user\/(?:profile|rk_success)/) && !windowStats.get(doc)) {
			windowStats.set(doc,'scriptsLoaded');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/jquery-2.1.0.min.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/phrases.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/guip_firefox.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/options-page.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/options.js');
		}
		if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/) && !windowStats.get(doc)) {
			windowStats.set(doc,'scriptsLoaded');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/guip_firefox.js');
			loader.createScript(doc, 'chrome://godville-ui-plus/content/forum.js');
		}
	}
},

createScript:function(doc, uri) {
	var head = doc.getElementsByTagName('head')[0];
	var scr = doc.createElement('script');
	scr.type = 'text/javascript';
	scr.src = uri;
	scr.id = 'godville-ui-plus';
	head.appendChild(scr);
},
};

gBrowser.addEventListener("load", loader.contentLoad, true);