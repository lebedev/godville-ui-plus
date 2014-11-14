var GUIp_browser = 'Chrome';
GUIp_getResource = function(res) {
	return chrome.extension.getURL(res);
};
GUIp_addGlobalStyleURL = function(url, id) {
	var sel = document.createElement('link');
	sel.setAttribute('type', 'text/css');
	sel.setAttribute('href', uri);
	sel.setAttribute('media', 'screen');
	sel.setAttribute('rel', 'stylesheet');
	sel.setAttribute('id', id);
	document.head.appendChild(sel);
};