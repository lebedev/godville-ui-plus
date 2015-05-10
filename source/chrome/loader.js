(function() {
	function createScripts(urls, locale) {
		urls = [scripts.common, scripts.guip_chrome, scripts['phrases_' + locale]].concat(urls);
		for (var i = 0, len = urls.length; i < len; i++) {
			var scr = document.createElement('script');
			scr.type = 'text/javascript';
			scr.src = urls[i];
			scr.id = 'godville-ui-plus';
			document.head.appendChild(scr);
		}
	}
	var prefix = window.chrome.extension.getURL('');
	localStorage.setItem('GUIp_prefix', prefix);
	var scripts = {
		common: prefix + 'common.js',
		superhero: prefix + 'superhero.js',
		phrases_ru: prefix + 'phrases_ru.js',
		phrases_en: prefix + 'phrases_en.js',
		guip_chrome: prefix + 'guip_chrome.js',
		jquery: '//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js',
		options_page: prefix + 'options_page.js',
		options: prefix + 'options.js',
		forum: prefix + 'forum.js',
		log: prefix + 'log.js'
	};
	function checkPathFor(locale) {
		var path = location.pathname;
		if (path.match(/^\/superhero/)) {
			createScripts(scripts.superhero, locale);
		} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
			createScripts([scripts.jquery, scripts.options_page, scripts.options], locale);
		} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
			createScripts(scripts.forum, locale);
		} else if (path.match(/^\/duels\/log\//)) {
			createScripts(scripts.log, locale);
		}
	}

	var site = location.href;
	if (site.match(/^https?:\/\/godville.net/)) {
		checkPathFor('ru');
	} else if (site.match(/^https?:\/\/godvillegame.com/)) {
		checkPathFor('en');
	}
})();