// ui_forum
var ui_forum = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "forum"}) : worker.GUIp.forum = {};

ui_forum.init = function() {
	document.body.insertAdjacentHTML('afterbegin', '<div id="forum_informer_bar" />');
	ui_forum._check();
	worker.setInterval(ui_forum._check.bind(ui_forum), 2.5*60*1000);
};
ui_forum._check = function() {
	var requests = 0;
	for (var forum_no = 1; forum_no <= (worker.GUIp_locale === 'ru' ? 6 : 4); forum_no++) {
		var current_forum = JSON.parse(ui_storage.get('Forum' + forum_no)),
			topics = [];
		for (var topic in current_forum) {
			topics.push('topic_ids[]=' + topic);
		}
		for (var i = 0, len = topics.length; i < len; i += 10) {
			var postData = topics.slice(i, i + 10).join('&');
			worker.setTimeout(ui_utils.postXHR.bind(null, {
				url: '/forums/last_in_topics',
				postData: postData,
				onSuccess: ui_forum._parse.bind(forum_no)
			}), 500*requests++);
		}
	}
};
ui_forum._process = function(forum_no) {
	var informers = JSON.parse(ui_storage.get('ForumInformers')),
		topics = JSON.parse(ui_storage.get('Forum' + forum_no));
	for (var topic in topics) {
		if (informers[topic]) {
			ui_forum._setInformer(topic, informers[topic], topics[topic].posts);
		}
	}
	ui_informer.clearTitle();
};
ui_forum._setInformer = function(topic_no, topic_data, posts_count) {
	var informer = document.getElementById('topic' + topic_no);
	if (!informer) {
		document.getElementById('forum_informer_bar').insertAdjacentHTML('beforeend',
			'<a id="topic' + topic_no + '" target="_blank"><span></span><div class="fr_new_badge"></div></a>'
		);
		informer = document.getElementById('topic' + topic_no);
		informer.onclick = function(e) {
			if (e.which === 1) {
				e.preventDefault();
			}
		};
		informer.onmouseup = function(e) {
			if (e.which === 1 || e.which === 2) {
				var informers = JSON.parse(ui_storage.get('ForumInformers'));
				delete informers[this.id.match(/\d+/)[0]];
				ui_storage.set('ForumInformers', JSON.stringify(informers));
				worker.$(this).slideToggle("fast", function() {
					if (this.parentElement) {
						this.parentElement.removeChild(this);
						ui_informer.clearTitle();
					}
				});
			}
		};
	}
	var page = Math.floor((posts_count - topic_data.diff)/25) + 1;
	informer.href = '/forums/show_topic/' + topic_no + '?page=' + page + '#guip_' + (posts_count - topic_data.diff + 25 - page*25);
	informer.style.paddingRight = (16 + String(topic_data.diff).length*6) + 'px';
	informer.getElementsByTagName('span')[0].textContent = topic_data.name;
	informer.getElementsByTagName('div')[0].textContent = topic_data.diff;
};
ui_forum._parse = function(xhr) {
	var responseJSON = JSON.parse(xhr.responseText);
	if (responseJSON.status !== 'success' || !responseJSON.topics) {
		return;
	}

	var forum_no = this,
	    forum = JSON.parse(ui_storage.get('Forum' + forum_no)),
	    informers = JSON.parse(ui_storage.get('ForumInformers')),
	    topics = responseJSON.topics,
	    diff, topic;
	for (var topic_no in topics) {
		topic = topics[topic_no];
		diff = topic.cnt - forum[topic_no].posts;

		if (diff <= 0 && forum[topic_no].date && (worker.Date(forum[topic_no].date) < worker.Date(topic.last_post_at))) {
			diff = 1;
		}

		forum[topic_no].posts = topic.cnt;
		forum[topic_no].date = topic.last_post_at;

		if (diff > 0) {
			if (topic.last_post_by !== ui_data.god_name) {
				informers[topic_no] = {
					diff: diff + (informers[topic_no] ? informers[topic_no].diff : 0),
					name: topic.title
				};
			} else {
				delete informers[topic_no];
			}
		}
	}
	ui_storage.set('ForumInformers', JSON.stringify(informers));
	ui_storage.set('Forum' + forum_no, JSON.stringify(forum));
	ui_forum._process(forum_no);
};
