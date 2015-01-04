(function() {
	function createScript(url) {
		var head = document.head;
		var scr = document.createElement('script');
		scr.type = 'text/javascript';
		scr.src = url;
		scr.id = 'godville-ui-plus';
		head.appendChild(scr);
	}
	localStorage.GUIp_prefix = window.chrome.extension.getURL('');
	var site = location.href,
		path = location.pathname;
	if (site.match(/^https?:\/\/godville.net/)) {
		if (path.match(/^\/superhero/)) {
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_ru.js'));
			createScript(window.chrome.extension.getURL('superhero.js'));
		}
		if (path.match(/^\/user\/(?:profile|rk_success)/)) {
			createScript('//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js');
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_ru.js'));
			createScript(window.chrome.extension.getURL('options-page.js'));
			createScript(window.chrome.extension.getURL('options.js'));
		}
		if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_ru.js'));
			createScript(window.chrome.extension.getURL('forum.js'));
		}
		if (path.match(/^\/duels\/log\//)) {
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_ru.js'));
			createScript(window.chrome.extension.getURL('log.js'));
		}
	}
	if (site.match(/^https?:\/\/godvillegame.com/)) {
		if (path.match(/^\/superhero/)) {
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_en.js'));
			createScript(window.chrome.extension.getURL('superhero.js'));
		}
		if (path.match(/^\/user\/(?:profile|rk_success)/)) {
			createScript('//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js');
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_en.js'));
			createScript(window.chrome.extension.getURL('options-page.js'));
			createScript(window.chrome.extension.getURL('options.js'));
		}
		if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
			createScript(window.chrome.extension.getURL('guip_chrome.js'));
			createScript(window.chrome.extension.getURL('phrases_en.js'));
			createScript(window.chrome.extension.getURL('forum.js'));
		}
	}
})();