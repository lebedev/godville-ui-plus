GM_log=function(msg) {try {console.log('GM_log: '+msg);} catch(e) {}};
GM_addStyle=function(css, id) {gm_func.addStyle(css, id);};
GM_addGlobalStyleURL=function(uri, id) {gm_func.addStyleURI('chrome://godville-ui-plus/content/' + uri, id);};
GM_getResource=function(resname) {return 'chrome://godville-ui-plus/content/' + resname;};
var GM_browser='Firefox';

GM_getResourceImageAsURL=function(res) {
	return window.URL.createObjectURL('chrome://godville-ui-plus/content/' + res);
};

GM_registerMenuCommand=function() {};

var gm_func = {
	addStyle:function(css, id) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) {return;}
		style = document.createElement('style');
		style.type = 'text/css';
		style.textContent = css;
		if (id) style.id = id;
		head.appendChild(style);
	},

	addStyleURI:function(uri, id) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) {return;}
		style = document.createElement('link');
		style.type = 'text/css';
		style.href = uri;
		style.rel = 'stylesheet';
		style.media = 'screen';
		if (id) style.id = id;
		head.appendChild(style);
	}

};
