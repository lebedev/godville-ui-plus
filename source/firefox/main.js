var selfUrl = require('sdk/self').data.url,
    pageMod = require('sdk/page-mod').PageMod;

var ruUrlRegExp = 'https?:\/\/(godville\\.net|gdvl\\.tk|gv\\.erinome\\.net)\/',
    enUrlRegExp = 'https?:\/\/godvillegame\\.com\/';

var specificScripts = {
	'superhero.*':                     'superhero.js',
	'user\/(?:profile|rk_success).*': ['options_page.js', 'options.js'],
	'forums\/show(?:_topic)?\/\\d+.*': 'forum.js',
	'duels\/log\/.*':                  'log.js'
};

function attachScripts(pathname, locale) {
	var commonScriptNames = ['common.js', 'guip_firefox.js', 'phrases_' + locale + '.js'],
	    scriptNames = commonScriptNames.concat(specificScripts[pathname]);

	// Minified loader to load add-on's scripts as unprivileged <script>-tags instead of Content Scripts.
	var loaderScript = 'var d=document,c="createElement",h=d.head,a="appendChild",tn="script",s;' +
		scriptNames.map(function(scriptName) {
			return 's=d[c](tn);s.src="' + selfUrl(scriptName) + '";h[a](s);';
		}).join('');
	return loaderScript;
}

function process(hostname, locale) {
	for (var pathname in specificScripts) {
		pageMod({
			include: RegExp(hostname + pathname, 'i'),
			contentScript: attachScripts(pathname, locale),
			contentScriptWhen: 'ready'
		});
	}
}

process(ruUrlRegExp, 'ru');
process(enUrlRegExp, 'en');

var tabs = require('sdk/tabs');
for (let tab of tabs) {
	if (tab.url.match(RegExp(ruUrlRegExp + '|' + enUrlRegExp, 'i'))) {
		tab.reload();
	}
}
