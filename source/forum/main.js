// main code
var i, len, topic, isTopic, forum_no, topics;
var setInitVariables = function() {
	isTopic = location.pathname.match(/topic/) !== null;
	forum_no = 'Forum' + (isTopic ? $q('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
									  : location.pathname.match(/forums\/show\/(\d+)/)[1]);
	storage.god_name = localStorage.getItem('GUIp_CurrentUser');
	topics = JSON.parse(storage.get(forum_no));
};
var GUIp_forum = function() {
	try {
		if (!worker.GUIp_i18n || !worker.GUIp_browser || !worker.GUIp_addCSSFromURL) { return; }
		worker.clearInterval(starter);

		setInitVariables();

		if (!isTopic) {
			addSmallElements();
		}

		addLinks();

		if (isTopic) {
			worker.GUIp_addCSSFromURL(worker.GUIp_getResource('forum.css'), 'forum_css');
			addFormattingButtonsAndCtrlEnter();
			fixGodnamePaste();
			improveTopic();
		}
	} catch(e) {
		worker.console.error(e);
	}
};
var starter = worker.setInterval(GUIp_forum, 100);
