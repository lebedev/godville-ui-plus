window.addEventListener('DOMContentLoaded', function(e) {
	// Path to the library:
	if (window.location.host.match(/godville\.net|godvillegame\.com/)) {
		var createElement = function(type) {
			var el = document.createElement(type);
			el.id = 'godville-ui-plus';
			el.textContent = this.result;
			document.head.appendChild(el);
		};
		var createScripts = function(urls, locale) {
			urls = [scripts.common, scripts.guip_opera, scripts['phrases_' + locale]].concat(urls);
			for (var i = 0, len = urls.length; i < len; i++) {
				var fileObj = opera.extension.getFile('/content/' + urls[i]);
				if (fileObj) {
					var fr = new FileReader();
					fr.onload = createElement.bind(fr, 'script');
					fr.readAsText(fileObj);
				}
			}
		};
		var createCSS = function(url) {
			var fileObj = opera.extension.getFile('/content/' + url);
			if (fileObj) {
				var fr = new FileReader();
				fr.onload = createElement.bind(fr, 'style');
				fr.readAsText(fileObj);
			}
		};
		var checkPathFor = function(locale) {
			var path = window.location.pathname;
			if (path.match(/^\/superhero/)) {
				createScripts([scripts.wm, scripts.mo, scripts.superhero], locale);
				createCSS('superhero.css');
			} else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
				createScripts([scripts.options_page, scripts.options], locale);
				createCSS('options.css');
			} else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
				createScripts([scripts.wm, scripts.mo, scripts.forum], locale);
				createCSS('forum.css');
			} else if (path.match(/^\/(?:duels\/log|hero\/duel_perm_link)\//)) {
				createScripts(scripts.log, locale);
			}
		};
		var scripts = {
			common: 'common.js',
			wm: 'WeakMap.js',
			mo: 'MutationObserver.js',
			superhero: 'superhero.js',
			phrases_ru: 'phrases_ru.js',
			phrases_en: 'phrases_en.js',
			guip_opera: 'guip_opera.js',
			options_page: 'options_page.js',
			options: 'options.js',
			forum: 'forum.js',
			log: 'log.js'
		};
		var site = window.location.href;
		if (site.match(/^https?:\/\/(godville\.net|gdvl\.tk)/)) {
			checkPathFor('ru');
		} else if (site.match(/^https?:\/\/godvillegame\.com/)) {
			checkPathFor('en');
		}
	}
}, false);