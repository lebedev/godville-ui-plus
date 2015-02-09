var selfUrl = require('sdk/self').data.url;
var pageMod = require('sdk/page-mod').PageMod;

function mod(url, locale) {
	var urls = ['superhero.*', 'user\/(?:profile|rk_success).*', 'forums\/show(?:_topic)?\/\\d+.*', 'duels\/log\/.*'],
		scripts = [
			[selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('superhero.js')],
			[selfUrl('common.js'), selfUrl('jquery-1.10.2.min.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('options_page.js'), selfUrl('options.js')],
			[selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('forum.js')],
			[selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('log.js')]
		];
	for (var i = 0; i < 4; i++) {
		pageMod({
			include: RegExp(url + urls[i]),
			contentScriptFile: scripts[i],
			contentScriptWhen: 'ready'
		});
	}
}

mod('https?:\/\/godville.net\/', 'ru');
mod('https?:\/\/godvillegame.com\/', 'en');