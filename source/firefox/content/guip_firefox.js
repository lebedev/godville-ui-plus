var GUIp_browser = 'Firefox';
GUIp_getResource = function(resname) {
	return 'chrome://godville-ui-plus/content/' + resname;
};
GUIp_addGlobalStyleURL = function(uri, id) {
	var style = document.createElement('link');
	style.type = 'text/css';
	style.href = 'chrome://godville-ui-plus/content/' + uri;
	style.rel = 'stylesheet';
	style.media = 'screen';
	style.id = id;
	document.head.appendChild(style);
};