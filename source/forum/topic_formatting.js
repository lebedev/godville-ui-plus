// topic formatting
var initEditor = function(editor) {
	val = editor.value;
	ss = editor.selectionStart;
	se = editor.selectionEnd;
	selection = worker.getSelection().isCollapsed ? '' : worker.getSelection().toString().trim().replace(/\n[\n\s]*/g, '<br>');
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
var setCtrlEnterAction = function(textarea, button) {
	textarea.onkeydown = function(e) {
		if (e.ctrlKey && e.keyCode === 13) {
			e.preventDefault();
			button.click();
		}
	};
};
var addFormattingButtonsAndCtrlEnter = function() {
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
	setCtrlEnterAction($id('post_body'), document.querySelector('#reply input[type="submit"]'));

	var editFormObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function() {
			if ($id('edit_body_editor') && !$q('#edit_body_editor .formatting.button.bold')) {
				$id('edit_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
				setClickActions('edit_body_editor', $id('edit_body'));
				setCtrlEnterAction($id('edit_body'), document.querySelector('#edit input[type="submit"]'));
			}
		});
	});
	editFormObserver.observe($id('content'), { childList: true, subtree: true });
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