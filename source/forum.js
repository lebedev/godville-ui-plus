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
		return "GUIp_" + god_name + ':' + key;
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
	god_name = localStorage.getItem('GUIp_CurrentUser'),
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
			posts = isTopic ? +$c('subtitle').textContent.match(/\d+/)[0]
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
if ($reply_form) {
	window.GUIp_addGlobalStyleURL(window.GUIp_getResource('forum.css'), 'forum_css');
	var formatting_buttons =
		'<a class="formatting button bold" title="Сделать полужирным">Ж</a>' +
		'<a class="formatting button underline" title="Подчеркнуть">П</a>' +
		'<a class="formatting button strike" title="Зачеркнуть">З</a>' +
		'<a class="formatting button italic" title="Сделать курсивным">К</a>' +
		'<blockquote class="formatting bq" title="Процитировать">bq.</blockquote>' +
		'<pre class="formatting bc" title="Выделить"><code>bc.</code></pre>' +
		'<a class="formatting button godname" title="Вставить ссылку на бога"></a>' +
		'<a class="formatting button link" title="Вставить ссылку">a</a>' +
		'<a class="formatting button ul" title="Оформить как неупорядоченный список">•</a>' +
		'<a class="formatting button ol" title="Оформить как упорядоченный список">1.</a>' +
		'<a class="formatting button br" title="Вставить перенос на новую строку">\\n</a>' +
		'<a class="formatting button sup" title="Сделать текст надстрочным">X<sup>2</sup></a>' +
		'<a class="formatting button sub" title="Сделать текст подстрочным">X<sub>2</sub></a>' +
		'<a class="formatting button monospace" title="Сделать текст моноширинным"><code>мш</code></a>';
	$reply_form.insertAdjacentHTML('afterbegin', formatting_buttons);
	var val, ss, se, nls, nle;
	var basic_formatting = function(left, right, editor, e) {
		try {
			val = editor.value;
			ss = editor.selectionStart;
			se = editor.selectionEnd;
			while (ss < se && val[ss].match(/[\W_]/)) {
				ss++;
			}
			while (ss < se && val[se - 1].match(/[\W_]/)) {
				se--;
			}
			editor.value = val.slice(0, ss) + (val && val[ss - 1] && !val[ss - 1].match(/[\W_]/) ? ' ' : '') + left + val.slice(ss, se) + right + (val && val [se] && !val[se].match(/[\W_]/) ? ' ' : '') + val.slice(se);
			editor.focus();
			editor.selectionStart = editor.selectionEnd = se + left.length;
		} catch(error) {
			console.error(error);
		}
	};
	var quote_formatting = function(quotation, editor, e) {
		try {
			val = editor.value;
			ss = editor.selectionStart;
			se = editor.selectionEnd;
			nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n\n' : (val[ss - 2] && !val[ss - 2].match(/\n/) ? '\n' : '');
			nle = val && val[se] && !val[se].match(/\n/) ? '\n\n' : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n' : '');
			editor.value = val.slice(0, ss) + nls + quotation + val.slice(ss, se) + nle + val.slice(se);
			editor.focus();
			editor.selectionStart = editor.selectionEnd = se + quotation.length + nls.length + (se > ss ? nle.length : 0);
		} catch(error) {
			console.error(error);
		}
	};
	var list_formatting = function(list_marker, editor, e) {
		try {
			val = editor.value;
			ss = editor.selectionStart;
			se = editor.selectionEnd;
			nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n' : '';
			nle = val && val[se] && !val[se].match(/\n/) ? '\n\n' : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n' : '');
			var count = val.slice(ss, se).match(/\n/g) ? val.slice(ss, se).match(/\n/g).length + 1 : 1;
			editor.value = val.slice(0, ss) + nls + list_marker + ' ' + val.slice(ss, se).replace(/\n/g, '\n' + list_marker + ' ') + nle + val.slice(se);
			editor.focus();
			editor.selectionStart = editor.selectionEnd = se + nls.length + (list_marker.length + 1)*count;
		} catch(error) {
			console.error(error);
		}
	};
	var paste_br = function(editor, e) {
		try {
			val = editor.value;
			var pos = editor.selectionDirection == 'backward' ? editor.selectionStart : editor.selectionEnd;
			editor.value = val.slice(0, pos) + '<br>' + val.slice(pos);
			editor.focus();
			editor.selectionStart = editor.selectionEnd = pos + 4;
		} catch(error) {
			console.error(error);
		}
	};
	var set_click_actions = function(id, container) {
		temp = '#' + id + ' .formatting.';
		$q(temp + 'bold').onclick = basic_formatting.bind(this, '*', '*', container);
		$q(temp + 'underline').onclick = basic_formatting.bind(this, '+', '+', container);
		$q(temp + 'strike').onclick = basic_formatting.bind(this, '-', '-', container);
		$q(temp + 'italic').onclick = basic_formatting.bind(this, '_', '_', container);
		$q(temp + 'bq').onclick = quote_formatting.bind(this, 'bq. ', container);
		$q(temp + 'bc').onclick = quote_formatting.bind(this, 'bc. ', container);
		$q(temp + 'godname').onclick = basic_formatting.bind(this, '"', '":пс', container);
		$q(temp + 'link').onclick = basic_formatting.bind(this, '"', '":', container);
		$q(temp + 'ul').onclick = list_formatting.bind(this, '*', container);
		$q(temp + 'ol').onclick = list_formatting.bind(this, '#', container);
		$q(temp + 'br').onclick = paste_br.bind(this, container);
		$q(temp + 'sup').onclick = basic_formatting.bind(this, '^', '^', container);
		$q(temp + 'sub').onclick = basic_formatting.bind(this, '~', '~', container);
		$q(temp + 'monospace').onclick = basic_formatting.bind(this, '@', '@', container);
	};
	set_click_actions('post_body_editor', $id('post_body'));
	
	var editFormObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if ($id('edit_body_editor') && !$q('#edit_body_editor .formatting.button.bold')) {
				$id('edit_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
				set_click_actions('edit_body_editor', $id('edit_body'));
			}
		});
	});
	editFormObserver.observe($id('content'), { childList: true, subtree: true });
}

} catch(e) {
	console.error(e);
}
})();