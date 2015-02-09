var selfUrl = require('sdk/self').data.url,
	pageMod = require('sdk/page-mod').PageMod;

function mod(hostname, locale) {
	var pathnames = ['superhero.*', 'user\/(?:profile|rk_success).*', 'forums\/show(?:_topic)?\/\\d+.*', 'duels\/log\/.*'],
		common = selfUrl('common.js'),
		guip_firefox = selfUrl('guip_firefox.js'),
		phrases = selfUrl('phrases_' + locale + '.js');
	scripts = [
		[common, guip_firefox, phrases, selfUrl('superhero.js')],
		[common, guip_firefox, phrases, selfUrl('jquery-1.10.2.min.js'), selfUrl('options_page.js'), selfUrl('options.js')],
		[common, guip_firefox, phrases, selfUrl('forum.js')],
		[common, guip_firefox, phrases, selfUrl('log.js')]
	];
	for (var i = 0; i < 4; i++) {
		pageMod({
			include: RegExp(hostname + pathnames[i]),
			contentScriptFile: scripts[i],
			contentScriptWhen: 'ready'
		});
	}
}

mod('https?:\/\/godville.net\/', 'ru');
mod('https?:\/\/godvillegame.com\/', 'en');