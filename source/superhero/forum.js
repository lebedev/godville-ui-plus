// ui_forum
var ui_forum = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "forum"}) : worker.GUIp.forum = {};

ui_forum.init = function() {
	document.body.insertAdjacentHTML('afterbegin', '<div id="forum_informer_bar" />');
	ui_forum._check();
	worker.setInterval(ui_forum._check.bind(ui_forum), 5*60*1000);
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
	var diff, temp, old_diff, topic_name, posts, date, last_poster,
		topics = JSON.parse(ui_storage.get('Forum' + xhr.extra_arg)),
		informers = JSON.parse(ui_storage.get('ForumInformers'));
	for (var topic in topics) {
		temp = xhr.responseText.match("show_topic\\/" + topic + "[^\\d>]+>([^<]+)(?:.*?\\n*?)*?<td class=\"ca inv stat\">(\\d+)<\\/td>(?:.*?\\n*?)*?<abbr class=\"updated\" title=\"([^\"]+)(?:.*?\\n*?)*?<strong class=\"fn\">([^<]+)<\\/strong>(?:.*?\\n*?)*?show_topic\\/" + topic);
		if (temp) {
			topic_name = temp[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'");
			posts = +temp[2];
			date = temp[3];
			last_poster = temp[4];

			diff = posts - topics[topic].posts;

			if (diff <= 0 && topics[topic].date && (new Date(topics[topic].date) < new Date(date))) {
				diff = 1;
			}

			topics[topic].posts = posts;
			topics[topic].date = date;

			if (diff > 0) {
				if (last_poster !== ui_data.god_name) {
					old_diff = informers[topic] ? informers[topic].diff : 0;
					informers[topic] = { diff: old_diff + diff, name: topic_name };
				} else {
					delete informers[topic];
				}
			}
			if (diff < 0) {
				delete informers[topic];
			}
		}
	}
	ui_storage.set('ForumInformers', JSON.stringify(informers));
	ui_storage.set('Forum' + xhr.extra_arg, JSON.stringify(topics));
	ui_forum._process(xhr.extra_arg);
};
