(function() {
'use strict';
try {

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
	_get_key: function(key) {
		return "GM_" + god_name + ':' + key;
	},
	set: function(id, value) {
		localStorage.setItem(this._get_key(id), value);
		return value;
	},
	get: function(id) {
		return localStorage.getItem(this._get_key(id));
	}
};

var i, len, follow_links, isFollowed, links_containers, temp, topic, unfollow_links,
	isTopic = location.pathname.match(/topic/) !== null,
	forum_topics = 'Forum' + (isTopic ? $q('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
									  : location.pathname.match(/forums\/show\/(\d+)/)[1]),
	god_name = localStorage.getItem('GM_CurrentUser'),
	topics = JSON.parse(storage.get(forum_topics));

if (isTopic) {
	links_containers = $Q('#topic_mod');
} else {
	// add missing <small> elements
	temp = $Q('.c2');
	for (i = 0, len = temp.length; i < len; i++) {
		if (!temp[i].querySelector('small')) {
			temp[i].insertAdjacentHTML('beforeend', '<small />');
		}
	}

	links_containers = $Q('.c2 small');
}

// add links
for (i = 0, len = links_containers.length; i < len; i++) {
	topic = isTopic ? location.pathname.match(/\d+/)[0]
					: links_containers[i].parentElement.getElementsByTagName('a')[0].href.match(/\d+/)[0];
	isFollowed = topics[topic] !== undefined;
	links_containers[i].insertAdjacentHTML('beforeend', isTopic ? ('(<a class="follow" href="#" style="display: ' + (isFollowed ? 'none' : 'inline') + '">Подписаться</a><a class="unfollow" href="#" style="display: ' + (isFollowed ? 'inline' : 'none') + '">Отписаться</a>)')
													 			: ('\n<a class="follow" href="#" style="display: ' + (isFollowed ? 'none' : 'inline') + '">подписаться</a><a class="unfollow" href="#" style="display: ' + (isFollowed ? 'inline' : 'none') + '">отписаться</a>'));
}

// add click events to follow links
follow_links = $Q('.follow');
var follow = function(e) {
	try {
		e.preventDefault();
		var topic = isTopic ? location.pathname.match(/\d+/)[0]
							: this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
			posts = isTopic ? +$('.subtitle').textContent.match(/\d+/)[0]
							: +this.parentElement.parentElement.nextElementSibling.textContent,
			topics = JSON.parse(storage.get(forum_topics));
		topics[topic] = posts;
		storage.set(forum_topics, JSON.stringify(topics));
		this.style.display = 'none';
		this.parentElement.querySelector('.unfollow').style.display = 'inline';
	} catch(error) {
		console.error(error);
	}
};
for (i = 0, len = follow_links.length; i < len; i++) {
	follow_links[i].onclick = follow;
}

// add click events to unfollow links
unfollow_links = $Q('.unfollow');
var unfollow = function(e) {
	try {
		e.preventDefault();
		var topic = isTopic ? location.pathname.match(/\d+/)[0]
							: this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
			topics = JSON.parse(storage.get(forum_topics));
		delete topics[topic];
		storage.set(forum_topics, JSON.stringify(topics));
		this.style.display = 'none';
		this.parentElement.querySelector('.follow').style.display = 'inline';
	} catch(error) {
		console.error(error);
	}
};
for (i = 0, len = unfollow_links.length; i < len; i++) {
	unfollow_links[i].onclick = unfollow;
}

// scroll to a certain post #
var guip_hash = location.hash.match(/#guip_(\d+)/);
if (guip_hash) {
	location.hash = $C('spacer')[+guip_hash[1]].id;
}

// formatting buttons
var $reply_form = $id('post_body_editor');
console.log($reply_form);
if ($reply_form) {
	window.GUIp_addGlobalStyleURL('forum.css', 'forum_css');
	$reply_form.insertAdjacentHTML(
		'afterbegin', 
		'<a class="formatting button bold" title="Сделать полужирным">Ж</a>' +
		'<a class="formatting button underline" title="Подчеркнуть">П</a>' +
		'<a class="formatting button strike" title="Зачеркнуть">З</a>' +
		'<a class="formatting button italic" title="Сделать курсивным">К</a>' +
		'<blockquote class="formatting bq" title="Процитировать">bq.</blockquote>' +
		'<pre class="formatting bc" title="Выделить"><code>bc.</code></pre>' +
		'<a class="formatting button godname" title="Вставить ссылку на бога"></a>' +
		'<a class="formatting button link" title="Вставить ссылку">a</a>'
	);
	var val, ss, se, pb = $id('post_body');
	var basic_formatting = function(left, right, e) {
		try {
			val = pb.value;
			ss = pb.selectionStart;
			se = pb.selectionEnd;
			while (ss < se && val[ss].match(/\s/)) {
				ss++;
			}
			while (ss < se && val[se - 1].match(/\s/)) {
				se--;
			}
			pb.value = val.slice(0, ss) + (val && val[ss - 1] && !val[ss - 1].match(/\s/) ? ' ' : '') + left + val.slice(ss, se) + right + (val && val [se] && !val[se].match(/\s/) ? ' ' : '') + val.slice(se);
		} catch(error) {
			console.error(error);
		}
	};
	$c('formatting bold').onclick = basic_formatting.bind(this, '*', '*');
	$c('formatting underline').onclick = basic_formatting.bind(this, '+', '+');
	$c('formatting strike').onclick = basic_formatting.bind(this, '-', '-');
	$c('formatting italic').onclick = basic_formatting.bind(this, '_', '_');
	$c('formatting godname').onclick = basic_formatting.bind(this, '"', '":пс');
	$c('formatting link').onclick = basic_formatting.bind(this, '"', '":');
	var quote_formatting = function(quotation, e) {
		try {
			val = pb.value;
			ss = pb.selectionStart;
			se = pb.selectionEnd;
			while (ss < se && val[ss].match(/\s/)) {
				ss++;
			}
			while (ss < se && val[se - 1].match(/\s/)) {
				se--;
			}
			pb.value = val.slice(0, ss) + (val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n\n' : (val[ss - 2] && !val[ss - 2].match(/\n/) ? '\n' : '')) + quotation + val.slice(ss, se) + (val && val[se] && !val[se].match(/\n/) ? '\n\n' : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n' : '')) + val.slice(se);
		} catch(error) {
			console.error(error);
		}
	};
	$c('formatting bq').onclick = quote_formatting.bind(this, 'bq. ');
	$c('formatting bc').onclick = quote_formatting.bind(this, 'bc. ');
}

} catch(e) {
	console.error(e);
}
})();