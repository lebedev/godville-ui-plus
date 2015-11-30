var specificScripts = {
	'superhero.*':                     'superhero.js',
	'user\/(?:profile|rk_success).*': ['options_page.js', 'options.js'],
	'forums\/show(?:_topic)?\/\\d+.*': 'forum.js',
	'duels\/log\/.*':                  'log.js'
};

var attachScripts = function(specificScripts) {
	var ruUrlRegExp = 'godville\\.net|gdvl\\.tk|gv\\.erinome\\.net',
		locale = document.location.hostname.match(ruUrlRegExp) ? 'ru' : 'en',
		commonScriptNames = ['common.js', 'guip_firefox.js', 'phrases_' + locale + '.js'],
	    scriptNames = commonScriptNames.concat(specificScripts),
	    script;

	for (var num in scriptNames) {
		script = document.createElement('script');
		script.src = 'resource://godville-ui-plus-at-badluck-dot-dicey/data/' + scriptNames[num];
		document.head.appendChild(script);
	}
};

for (var pathname in specificScripts) {
	if (location.pathname.match(pathname)) {
		attachScripts(specificScripts[pathname]);
		break;
	}
}
