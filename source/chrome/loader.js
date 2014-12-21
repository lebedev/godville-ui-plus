(function() {
	function createScript(url) {
		var head = document.head;
		var scr = document.createElement('script');
		scr.type = 'text/javascript';
		scr.src = url;
		scr.id = 'godville-ui-plus';
		head.appendChild(scr);
	}
	localStorage.setItem('GUIp_prefix', chrome.extension.getURL(''));
	var path = location.pathname;
	if (path.match(/^\/superhero/)) {
		createScript(chrome.extension.getURL('guip_chrome.js'));
		createScript(chrome.extension.getURL('phrases.js'));
		createScript(chrome.extension.getURL('superhero.js'));
	}
	if (path.match(/^\/user\/(?:profile|rk_success)/)) {
		createScript('//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js');
		createScript(chrome.extension.getURL('guip_chrome.js'));
		createScript(chrome.extension.getURL('phrases.js'));
		createScript(chrome.extension.getURL('options-page.js'));
		createScript(chrome.extension.getURL('options.js'));
	}
	if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
		createScript(chrome.extension.getURL('guip_chrome.js'));
		createScript(chrome.extension.getURL('forum.js'));
	}
})();