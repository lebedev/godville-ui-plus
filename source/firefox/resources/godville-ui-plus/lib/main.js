var url = require('sdk/self').data.url;
var pageMod = require('sdk/page-mod').PageMod;

pageMod({
	include: /https?:\/\/godville.net\/superhero.*/,
	contentScriptFile: [url('common.js'), url('guip_firefox.js'), url('phrases_ru.js'), url('superhero.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godville.net\/user\/(?:profile|rk_success).*/,
	contentScriptFile: [url('common.js'), url('jquery-1.10.2.min.js'), url('guip_firefox.js'), url('phrases_ru.js'), url('options_page.js'), url('options.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godville.net\/forums\/show(?:\_topic)?\/\d+.*/,
	contentScriptFile: [url('common.js'), url('guip_firefox.js'), url('phrases_ru.js'), url('forum.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godville.net\/duels\/log\/.*/,
	contentScriptFile: [url('common.js'), url('guip_firefox.js'), url('phrases_ru.js'), url('log.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godvillegame.com\/superhero.*/,
	contentScriptFile: [url('common.js'), url('guip_firefox.js'), url('phrases_en.js'), url('superhero.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godvillegame.com\/user\/(?:profile|rk_success).*/,
	contentScriptFile: [url('common.js'), url('jquery-1.10.2.min.js'), url('guip_firefox.js'), url('phrases_en.js'), url('options_page.js'), url('options.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godvillegame.com\/forums\/show(?:\_topic)?\/\d+.*/,
	contentScriptFile: [url('common.js'), url('guip_firefox.js'), url('phrases_en.js'), url('forum.js')],
	contentScriptWhen: 'ready'
});

pageMod({
	include: /https?:\/\/godvillegame.com\/duels\/log\/.*/,
	contentScriptFile: [url('common.js'), url('guip_firefox.js'), url('phrases_en.js'), url('log.js')],
	contentScriptWhen: 'ready'
});