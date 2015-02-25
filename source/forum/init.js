// base functions and variables initialization
var worker = window.wrappedJSObject || window;

var doc = document;
var $id = function(id) {
	return doc.getElementById(id);
};
var $C = function(classname) {
	return doc.getElementsByClassName(classname);
};
var $c = function(classname) {
	return doc.getElementsByClassName(classname)[0];
};
var $Q = function(sel) {
	return doc.querySelectorAll(sel);
};
var $q = function(sel) {
	return doc.querySelector(sel);
};
var storage = {
	_getKey: function(key) {
		return "GUIp_" + god_name + ':' + key;
	},
	set: function(id, value) {
		localStorage[this._getKey(id)] = value;
		return value;
	},
	get: function(id) {
		var value = localStorage[this._getKey(id)];
		if (value === 'true') { return true; }
		else if (value === 'false') { return false; }
		else { return value; }
	}
};
var addSmallElements = function() {
	var temp = $Q('.c2');
	for (i = 0, len = temp.length; i < len; i++) {
		if (!temp[i].querySelector('small')) {
			temp[i].insertAdjacentHTML('beforeend', '<small />');
		}
	}
};
var followOnclick = function(e) {
	try {
		e.preventDefault();
		var topic = isTopic ? location.pathname.match(/\d+/)[0]
							: this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
			posts = isTopic ? +$c('subtitle').textContent.match(/\d+/)[0]
							: +this.parentElement.parentElement.nextElementSibling.textContent,
			topics = JSON.parse(storage.get(forum_topics));
		topics[topic] = posts;
		storage.set(forum_topics, JSON.stringify(topics));
		this.style.display = 'none';
		this.parentElement.querySelector('.unfollow').style.display = 'inline';
	} catch(error) {
		worker.console.error(error);
	}
};
var addOnclickToFollow = function() {
	follow_links = $Q('.follow');
	for (i = 0, len = follow_links.length; i < len; i++) {
		follow_links[i].onclick = followOnclick;
	}
};
var unfollowOnclick = function(e) {
	try {
		e.preventDefault();
		var topic = isTopic ? location.pathname.match(/\d+/)[0]
							: this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
			topics = JSON.parse(storage.get(forum_topics)),
			informers = JSON.parse(storage.get('ForumInformers'));
		delete topics[topic];
		storage.set(forum_topics, JSON.stringify(topics));
		delete informers[topic];
		storage.set('ForumInformers', JSON.stringify(informers));
		this.style.display = 'none';
		this.parentElement.querySelector('.follow').style.display = 'inline';
	} catch(error) {
		worker.console.error(error);
	}
};
var addOnclickToUnfollow = function() {
	unfollow_links = $Q('.unfollow');
	for (i = 0, len = unfollow_links.length; i < len; i++) {
		unfollow_links[i].onclick = unfollowOnclick;
	}
};
var addLinks = function() {
	for (i = 0, len = links_containers.length; i < len; i++) {
		topic = isTopic ? location.pathname.match(/\d+/)[0]
						: links_containers[i].parentElement.getElementsByTagName('a')[0].href.match(/\d+/)[0];
		isFollowed = topics[topic] !== undefined;
		links_containers[i].insertAdjacentHTML('beforeend',
			(isTopic ? '(' : '\n') + '<a class="follow" href="#" style="display: ' + (isFollowed ? 'none' : 'inline') + '">' + (isTopic ? worker.GUIp_i18n.Subscribe : worker.GUIp_i18n.subscribe) + '</a>' +
									 '<a class="unfollow" href="#" style="display: ' + (isFollowed ? 'inline' : 'none') + '">' + (isTopic ? worker.GUIp_i18n.Unsubscribe : worker.GUIp_i18n.unsubscribe) + '</a>' + (isTopic ? ')' : '')
		);
	}
	addOnclickToFollow();
	addOnclickToUnfollow();
};
