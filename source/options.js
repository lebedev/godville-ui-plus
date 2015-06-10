(function() {
'use strict';

var worker = window.wrappedJSObject || window;

var doc = document;

var $id = function(id) {
	return doc.getElementById(id);
};

var $C = function(classname) {
	return doc.getElementsByClassName(classname);
};

var $q = function(selector) {
	return doc.querySelector(selector);
};

var setTextareaResize = function(id, inner_func) {
	var ta = $id(id);
	ta.onchange =
	ta.oncut =
	ta.onfocus =
	ta.oninput =
	ta.onkeypress =
	ta.onpaste = function() {
		this.setAttribute('rows', this.value.match(/\n/g).length + 1);
		if (inner_func) { inner_func(); }
	};
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
		var val = localStorage.getItem(this._get_key(id));
		if (val === 'true') { return true; }
		else if (val === 'false') { return false; }
		else { return val; }
	},
	remove: function(id) {
		localStorage.removeItem(this._get_key(id));
	},
	importOptions: function(options_string) {
		try {
			var options = JSON.parse(options_string);
			for (var key in options) {
				this.set(key, options[key]);
			}
			worker.alert(worker.GUIp_i18n.import_success);
			location.reload();
		} catch(e) {
			worker.alert(worker.GUIp_i18n.import_fail);
		}
	},
	exportOptions: function() {
		var options = {};
		for (var key in localStorage) {
			if (key.match(this._get_key('')) && !key.match(/Logger/)) {
				options[key.replace(this._get_key(''), '')] = localStorage.getItem(key);
			}
		}
		return JSON.stringify(options);
	}
};

function addMenu() {
	if (!god_name) { return; }
	if (!$id('ui_settings')) {
		$q('#profile_main p').insertAdjacentHTML('beforeend', ' | <a id="ui_settings" href="#ui_settings">' + worker.GUIp_i18n.ui_settings + '</a>');
		$id('ui_settings').onclick = loadOptions;
	}
}

var setAllCheckboxesToState = function(classname, state) {
	var checkboxes = $C(classname);
	for (var i = 0, len = checkboxes.length; i < len; i++) {
		checkboxes[i].checked = state;
	}
};

function loadOptions() {
	if (!(localStorage.getItem('GUIp_CurrentUser') || $id('profile_main'))) {
		worker.setTimeout(loadOptions, 100);
		return;
	}
	$id('profile_main').innerHTML = worker.getOptionsPage();
	setForm();
	restore_options();
	$id('forbidden_informers').onclick = function() {
		$j('#informers').slideToggle("slow");
	};
	$id('forbidden_craft').onclick = function() {
		$j('#craft_categories').slideToggle("slow");
	};
	$id('relocate_duel_buttons').onclick = function() {
		$j('#relocate_duel_buttons_desc').slideToggle("slow");
		$j('#relocate_duel_buttons_choice').slideToggle("slow");
	};
	$id('forbidden_title_notices').onclick = function() {
		$j('#forbidden_title_notices_desc').slideToggle("slow");
		$j('#forbidden_title_notices_choice').slideToggle("slow");
	};
	$id('use_background').onclick = function() {
		$j('#background_choice').slideToggle("slow");
		$j('#background_desc').slideToggle("slow");
	};
	$id('custom_file').onclick = function() {
		$id('custom_background').click();
		$id('custom_file').value = '';
	};
	$id('custom_link').onclick = function() {
		$id('custom_background').click();
	};
	$id('voice_timeout').onclick = function() {
		$j('#voice_timeout_choice').slideToggle("slow");
		$j('#voice_timeout_desc').slideToggle("slow");
	};
	$id('freeze_voice_button').onclick = function() {
		$j('#freeze_voice_button_choice').slideToggle("slow");
		$j('#freeze_voice_button_desc').slideToggle("slow");
	};
	$id('check_all').onclick = function() {
		setAllCheckboxesToState('item-informer', true);
		return false;
	};
	$id('uncheck_all').onclick = function() {
		setAllCheckboxesToState('item-informer', false);
		return false;
	};
	$id('disable_voice_generators').onclick = function() {
		$j('#voice_menu').slideToggle("slow");
		$j('#GUIp_words').slideToggle("slow");
	};
	if (!storage.get('charIsMale')) {
		$q('#voice_menu .l_capt').textContent = $q('#voice_menu .l_capt').textContent.replace('героя', 'героини');
		$q('#voice_menu .g_desc').textContent = $q('#voice_menu .g_desc').textContent.replace('герою', 'героине');
	}

	setTextareaResize('ta_edit', setSaveWordsButtonState);

	setTextareaResize('user_css');

	$id('GUIp_import').onclick = function() {
		storage.importOptions($id('guip_settings').value);
	};
	$id('GUIp_export').onclick = function() {
		$id('guip_settings').value = storage.exportOptions();
	};
}

function setForm() {
	for (var sect in def.phrases) {
		addOnClick(sect);
	}
	$id('words').onsubmit = function() { save_words(); return false; };
	$id('GUIp_options').onsubmit = function() { save_options(); return false; };
	$id('set_default').onclick = function() { delete_custom_words(); return false; };
	$id('set_user_css').onclick = function() { set_user_css(); return false; };
}

function addOnClick(sect) {
	$id('l_' + sect).onclick = function() {
		setText(sect);
		return false;
	};
}

function delete_custom_words() {
	var ta = $id('ta_edit'),
		text = def.phrases[curr_sect];
	ta.setAttribute('rows', text.length);
	ta.value = text.join('\n');
	storage.remove('CustomPhrases:' + curr_sect);
	storage.set('phrasesChanged', 'true');
	setSaveWordsButtonState();
	setDefaultWordsButtonState(false);
}

function save_words() {
	$j('#gui_word_progress').show();
	var text = $id('ta_edit').value;
	if (text === "") { return; }
	var t_list = text.split("\n"),
		t_out = [];
	for (var i = 0; i < t_list.length; i++) {
		if (t_list[i] !== '') {
			t_out.push(t_list[i]);
		}
	}
	storage.set('CustomPhrases:' + curr_sect, t_out.join('||'));
	$j('#gui_word_progress').fadeOut("slow");
	storage.set('phrasesChanged', 'true');
	setSaveWordsButtonState();
	setDefaultWordsButtonState(true);
}

function save_options() {
	$j('#gui_settings_progress').show();

	var i, len, option_checkboxes = $C('option-checkbox');
	for (i = 0, len = option_checkboxes.length; i < len; i++) {
		var id = option_checkboxes[i].id;
		// id = "first_second_third" to option_name = "firstSecondThird"
		var parts = id.split('_');
		for (var k = 1; k < parts.length; k++) {
			parts[k] = parts[k][0].toUpperCase() + parts[k].slice(1);
		}
		var option_name = parts.join('');
		storage.set('Option:' + option_name, option_checkboxes[i].checked);
	}

	if ($id('relocate_duel_buttons').checked) {
		var buttons = [];
		if ($id('relocate_arena').checked) { buttons.push('arena'); }
		if ($id('relocate_chf').checked) { buttons.push('chf'); }
		if ($id('relocate_cvs').checked) { buttons.push('cvs'); }
		storage.set('Option:relocateDuelButtons', buttons.join());
	} else {
		storage.set('Option:relocateDuelButtons', '');
	}

	if ($id('forbidden_title_notices').checked) {
		var notices = [];
		if (!$id('title_notice_pm').checked) { notices.push('pm'); }
		if (!$id('title_notice_gm').checked) { notices.push('gm'); }
		if (!$id('title_notice_fi').checked) { notices.push('fi'); }
		storage.set('Option:forbiddenTitleNotices', notices.join());
	} else {
		storage.set('Option:forbiddenTitleNotices', '');
	}

	if ($id('use_background').checked) {
		if ($id('custom_background').checked) {
			var custom_file = $id('custom_file').files[0],
				custom_link = $id('custom_link').value.match(/https?:\/\/.*/),
				cb_status = $id('cb_status');
			if (custom_file && custom_file.type.match(/^image\/(bmp|cis\-cod|gif|ief|jpeg|jpg|pipeg|png|svg\+xml|tiff|x\-cmu\-raster|x\-cmx|x\-icon|x\-portable\-anymap|x\-portable\-bitmap|x\-portable\-graymap|x\-portable\-pixmap|x\-rgb|x\-xbitmap|x\-xpixmap|x\-xwindowdump)$/i)) {
				var reader = new FileReader();
				reader.onload = function(e) {
					storage.set('Option:useBackground', e.target.result);
				};
				reader.readAsDataURL(custom_file);
				cb_status.textContent = worker.GUIp_i18n.bg_status_file;
				cb_status.style.color = 'green';
			} else if (custom_link) {
				cb_status.textContent = worker.GUIp_i18n.bg_status_link;
				cb_status.style.color = 'green';
				storage.set('Option:useBackground', custom_link);
			} else if (storage.get('Option:useBackground') && storage.get('Option:useBackground') !== 'cloud') {
				cb_status.textContent = worker.GUIp_i18n.bg_status_same;
				cb_status.style.color = 'blue';
			} else {
				cb_status.textContent = worker.GUIp_i18n.bg_status_error;
				cb_status.style.color = 'red';
				worker.setTimeout(function() {
					$id('cloud_background').click();
				}, 150);
				storage.set('Option:useBackground', 'cloud');
			}
			$j('#cb_status').fadeIn();
			worker.setTimeout(function() {
				$j('#cb_status').fadeOut();
			}, 1000);
		}
		else if ($id('cloud_background').checked) {
			storage.set('Option:useBackground', 'cloud');
		}
	} else {
		storage.set('Option:useBackground', '');
	}

	if ($id('voice_timeout').checked) {
		var voice_timeout = $id('voice_timeout_value').value;
		if (parseInt(voice_timeout) > 0) {
			storage.set('Option:voiceTimeout', voice_timeout);
		} else {
			$id('voice_timeout_value').value = '20';
			$id('voice_timeout').click();
			storage.set('Option:voiceTimeout', '');
		}
	} else {
		storage.set('Option:voiceTimeout', '');
	}

	if ($id('freeze_voice_button').checked) {
		var cases = [];
		if ($id('freeze_after_voice').checked) { cases.push('after_voice'); }
		if ($id('freeze_when_empty').checked) { cases.push('when_empty'); }
		storage.set('Option:freezeVoiceButton', cases.join());
	} else {
		storage.set('Option:freezeVoiceButton', '');
	}

	if (!$id('forbidden_informers').checked) {
		setAllCheckboxesToState('informer-checkbox', true);
	}
	if (!$id('forbidden_craft').checked) {
		setAllCheckboxesToState('craft-checkbox', true);
	}
	$id('smelt!').checked = $id('smelter').checked;
	$id('transform!').checked = $id('transformer').checked;
	var forbiddenInformers = [],
		fiCheckboxes = $C('informer-checkbox');
	for (i = 0, len = fiCheckboxes.length; i < len; i++) {
		if (!fiCheckboxes[i].checked) {
			forbiddenInformers.push(fiCheckboxes[i].id);
		}
	}
	storage.set('Option:forbiddenInformers', forbiddenInformers.join());
	var forbiddenCraft = [],
		fcCheckboxes = $C('craft-checkbox');
	for (i = 0, len = fcCheckboxes.length; i < len; i++) {
		if (!fcCheckboxes[i].checked) {
			forbiddenCraft.push(fcCheckboxes[i].id);
		}
	}
	storage.set('Option:forbiddenCraft', forbiddenCraft.join());

	$j('#gui_settings_progress').fadeOut('slow');

	set_theme_and_background();

	storage.set('optionsChanged', true);
}

function setSaveWordsButtonState() {
	var save_words = $id('save_words');
	if ($id('ta_edit').value.replace(/\n/g, '||') !== (storage.get('CustomPhrases:' + curr_sect) || def.phrases[curr_sect].join('||'))) {
		save_words.removeAttribute('disabled');
	} else {
		save_words.setAttribute('disabled', 'disabled');
	}
}

function setDefaultWordsButtonState(condition) {
	var set_default = $id('set_default');
	if (condition) {
		set_default.removeAttribute('disabled');
	} else {
		set_default.setAttribute('disabled', 'disabled');
	}
}

function setText(sect) {
	curr_sect = sect;
	if ($q('#words a.selected')) { $q('#words a.selected').classList.remove('selected'); }
	$q('#words a#l_' + curr_sect).classList.add('selected');
	var text_list = storage.get('CustomPhrases:' + curr_sect),
		text = text_list ? text_list.split('||') : def.phrases[curr_sect],
		textarea = $id('ta_edit');
	textarea.removeAttribute('disabled');
	textarea.setAttribute('rows', text.length);
	textarea.value = text.join('\n');
	setSaveWordsButtonState();
	setDefaultWordsButtonState(text_list);
}

function set_user_css() {
	$j('#gui_css_progress').show();
	storage.set('UserCss', $id('user_css').value);
	storage.set('UserCssChanged', true);
	$j('#gui_css_progress').fadeOut("slow");
}

// Restores select box state to saved value from localStorage
function restore_options() {
	var i, len, r = new worker.RegExp('^' + storage._get_key('Option:'));
	for (i = 0, len = localStorage.length; i < len; i++) {
		if (localStorage.key(i).match(r)) {
			var option = localStorage.key(i).replace(r, '');
			if (storage.get(localStorage.key(i).replace(storage._get_key(''), ''))) {
				var pos;
				while ((pos = option.indexOf(option.match('[A-Z]'))) !== -1) {
					option = option.slice(0, pos) + '_' + option.charAt(pos).toLowerCase() + option.slice(pos + 1);
				}
				$id(option).checked = true;
			}
		}
	}

	if ($id('relocate_duel_buttons').checked) {
		$j('#relocate_duel_buttons_desc').hide();
		var buttons = storage.get('Option:relocateDuelButtons');
		if (buttons.match('arena')) { $id('relocate_arena').checked = true; }
		if (buttons.match('chf')) { $id('relocate_chf').checked = true; }
		if (buttons.match('cvs')) { $id('relocate_cvs').checked = true; }
	} else {
		$j('#relocate_duel_buttons_choice').hide();
	}
	if ($id('forbidden_title_notices').checked) {
		$j('#forbidden_title_notices_desc').hide();
		var notices = storage.get('Option:forbiddenTitleNotices');
		if (notices.match('pm')) { $id('title_notice_pm').checked = false; }
		if (notices.match('gm')) { $id('title_notice_gm').checked = false; }
		if (notices.match('fi')) { $id('title_notice_fi').checked = false; }
	} else {
		$j('#forbidden_title_notices_choice').hide();
	}
	if ($id('use_background').checked) {
		$j('#background_desc').hide();
		var bg = storage.get('Option:useBackground');
		if (bg !== 'cloud') {
			$id('custom_background').click();
		}
	} else {
		$j('#background_choice').hide();
	}
	if ($id('voice_timeout').checked) {
		$j('#voice_timeout_desc').hide();
		$id('voice_timeout_value').value = storage.get('Option:voiceTimeout');
	} else {
		$j('#voice_timeout_choice').hide();
		$id('voice_timeout_value').value = '20';
	}
	if ($id('freeze_voice_button').checked) {
		$j('#freeze_voice_button_desc').hide();
		var cases = storage.get('Option:freezeVoiceButton');
		if (cases.match('after_voice')) { $id('freeze_after_voice').checked = true; }
		if (cases.match('when_empty')) { $id('freeze_when_empty').checked = true; }
	} else {
		$j('#freeze_voice_button_choice').hide();
	}
	var forbiddenInformers = storage.get('Option:forbiddenInformers');
	if (forbiddenInformers) {
		var fiArray = forbiddenInformers.split(','),
			fiCheckboxes = $C('informer-checkbox');
		for (i = 0, len = fiCheckboxes.length; i < len; i++) {
			if (fiArray.indexOf(fiCheckboxes[i].id) === -1) {
				fiCheckboxes[i].checked = true;
			}
		}
	} else {
		setAllCheckboxesToState('informer-checkbox', true);
		$j('#informers').hide();
	}
	var forbiddenCraft = storage.get('Option:forbiddenCraft');
	if (forbiddenCraft) {
		var fcArray = forbiddenCraft.split(','),
			fcCheckboxes = $C('craft-checkbox');
		for (i = 0, len = fcCheckboxes.length; i < len; i++) {
			if (fcArray.indexOf(fcCheckboxes[i].id) === -1) {
				fcCheckboxes[i].checked = true;
			}
		}
	} else {
		setAllCheckboxesToState('craft-checkbox', true);
		$j('#craft_categories').hide();
	}
	if ($id('disable_voice_generators').checked) {
		$j('#voice_menu').hide();
		$j('#GUIp_words').hide();
	}

	$id('user_css').value = storage.get('UserCss') || '';
}

function improve_blocks() {
	var blocks = document.querySelectorAll('.bl_cell:not(.block), #pant_tbl:not(.block)');
	for (var i = 0, len = blocks.length; i < len; i++) {
		blocks[i].classList.add('block');
	}
}

function set_theme_and_background() {
	var ui_s_css = document.getElementById('ui_s_css');
	if (ui_s_css) {
		ui_s_css.parentNode.removeChild(ui_s_css);
	}
	worker.GUIp_addCSSFromURL('/stylesheets/' + storage.get('ui_s') + '.css', 'ui_s_css');
	var background = storage.get('Option:useBackground');
	if (background === 'cloud') {
		document.body.style.backgroundImage = 'url(' + worker.GUIp_getResource('images/background.jpg') + ')';
	} else {
		document.body.style.backgroundImage =  background ? 'url(' + background + ')' : '';
	}
}

var def, $j, curr_sect, god_name;

var starterInt = worker.setInterval(function() {
	if (worker.jQuery && worker.GUIp_browser && worker.GUIp_i18n && worker.GUIp_addCSSFromURL) {
		$j = worker.jQuery.noConflict();
		def = worker.GUIp_words();
		worker.clearInterval(starterInt);
		god_name = $q('#opt_change_profile div div').textContent;
		if (god_name) {
			localStorage.setItem('GUIp_CurrentUser', god_name);
		} else {
			god_name = localStorage.getItem('GUIp_CurrentUser');
		}
		addMenu();
		if (location.hash === "#ui_settings") {
			loadOptions();
		}
		if (worker.GUIp_browser !== 'Opera') {
			worker.GUIp_addCSSFromURL(worker.GUIp_getResource('options.css'), 'guip_options_css');
		}
		set_theme_and_background();
		improve_blocks();
		// Event and Listeners
		document.addEventListener("DOMNodeInserted", function() {
			if (!$q('#profile_main p').textContent.match(worker.GUIp_i18n.ui_settings.replace('+', '\\+'))) {
				worker.setTimeout(addMenu, 0);
			}
			improve_blocks();
		});
	}
}, 100);

})();