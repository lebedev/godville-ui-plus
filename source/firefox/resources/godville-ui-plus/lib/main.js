var selfUrl = require('sdk/self').data.url;
var pageMod = require('sdk/page-mod').PageMod;

function mod(url, locale) {
	pageMod({
		include: RegExp(url + 'superhero.*'),
		contentScriptFile: [selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('superhero.js')],
		contentScriptWhen: 'ready'
	});

	pageMod({
		include: RegExp(url + 'user\/(?:profile|rk_success).*'),
		contentScriptFile: [selfUrl('common.js'), selfUrl('jquery-1.10.2.min.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('options_page.js'), selfUrl('options.js')],
		contentScriptWhen: 'ready'
	});

	pageMod({
		include: RegExp(url + 'forums\/show(?:_topic)?\/\\d+.*'),
		contentScriptFile: [selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('forum.js')],
		contentScriptWhen: 'ready'
	});

	pageMod({
		include: RegExp(url + 'duels\/log\/.*'),
		contentScriptFile: [selfUrl('common.js'), selfUrl('guip_firefox.js'), selfUrl('phrases_' + locale + '.js'), selfUrl('log.js')],
		contentScriptWhen: 'ready'
	});
}

mod('https?:\/\/godville.net\/', 'ru');
mod('https?:\/\/godvillegame.com\/', 'en');