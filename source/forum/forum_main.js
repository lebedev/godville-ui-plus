// main code
var i, len, follow_links, isFollowed, links_containers, topic, unfollow_links,
	isTopic, forum_topics, god_name, topics, elem, pw, pw_pb_int, val, ss, se, nls, nle, selection;
var GUIp_forum = function() {
	try {

		if (!worker.GUIp_i18n || !worker.GUIp_browser || !worker.GUIp_addCSSFromURL) { return; }
		clearInterval(starter);

		isTopic = location.pathname.match(/topic/) !== null;
		forum_topics = 'Forum' + (isTopic ? $q('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
										  : location.pathname.match(/forums\/show\/(\d+)/)[1]);
		god_name = localStorage.GUIp_CurrentUser;
		topics = JSON.parse(storage.get(forum_topics));

		if (isTopic) {
			links_containers = $Q('#topic_mod');
		} else {
			addSmallElements();
			links_containers = $Q('.c2 small');
		}

		addLinks();

		if (isTopic) {
			worker.GUIp_addCSSFromURL(worker.GUIp_getResource('forum.css'), 'forum_css');
			addFormattingButtons();
			improveTopic();
		}

	} catch(e) {
		worker.console.error(e);
	}
};
var starter = setInterval(GUIp_forum, 100);
