var worker = window.wrappedJSObject || window;
worker.GUIp_addCSSFromURL = function(href, id) {
	document.head.insertAdjacentHTML('beforeend', '<link id="' + id + '" type="text/css" href="' + href + '" rel="stylesheet" media="screen">');
};
worker.GUIp_addCSSFromString = function(text) {
	if (!document.getElementById('guip_user_css')) {
		document.head.insertAdjacentHTML('beforeend', '<style id="guip_user_css" />');
	}
	document.getElementById('guip_user_css').textContent = text;
};
worker.GUIp_github_link = '<a target="_blank" href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/';
