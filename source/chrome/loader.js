(function() {
	function createScripts(urls) {
		for (var i = 0, len = urls.length; i < len; i++) {
			var scr = document.createElement('script');
			scr.type = 'text/javascript';
			scr.src = urls[i];
			scr.id = 'godville-ui-plus';
			document.head.appendChild(scr);
		}
	}
	function check(path, locale) {
		if (path.match(/^\/superhero/)) {
			createScripts([scripts.common, scripts.guip_chrome, scripts['phrases_' + locale], scripts.superhero]);
		} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
			createScripts([scripts.common, scripts.jquery, scripts.guip_chrome, scripts['phrases_' + locale], scripts.options_page, scripts.options]);
		} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
			createScripts([scripts.common, scripts.guip_chrome, scripts['phrases_' + locale], scripts.forum]);
		} else if (path.match(/^\/duels\/log\//)) {
			createScripts([scripts.common, scripts.guip_chrome, scripts['phrases_' + locale], scripts.log]);
		}
	}
	var prefix = localStorage.GUIp_prefix = window.chrome.extension.getURL('');
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
	var site = location.href,
		path = location.pathname;
	if (site.match(/^https?:\/\/godville.net/)) {
		check(path, 'ru');
	} else if (site.match(/^https?:\/\/godvillegame.com/)) {
		check(path, 'en');
	}
})();