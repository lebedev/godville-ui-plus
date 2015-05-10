var selfUrl = require('sdk/self').data.url,
	pageMod = require('sdk/page-mod').PageMod;

function mod(hostname, locale) {
	var pathnames = ['superhero.*', 'user\/(?:profile|rk_success).*', 'forums\/show(?:_topic)?\/\\d+.*', 'duels\/log\/.*'],
		commonScripts = [selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js')];
	var scripts = [
		selfUrl('superhero.js'),
		[selfUrl('jquery-1.10.2.min.js'), selfUrl('options_page.js'), selfUrl('options.js')],
		selfUrl('forum.js'),
		selfUrl('log.js')
	];
	for (var i = 0; i < 4; i++) {
		pageMod({
			include: RegExp(hostname + pathnames[i]),
			contentScriptFile: commonScripts.concat(scripts[i]),
			contentScriptWhen: 'ready'
		});
	}
}

mod('https?:\/\/(godville\\.net|gdvl\\.tk)\/', 'ru');
mod('https?:\/\/godvillegame\\.com\/', 'en');