// ui_forum
ui_forum.init = function() {
	document.body.insertAdjacentHTML('afterbegin', '<div id="forum_informer_bar" />');
	this._check();
	worker.setInterval(this._check.bind(this), 300000);
};
ui_forum._check = function() {
	for (var forum_no = 1; forum_no <= (worker.GUIp_locale === 'ru' ? 6 : 4); forum_no++) {
		var current_forum = JSON.parse(ui_storage.get('Forum' + forum_no)),
			topics = [];
		for (var topic in current_forum) {
			// to prevent simultaneous ForumInformers access
			worker.setTimeout(ui_utils.getXHR.bind(this, '/forums/show/' + forum_no, this._parse.bind(this), undefined, forum_no), 500*forum_no);
			break;
		}
	}
};
ui_forum._process = function(forum_no) {
	var informers = JSON.parse(ui_storage.get('ForumInformers')),
		topics = JSON.parse(ui_storage.get('Forum' + forum_no));
	for (var topic in topics) {
		if (informers[topic]) {
			this._set_informer(topic, informers[topic], topics[topic]);
		}
	}
};
ui_forum._set_informer = function(topic_no, topic_data, posts_count) {
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
				worker.$(document).trigger("DOMNodeInserted");
				worker.$(this).slideToggle("fast", function() {
					if (this.parentElement) {
						this.parentElement.removeChild(this);
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
	var i, diff, temp, old_diff,
		forum = JSON.parse(ui_storage.get('Forum' + xhr.extra_arg)),
		informers = JSON.parse(ui_storage.get('ForumInformers')),
		topics = [];
	for (var topic in forum) {
		topics.push(topic);
	}
	for (i = 0, len = topics.length; i < len; i++) {
		temp = xhr.responseText.match(new RegExp("show_topic\\/" + topics[i] + "[^\\d>]+>([^<]+)(?:.*?\\n*?)*?<td class=\"ca inv stat\">(\\d+)<\\/td>(?:.*?\\n*?)*?<strong class=\"fn\">([^<]+)<\\/strong>(?:.*?\\n*?)*?show_topic\\/" + topics[i]));
		if (temp) {
			diff = +temp[2] - forum[topics[i]];
			if (diff) {
				forum[topics[i]] = +temp[2];
				if (diff > 0) {
					if (temp[3] !== ui_data.god_name) {
						if (!informers[topics[i]]) {
							//create
							informers[topics[i]] = {diff: diff, name: temp[1].replace(/&quot;/g, '"')};
						} else {
							//update
							old_diff = informers[topics[i]].diff;
							delete informers[topics[i]];
							informers[topics[i]] = {diff: old_diff + diff, name: temp[1].replace(/&quot;/g, '"')};
						}
					} else {
						delete informers[topics[i]];
					}
				}
			}
		}
	}
	ui_storage.set('ForumInformers', JSON.stringify(informers));
	ui_storage.set('Forum' + xhr.extra_arg, JSON.stringify(forum));
	this._process(xhr.extra_arg);
};
