(function() {
'use strict';

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
			topics = JSON.parse(storage.get(forum_topics));
		delete topics[topic];
		storage.set(forum_topics, JSON.stringify(topics));
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

// topic formatting buttons
var initEditor = function(editor) {
	val = editor.value;
	ss = editor.selectionStart;
	se = editor.selectionEnd;
	selection = worker.getSelection().isCollapsed ? '' : worker.getSelection().toString().trim();
};
var putSelectionTo = function(editor, pos, quoting) {
	editor.focus();
	editor.selectionStart = editor.selectionEnd = pos + (quoting ? selection.length : 0);
};
var basicFormatting = function(left_and_right, editor) {
	try {
		initEditor(editor);
		while (ss < se && val[ss].match(/[^\wА-Яа-я]/)) {
			ss++;
		}
		while (ss < se && val[se - 1].match(/[^\wА-Яа-я]/)) {
			se--;
		}
		editor.value = val.slice(0, ss) + (val && val[ss - 1] && !val[ss - 1].match(/[^\wА-Яа-я]/) ? ' ' : '') + left_and_right[0] + val.slice(ss, se) + selection + left_and_right[1] + (val && val [se] && !val[se].match(/[^\wА-Яа-я]/) ? ' ' : '') + val.slice(se);
		putSelectionTo(editor, se + left_and_right[0].length, true);
		return false;
	} catch(error) {
		worker.console.error(error);
	}
};
var quoteFormatting = function(quotation, editor) {
	try {
		initEditor(editor);
		nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n\n' : (val[ss - 2] && !val[ss - 2].match(/\n/) ? '\n' : '');
		nle = val && (val[se] && !val[se].match(/\n/) || !val[se]) ? '\n\n' : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n' : '') +
		      selection && !selection[selection.length - 1].match(/\n/) ? '\n\n' : (selection[selection.length - 2] && !selection[selection.length - 2].match(/\n/) ? '\n' : '');
		editor.value = val.slice(0, ss) + nls + quotation + val.slice(ss, se) + selection + nle + val.slice(se);
		putSelectionTo(editor, se + quotation.length + nls.length + (se > ss || selection ? nle.length : 0), true);
	} catch(error) {
		worker.console.error(error);
	}
};
var listFormatting = function(list_marker, editor) {
	try {
		initEditor(editor);
		nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n' : '';
		nle = val && val[se] && !val[se].match(/\n/) ? '\n\n' : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n' : '');
		var count = val.slice(ss, se).match(/\n/g) ? val.slice(ss, se).match(/\n/g).length + 1 : 1;
		editor.value = val.slice(0, ss) + nls + list_marker + ' ' + val.slice(ss, se).replace(/\n/g, '\n' + list_marker + ' ') + nle + val.slice(se);
		putSelectionTo(editor, se + nls.length + (list_marker.length + 1)*count, true);
	} catch(error) {
		worker.console.error(error);
	}
};
var pasteBr = function(dummy, editor) {
	try {
		initEditor(editor);
		var pos = editor.selectionDirection === 'backward' ? ss : se;
		editor.value = val.slice(0, pos) + '<br>' + val.slice(pos);
		putSelectionTo(editor, pos + 4, true);
	} catch(error) {
		worker.console.error(error);
	}
};
var setClickActions = function(id, container) {
	var temp = '#' + id + ' .formatting.',
		buttons = [
			{ class: 'bold', func: basicFormatting, params: ['*', '*'] },
			{ class: 'underline', func: basicFormatting, params: ['+', '+'] },
			{ class: 'strike', func: basicFormatting, params: ['-', '-'] },
			{ class: 'italic', func: basicFormatting, params: ['_', '_'] },
			{ class: 'godname', func: basicFormatting, params: ['"', '":пс'] },
			{ class: 'link', func: basicFormatting, params: ['"', '":'] },
			{ class: 'sup', func: basicFormatting, params: ['^', '^'] },
			{ class: 'sub', func: basicFormatting, params: ['~', '~'] },
			{ class: 'monospace', func: basicFormatting, params: ['@', '@'] },
			{ class: 'bq', func: quoteFormatting, params: 'bq. ' },
			{ class: 'bc', func: quoteFormatting, params: 'bc. ' },
			{ class: 'ul', func: listFormatting, params: '*' },
			{ class: 'ol', func: listFormatting, params: '#' },
			{ class: 'br', func: pasteBr, params: null },
		];
	for (i = 0, len = buttons.length; i < len; i++) {
		if ((elem = $q(temp + buttons[i].class))) {
			elem.onclick = buttons[i].func.bind(this, buttons[i].params, container);
		}
	}
};
var addFormattingButtons = function() {
	var formatting_buttons =
		'<a class="formatting button bold" title="' + worker.GUIp_i18n.bold_hint + '">' + worker.GUIp_i18n.bold + '</a>' +
		'<a class="formatting button underline" title="' + worker.GUIp_i18n.underline_hint + '">' + worker.GUIp_i18n.underline + '</a>' +
		'<a class="formatting button strike" title="' + worker.GUIp_i18n.strike_hint + '">' + worker.GUIp_i18n.strike + '</a>' +
		'<a class="formatting button italic" title="' + worker.GUIp_i18n.italic_hint + '">' + worker.GUIp_i18n.italic + '</a>' +
		'<blockquote class="formatting bq" title="' + worker.GUIp_i18n.quote_hint + '">bq.</blockquote>' +
		'<pre class="formatting bc" title="' + worker.GUIp_i18n.code_hint + '"><code>bc.</code></pre>' +
		(worker.GUIp_locale === 'ru' ? '<a class="formatting button godname" title="Вставить ссылку на бога"></a>' : '') +
		'<a class="formatting button link" title="' + worker.GUIp_i18n.link_hint + '">a</a>' +
		'<a class="formatting button ul" title="' + worker.GUIp_i18n.unordered_list_hint + '">•</a>' +
		'<a class="formatting button ol" title="' + worker.GUIp_i18n.ordered_list_hint + '">1.</a>' +
		'<a class="formatting button br" title="' + worker.GUIp_i18n.br_hint + '">\\n</a>' +
		'<a class="formatting button sup" title="' + worker.GUIp_i18n.sup_hint + '">X<sup>2</sup></a>' +
		'<a class="formatting button sub" title="' + worker.GUIp_i18n.sub_hint + '">X<sub>2</sub></a>' +
		'<a class="formatting button monospace" title="' + worker.GUIp_i18n.monospace_hint + '"><code>' + worker.GUIp_i18n.monospace + '</code></a>';
	$id('post_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
	setClickActions('post_body_editor', $id('post_body'));

	var editFormObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function() {
			if ($id('edit_body_editor') && !$q('#edit_body_editor .formatting.button.bold')) {
				$id('edit_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
				setClickActions('edit_body_editor', $id('edit_body'));
			}
		});
	});
	editFormObserver.observe($id('content'), { childList: true, subtree: true });
};

// topic other improvements
var checkHash = function() {
	// scroll to a certain post #
	var guip_hash = location.hash.match(/#guip_(\d+)/);
	if (guip_hash) {
		var post = $C('spacer')[+guip_hash[1]];
		location.hash = post ? post.id : '';
	}
};
var setPageWrapperPaddingBottom = function(el) {
	var form = document.getElementById(el) || el,
		old_height = parseFloat(getComputedStyle(form).height) || 0,
		step = 0;
	worker.clearInterval(pw_pb_int);
	pw_pb_int = worker.setInterval(function() {
		if (step++ >= 100) {
			worker.clearInterval(pw_pb_int);
		} else {
			var diff = (parseFloat(getComputedStyle(form).height) || 0) - old_height;
			old_height += diff;
			pw.style.paddingBottom = ((parseFloat(pw.style.paddingBottom) || 0) + diff) + 'px';
			worker.scrollTo(0, worker.scrollY + diff);
		}
	}, 10);
};
var fixPageWrapperPadding = function() {
	pw = document.getElementById('page_wrapper');
	worker.Effect.old_toggle = worker.Effect.toggle;
	worker.Effect.toggle = function(a, b) { setPageWrapperPaddingBottom(a); worker.Effect.old_toggle(a, b); };
	worker.Effect.old_BlindDown = worker.Effect.BlindDown;
	worker.Effect.BlindDown = function(a, b) { setPageWrapperPaddingBottom(a); worker.Effect.old_BlindDown(a, b); };
	worker.EditForm.old_hide = worker.EditForm.hide;
	worker.EditForm.hide = function(dummy) { pw.style.paddingBottom = '0px'; worker.EditForm.old_hide(); };
	worker.EditForm.old_setReplyId = worker.EditForm.setReplyId;
	worker.EditForm.setReplyId = function(a) { if (document.getElementById('reply').style.display !== 'none') { pw.style.paddingBottom = '0px'; } worker.EditForm.old_setReplyId(a); };
};
var fixGodnamePaste = function() {
	worker.ReplyForm.add_name = function(name) {
		try {
			var editor;
			if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
				editor = document.getElementById('edit_body');
			} else {
				editor = document.getElementById('post_body');
				if (document.getElementById('reply').style.display === 'none') {
					worker.ReplyForm.init();
				}
			}
			initEditor(editor);
			var pos = editor.selectionDirection === 'backward' ? ss : se;
			editor.value = val.slice(0, pos) + '*' + name + '*, ' + val.slice(pos);
			worker.setTimeout(function() {
				putSelectionTo(editor, pos + name.length + 4, false);
			}, 50);
		} catch(error) {
			worker.console.error(error);
		}
	};
};
var picturesAutoreplace = function() {
	if (!storage.get('Option:disableLinksAutoreplace')) {
		var links = document.querySelectorAll('.post .body a'),
			imgs = [],
			onerror = function(i) {
				links[i].removeChild(links[i].getElementsByTagName('img')[0]);
				imgs[i] = undefined;
			},
			onload = function(i) {
				links[i].removeChild(links[i].getElementsByTagName('img')[0]);
				var hint = links[i].innerHTML;
				links[i].outerHTML = '<div class="img_container"><a id="link' + i + '" href="' + links[i].href + '" target="_blank" alt="' + worker.GUIp_i18n.open_in_a_new_tab + '"></a><div class="hint">' + hint + '</div></div>';
				imgs[i].alt = hint;
				var new_link = document.getElementById('link' + i);
				new_link.appendChild(imgs[i]);
			};
		for (i = 0, len = links.length; i < len; i++) {
			if (links[i].href.match(/jpe?g|png|gif/)) {
				links[i].insertAdjacentHTML('beforeend', '<img src="http://godville.net/images/spinner.gif">');
				imgs[i] = document.createElement('img');
				imgs[i].onerror = onerror.bind(null, i);
				imgs[i].onload = onload.bind(null, i);
				imgs[i].src = links[i].href;
			}
		}
	}
};
var improveTopic = function() {
	checkHash();
	fixPageWrapperPadding();
	fixGodnamePaste();
	picturesAutoreplace();
};

// main code
var i, len, follow_links, isFollowed, links_containers, topic, unfollow_links,
	isTopic, forum_topics, god_name, topics, elem, pw, pw_pb_int, val, ss, se, nls, nle, selection;
var setInitVariables = function() {
	isTopic = location.pathname.match(/topic/) !== null;
	forum_topics = 'Forum' + (isTopic ? $q('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
									  : location.pathname.match(/forums\/show\/(\d+)/)[1]);
	god_name = localStorage.GUIp_CurrentUser;
	topics = JSON.parse(storage.get(forum_topics));
};
var GUIp_forum = function() {
	try {
		if (!worker.GUIp_i18n || !worker.GUIp_browser || !worker.GUIp_addCSSFromURL) { return; }
		worker.clearInterval(starter);

		setInitVariables();

		if (isTopic) {
			links_containers = $Q('#topic_mod');
		} else {
			addSmallElements();
			links_containers = $Q('.c2 small');
		}

		addLinks();

		if (isTopic) {
			if (worker.GUIp_browser !== 'Opera') {
				worker.GUIp_addCSSFromURL(worker.GUIp_getResource('forum.css'), 'forum_css');
			}
			addFormattingButtons();
			improveTopic();
		}
	} catch(e) {
		worker.console.error(e);
	}
};
var starter = worker.setInterval(GUIp_forum, 100);


})();