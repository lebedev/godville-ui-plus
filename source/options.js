(function() {
'use strict';

var worker = window.wrappedJSObject || window;

var storage = {
	_get_key: function(key) {
		return "GUIp_" + god_name + ':' + key;
	},
	set: function(id, value) {
		localStorage[this._get_key(id)] = value;
		return value;
	},
	get: function(id) {
		var val = localStorage[this._get_key(id)];
		if (val) { val = val.replace(/^[NSB]\]/, ''); }
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
		var r = new RegExp(this._get_key(''));
		for (var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).match(r) && !localStorage.key(i).match(/Stats|Logger/)) {
				options[localStorage.key(i).replace(r, '')] = localStorage[localStorage.key(i)];
			}
		}
		return JSON.stringify(options);
	}
};

function addMenu() {
	if (god_name === "") { return; }
	ImproveInProcess = true;
	if ($j('#ui_options').length === 0) {
		$j('#profile_main p:first').append(' | <a id="ui_options" href="#ui_options">' + worker.GUIp_i18n.ui_options + '</a>');
		$j('#ui_options').click(function() {
			loadOptions();
		});
	}
	ImproveInProcess = false;
}

function loadOptions() {
	if (!(localStorage.GUIp_CurrentUser || $j('#profile_main').length)) {
		worker.setTimeout(function() {loadOptions();}, 100);
		return;
	}
	ImproveInProcess = true;
	$j('#profile_main').empty();
	$j('#profile_main').append(worker.getOptionsPage());
	setForm();
	restore_options();
	$j('#forbidden_informers').click(function() {
		$j('#informers').slideToggle("slow");
	});
	$j('#forbidden_craft').click(function() {
		$j('#craft_categories').slideToggle("slow");
	});
	$j('#relocate_duel_buttons').click(function() {
		$j('#relocate_duel_buttons_desc').slideToggle("slow");
		$j('#relocate_duel_buttons_choice').slideToggle("slow");
	});
	$j('#forbidden_title_notices').click(function() {
		$j('#forbidden_title_notices_desc').slideToggle("slow");
		$j('#forbidden_title_notices_choice').slideToggle("slow");
	});
	$j('#use_background').click(function() {
		$j('#background_choice').slideToggle("slow");
		$j('#background_desc').slideToggle("slow");
	});
	$j('#custom_file').click(function() {
		$j('#custom_background').click();
		$j('#custom_file').val('');
	});
	$j('#custom_link').click(function() {
		$j('#custom_background').click();
	});
	$j('#voice_timeout').click(function() {
		$j('#voice_timeout_choice').slideToggle("slow");
		$j('#voice_timeout_desc').slideToggle("slow");
	});
	$j('#freeze_voice_button').click(function() {
		$j('#freeze_voice_button_choice').slideToggle("slow");
		$j('#freeze_voice_button_desc').slideToggle("slow");
	});
	$j('#check_all').click(function() {
		$j('.item-informer').prop('checked', true);
		return false;
	});
	$j('#uncheck_all').click(function() {
		$j('.item-informer').prop('checked', false);
		return false;
	});
	$j('#disable_voice_generators').click(function() {
		$j('#voice_menu').slideToggle("slow");
		$j('#GUIp_words').slideToggle("slow");
	});
	if (storage.get('sex') === 'female') {
		$j('#voice_menu .l_capt:first').text($j('#voice_menu .l_capt:first').text().replace('героя', 'героини'));
		$j('#voice_menu .g_desc:first').text($j('#voice_menu .g_desc:first').text().replace('герою', 'героине'));
	}

	$j(document).on('change keypress paste focus textInput input', '#ta_edit', function() {
		$j(this).attr('rows', $j(this).val().split('\n').length || 1);
		setSaveWordsButtonState();
	}).attr('rows', 1);

	$j('#GUIp_import').click(function() {
		storage.importOptions($j('#guip_settings').val());
	});
	$j('#GUIp_export').click(function() {
		$j('#guip_settings').val(storage.exportOptions());
	});

	ImproveInProcess = false;
}

function setForm() {
	for (var sect in def.phrases) {
		addOnClick($j('#l_' + sect), sect);
	}
	$j('#words').submit(function() { save_words(); return false; });
	$j('#GUIp_options').submit(function() { save_options(); return false; });
	$j('#set_default').click(function() { delete_custom_words(); return false; });
	$j('#set_user_css').click(function() { set_user_css(); return false; });
}

function addOnClick($el, sect) {
	$el.click(function() {
		setText(sect);
		return false;
	});
}

function delete_custom_words() {
	ImproveInProcess = true;
	var $elem = $j('#ta_edit');
	var text = def.phrases[curr_sect];
	$elem.attr('rows', text.length);
	$elem.val(text.join("\n"));
	storage.remove('CustomPhrases:' + curr_sect);
	storage.set('phrasesChanged', 'true');
	setSaveWordsButtonState();
	setDefaultWordsButtonState(false);
	ImproveInProcess = false;
}

function save_words() {
	ImproveInProcess = true;
	$j('#gui_word_progress').show();
	var text = $j('#ta_edit').val();
	if (text === "") { return; }
	var t_list = text.split("\n"),
		t_out = [];
	for (var i = 0; i < t_list.length; i++) {
		if (t_list[i] !== '') {
			t_out.push(t_list[i]);
		}
	}
	storage.set('CustomPhrases:' + curr_sect, t_out.join("||"));
	$j('#gui_word_progress').fadeOut("slow");
	storage.set('phrasesChanged', 'true');
	setSaveWordsButtonState();
	setDefaultWordsButtonState(true);
	ImproveInProcess = false;
}

function save_options() {
	var i;
	$j('#gui_options_progress').show();

	for (i = 0; i < $j('.option-checkbox').length; i++) {
		var option = $j('.option-checkbox')[i].id;
		// option = "first_second_third" to option = "firstSecondThird"
		var parts = option.split('_');
		for (var k = 1; k < parts.length; k++) {
			parts[k] = parts[k][0].toUpperCase() + parts[k].slice(1);
		}
		option = parts.join('');
		storage.set('Option:' + option, $j('.option-checkbox')[i].checked);
	}

	if ($j('#relocate_duel_buttons:checked').length) {
		var buttons = [];
		if ($j('#relocate_arena:checked').length) { buttons.push('arena'); }
		if ($j('#relocate_chf:checked').length) { buttons.push('chf'); }
		if ($j('#relocate_cvs:checked').length) { buttons.push('cvs'); }
		storage.set('Option:relocateDuelButtons', buttons.join());
	} else {
		storage.set('Option:relocateDuelButtons', '');
	}

	if ($j('#forbidden_title_notices:checked').length) {
		var notices = [];
		if (!$j('#title_notice_pm:checked').length) { notices.push('pm'); }
		if (!$j('#title_notice_gm:checked').length) { notices.push('gm'); }
		if (!$j('#title_notice_fi:checked').length) { notices.push('fi'); }
		storage.set('Option:forbiddenTitleNotices', notices.join());
	} else {
		storage.set('Option:forbiddenTitleNotices', '');
	}

	if ($j('#use_background:checked').length) {
		if ($j('#custom_background:checked').length) {
			var custom_file = $j('#custom_file')[0].files[0],
				custom_link = $j('#custom_link').val().match(/https?:\/\/.*/);
			if (custom_file && custom_file.type.match(/^image\/(bmp|cis\-cod|gif|ief|jpeg|jpg|pipeg|png|svg\+xml|tiff|x\-cmu\-raster|x\-cmx|x\-icon|x\-portable\-anymap|x\-portable\-bitmap|x\-portable\-graymap|x\-portable\-pixmap|x\-rgb|x\-xbitmap|x\-xpixmap|x\-xwindowdump)$/i)) {
				var reader = new FileReader();
				reader.onload = function(e) {
					storage.set('Option:useBackground', e.target.result);
				};
				reader.readAsDataURL(custom_file);
				$j('#cb_status').text(worker.GUIp_i18n.bg_status_file);
				$j('#cb_status').css('color', 'green');
			} else if (custom_link) {
				$j('#cb_status').text(worker.GUIp_i18n.bg_status_link);
				$j('#cb_status').css('color', 'green');
				storage.set('Option:useBackground', custom_link);
			} else if (storage.get('Option:useBackground') && storage.get('Option:useBackground') !== 'cloud') {
				$j('#cb_status').text(worker.GUIp_i18n.bg_status_same);
				$j('#cb_status').css('color', 'blue');
			} else {
				$j('#cb_status').text(worker.GUIp_i18n.bg_status_error);
				$j('#cb_status').css('color', 'red');
				worker.setTimeout(function() {
					$j('#cloud_background').click();
				}, 150);
				storage.set('Option:useBackground', 'cloud');
			}
			$j('#cb_status').fadeIn();
			worker.setTimeout(function() {
				$j('#cb_status').fadeOut();
			}, 1000);
		}
		else if ($j('#cloud_background:checked').length) {
			storage.set('Option:useBackground', 'cloud');
		}
	} else {
		storage.set('Option:useBackground', '');
	}

	if ($j('#voice_timeout:checked').length) {
		var voice_timeout = $j('#voice_timeout_value').val();
		if (voice_timeout) {
			storage.set('Option:voiceTimeout', voice_timeout);
		} else {
			$j('#voice_timeout_value').val('30');
			$j('#voice_timeout').click();
			storage.set('Option:voiceTimeout', '');
		}
	} else {
		storage.set('Option:voiceTimeout', '');
	}

	if ($j('#freeze_voice_button:checked').length) {
		var cases = [];
		if ($j('#freeze_after_voice:checked').length) { cases.push('after_voice'); }
		if ($j('#freeze_when_empty:checked').length) { cases.push('when_empty'); }
		storage.set('Option:freezeVoiceButton', cases.join());
	} else {
		storage.set('Option:freezeVoiceButton', '');
	}

	if (!$j('#forbidden_informers:checked').length) {
		$j('.informer-checkbox').prop('checked', true);
	}
	if (!$j('#forbidden_craft:checked').length) {
		$j('.craft-checkbox').prop('checked', true);
	}
	document.getElementById('smelt!').checked = $j('#smelter:checked').length;
	document.getElementById('transform!').checked = $j('#transformer:checked').length;
	var forbiddenInformers = [];
	for (i = 0; i < $j('.informer-checkbox').length; i++) {
		if (!$j('.informer-checkbox')[i].checked) {
			forbiddenInformers.push($j('.informer-checkbox')[i].id);
		}
	}
	storage.set('Option:forbiddenInformers', forbiddenInformers.join());
	var forbiddenCraft = [];
	for (i = 0; i < $j('.craft-checkbox').length; i++) {
		if (!$j('.craft-checkbox')[i].checked) {
			forbiddenCraft.push($j('.craft-checkbox')[i].id);
		}
	}
	storage.set('Option:forbiddenCraft', forbiddenCraft.join());

	$j('#gui_options_progress').fadeOut('slow');

	set_theme_and_background();
	ImproveInProcess = false;
}

function setSaveWordsButtonState() {
	var save_words = $j('#save_words');
	if ($j('#ta_edit').val().replace(/\n/g, '||') !== (storage.get('CustomPhrases:' + curr_sect) || def.phrases[curr_sect].join('||'))) {
		save_words.removeAttr('disabled');
	} else {
		save_words.attr('disabled', 'disabled');
	}
}

function setDefaultWordsButtonState(condition) {
	var set_default = $j('#set_default');
	if (condition) {
		set_default.removeAttr('disabled');
	} else {
		set_default.attr('disabled', 'disabled');
	}
}

function setText(sect) {
	ImproveInProcess = true;
	curr_sect = sect;
	$j('#words a.selected').removeClass('selected');
	$j('#words a#l_' + curr_sect).addClass('selected');
	var text_list = storage.get('CustomPhrases:' + curr_sect);
	var text = text_list ? text_list.split('||') : def.phrases[curr_sect];
	$j('#ta_edit').removeAttr('disabled').attr('rows', text.length).val(text.join("\n"));
	setSaveWordsButtonState();
	setDefaultWordsButtonState(text_list);
	ImproveInProcess = false;
}

function set_user_css() {
	$j('#gui_css_progress').show();
	storage.set('UserCss', $j('#user_css').val());
	storage.set('UserCssChanged', true);
	$j('#gui_css_progress').fadeOut("slow");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var i, r = new RegExp('^' + storage._get_key('Option:'));
	for (i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).match(r)) {
			var option = localStorage.key(i).replace(r, '');
			if (storage.get(localStorage.key(i).replace(storage._get_key(''), ''))) {
				var pos;
				while ((pos = option.indexOf(option.match('[A-Z]'))) !== -1) {
					option = option.slice(0, pos) + '_' + option.charAt(pos).toLowerCase() + option.slice(pos + 1);
				}
				$j('#' + option).prop('checked', true);
			}
		}
	}

	if ($j('#relocate_duel_buttons:checked').length) {
		$j('#relocate_duel_buttons_desc').hide();
		var buttons = storage.get('Option:relocateDuelButtons');
		if (buttons.match('arena')) { $j('#relocate_arena').prop('checked', true); }
		if (buttons.match('chf')) { $j('#relocate_chf').prop('checked', true); }
		if (buttons.match('cvs')) { $j('#relocate_cvs').prop('checked', true); }
	} else {
		$j('#relocate_duel_buttons_choice').hide();
	}
	if ($j('#forbidden_title_notices:checked').length) {
		$j('#forbidden_title_notices_desc').hide();
		var notices = storage.get('Option:forbiddenTitleNotices');
		if (notices.match('pm')) { $j('#title_notice_pm').prop('checked', false); }
		if (notices.match('gm')) { $j('#title_notice_gm').prop('checked', false); }
		if (notices.match('fi')) { $j('#title_notice_fi').prop('checked', false); }
	} else {
		$j('#forbidden_title_notices_choice').hide();
	}
	if ($j('#use_background:checked').length) {
		$j('#background_desc').hide();
		var bg = storage.get('Option:useBackground');
		if (bg !== 'cloud') {
			$j('#custom_background').click();
		}
	} else {
		$j('#background_choice').hide();
	}
	if ($j('#voice_timeout:checked').length) {
		$j('#voice_timeout_desc').hide();
		$j('#voice_timeout_value').val(storage.get('Option:voiceTimeout'));
	} else {
		$j('#voice_timeout_choice').hide();
	}
	if ($j('#freeze_voice_button:checked').length) {
		$j('#freeze_voice_button_desc').hide();
		var cases = storage.get('Option:freezeVoiceButton');
		if (cases.match('after_voice')) { $j('#freeze_after_voice').prop('checked', true); }
		if (cases.match('when_empty')) { $j('#freeze_when_empty').prop('checked', true); }
	} else {
		$j('#freeze_voice_button_choice').hide();
	}
	var forbiddenInformers = storage.get('Option:forbiddenInformers');
	if (forbiddenInformers) {
		forbiddenInformers = forbiddenInformers.split(',');
		for (i = 0; i < $j('.informer-checkbox').length; i++) {
			if (forbiddenInformers.indexOf($j('.informer-checkbox')[i].id) === -1) {
				$j('.informer-checkbox')[i].checked = true;
			}
		}
	} else {
		$j('.informer-checkbox').prop('checked', true);
		$j('#informers').hide();
	}
	var forbiddenCraft = storage.get('Option:forbiddenCraft');
	if (forbiddenCraft) {
		forbiddenCraft = forbiddenCraft.split(',');
		for (i = 0; i < $j('.craft-checkbox').length; i++) {
			if (forbiddenCraft.indexOf($j('.craft-checkbox')[i].id) === -1) {
				$j('.craft-checkbox')[i].checked = true;
			}
		}
	} else {
		$j('.craft-checkbox').prop('checked', true);
		$j('#craft_categories').hide();
	}
	if ($j('#disable_voice_generators:checked').length) {
		$j('#voice_menu').hide();
		$j('#GUIp_words').hide();
	}

	$j('#user_css').val(storage.get('UserCss') || '');
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
	if (background) {
		if (background === 'cloud') {
			document.body.style.backgroundImage = 'url(' + worker.GUIp_getResource('images/background.jpg') + ')';
		} else {
			document.body.style.backgroundImage =  'url(' + background + ')';
		}
	} else {
		document.body.style.backgroundImage = '';
	}
}

var def, $j, curr_sect, god_name,
	ImproveInProcess = false;

var starterInt = worker.setInterval(function() {
	if (worker.jQuery && worker.GUIp_browser && worker.GUIp_i18n && worker.GUIp_addCSSFromURL) {
		$j = worker.jQuery.noConflict();
		def = worker.GUIp_words();
		worker.clearInterval(starterInt);
		god_name = $j('#opt_change_profile div:first div:first').text();
		if (god_name) {
			localStorage.GUIp_CurrentUser = god_name;
		} else {
			god_name = localStorage.GUIp_CurrentUser;
		}
		addMenu();
		if (location.hash === "#ui_options") {
			loadOptions();
		}
		worker.GUIp_addCSSFromURL(worker.GUIp_getResource('options.css'), 'guip_options_css');
		set_theme_and_background();
		improve_blocks();
		// Event and Listeners
		document.addEventListener("DOMNodeInserted", function() {
			if (!$j('#profile_main p:first').text().match(worker.GUIp_i18n.ui_options.replace('+', '\\+'))) {
				worker.setTimeout(addMenu, 0);
			}
			improve_blocks();
		});
	}
}, 100);

})();