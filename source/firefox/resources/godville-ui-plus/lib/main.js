var data = require('sdk/self').data;
var pageMod = require('sdk/page-mod');

pageMod.PageMod({
	include: /https?:\/\/godville.net\/superhero.*/,
	contentScriptFile: [data.url('common.js'), data.url('guip_firefox.js'), data.url('phrases_ru.js'), data.url('superhero.js')],
	contentScriptWhen: 'ready'
});

pageMod.PageMod({
	include: /https?:\/\/godville.net\/user\/(?:profile|rk_success).*/,
	contentScriptFile: [data.url('common.js'), data.url('jquery-1.10.2.min.js'), data.url('guip_firefox.js'), data.url('phrases_ru.js'), data.url('options_page.js'), data.url('options.js')],
	contentScriptWhen: 'ready'
});

pageMod.PageMod({
	include: /https?:\/\/godville.net\/forums\/show(?:\_topic)?\/\d+.*/,
	contentScriptFile: [data.url('common.js'), data.url('guip_firefox.js'), data.url('phrases_ru.js'), data.url('forum.js')],
	contentScriptWhen: 'ready'
});

pageMod.PageMod({
	include: /https?:\/\/godville.net\/(?:duels\/log|hero\/duel_perm_link)\/.*/,
	contentScriptFile: [data.url('log.js')],
	contentScriptWhen: 'ready'
});

pageMod.PageMod({
	include: /https?:\/\/godvillegame.com\/superhero.*/,
	contentScriptFile: [data.url('common.js'), data.url('guip_firefox.js'), data.url('phrases_en.js'), data.url('superhero.js')],
	contentScriptWhen: 'ready'
});

pageMod.PageMod({
	include: /https?:\/\/godvillegame.com\/user\/(?:profile|rk_success).*/,
	contentScriptFile: [data.url('common.js'), data.url('jquery-1.10.2.min.js'), data.url('guip_firefox.js'), data.url('phrases_en.js'), data.url('options_page.js'), data.url('options.js')],
	contentScriptWhen: 'ready'
});

pageMod.PageMod({
	include: /https?:\/\/godvillegame.com\/forums\/show(?:\_topic)?\/\d+.*/,
	contentScriptFile: [data.url('common.js'), data.url('guip_firefox.js'), data.url('phrases_en.js'), data.url('forum.js')],
	contentScriptWhen: 'ready'
});