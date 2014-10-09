var $j = jQuery.noConflict();

var storage = {
	_get_key: function(key) {
		return "GM_" + god_name + ':' + key;
	},
	set: function(id, value) {
		localStorage.setItem(this._get_key(id), value);
		return value;
	},
	get: function(id) {
		var val = localStorage.getItem(this._get_key(id));
		if (val) val = val.replace(/^[NSB]\]/, '');
		if (val === 'true') return true;
		else if (val === 'false') return false;
		else return val;
	}
};

function updateMenu() {
	if (god_name === "") return;
	ImproveInProcess = true;
	if ($j('#ui_options').length === 0) {
		$j('#profile_main p:first').append(' | <a id="ui_options" href="#">Настройки UI</a>');
		//$j('#ui_options').click();
		$j('#ui_options').click(function() {
			loadOptions();
			return false;
		});
	}
	ImproveInProcess = false;
}

function loadOptions() {
	if (!(localStorage.getItem('GM_CurrentUser') || $j('div#profile_main').length)) {
		setTimeout(function() {loadOptions()}, 100);
		return;
	}
	ImproveInProcess = true;
	$j('div#profile_main').empty();
	$j('div#profile_main').append(getOptionsPage());
	setForm();
	restore_options();
	$j('input:not(.menu-checkbox):not(.option-checkbox)[type=checkbox]').css({'position' : 'relative', 'top' : '0.25em'});
	$j('input:not(.menu-checkbox):not(.option-checkbox)[type=radio]').css({'position' : 'relative', 'top' : '0.25em'});
	if (GM_browser === 'Firefox') {
		$j('input:not(.menu-checkbox):not(.option-checkbox)[type=checkbox]').css('transform', 'scale(0.7)');
	} else if (GM_browser === 'Chrome') {
		$j('input:not(.menu-checkbox):not(.option-checkbox)[type=checkbox]').css('-webkit-transform', 'scale(0.69)');
	}
	$j('#forbidden_informers').click(function() {
		$j('#informers').slideToggle("slow");
	});
	$j('#relocate_duel_buttons').click(function() {
		$j('#relocate_duel_buttons_desc').slideToggle("slow");
		$j('#relocate_duel_buttons_choice').slideToggle("slow");
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
	$j('#freeze_voice_button').click(function() {
		$j('#freeze_voice_button_choice').slideToggle("slow");
		$j('#freeze_voice_button_desc').slideToggle("slow");
	});
	$j('#check_all').click(function() {
		$j('.item-informer').attr('checked', true);
		return false;
	});
	$j('#uncheck_all').click(function() {
		$j('.item-informer').attr('checked', false);
		return false;
	});
	$j('#disable_voice_generators').click(function() {
		$j('#voice_menu').slideToggle("slow");
		$j('#godvilleUI_words').slideToggle("slow");
	});
	$j('<div>', {id:"temp"}).insertAfter($j('div#profile_main')).hide();
	if (storage.get('sex') === 'female') {
		$j('#voice_menu .l_capt:first').text($j('#voice_menu .l_capt:first').text().replace('героя', 'героини'));
		$j('#voice_menu .g_desc:first').text($j('#voice_menu .g_desc:first').text().replace('герою', 'героине'));	
	}
	
	$j('form#words a').css({'text-decoration' : 'underline', 'color' : '#199BDC', 'cursor' : 'pointer'});
	$j(document).on('change keypress paste focus textInput input', 'textarea#ta_edit', function() {
		$j(this).attr('rows', $j(this).val().split('\n').length || 1);
	}).attr('rows', 1);
	
	ImproveInProcess = false;
}

function setForm() {
	for (var i = 0; i < sects.length; i++) {
		var t = sects[i];
		var $el = $j('a#l_' + t);
		addOnClick($el, t);
	}
	var $bt1 = $j('form#words').submit(function() {save_options(1); return false;});
	var $bt2 = $j('form#add_options').submit(function() {save_options(2); return false;});
	var $bt3 = $j('form#words input[type="button"]').click(function() {reset_options(1); return false;});
}

function addOnClick($el, text) {
	$el.click(function(e) {
		setText(text);
		return false;
	});
}

function reset_options(form) {
	ImproveInProcess = true;
	var $elem = $j('textarea#ta_edit');
	var text = def['phrases'][curr_sect];
	$elem.attr('rows', text.length);
	$elem.val(text.join("\n"));
	ImproveInProcess = false;
}

function save_options(form) {
	ImproveInProcess = true;
	if (form === 1) {
		$j('img#gui_word_progress').show();
		var text = $j('textarea#ta_edit').val();
		if (text === "") return;
		var t_list = text.split("\n"); var t_out = [];
		for (var i = 0; i < t_list.length; i++) {
			if (t_list[i] != '') t_out.push(t_list[i]);
		}
		storage.set("phrases_" + curr_sect, t_out.join("||"));
		$j('img#gui_word_progress').fadeOut("slow");
		setText(curr_sect);
		storage.set('phrasesChanged', 'true');
	} else {
		$j('img#gui_options_progress').show();
		
		for (var i = 0; i < $j('.option-checkbox').length; i++) {
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
			if ($j('#relocate_arena:checked').length) buttons.push('arena');
			if ($j('#relocate_chf:checked').length) buttons.push('chf');
			if ($j('#relocate_cvs:checked').length) buttons.push('cvs');
			storage.set('Option:relocateDuelButtons', buttons.join());
		} else storage.set('Option:relocateDuelButtons', '');
		
		if ($j('#use_background:checked').length) {			
			if ($j('#custom_background:checked').length) {
				var custom_file = $j('#custom_file')[0].files[0];
				var custom_link = $j('#custom_link').val().match(/https?:\/\/.*/);				
				if (custom_file && custom_file.type.match(/^image\/(bmp|cis\-cod|gif|ief|jpeg|jpg|pipeg|png|svg\+xml|tiff|x\-cmu\-raster|x\-cmx|x\-icon|x\-portable\-anymap|x\-portable\-bitmap|x\-portable\-graymap|x\-portable\-pixmap|x\-rgb|x\-xbitmap|x\-xpixmap|x\-xwindowdump)$/i)) {
					var reader = new FileReader();
					reader.onload = function(e) {
						storage.set('Option:useBackground', e.target.result);
					}
					reader.readAsDataURL(custom_file);
					$j('#cb_status').text('файл');
					$j('#cb_status').css('color', 'green');	
				} else if (custom_link) {
					$j('#cb_status').text('ссылка');
					$j('#cb_status').css('color', 'green');	
					storage.set('Option:useBackground', custom_link);
				} else if (storage.get('Option:useBackground') && storage.get('Option:useBackground') != 'cloud') {
					GM_log(storage.get('Option:useBackground') + '123' + storage.get('Option:useBackground') != 'cloud');
					$j('#cb_status').text('тот же');
					$j('#cb_status').css('color', 'blue');	
				} else {
					$j('#cb_status').text('ошибка');
					$j('#cb_status').css('color', 'red');
					setTimeout(function() {
						$j('#cloud_background').click();
					}, 150);
					storage.set('Option:useBackground', 'cloud');
				}
				$j('#cb_status').fadeIn();
				setTimeout(function() {
					$j('#cb_status').fadeOut();
				}, 1000);
			}
			else if ($j('#cloud_background:checked').length)
				storage.set('Option:useBackground', 'cloud');	
		}
		
		if ($j('#freeze_voice_button:checked').length) {			
			var cases = [];
			if ($j('#freeze_after_voice:checked').length) cases.push('after_voice');
			if ($j('#freeze_when_empty:checked').length) cases.push('when_empty');
			storage.set('Option:freezeVoiceButton', cases.join());
		} else storage.set('Option:freezeVoiceButton', '');
				
		if (!$j('#forbidden_informers:checked').length) {
			$j('.informer-checkbox').attr('checked', true);
		}
		document.getElementById('smelt!').checked = $j('#smelter:checked').length;
		document.getElementById('transform!').checked = $j('#transformer:checked').length;
		var forbiddenInformers = [];
		for (var i = 0; i < $j('.informer-checkbox').length; i++) {
			GM_log($j('.informer-checkbox')[i].id + ' ' + $j('.informer-checkbox')[i].checked)
			if (!$j('.informer-checkbox')[i].checked)
				forbiddenInformers.push($j('.informer-checkbox')[i].id);
		}
		storage.set('Option:forbiddenInformers', forbiddenInformers.join());
		$j('img#gui_options_progress').fadeOut('slow');
	}
	ImproveInProcess = false;
}

function setText(element_name) {
	ImproveInProcess = true;
	curr_sect = element_name;
	$j('#submit2').removeAttr('disabled');
	$j('#cancel2').removeAttr('disabled');
	$j('form#words a').css({'text-decoration' : 'underline', 'color' : '#199BDC', 'cursor' : 'pointer'});
	$j('form#words a#l_' + element_name).css({'text-decoration' : 'none', 'color' : '#DA251D'});
	var text_list = storage.get("phrases_" + element_name);
	var text = (text_list && text_list != "") ? text_list.split("||") : def['phrases'][element_name];
	$j('textarea#ta_edit').attr('rows', text.length).val(text.join("\n"));
	
	$j('#ta_edit').removeAttr('disabled');
	$j('#submit2').removeAttr('disabled');
	$j('#cancel2').removeAttr('disabled');
	
	ImproveInProcess = false;
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	def = getWords();
	var r = new RegExp('^' + storage._get_key('Option:'));
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).match(r)) {
			var option = localStorage.key(i).replace(r, '');
			if (storage.get(localStorage.key(i).replace(storage._get_key(''), ''))) {
				var pos;
				while ((pos = option.indexOf(option.match('[A-Z]'))) != -1) {
					option = option.slice(0, pos) + '_' + option.charAt(pos).toLowerCase() + option.slice(pos + 1);
				}
				$j('input#' + option).prop('checked', true);
			}// else 
				//GM_log(localStorage.key(i) + ' NULL');
		}
	}
	
	/*////////////////////////////
	r = new RegExp('^GM_');
	GM_log(r);
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).match(r))
			GM_log(localStorage.key(i));
	}
	*/////////////////////////////
	
	if ($j('input#relocate_duel_buttons:checked').length) {		
		$j('#relocate_duel_buttons_desc').hide();
		var buttons = storage.get('Option:relocateDuelButtons');
		if (buttons.match('arena')) $j('#relocate_arena').attr('checked', true);
		if (buttons.match('chf')) $j('#relocate_chf').attr('checked', true);
		if (buttons.match('cvs')) $j('#relocate_cvs').attr('checked', true);
	} else {
		$j('#relocate_duel_buttons_choice').hide();
	}
	if ($j('input#use_background:checked').length) {		
		$j('#background_desc').hide();
		var bg = storage.get('Option:useBackground');
		if (bg != 'cloud') {
			$j('#custom_background').click();
		}
	} else {
		$j('#background_choice').hide();
	}
	if ($j('input#freeze_voice_button:checked').length) {		
		$j('#freeze_voice_button_desc').hide();
		var cases = storage.get('Option:freezeVoiceButton');
		if (cases.match('after_voice')) $j('#freeze_after_voice').attr('checked', true);
		if (cases.match('when_empty')) $j('#freeze_when_empty').attr('checked', true);
	} else {
		$j('#freeze_voice_button_choice').hide();
	}
	var forbiddenInformers = storage.get('Option:forbiddenInformers');
	if (forbiddenInformers) {
		forbiddenInformers = forbiddenInformers.split(',');
		for (var i = 0; i < $j('.informer-checkbox').length; i++) {
			if (forbiddenInformers.indexOf($j('.informer-checkbox')[i].id) === -1)
				$j('.informer-checkbox')[i].checked = true;
		}
	} else {
		$j('.informer-checkbox').attr('checked', true);
		$j('#informers').hide();
	}
	if ($j('input#disable_voice_generators:checked').length) {
		$j('#voice_menu').hide();
		$j('#godvilleUI_words').hide();
	}
}

var sects = ['heal', 'pray', 'sacrifice', 'exp', 'dig', 'hit', 'do_task', 'cancel_task', 'die', 'town', 'heil', 'walk_s', 'walk_n', 'walk_w', 'walk_e'];
var phrases = {heal : "Лечись", pray: "Молись", sacrifice : "Жертвуй", exp : "Опыт", dig : "Клад, золото", hit : "Бей",
				do_task : "Задание", cancel_task : "Отмени задание", die : "Умри", town : "Домой", heil : "Восклицания", 
				walk_s : "Север", walk_n : "Юг", walk_w : "Запад", walk_e : "Восток"};
var def = "";
var curr_sect = "";
var ImproveInProcess = false;
var god_name = $j('#opt_change_profile div:first div:first').text();
	if (god_name !== "") localStorage.setItem("GM_CurrentUser", god_name);
	else god_name = localStorage.getItem("GM_CurrentUser");
var isDataRead = false;
updateMenu();
if (location.hash === "#ui_options") {
	loadOptions();
}

// Event and Listeners
document.addEventListener("DOMNodeInserted", function () {
	if(!$j('div#profile_main p:first').text().match('Настройки UI'))
		setTimeout(function() {
			updateMenu();
		}, 0);
});