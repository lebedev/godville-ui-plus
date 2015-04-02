// ui_utils
var ui_utils = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "utils"}) : worker.GUIp.utils = {};

ui_utils.hasShownErrorMessage = false;
ui_utils.hasShownInfoMessage = false;
// base phrase say algorythm
ui_utils.setVoice = function(voice) {
	this.voiceInput.value = voice;
	ui_utils.triggerChangeOnVoiceInput();
};
ui_utils.triggerChangeOnVoiceInput = function() {
	worker.$(this.voiceInput).change();
};
// finds a label with given name
ui_utils.findLabel = function($base_elem, label_name) {
	return worker.$('.l_capt', $base_elem).filter(function(index) {
		return this.textContent === label_name;
	});
};
// checks if $elem already improved
ui_utils.isAlreadyImproved = function(elem) {
	if (elem.classList.contains('improved')) {
		return true;
	} else {
		elem.classList.add('improved');
		return false;
	}
};
// generic voice generator
ui_utils.getGenericVoicegenButton = function(text, section, title) {
	var voicegen = document.createElement('a');
	voicegen.title = title;
	voicegen.textContent = text;
	voicegen.className = 'voice_generator ' + (ui_data.isDungeon ? 'dungeon' : ui_data.isFight ? 'battle' : 'field') + ' ' + section;
	voicegen.onclick = function() {
		if (document.getElementById('god_phrase').getAttribute('disabled') !== 'disabled') {
			ui_utils.setVoice(ui_words.longPhrase(section));
			ui_words.currentPhrase = "";
		}
		return false;
	};
	return voicegen;
};
ui_utils.addVoicegen = function(elem, voicegen_name, section, title) {
	elem.parentNode.insertBefore(ui_utils.getGenericVoicegenButton(voicegen_name, section, title), elem.nextSibling);
};
// Случайный индекс в массиве
ui_utils.getRandomIndex = function(arr) {
	return Math.floor(Math.random()*arr.length);
};
// Случайный элемент массива
ui_utils.getRandomItem = function(arr) {
	return arr[ui_utils.getRandomIndex(arr)];
};
// Вытаскивает случайный элемент из массива
ui_utils.popRandomItem = function(arr) {
	var ind = ui_utils.getRandomIndex(arr);
	var res = arr[ind];
	arr.splice(ind, 1);
	return res;
};
ui_utils.createInspectButton = function(item_name) {
	var a = document.createElement('a');
	a.className = 'inspect_button';
	a.title = worker.GUIp_i18n.ask1 + ui_data.char_sex[0] + worker.GUIp_i18n.inspect + item_name;
	a.textContent = '?';
	a.onclick = function() {
		ui_utils.setVoice(ui_words.inspectPhrase(item_name));
		return false;
	};
	return a;
};
ui_utils.createCraftButton = function(combo, combo_list, hint) {
	var a = document.createElement('a');
	a.className = 'craft_button ' + combo_list;
	a.title = worker.GUIp_i18n.ask2 + ui_data.char_sex[0] + worker.GUIp_i18n.craft1 + hint + worker.GUIp_i18n.craft2;
	a.innerHTML = combo;
	a.onclick = function() {
		var rand = Math.floor(Math.random()*ui_improver[combo_list].length),
			items = ui_improver[combo_list][rand];
		ui_utils.setVoice(ui_words.craftPhrase(items));
		return false;
	};
	return a;
};
// Escapes HTML symbols
ui_utils.escapeHTML = function(str) {
	return String(str).replace(/&/g, "&amp;")
					  .replace(/"/g, "&quot;")
					  .replace(/</g, "&lt;")
					  .replace(/>/g, "&gt;");
};
ui_utils.addCSS = function () {
	if (worker.GUIp_browser !== 'Opera' && !document.getElementById('ui_css')) {
		worker.GUIp_addCSSFromURL(worker.GUIp_getResource('superhero.css'), 'guip_css');
	}
};
ui_utils.getXHR = function(path, success_callback, fail_callback, extra_arg) {
	var xhr = new XMLHttpRequest();
	if (extra_arg) {
		xhr.extra_arg = extra_arg;
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState < 4) {
			return;
		} else if (xhr.status === 200) {
			if (success_callback) {
				success_callback(xhr);
			}
		} else if (fail_callback) {
			fail_callback(xhr);
		}
	};

	xhr.open('GET', path, true);
	xhr.send();
};
ui_utils.showMessage = function(msg_no, msg) {
	var id = 'msg' + msg_no;
	document.getElementById('menu_bar').insertAdjacentHTML('afterend',
		'<div id="' + id + '" class="hint_bar ui_msg">'+
			'<div class="hint_bar_capt"><b>' + msg.title + '</b></div>'+
			'<div class="hint_bar_content">' + msg.content + '</div>'+
			'<div class="hint_bar_close"><a id="' + id + '_close">' + worker.GUIp_i18n.close + '</a></div>' +
		'</div>'
	);
	var msg_elem = document.getElementById(id);
	document.getElementById(id + '_close').onclick = function() {
		worker.$(msg_elem).fadeToggle(function() {
			msg_elem.parentNode.removeChild(msg_elem);
			if (!isNaN(msg_no)) {
				ui_storage.set('lastShownMessage', msg_no);
			}
		});
		return false;
	};

	worker.setTimeout(function() {
		worker.$(msg_elem).fadeToggle(1500, msg.callback);
	}, 1000);
};
ui_utils.inform = function() {
	var last_shown = !isNaN(ui_storage.get('lastShownMessage')) ? +ui_storage.get('lastShownMessage') : -1;
	for (var i = 0, len = this.messages[worker.GUIp_locale].length; i < len; i++) {
		if (this.messages[worker.GUIp_locale][i].msg_no > last_shown) {
			ui_utils.showMessage(this.messages[worker.GUIp_locale][i].msg_no, this.messages[worker.GUIp_locale][i]);
		}
	}
};
ui_utils.messages = {
	ru: [{
		msg_no: 0,
		title: 'Приветственное сообщение Godville UI+',
		get content() { return '<div>Приветствую бог' + (document.title.match('её') ? 'иню' : 'а') + ', использующ' + (document.title.match('её') ? 'ую' : 'его') +
			' дополнение <b>Godville UI+</b>.</div>'+

			'<div style="text-align: justify; margin: 0.2em 0 0.3em;">&emsp;Нажмите на кнопку <b>настройки ui+</b> в верхнем меню или ' +
			'откройте вкладку <b>Настройки UI+</b> в <b>профиле</b> героя и ознакомьтесь с настройками дополнения, если еще этого не сделали.<br>' +

			'&emsp;Касательно форумных информеров: по умолчанию, вы подписаны только на тему дополнения и, скорее всего, видите ее <i>форумный информер</i> в левом верхнем углу.<br>' +

			'&emsp;Если с каким-то функционалом дополнения не удалось интуитивно разобраться — прочтите <b>статью дополнения в богии</b> ' +
			'или задайте вопрос мне (богу <b>Бэдлак</b>) или в соответствующей <b>теме на форуме</b>.<br>' +

			'&emsp;Инструкции на случай проблем можно прочесть в <i>диалоговом окне помощи</i> (оно сейчас открыто), которое открывается/закрывается ' +
			'по щелчку на кнопке <b style="text-decoration: underline;">help</b> в верхнем меню. Ссылки на все ранее упомянутое находятся там же.<br>' +

			'<div style="text-align: right;">Приятной игры!<br>~~Бэдлак</div>';
		},
		callback: function() {
			if (!ui_storage.get('helpDialogVisible')) {
				ui_help.toggleDialog();
			}
		}
	},
	{
		msg_no: 7,
		title: 'Godville UI+: Решение бага с безумной пони',
		content: '<div style="text-align: justify;">&emsp;Рад сообщить, что баг с безумной пони был, наконец-то, окончательно починен. Прошу прощения за возможно причиненные неудобства. ' +
				 'Надеюсь, в будущем удастся избежать таких багов.</div>' +
				 '<div style="text-align: right;">Хорошего дня.<br>~~Бэдлак</div>'
	}
	/*{
		msg_no: 8, // 0..7 are used
		title: 'Godville UI+: Заголовок',
		content: '<div style="text-align: justify;">&emsp;Текст.</div>' +
				 '<div style="text-align: right;">Подпись.<br>~~Бэдлак</div>'
	}*/],
	en: [{
		msg_no: 0,
		title: 'Godville UI+ greeting message',
		get content() { return '<div>Greetings to a god' + (document.title.match('his') ? '' : 'dess') + ', using <b>Godville UI+</b> ' + (worker.GUIp_browser === 'Firefox' ? 'add-on' : 'extension') + '.</div>' +
			'<div style="text-align: justify; margin: 0.2em 0 0.3em;">&emsp;Please click <b>ui+ settings</b> button at the top of a page, or ' +
			'open <b>UI+ settings</b> tab in the hero <b>profile</b> and familiarize yourself with the settings available in this ' + (worker.GUIp_browser === 'Firefox' ? 'add-on' : 'extension') + ', if you haven\'t done so yet.<br>' +

			'&emsp;In respect to forum informers, by default you are only subscribed to the topic for this addon, and most likely you can see it <i>in the upper left corner</i> right now.<br>' +

			'&emsp;If you can\'t figure out some functions of the ' + (worker.GUIp_browser === 'Firefox' ? 'add-on' : 'extension') + ' - feel free to ask me (god <b>Bad&nbsp;Luck</b>) directly or in the forums.<br>' +

			'&emsp;Guides for handling errors can be found in the <i>help dialog</i> (which is open now), that can be shown or hidden by clicking <b style="text-decoration: underline;">ui+ help</b> in the top menu. ' +
			'Links to everything mentioned above can also be found there.<br>' +

			'<div style="text-align: right;">Enjoy the game!<br>~~Bad Luck</div>';
		},
		callback: function() {
			if (!ui_storage.get('helpDialogVisible')) {
				ui_help.toggleDialog();
			}
		}
	},
	{
		msg_no: 2,
		title: 'Godville UI+: Crazy pony bug fix',
		content: '<div style="text-align: justify;">&emsp;I\'m glad to inform you that the crazy pony bug is finally fixed. Sorry for inconvenience. ' +
				 'I hope that I\'ll be able to prevent such bugs in the future.</div>' +
				 '<div style="text-align: right;">Have a nice day.<br>~~Bad Luck</div>'
	}
	/*{
		msg_no: 3, // 0..2 are used
		title: 'Godville UI+: Title',
		content: '<div style="text-align: justify;">&emsp;Text.</div>' +
				 '<div style="text-align: right;">Signature.<br>~~Bad Luck</div>'
	}*/]
};
ui_utils.getNodeIndex = function(node) {
	var i = 0;
	while ((node = node.previousElementSibling)) {
		i++;
	}
	return i;
};
ui_utils.openChatWith = function(friend, e) {
	if (e) {
		e.preventDefault();
		e.stopPropagation();
	}
	var current, friends = document.querySelectorAll('.msgDockPopupW .frline');
	for (var i = 0, len = friends.length; i < len; i++) {
		current = friends[i].querySelector('.frname');
		if (current.textContent === friend) {
			current.click();
			break;
		}
	}
};
ui_utils.dateToMoscowTimeZone = function(date) {
	var temp = new Date(date);
	temp.setTime(temp.getTime() + (temp.getTimezoneOffset() + 180)*60*1000);
	return temp.getFullYear() + '/' +
		  (temp.getMonth() + 1 < 10 ? '0' : '') + (temp.getMonth() + 1) + '/' +
		  (temp.getDate() < 10 ? '0' : '') + temp.getDate();
};
ui_utils.setVoiceSubmitState = function(condition, disable) {
	if (!ui_data.isFight && condition) {
		var voice_submit = document.getElementById('voice_submit');
		if (disable) {
			voice_submit.setAttribute('disabled', 'disabled');
		} else {
			voice_submit.removeAttribute('disabled');
		}
		return true;
	}
	return false;
};
ui_utils.hideElem = function(elem, hide) {
	if (hide) {
		elem.classList.add('hidden');
	} else {
		elem.classList.remove('hidden');
	}
};
ui_utils._parseVersion = function(isNewestCallback, isNotNewestCallback, failCallback, xhr) {
	var match;
	if ((match = xhr.responseText.match(/Godville UI\+ (\d+\.\d+\.\d+\.\d+)/))) {
		var temp_cur = ui_data.currentVersion.split('.'),
			last_version = match[1],
			temp_last = last_version.split('.'),
			isNewest = +temp_cur[0] < +temp_last[0] ? false :
					   +temp_cur[0] > +temp_last[0] ? true :
					   +temp_cur[1] < +temp_last[1] ? false :
					   +temp_cur[1] > +temp_last[1] ? true :
					   +temp_cur[2] < +temp_last[2] ? false :
					   +temp_cur[2] > +temp_last[2] ? true :
					   +temp_cur[3] < +temp_last[3] ? false : true;
		worker.console.log(isNewest);
		if (isNewest) {
			if (isNewestCallback) {
				isNewestCallback();
			}
		} else if (isNotNewestCallback) {
			isNotNewestCallback();
		}
	} else if (failCallback) {
		failCallback();
	}
};
ui_utils.checkVersion = function(isNewestCallback, isNotNewestCallback, failCallback) {
	ui_utils.getXHR('/forums/show/' + (worker.GUIp_locale === 'ru' ? '2' : '1'), ui_utils._parseVersion.bind(null, isNewestCallback, isNotNewestCallback, failCallback), failCallback);
};

ui_utils.processError = function(error, isDebugMode) {
	if (isDebugMode) {
		worker.console.warn(worker.GUIp_i18n.debug_mode_warning);
	}
	var name_message = error.name + ': ' + error.message,
		stack = error.stack.replace(name_message, '').replace(/^\n|    at /g, '').replace(/(?:chrome-extension|@resource).*?:(\d+:\d+)/g, '@$1');
	worker.console.error('Godville UI+ error log:\n' +
						  name_message + '\n' +
						  worker.GUIp_i18n.error_message_stack_trace + ': ' + stack);
	if (!ui_utils.hasShownErrorMessage) {
		ui_utils.hasShownErrorMessage = true;
		ui_utils.showMessage('error', {
			title: worker.GUIp_i18n.error_message_title,
			content: (isDebugMode ? '<div><b class="debug_mode_warning">' + worker.GUIp_i18n.debug_mode_warning + '</b></div>' : '') +
					 '<div id="possible_actions">' +
						'<div>' + worker.GUIp_i18n.error_message_text + ' <b>' + name_message + '</b>.</div>' +
						'<div>' + worker.GUIp_i18n.possible_actions + '</div>' +
						'<ol>' +
							'<li>' + worker.GUIp_i18n.if_first_time + '<a id="press_here_to_reload">' + worker.GUIp_i18n.press_here_to_reload + '</a></li>' +
							'<li>' + worker.GUIp_i18n.if_repeats + '<a id="press_here_to_show_details">' + worker.GUIp_i18n.press_here_to_show_details + '</a></li>' +
						'</ol>' +
					 '</div>' +
					 '<div id="error_details" class="hidden">' +
						'<div>' + worker.GUIp_i18n.error_message_subtitle + '</div>' +
						'<div>' + worker.GUIp_i18n.browser + ' <b>' + worker.GUIp_browser + ' ' + navigator.userAgent.match(worker.GUIp_browser + '\/([\\d.]+)')[1] +'</b>.</div>' +
						'<div>' + worker.GUIp_i18n.version + ' <b>' + ui_data.currentVersion + '</b>.</div>' +
						'<div>' + worker.GUIp_i18n.error_message_text + ' <b>' + name_message + '</b>.</div>' +
						'<div>' + worker.GUIp_i18n.error_message_stack_trace + ': <b>' + stack.replace(/\n/g, '<br>') + '</b></div>' +
					 '</div>',
			callback: function() {
				document.getElementById('press_here_to_reload').onclick = location.reload.bind(location);
				document.getElementById('press_here_to_show_details').onclick = function() {
					ui_utils.hideElem(document.getElementById('possible_actions'), true);
					ui_utils.hideElem(document.getElementById('error_details'), false);
					if (!ui_storage.get('helpDialogVisible')) {
						ui_help.toggleDialog();
					}
				};
			}
		});
	}
};

ui_utils.informAboutOldVersion = function() {
	ui_utils.showMessage('update_required', {
		title: worker.GUIp_i18n.error_message_title,
		content: '<div>' + worker.GUIp_i18n.error_message_in_old_version + '</div>',
		callback: function() {
			if (!ui_storage.get('helpDialogVisible')) {
				ui_help.toggleDialog();
			}
		}
	});
};
