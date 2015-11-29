// topic formatting
var val, ss, se, nls, nle, selection;
var initEditor = function(editor) {
	val = editor.value;
	ss = editor.selectionStart;
	se = editor.selectionEnd;
	selection = getSelection().isCollapsed ? '' : getSelection().toString().trim().replace(/\n[\n\s]*/g, '<br>');
};
var putSelectionTo = function(editor, pos, quoting) {
	setTimeout(function() {
		editor.focus();
		editor.selectionStart = editor.selectionEnd = pos + (quoting ? selection.length : 0);
	}, 50);
};
var basicFormatting = function(left_and_right, editor) {
	try {
		initEditor(editor);
		while (ss < se && val[ss].match(/\s/)) {
			ss++;
		}
		while (ss < se && val[se - 1].match(/\s/)) {
			se--;
		}
		editor.value = val.slice(0, ss) + (val && val[ss - 1] && val[ss - 1].match(/[a-zA-Zа-яА-ЯёЁ]/) ? ' ' : '') + left_and_right[0] + val.slice(ss, se) + selection + left_and_right[1] + (val && val [se] && val[se].match(/[a-zA-Zа-яА-ЯёЁ]/) ? ' ' : '') + val.slice(se);
		putSelectionTo(editor, se + left_and_right[0].length, true);
		return false;
	} catch(error) {
		console.error(error);
	}
};
var quoteFormatting = function(quotation, editor) {
	try {
		initEditor(editor);
		nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n\n' : (val[ss - 2] && !val[ss - 2].match(/\n/) ? '\n' : '');
		nle = ss !== se && val ? ((val[se] && !val[se].match(/\n/) || !val[se]) ? '\n\n'
																				: (val[se + 1] && !val[se + 1].match(/\n/) ? '\n'
																														   : ''))
							   : '' +
			  selection ? (!selection[selection.length - 1].match(/\n/) ? '\n\n'
																		: (selection && selection[selection.length - 2] && !selection[selection.length - 2].match(/\n/) ? '\n'
																																										: ''))
						: '';
		editor.value = val.slice(0, ss) + nls + quotation + val.slice(ss, se) + selection + nle + val.slice(se);
		putSelectionTo(editor, se + quotation.length + nls.length + (se > ss || selection ? nle.length : 0), true);
		return false;
	} catch(error) {
		console.error(error);
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
		return false;
	} catch(error) {
		console.error(error);
	}
};
var pasteBr = function(dummy, editor) {
	try {
		initEditor(editor);
		var pos = editor.selectionDirection === 'backward' ? ss : se;
		editor.value = val.slice(0, pos) + '<br>' + val.slice(pos);
		putSelectionTo(editor, pos + 4, true);
		return false;
	} catch(error) {
		console.error(error);
	}
};
var setClickActions = function(id, container) {
	var elem, temp = '#' + id + ' .formatting.',
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
var setCtrlEnterAction = function(textarea, button) {
	textarea.onkeydown = function(e) {
		if (e.ctrlKey && e.keyCode === 13) {
			e.preventDefault();
			button.click();
		}
	};
};
var initSmartQuotation = function() {
	document.body.insertAdjacentHTML('beforeend', '<div id="quote_button"><div id="copy" title="Скопировать цитату"></div><div id="quote" title="' + GUIp.i18n.quote_hint + '"></div><div id="quote_with_author" title="' + GUIp.i18n.quote_with_author_hint + '">+</div></div>');

	var quoteButton = document.getElementById('quote_button');

	document.onmouseup = function() {
		quoteButton.classList.remove('shown');
		setTimeout(setupQuoteDialog, 50);
	};

	var setupQuoteDialog = function() {
		var selection = window.getSelection(),
			range = selection.getRangeAt(0),
			container = range.commonAncestorContainer;
		if (container.nodeType === 3) {
			container = container.parentElement;
		}
		container.classList.add('current_selection_container');
		if ((document.querySelector('.body.entry-content.current_selection_container') || document.querySelector('.body.entry-content .current_selection_container')) && selection.toString().length > 2) {
			var rect = range.getBoundingClientRect(),
				qbRect = window.qbRect = quoteButton.getBoundingClientRect(),
			    leftOffset = (rect.left + rect.right)/2 - (qbRect.right - qbRect.left)/2,
			    topOffset = window.pageYOffset + rect.top - (qbRect.bottom - qbRect.top) - 5;
			quoteButton.style.left = leftOffset + 'px';
			quoteButton.style.top = topOffset + 'px';
			quoteButton.classList.add('shown');

			document.getElementById('copy').onclick = function() {
				// TODO: copy to clipboard.
			};
			document.getElementById('quote').onclick = function() {
				var editor, init;
				if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
					editor = document.getElementById('edit_body');
				} else {
					editor = document.getElementById('post_body');
					if (document.getElementById('reply').style.display === 'none') {
						ReplyForm.init();
					}
				}
				quoteFormatting('bq. ', editor);
				getSelection().collapseToStart();
				return false;
			};
			document.getElementById('quote_with_author').onclick = function() {
				var editor;
				if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
					editor = document.getElementById('edit_body');
				} else {
					editor = document.getElementById('post_body');
					if (document.getElementById('reply').style.display === 'none') {
						ReplyForm.init();
					}
				}
				quoteFormatting('bq. ', editor);

				var findPost = function(el) {
					do {
						el = el.parentNode;
					} while (!el.classList.contains('post'));
					return el;
				};

				var post = findPost(container),
					author = post.querySelector('.post_info a').textContent;
				setTimeout(ReplyForm.add_name.bind(null, author), 100);
				getSelection().collapseToStart();
				return false;
			};
		}
		container.classList.remove('current_selection_container');
	};
};
var addFormattingButtonsAndCtrlEnter = function() {
	var formatting_buttons =
		'<div>' +
			'<button class="formatting button bold" title="' + GUIp.i18n.bold_hint + '">' + GUIp.i18n.bold + '</button>' +
			'<button class="formatting button underline" title="' + GUIp.i18n.underline_hint + '">' + GUIp.i18n.underline + '</button>' +
			'<button class="formatting button strike" title="' + GUIp.i18n.strike_hint + '">' + GUIp.i18n.strike + '</button>' +
			'<button class="formatting button italic" title="' + GUIp.i18n.italic_hint + '">' + GUIp.i18n.italic + '</button>' +
			'<button class="formatting bq" title="' + GUIp.i18n.quote_hint + '">bq.</button>' +
			'<button class="formatting bc" title="' + GUIp.i18n.code_hint + '">bc.</button>' +
			(GUIp.locale === 'ru' ? '<button class="formatting button godname" title="Вставить ссылку на бога"></button>' : '') +
			'<button class="formatting button link" title="' + GUIp.i18n.link_hint + '">a</button>' +
			'<button class="formatting button ul" title="' + GUIp.i18n.unordered_list_hint + '">•</button>' +
			'<button class="formatting button ol" title="' + GUIp.i18n.ordered_list_hint + '">1.</button>' +
			'<button class="formatting button br" title="' + GUIp.i18n.br_hint + '"></button>' +
			'<button class="formatting button sup" title="' + GUIp.i18n.sup_hint + '">X<sup>2</sup></button>' +
			'<button class="formatting button sub" title="' + GUIp.i18n.sub_hint + '">X<sub>2</sub></button>' +
			'<button class="formatting button monospace" title="' + GUIp.i18n.monospace_hint + '">' + GUIp.i18n.monospace + '</button>' +
		'</div>';
	$id('post_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
	setClickActions('post_body_editor', $id('post_body'));
	setCtrlEnterAction($id('post_body'), document.querySelector('#reply input[type="submit"]'));

	var editFormObserver = new MutationObserver(function(mutations) {
		if ($id('edit_body_editor') && !$q('#edit_body_editor.improved')) {
			$id('edit_body_editor').classList.add('improved');
			$id('edit_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
			setClickActions('edit_body_editor', $id('edit_body'));
			setCtrlEnterAction($id('edit_body'), document.querySelector('#edit input[type="submit"]'));
		}
	});
	editFormObserver.observe($id('content'), { childList: true, subtree: true });
	initSmartQuotation();
};
var fixGodnamePaste = function() {
	ReplyForm.add_name = function(name) {
		try {
			var editor;
			if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
				editor = document.getElementById('edit_body');
			} else {
				editor = document.getElementById('post_body');
				if (document.getElementById('reply').style.display === 'none') {
					ReplyForm.init();
				}
			}
			initEditor(editor);
			var pos = editor.selectionDirection === 'backward' ? ss : se;
			editor.value = val.slice(0, pos) + '*' + name + '*, ' + val.slice(pos);
			putSelectionTo(editor, pos + name.length + 4, false);
		} catch(error) {
			console.error(error);
		}
	};
};
