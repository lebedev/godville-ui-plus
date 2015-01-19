var pageMod = require('sdk/page-mod');

pageMod.PageMod({
	include: /https?:\/\/godville.net\/superhero.*/,
	contentScriptFile: ['./common.js', './guip_firefox.js', './phrases_ru.js', './superhero.js'],
	contentScriptWhen: 'end'
});

pageMod.PageMod({
	include: /https?:\/\/godville.net\/user\/(?:profile|rk_success).*/,
	contentScriptFile: ['./common.js', './jquery-1.10.2.min.js', './guip_firefox.js', './phrases_ru.js', './options_page.js', './options.js'],
	contentScriptWhen: 'end'
});

pageMod.PageMod({
	include: /https?:\/\/godville.net\/forums\/show(?:\_topic)?\/\d+.*/,
	contentScriptFile: ['./common.js', './guip_firefox.js', './phrases_ru.js', './forum.js'],
	contentScriptWhen: 'end'
});

pageMod.PageMod({
	include: /https?:\/\/godville.net\/duels\/log\/.*/,
	contentScriptFile: ['./log.js'],
	contentScriptWhen: 'end'
});

pageMod.PageMod({
	include: /https?:\/\/godvillegame.com\/superhero.*/,
	contentScriptFile: ['./common.js', './guip_firefox.js', './phrases_en.js', './superhero.js'],
	contentScriptWhen: 'end'
});

pageMod.PageMod({
	include: /https?:\/\/godvillegame.com\/user\/(?:profile|rk_success).*/,
	contentScriptFile: ['./common.js', './jquery-1.10.2.min.js', './guip_firefox.js', './phrases_en.js', './options_page.js', './options.js'],
	contentScriptWhen: 'end'
});

pageMod.PageMod({
	include: /https?:\/\/godvillegame.com\/forums\/show(?:\_topic)?\/\d+.*/,
	contentScriptFile: ['./common.js', './guip_firefox.js', './phrases_en.js', './forum.js'],
	contentScriptWhen: 'end'
});