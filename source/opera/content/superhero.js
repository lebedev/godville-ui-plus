(function() {
'use strict';

var worker = window.wrappedJSObject || window;

if (window.wrappedJSObject) {
	worker.GUIp = createObjectIn(worker);
} else {
	worker.GUIp = {};
}
// ui_data
var ui_data = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "data"}) : worker.GUIp.data = {};

// base variables initialization
ui_data.init = function() {
	ui_data._initVariables();
	ui_data._initForumData();
	ui_data._clearOldDungeonData();

	// init mobile cookies
	worker.document.cookie = 'm_f=1';
	worker.document.cookie = 'm_pp=1';
	worker.document.cookie = 'm_fl=1';

	ui_data._getLEMRestrictions();
	worker.setInterval(ui_data._getLEMRestrictions, 60*60*1000);

	ui_data._getWantedMonster();
	worker.setInterval(ui_data._getWantedMonster, 5*60*1000);
};
ui_data._initVariables = function() {
	this.currentVersion = '0.26.119.6';
	this.isFight = worker.so.state.is_fighting();
	this.isDungeon = worker.so.state.fight_type() === 'dungeon';
	this.god_name = worker.so.state.stats.godname.value;
	this.char_name = worker.so.state.stats.name.value;
	this.char_sex = worker.so.state.stats.gender.value === 'male' ? worker.GUIp_i18n.hero : worker.GUIp_i18n.heroine;
	ui_storage.set('ui_s', '');
	worker.localStorage.GUIp_CurrentUser = this.god_name;
	if (worker.so.state.bricks_cnt() === 1000) {
		document.body.classList.add('has_temple');
		this.hasTemple = true;
	}
};
ui_data._initForumData = function() {
	if (!ui_storage.get('Forum1')) {
		ui_storage.set('Forum1', '{}');
		ui_storage.set('Forum2', '{}');
		ui_storage.set('Forum3', '{}');
		ui_storage.set('Forum4', '{}');
		ui_storage.set('ForumInformers', '{}');

		if (worker.GUIp_locale === 'ru') {
			ui_storage.set('Forum2', '{"2812": 0}');
			ui_storage.set('Forum5', '{}');
			ui_storage.set('Forum6', '{}');

			// clear old data
			worker.localStorage.removeItem('GUIp_' + this.god_name + ':posts');
			worker.localStorage.removeItem('GUIp_Options:User');
			var informer_flags = ui_storage.get('informer_flags') && JSON.parse(ui_storage.get('informer_flags')) || null;
			if (informer_flags) {
				delete informer_flags['new posts'];
				ui_storage.set('informer_flags', JSON.stringify(informer_flags));
			}
		} else {
			ui_storage.set('Forum1', '{"2800": 0}');
		}
	}
};
ui_data._clearOldDungeonData = function() {
	if (!this.isFight && !this.isDungeon) {
		for (var i = 0, lines = [], len = worker.localStorage.length; i < len; i++) {
			if (worker.localStorage.key(i).match(/Dungeon:/)) {
				lines.push(worker.localStorage.key(i));
			}
		}
		for (i = 0, len = lines.length; i < len; i++) {
			worker.localStorage.removeItem(lines[i]);
		}
	}
};
ui_data._getLEMRestrictions = function() {
	if (isNaN(ui_storage.get('LEMRestrictions:Date')) || Date.now() - ui_storage.get('LEMRestrictions:Date') > 24*60*60*1000) {
		ui_utils.getXHR('http://www.godalert.info/Dungeons/guip.cgi', ui_data._parseLEMRestrictions);
	}
};
ui_data._parseLEMRestrictions = function(xhr) {
	var restrictions = JSON.parse(xhr.responseText);
	ui_storage.set('LEMRestrictions:Date', Date.now());
	ui_storage.set('LEMRestrictions:FirstRequest', restrictions.first_request);
	ui_storage.set('LEMRestrictions:TimeFrame', restrictions.time_frame);
	ui_storage.set('LEMRestrictions:RequestLimit', restrictions.request_limit);
};
ui_data._getWantedMonster = function() {
	if (isNaN(ui_storage.get('WantedMonster:Date')) ||
		ui_utils.dateToMoscowTimeZone(+ui_storage.get('WantedMonster:Date')) < ui_utils.dateToMoscowTimeZone(Date.now())) {
		ui_utils.getXHR('/news', ui_data._parseWantedMonster);
	} else {
		ui_improver.wantedMonsters = new worker.RegExp(ui_storage.get('WantedMonster:Value'));
	}
};
ui_data._parseWantedMonster = function(xhr) {
	var temp = xhr.responseText.match(/(?:Разыскиваются|Wanted)[\s\S]+?>([^<]+?)<\/a>[\s\S]+?>([^<]+?)<\/a>/),
		newWantedMonster = temp ? temp[1] + '|' + temp[2] : '';
	if (newWantedMonster !== ui_storage.get('WantedMonster:Value')) {
		ui_storage.set('WantedMonster:Date', Date.now());
		ui_storage.set('WantedMonster:Value', newWantedMonster);
		ui_improver.wantedMonsters = new worker.RegExp(newWantedMonster);
	}
};
// ui_utils
var ui_utils = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "utils"}) : worker.GUIp.utils = {};

ui_utils.hasShownErrorMessage = false;
ui_utils.hasShownInfoMessage = false;
// base phrase say algorythm
ui_utils.sayToHero = function(phrase) {
	worker.$('#god_phrase').val(phrase).change();
};
// checks if $elem already improved
ui_utils.isAlreadyImproved = function($elem) {
	if ($elem.hasClass('improved')) { return true; }
	$elem.addClass('improved');
	return false;
};
// finds a label with given name
ui_utils.findLabel = function($base_elem, label_name) {
	return worker.$('.l_capt', $base_elem).filter(function(index) {
		return worker.$(this).text() === label_name;
	});
};
// finds a label with given name and appends given elem after it
ui_utils.addAfterLabel = function($base_elem, label_name, $elem) {
	ui_utils.findLabel($base_elem, label_name).after($elem.addClass('voice_generator').addClass(ui_data.isDungeon ? 'dungeon' : ui_data.isFight ? 'battle' : 'field'));
};
// generic voice generator
ui_utils.getGenSayButton = function(title, section, hint) {
	return worker.$('<a title="' + hint + '">' + title + '</a>').click(function() {
		ui_utils.sayToHero(ui_words.longPhrase(section));
		ui_words.currentPhrase = "";
		return false;
	});
};
// Хелпер объединяет addAfterLabel и getGenSayButton
// + берет фразы из words['phrases']
ui_utils.addSayPhraseAfterLabel = function($base_elem, label_name, btn_name, section, hint) {
	ui_utils.addAfterLabel($base_elem, label_name, ui_utils.getGenSayButton(btn_name, section, hint));
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
		ui_utils.sayToHero(ui_words.inspectPhrase(item_name));
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
		ui_utils.sayToHero(ui_words.craftPhrase(items));
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
	var id = 'msg' + msg_no,
		$msg = worker.$('<div id="' + id + '" class="hint_bar ui_msg">'+
					'<div class="hint_bar_capt"><b>' + msg.title + '</b></div>'+
					'<div class="hint_bar_content">' + msg.content + '</div>'+
					'<div class="hint_bar_close"><a id="' + id + '_close">' + worker.GUIp_i18n.close + '</a></div>' +
				 '</div>').insertAfter(worker.$('#menu_bar'));
	worker.$('#' + id + '_close').click(function() {
		worker.$('#' + id).fadeToggle(function() {
			worker.$('#' + id).remove();
			if (!isNaN(msg_no)) {
				ui_storage.set('lastShownMessage', msg_no);
			}
		});
		return false;
	});

	worker.setTimeout(function() {
		$msg.fadeToggle(1500, msg.callback);
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
	}
	/*{
		msg_no: 7, // 0..6 are used
		title: 'Godville UI+: Заголовок',
		content: '<div style="text-align: justify;">&emsp;Текст.</div>'+
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
		msg_no: 1,
		title: 'Godville UI+: New functionality!',
		content: '<div style="text-align: justify;">&emsp;I\'ve enabled dungeon functionality and gold-to-exp conversion penalty timer.<br>' +
				 'Tell me if there are any issues with that.</div>'+
				 '<div style="text-align: right;">Have fun!<br>~~Bad Luck</div>'
	}
	/*{
		msg_no: 2, // 0..1 are used
		title: 'Godville UI+: Заголовок',
		content: '<div style="text-align: justify;">&emsp;Текст.</div>'+
				 '<div style="text-align: right;">Подпись.<br>~~Бэдлак</div>'
	}*/]
};
ui_utils.getNodeIndex = function(node) {
	var i = 0;
	while ((node = node.previousElementSibling)) {
		i++;
	}
	return i;
};
ui_utils.openChatWith = function(friend) {
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
// ui_timeout
var ui_timeout = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "timeout"}) : worker.GUIp.timeout = {};

ui_timeout.bar = null;
ui_timeout.timeout = 0;
ui_timeout._finishtDate = 0;
ui_timeout._tickInt = 0;
ui_timeout._tick = function() {
	if (Date.now() > this._finishDate) {
		worker.clearInterval(this._tickInt);
		if (this.bar.style.transitionDuration) {
			this.bar.style.transitionDuration = '';
		}
		this.bar.classList.remove('running');
		ui_utils.setVoiceSubmitState(!(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) || document.querySelector('#god_phrase').value, false);
	}
};
// creates timeout bar element
ui_timeout.create = function() {
	this.bar = document.createElement('div');
	this.bar.id = 'timeout_bar';
	document.body.insertBefore(this.bar, document.body.firstChild);
};
// starts timeout bar
ui_timeout.start = function() {
	worker.clearInterval(this._tickInt);
	this.bar.style.transitionDuration = '';
	this.bar.classList.remove('running');
	worker.setTimeout(ui_timeout._delayedStart, 10);
	this._finishtDate = Date.now() + this.timeout*1000;
	this._tickInt = worker.setInterval(ui_timeout._tick.bind(this), 100);
	ui_utils.setVoiceSubmitState(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice'), true);
};
ui_timeout._delayedStart = function() {
	var customTimeout = ui_storage.get('Option:voiceTimeout');
	if (!isNaN(customTimeout)) {
		ui_timeout.timeout = customTimeout;
		ui_timeout.bar.style.transitionDuration = customTimeout + 's';
	} else {
		ui_timeout.timeout = 30;
	}
	ui_timeout.bar.classList.add('running');
};

// ui_help
var ui_help = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "help"}) : worker.GUIp.help = {};

ui_help.init = function() {
	ui_help._createHelpDialog();
	ui_help._createButtons();
};
// creates ui dialog
ui_help._createHelpDialog = function() {
	document.getElementById('menu_bar').insertAdjacentHTML('afterend',
		'<div id="ui_help" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' +
		'<div class="hint_bar_capt"><b>Godville UI+ (v' + ui_data.currentVersion + ')</b>, ' + worker.GUIp_i18n.if_something_wrong_capt + '...</div>' +
		'<div class="hint_bar_content" style="padding: 0.5em 0.8em;">'+
			'<div style="text-align: left;">' +
				'<div>' + worker.GUIp_i18n.if_something_wrong + '</div>' +
				'<ol>' +
					'<li>' + worker.GUIp_i18n.help_refresh + '</li>' +
					'<li><div id="check_version" class="div_link" style="display: inline;">' + worker.GUIp_i18n.help_check_version + '</div></li>' +
					'<li class="update_required Chrome hidden">' + worker.GUIp_i18n.help_update_chrome_1 + '</li>' +
					'<li class="update_required Chrome hidden">' + worker.GUIp_i18n.help_update_chrome_2 + '</li>' +
					'<li class="update_required Firefox hidden">' + worker.GUIp_i18n.help_update_firefox_1 + '</li>' +
					'<li class="update_required Firefox hidden">' + worker.GUIp_i18n.help_update_firefox_2 + '</li>' +
					'<li class="update_required Chrome Firefox hidden">' + worker.GUIp_i18n.help_back_to_step_1 + '</li>' +
					'<li class="console Chrome Firefox hidden">' + worker.GUIp_i18n.help_console_1 + '</li>' +
					'<li class="console Chrome Firefox hidden">' + worker.GUIp_i18n.help_console_2 + '</li>' +
					'<li class="console Chrome Firefox hidden">' + worker.GUIp_i18n.help_console_3 + '</li>' +
				'</ol>' +
				'<div>' + worker.GUIp_i18n.help_useful_links + '</div>' +
			'</div>' +
		'</div>' +
		'<div class="hint_bar_close"></div></div>'
	);

	document.getElementById('check_version').onclick = function() {
		this.textContent = worker.GUIp_i18n.getting_version_no;
		this.classList.remove('div_link');
		ui_utils.getXHR('/forums/show/' + (worker.GUIp_locale === 'ru' ? '2' : '1'), ui_help.onXHRSuccess, ui_help.onXHRFail);
		return false;
	};

	if (ui_storage.get('helpDialogVisible')) { worker.$('#ui_help').show(); }
};
ui_help._createButtons = function() {
	var menu_bar = document.querySelector('#menu_bar ul');
	menu_bar.insertAdjacentHTML('beforeend', '<li> | </li><a href="user/profile#ui_options">' + worker.GUIp_i18n.ui_settings_top_menu + '</a><li> | </li>');
	ui_help._addToggleButton(menu_bar, '<strong>' + worker.GUIp_i18n.ui_help + '</strong>');
	if (ui_storage.get('Option:enableDebugMode')) {
		ui_help._addDumpButton('<span>dump: </span>', 'all');
		ui_help._addDumpButton('<span>, </span>', 'options', 'Option');
		ui_help._addDumpButton('<span>, </span>', 'stats', 'Stats');
		ui_help._addDumpButton('<span>, </span>', 'logger', 'Logger');
		ui_help._addDumpButton('<span>, </span>', 'forum', 'Forum');
		ui_help._addDumpButton('<span>, </span>', 'log', 'Log:');
	}
	ui_help._addToggleButton(document.getElementsByClassName('hint_bar_close')[0], worker.GUIp_i18n.close);
};
// gets toggle button
ui_help._addToggleButton = function(elem, text) {
	elem.insertAdjacentHTML('beforeend', '<a class="close_button">' + text + '</a>');
	elem.getElementsByClassName('close_button')[0].onclick = function() {
		ui_help.toggleDialog();
		return false;
	};
};
// gets fump button with a given label and selector
ui_help._addDumpButton = function(text, label, selector) {
	var hint_bar_content = document.getElementsByClassName('hint_bar_content')[0];
	hint_bar_content.insertAdjacentHTML('beforeend', text + '<a class="devel_link" id="dump_' + label + '">' + label + '</a>');
	document.getElementById('dump_' + label).onclick = function() {
		ui_storage.dump(selector);
	};
};
ui_help.onXHRSuccess = function(xhr) {
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
		worker.$('#check_version')[0].innerHTML = (isNewest ? worker.GUIp_i18n.is_last_version : worker.GUIp_i18n.is_not_last_version_1 + last_version + worker.GUIp_i18n.is_not_last_version_2) + worker.GUIp_i18n.proceed_to_next_step;
		if (!isNewest) {
			worker.$('#ui_help ol li.update_required.' + worker.GUIp_browser).removeClass('hidden');
		} else {
			worker.$('#ui_help ol li.console.' + worker.GUIp_browser).removeClass('hidden');
		}
	} else {
		ui_help.onXHRFail();
	}
};
ui_help.onXHRFail = function() {
	worker.$('#check_version')[0].textContent = worker.GUIp_i18n.getting_version_failed;
	worker.$('#ui_help ol li.' + worker.GUIp_browser).removeClass('hidden');
};
ui_help.toggleDialog = function(visible) {
	ui_storage.set('helpDialogVisible', !ui_storage.get('helpDialogVisible'));
	worker.$('#ui_help').slideToggle("slow");
};

// ui_storage
var ui_storage = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "storage"}) : worker.GUIp.storage = {};

ui_storage._get_key = function(key) {
	return 'GUIp_' + ui_data.god_name + ':' + key;
};
// gets diff with a value
ui_storage._diff = function(id, value) {
	var diff = null;
	var old = ui_storage.get(id);
	if (old !== null) {
		diff = value - old;
	}
	return diff;
};
// stores a value
ui_storage.set = function(id, value) {
	worker.localStorage[ui_storage._get_key(id)] = value;
	return value;
};
// reads a value
ui_storage.get = function(id) {
	var val = worker.localStorage[ui_storage._get_key(id)];
	if (val === 'true') { return true; }
	if (val === 'false') { return false; }
	return val;
};
// stores value and gets diff with old
ui_storage.set_with_diff = function(id, value) {
	var diff = ui_storage._diff(id, value);
	ui_storage.set(id, value);
	return diff;
};
// dumps all values related to current god_name
ui_storage.dump = function(selector) {
	var lines = [];
	var r = new worker.RegExp('^GUIp_' + (selector === undefined ? '' : (ui_data.god_name + ':' + selector)));
	for (var i = 0; i < worker.localStorage.length; i++) {
		if (worker.localStorage.key(i).match(r)) {
			lines.push(worker.localStorage.key(i) + ' = ' + worker.localStorage[worker.localStorage.key(i)]);
		}
	}
	lines.sort();
	worker.console.info('Godville UI+ log: Storage:\n' + lines.join('\n'));
};
// resets saved options
ui_storage.clear = function(what) {
	if (!what || !what.match(/^(?:GUIp|Godville|All)$/)) {
		if (worker.GUIp_locale === 'ru') {
			worker.console.log('Godville UI+: использование storage.clear:\n' +
							   'storage.clear("GUIp") для удаление только настроек Godville UI+\n' +
							   'storage.clear("Godville") для удаления настроек Годвилля, сохранив настройки Godville UI+\n' +
							   'storage.clear("All") для удаления всех настроек');
		} else {
			worker.console.log('Godville UI+: storage.clean usage:\n' +
							   'storage.clear("GUIp") to remove Godville UI+ setting only\n' +
							   'storage.clear("Godville") to remove Godville setting and keep Godville UI+ settings\n' +
							   'storage.clear("All") to remove all setting');
		}
		return;
	}
	var i, len, key, keys = [];
	for (i = 0, len = worker.localStorage.length; i < len; i++) {
		key = worker.localStorage.key(i);
		if (what === 'GUIp' && key.match(/^GUIp_/) ||
			what === 'Godville' && !key.match(/^GUIp_/) ||
			what === 'All') {
			keys.push(key);
		}
	}
	for (i = 0, len = keys.length; i < len; i++) {
		worker.localStorage.removeItem(keys[i]);
	}
	location.reload();
};
ui_storage._rename = function(from, to) {
	for (i = 0, len = worker.localStorage.length, keys = []; i < len; i++) {
		if (worker.localStorage.key(i).match(from)) {
			keys.push(worker.localStorage.key(i));
		}
	}
	for (i = 0, len = keys.length; i < len; i++) {
		worker.localStorage[keys[i].replace(from, to)] = worker.localStorage[keys[i]];
		worker.localStorage.removeItem(keys[i]);
	}
};
ui_storage._rename_nesw = function(from, to) {
	if (ui_storage.get('phrases_walk_' + from)) {
		ui_storage.set('CustomPhrases:go_' + to, ui_storage.get('phrases_walk_' + from));
		worker.localStorage.removeItem(ui_storage._get_key('phrases_walk_' + from));
	}
};
ui_storage.migrate = function() {
	var i, len, keys = [];
	if (!worker.localStorage.GUIp_migrated) {
		ui_storage._rename(/^GM/, 'GUIp_');
		worker.localStorage.GUIp_migrated = '151114';
	}
	if (worker.localStorage.GUIp_migrated === '151114' || worker.localStorage.GUIp_migrated < '150113') {
		ui_storage._rename_nesw('n', 'north');
		ui_storage._rename_nesw('e', 'east');
		ui_storage._rename_nesw('s', 'south');
		ui_storage._rename_nesw('w', 'west');
		ui_storage._rename(/:phrases_/, ':CustomPhrases:');
		worker.localStorage.GUIp_migrated = '150113';
	}
};

// ui_words
var ui_words = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "words"}) : worker.GUIp.words = {};

ui_words.currentPhrase = '';
// gets words from phrases.js file and splits them into sections
ui_words.init = function() {
	this.base = worker.GUIp_words();
	for (var sect in this.base.phrases) {
		var text = ui_storage.get('CustomPhrases:' + sect);
		if (text && text !== "") {
			this.base.phrases[sect] = text.split("||");
		}
	}
};
ui_words._changeFirstLetter = function(text) {
	return text.charAt(0).toLowerCase() + text.slice(1);
};
ui_words._addHeroName = function(text) {
	if (!ui_storage.get('Option:useHeroName')) { return text; }
	return ui_data.char_name + ', ' + ui_words._changeFirstLetter(text);
};
ui_words._addExclamation = function(text) {
	if (!ui_storage.get('Option:useExclamations')) { return text; }
	return ui_utils.getRandomItem(this.base.phrases.exclamation) + ', ' + ui_words._changeFirstLetter(text);
};
// single phrase gen
ui_words._randomPhrase = function(sect) {
	return ui_utils.getRandomItem(this.base.phrases[sect]);
};
ui_words._longPhrase_recursion = function(source, len) {
	while (source.length) {
		var next = ui_utils.popRandomItem(source);
		var remainder = len - next.length - 2; // 2 for ', '
		if (remainder > 0) {
			return [next].concat(ui_words._longPhrase_recursion(source, remainder));
		}
	}
	return [];
};
// main phrase constructor
ui_words.longPhrase = function(sect, item_name, len) {
	if (ui_storage.get('phrasesChanged')) {
		ui_words.init();
		ui_storage.set('phrasesChanged', 'false');
	}
	var prefix = ui_words._addHeroName(ui_words._addExclamation(''));
	var phrases;
	if (item_name) {
		phrases = [ui_words._randomPhrase(sect) + ' ' + item_name + '!'];
	} else if (ui_storage.get('Option:useShortPhrases') || sect.match(/go_/)) {
		phrases = [ui_words._randomPhrase(sect)];
	} else {
		phrases = ui_words._longPhrase_recursion(this.base.phrases[sect].slice(), (len || 100) - prefix.length);
	}
	this.currentPhrase = prefix ? prefix + ui_words._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
	return this.currentPhrase;
};
// inspect button phrase gen
ui_words.inspectPhrase = function(item_name) {
	return ui_words.longPhrase('inspect_prefix', item_name);
};
// craft button phrase gen
ui_words.craftPhrase = function(items) {
	return ui_words.longPhrase('craft_prefix', items);
};
// Checkers
ui_words.usableItemType = function(desc) {
	return this.base.usable_items.descriptions.indexOf(desc);
};
ui_words.isHealItem = function(item) {
	return item.style.fontStyle === "italic";
};
ui_words.isUsableItem = function(item) {
	return item.textContent.match(/\(@\)/);
};
ui_words.isBoldItem = function(item) {
	return item.style.fontWeight === 700 || item.style.fontWeight === "bold";
};

// ui_stats
var ui_stats = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "stats"}) : worker.GUIp.stats = {};

ui_stats.get = function(key) {
	return ui_storage.get('Stats:' + key);
};
ui_stats.set = function(key, value) {
	return ui_storage.set('Stats:' + key, value);
};
ui_stats.setFromProgressBar = function(id, $elem) {
	var value = $elem.attr('title').replace(/[^0-9]/g, '');
	return ui_stats.set(id, value);
};
ui_stats.setFromLabelCounter = function(id, $container, label, parser) {
	parser = parser || parseInt;
	var $label = ui_utils.findLabel($container, label);
	var $field = $label.siblings('.l_val');
	var value = parser($field.text());
	if (id === 'Bricks' || id === 'Logs') { return ui_stats.set(id, Math.floor(value*10 + 0.5)); }
	else { return ui_stats.set(id, value); }
};
// ui_logger
var ui_logger = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "logger"}) : worker.GUIp.logger = {};

ui_logger.create = function() {
	this.updating = false;
	this.bar = worker.$('<ul id="logger" style="mask: url(#fader_masking);"/>');
	worker.$('#menu_bar').after(this.bar);
	this.need_separator = false;
	this.dungeonWatchers = [
		['Map_HP', 'hp', worker.GUIp_i18n.hero_health, 'hp'],
		['Map_Inv', 'inv', worker.GUIp_i18n.inventory, 'inv'],
		['Map_Gold', 'gld', worker.GUIp_i18n.gold, 'gold'],
		['Map_Charges', 'ch', worker.GUIp_i18n.charges, 'charges'],
		['Map_Alls_HP', 'a:hp', worker.GUIp_i18n.allies_health, 'allies']
	];
	this.battleWatchers = [
		['Hero_HP', 'h:hp', worker.GUIp_i18n.hero_health, 'hp'],
		['Enemy_HP', 'e:hp', worker.GUIp_i18n.enemy_health, 'death'],
		['Hero_Alls_HP', 'a:hp', worker.GUIp_i18n.allies_health, 'allies'],
		['Hero_Inv', 'h:inv', worker.GUIp_i18n.inventory, 'inv'],
		['Hero_Gold', 'h:gld', worker.GUIp_i18n.gold, 'gold'],
		['Hero_Charges', 'ch', worker.GUIp_i18n.charges, 'charges'],
		['Enemy_Gold', 'e:gld', worker.GUIp_i18n.gold, 'monster'],
		['Enemy_Inv', 'e:inv', worker.GUIp_i18n.inventory, 'monster']
	];
	this.fieldWatchers = [
		['Exp', 'exp', worker.GUIp_i18n.exp],
		['Level', 'lvl', worker.GUIp_i18n.level],
		['HP', 'hp', worker.GUIp_i18n.health],
		['Godpower', 'gp', worker.GUIp_i18n.godpower],
		['Charges', 'ch', worker.GUIp_i18n.charges],
		['Task', 'tsk', worker.GUIp_i18n.task],
		['Monster', 'mns', worker.GUIp_i18n.monsters],
		['Inv', 'inv', worker.GUIp_i18n.inventory],
		['Gold', 'gld', worker.GUIp_i18n.gold],
		['Bricks', 'br', worker.GUIp_i18n.bricks],
		['Logs', 'wd', worker.GUIp_i18n.logs],
		['Savings', 'rtr', worker.GUIp_i18n.savings],
		['Equip1', 'eq1', worker.GUIp_i18n.weapon, 'equip'],
		['Equip2', 'eq2', worker.GUIp_i18n.shield, 'equip'],
		['Equip3', 'eq3', worker.GUIp_i18n.head, 'equip'],
		['Equip4', 'eq4', worker.GUIp_i18n.body, 'equip'],
		['Equip5', 'eq5', worker.GUIp_i18n.arms, 'equip'],
		['Equip6', 'eq6', worker.GUIp_i18n.legs, 'equip'],
		['Equip7', 'eq7', worker.GUIp_i18n.talisman, 'equip'],
		['Death', 'death', worker.GUIp_i18n.death_count],
		['Pet_Level', 'pet_level', worker.GUIp_i18n.pet_level, 'monster']
	];
};
ui_logger._appendStr = function(id, klass, str, descr) {
	// append separator if needed
	if (this.need_separator) {
		this.need_separator = false;
		if (this.bar.children().length > 0) {
			this.bar.append('<li class="separator">|</li>');
		}
	}
	// append string
	this.bar.append('<li class="' + klass + '" title="' + descr + '">' + str + '</li>');
	this.bar.scrollLeft(10000); //Dirty fix
	while (worker.$('#logger li').position().left + worker.$('#logger li').width() < 0 || worker.$('#logger li')[0].className === "separator") {
		worker.$('#logger li:first').remove();
	}
};
ui_logger._watchStatsValue = function(id, name, descr, klass) {
	klass = (klass || id).toLowerCase();
	var s, diff = ui_storage.set_with_diff('Logger:' + id, ui_stats.get(id));
	if (diff) {
		// Если нужно, то преобразовываем в число с одним знаком после запятой
		if (parseInt(diff) !== diff) { diff = diff.toFixed(1); }
		// Добавление плюcа, минуса или стрелочки
		if (diff < 0) {
			if (name === 'exp' && ui_storage.get('Logger:Level') !== worker.$('#hk_level .l_val').text()) {
				s = '→' + ui_stats.get(id);
			} else if (name === 'tsk' && ui_storage.get('Stats:Task_Name') !== worker.$('.q_name').text()) {
				ui_storage.set('Stats:Task_Name', worker.$('.q_name').text());
				s = '→' + ui_stats.get(id);
			} else {
				s = diff;
			}
		} else {
			s = '+' + diff;
		}
		ui_logger._appendStr(id, klass, name + s, descr);
	}
};
ui_logger._updateWatchers = function(watchersList) {
	for (var i = 0, len = watchersList.length; i < len; i++) {
		ui_logger._watchStatsValue.apply(this, watchersList[i]);
	}
};
ui_logger.update = function() {
	if (ui_storage.get('Option:disableLogger')) {
		this.bar.hide();
		return;
	} else {
		this.bar.show();
	}
	if (ui_data.isDungeon) {
		ui_logger._updateWatchers(this.dungeonWatchers);
	} else if (ui_data.isFight) {
		ui_logger._updateWatchers(this.battleWatchers);
	} else {
		ui_logger._updateWatchers(this.fieldWatchers);
	}
	this.need_separator = true;
};

// ui_informer
var ui_informer = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "informer"}) : worker.GUIp.informer = {};

ui_informer.init = function() {
	//title saver
	this.title = document.title;
	// container
	document.getElementById('main_wrapper').insertAdjacentHTML('afterbegin', '<div id="informer_bar" />');
	this.container = document.getElementById('informer_bar');
	// load and draw labels
	ui_informer._load();
	for (var flag in this.flags) {
		if (this.flags[flag]) {
			ui_informer._create_label(flag);
		}
	}
	// run flicker
	ui_informer._tick();
};
ui_informer._load = function() {
	var fl = ui_storage.get('informer_flags');
	if (!fl || fl === "") { fl = '{}'; }
	this.flags = JSON.parse(fl);
};
ui_informer._save = function() {
	ui_storage.set('informer_flags', JSON.stringify(this.flags));
};
ui_informer._create_label = function(flag) {
	var id = flag.replace(/ /g, '_');
	this.container.insertAdjacentHTML('beforeend', '<div id="' + id + '">' + flag + '</div>');
	document.getElementById(id).onclick = function() {
		ui_informer.hide(flag);
		return false;
	};
};
ui_informer._delete_label = function(flag) {
	var label = document.getElementById(flag.replace(/ /g, '_'));
	if (label) {
		this.container.removeChild(label);
	}
};
ui_informer._tick = function() {
	// пройти по всем флагам и выбрать те, которые надо показывать
	var to_show = [];
	for (var flag in this.flags) {
		if (this.flags[flag]) {
			to_show.push(flag);
		}
	}
	to_show.sort();

	// если есть чё, показать или вернуть стандартный заголовок
	if (to_show.length > 0) {
		ui_informer._update_title(to_show);
		this.tref = worker.setTimeout(ui_informer._tick.bind(ui_informer), 700);
	} else {
		ui_informer.clearTitle();
		this.tref = undefined;
	}
};
ui_informer.clearTitle = function() {
	var forbidden_title_notices = ui_storage.get('Option:forbiddenTitleNotices') || '';
	var titleNotices = (!forbidden_title_notices.match('pm') ? ui_informer._getPMTitleNotice() : '') +
					   (!forbidden_title_notices.match('gm') ? ui_informer._getGMTitleNotice() : '') +
					   (!forbidden_title_notices.match('fi') ? ui_informer._getFITitleNotice() : '');
	document.title = (titleNotices ? titleNotices + ' ' : '') + this.title;
	document.head.removeChild(document.querySelector('link[rel="shortcut icon"]'));
	document.head.insertAdjacentHTML('beforeend', '<link rel="shortcut icon" href="images/favicon.ico" />');
};
ui_informer._getPMTitleNotice = function() {
	var pm = 0,
		pm_badge = document.querySelector('.fr_new_badge_pos');
	if (pm_badge && pm_badge.style.display !== 'none') {
		pm = +pm_badge.textContent;
	}
	var stars = document.querySelectorAll('.msgDock .fr_new_msg');
	for (var i = 0, len = stars.length; i < len; i++) {
		if (!stars[i].parentNode.getElementsByClassName('dockfrname')[0].textContent.match(/Гильдсовет|Guild Council/)) {
			pm++;
		}
	}
	return pm ? '[' + pm + ']' : '';
};
ui_informer._getGMTitleNotice = function() {
	return document.getElementsByClassName('gc_new_badge')[0].style.display !== 'none' ? '[g]' : '';
};
ui_informer._getFITitleNotice = function() {
	return document.querySelector('#forum_informer_bar a') ? '[f]' : '';
};
ui_informer._update_title = function(arr) {
	this.odd_tick = !this.odd_tick;
	var sep, favicon;
	if (this.odd_tick) {
		sep = '...';
		favicon = 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=';
	} else {
		sep = '!!!';
		favicon = "images/favicon.ico";
	}
	document.title = sep + ' ' + arr.join('! ') + ' ' + sep;
	worker.$('link[rel="shortcut icon"]').remove();
	worker.$('head').append('<link rel="shortcut icon" href=' + favicon + ' />');
};
ui_informer.update = function(flag, value) {
	if (value && (flag === 'pvp' || !(ui_data.isFight && !ui_data.isDungeon)) && !(ui_storage.get('Option:forbiddenInformers') &&
		ui_storage.get('Option:forbiddenInformers').match(flag.replace(/ /g, '_')))) {
		if (!(flag in this.flags)) {
			this.flags[flag] = true;
			ui_informer._create_label(flag);
			ui_informer._save();
		}
	} else if (flag in this.flags) {
		delete this.flags[flag];
		ui_informer._delete_label(flag);
		ui_informer._save();
	}
	if (!this.tref) {
		ui_informer._tick();
	}
};
ui_informer.hide = function(flag) {
	this.flags[flag] = false;
	ui_informer._delete_label(flag);
	ui_informer._save();
};

// ui_forum
var ui_forum = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "forum"}) : worker.GUIp.forum = {};

ui_forum.init = function() {
	document.body.insertAdjacentHTML('afterbegin', '<div id="forum_informer_bar" />');
	ui_forum._check();
	worker.setInterval(ui_forum._check.bind(ui_forum), 5*60*1000);
};
ui_forum._check = function() {
	for (var forum_no = 1; forum_no <= (worker.GUIp_locale === 'ru' ? 6 : 4); forum_no++) {
		var current_forum = JSON.parse(ui_storage.get('Forum' + forum_no)),
			topics = [];
		for (var topic in current_forum) {
			// to prevent simultaneous ForumInformers access
			worker.setTimeout(ui_utils.getXHR.bind(ui_forum, '/forums/show/' + forum_no, ui_forum._parse.bind(ui_forum), undefined, forum_no), 500*forum_no);
			break;
		}
	}
};
ui_forum._process = function(forum_no) {
	var informers = JSON.parse(ui_storage.get('ForumInformers')),
		topics = JSON.parse(ui_storage.get('Forum' + forum_no));
	for (var topic in topics) {
		if (informers[topic]) {
			ui_forum._set_informer(topic, informers[topic], topics[topic]);
		}
	}
};
ui_forum._set_informer = function(topic_no, topic_data, posts_count) {
	var informer = document.getElementById('topic' + topic_no);
	if (!informer) {
		document.getElementById('forum_informer_bar').insertAdjacentHTML('beforeend',
			'<a id="topic' + topic_no + '" target="_blank"><span></span><div class="fr_new_badge"></div></a>'
		);
		informer = document.getElementById('topic' + topic_no);
		informer.onclick = function(e) {
			if (e.which === 1) {
				e.preventDefault();
			}
		};
		informer.onmouseup = function(e) {
			if (e.which === 1 || e.which === 2) {
				var informers = JSON.parse(ui_storage.get('ForumInformers'));
				delete informers[this.id.match(/\d+/)[0]];
				ui_storage.set('ForumInformers', JSON.stringify(informers));
				worker.$(this).slideToggle("fast", function() {
					if (this.parentElement) {
						this.parentElement.removeChild(this);
						ui_informer.clearTitle();
					}
				});
			}
		};
	}
	var page = Math.floor((posts_count - topic_data.diff)/25) + 1;
	informer.href = '/forums/show_topic/' + topic_no + '?page=' + page + '#guip_' + (posts_count - topic_data.diff + 25 - page*25);
	informer.style.paddingRight = (16 + String(topic_data.diff).length*6) + 'px';
	informer.getElementsByTagName('span')[0].textContent = topic_data.name;
	informer.getElementsByTagName('div')[0].textContent = topic_data.diff;
};
ui_forum._parse = function(xhr) {
	var diff, temp, old_diff,
		forum = JSON.parse(ui_storage.get('Forum' + xhr.extra_arg)),
		informers = JSON.parse(ui_storage.get('ForumInformers')),
		topics = [];
	for (var topic in forum) {
		topics.push(topic);
	}
	for (var i = 0, len = topics.length; i < len; i++) {
		temp = xhr.responseText.match(new worker.RegExp("show_topic\\/" + topics[i] + "[^\\d>]+>([^<]+)(?:.*?\\n*?)*?<td class=\"ca inv stat\">(\\d+)<\\/td>(?:.*?\\n*?)*?<strong class=\"fn\">([^<]+)<\\/strong>(?:.*?\\n*?)*?show_topic\\/" + topics[i]));
		if (temp) {
			diff = +temp[2] - forum[topics[i]];
			if (diff) {
				forum[topics[i]] = +temp[2];
				if (diff > 0) {
					if (temp[3] !== ui_data.god_name) {
						old_diff = informers[topics[i]] ? informers[topics[i]].diff : 0;
						if (old_diff) {
							delete informers[topics[i]];
						}
						informers[topics[i]] = {diff: old_diff + diff, name: temp[1].replace(/&quot;/g, '"')};
					} else {
						delete informers[topics[i]];
					}
				}
			}
		}
	}
	ui_storage.set('ForumInformers', JSON.stringify(informers));
	ui_storage.set('Forum' + xhr.extra_arg, JSON.stringify(forum));
	ui_forum._process(xhr.extra_arg);
};

// ui_improver
var ui_improver = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "improver"}) : worker.GUIp.improver = {};

ui_improver.inventoryChanged = true;
ui_improver.improveInProcess = true;
ui_improver.isFirstTime = true;
ui_improver.voiceSubmitted = false;
ui_improver.wantedMonsters = null;
ui_improver.friendsRegexp = null;
ui_improver.windowResizeInt = 0;
ui_improver.mapColorizationTmt = 0;
ui_improver.alliesCount = 0;
ui_improver.currentAlly = 0;
ui_improver.currentAllyObserver = 0;
// trophy craft combinations
ui_improver.b_b = [];
ui_improver.b_r = [];
ui_improver.r_r = [];
// dungeon phrases
ui_improver.dungeonPhrases = [
	'warning',
	'boss',
	'bonusGodpower',
	'bonusHealth',
	'trapUnknown',
	'trapTrophy',
	'trapGold',
	'trapLowDamage',
	'trapModerateDamage',
	'trapMoveLoss',
	'jumpingDungeon'
];
// resresher
ui_improver.softRefreshInt = 0;
ui_improver.hardRefreshInt = 0;
ui_improver.softRefresh = function() {
	worker.console.info('Godville UI+ log: Soft reloading...');
	document.getElementById('d_refresh').click();
};
ui_improver.hardRefresh = function() {
	worker.console.warn('Godville UI+ log: Hard reloading...');
	location.reload();
};
ui_improver.improve = function() {
	this.improveInProcess = true;
	ui_informer.update('pvp', ui_data.isFight && !ui_data.isDungeon);
	ui_informer.update('arena available', worker.so.state.arena_available());
	ui_informer.update('dungeon available', worker.so.state.dungeon_available());
	if (this.isFirstTime) {
		if (!ui_data.isFight && !ui_data.isDungeon) {
			ui_improver.improveDiary();
			ui_improver.improveLoot();
		}
		if (ui_data.isDungeon) {
			ui_improver.getDungeonPhrases();
		}
	}
	ui_improver.improveStats();
	ui_improver.improvePet();
	ui_improver.improveVoiceDialog();
	if (!ui_data.isFight) {
		ui_improver.improveNews();
		ui_improver.improveEquip();
		ui_improver.improvePantheons();
	}
	if (ui_data.isDungeon) {
		ui_improver.improveMap();
	}
	ui_improver.improveInterface();
	ui_improver.improveChat();
	if (this.isFirstTime && (ui_data.isFight || ui_data.isDungeon)) {
		ui_improver.improveAllies();
	}
	ui_improver.checkButtonsVisibility();
	this.isFirstTime = false;
	this.improveInProcess = false;
};
ui_improver.improveLoot = function() {
	var i, j, len, items = document.querySelectorAll('#inventory li'),
		flags = new Array(ui_words.base.usable_items.types.length),
		bold_items = 0,
		trophy_list = [],
		trophy_boldness = {},
		forbidden_craft = ui_storage.get('Option:forbiddenCraft');

	for (i = 0, len = flags.length; i < len; i++) {
		flags[i] = false;
	}

	// Parse items
	for (i = 0, len = items.length; i < len; i++) {
		if (getComputedStyle(items[i]).overflow === 'visible') {
			var item_name = items[i].textContent.replace(/\?$/, '')
												.replace(/\(@\)/, '')
												.replace(/\(\d шт\)$/, '')
												.replace(/\(\dpcs\)$/, '')
												.replace(/^\s+|\s+$/g, '');
			// color items and add buttons
			if (ui_words.isUsableItem(items[i])) {
				var desc = items[i].querySelector('.item_act_link_div *').getAttribute('title').replace(/ \(.*/g, ''),
					sect = ui_words.usableItemType(desc);
				bold_items++;
				if (sect !== -1) {
					flags[sect] = true;
				} else if (!ui_utils.hasShownInfoMessage) {
					ui_utils.hasShownInfoMessage = true;
					ui_utils.showMessage('info', {
						title: worker.GUIp_i18n.unknown_item_type_title,
						content: '<div>' + worker.GUIp_i18n.unknown_item_type_content + '<b>"' + desc + '</b>"</div>'
					});
				}
				if (!(forbidden_craft && (forbidden_craft.match('usable') || (forbidden_craft.match('b_b') && forbidden_craft.match('b_r'))))) {
					trophy_list.push(item_name);
					trophy_boldness[item_name] = true;
				}
			} else if (ui_words.isHealItem(items[i])) {
				if (!ui_utils.isAlreadyImproved(worker.$(items[i]))) {
					items[i].classList.add('heal_item');
				}
				if (!(forbidden_craft && (forbidden_craft.match('heal') || (forbidden_craft.match('b_r') && forbidden_craft.match('r_r'))))) {
					trophy_list.push(item_name);
					trophy_boldness[item_name] = false;
				}
			} else {
				if (ui_words.isBoldItem(items[i])) {
					bold_items++;
					if (!(forbidden_craft && forbidden_craft.match('b_b') && forbidden_craft.match('b_r')) &&
						!item_name.match('золотой кирпич') && !item_name.match(' босса ')) {
						trophy_list.push(item_name);
						trophy_boldness[item_name] = true;
					}
				} else {
					if (!(forbidden_craft && forbidden_craft.match('b_r') && forbidden_craft.match('r_r')) &&
						!item_name.match('пушистого триббла')) {
						trophy_list.push(item_name);
						trophy_boldness[item_name] = false;
					}
				}
				if (!ui_utils.isAlreadyImproved(worker.$(items[i]))) {
					items[i].insertBefore(ui_utils.createInspectButton(item_name), null);
				}
			}
		}
	}

	for (i = 0, len = flags.length; i < len; i++) {
		ui_informer.update(ui_words.base.usable_items.types[i], flags[i]);
	}
	ui_informer.update('transform!', flags[ui_words.base.usable_items.types.indexOf('transformer')] && bold_items >= 2);
	ui_informer.update('smelt!', flags[ui_words.base.usable_items.types.indexOf('smelter')] && ui_storage.get('Stats:Gold') >= 3000);

	// Склейка трофеев, формирование списков
	this.b_b = [];
	this.b_r = [];
	this.r_r = [];
	if (trophy_list.length) {
		trophy_list.sort();
		for (i = 0, len = trophy_list.length - 1; i < len; i++) {
			for (j = i + 1; j < len + 1; j++) {
				if (trophy_list[i][0] === trophy_list[j][0]) {
					if (trophy_boldness[trophy_list[i]] && trophy_boldness[trophy_list[j]]) {
						if (!(forbidden_craft && forbidden_craft.match('b_b'))) {
							this.b_b.push(trophy_list[i] + worker.GUIp_i18n.and + trophy_list[j]);
							this.b_b.push(trophy_list[j] + worker.GUIp_i18n.and + trophy_list[i]);
						}
					} else if (!trophy_boldness[trophy_list[i]] && !trophy_boldness[trophy_list[j]]) {
						if (!(forbidden_craft && forbidden_craft.match('r_r'))) {
							this.r_r.push(trophy_list[i] + worker.GUIp_i18n.and + trophy_list[j]);
							this.r_r.push(trophy_list[j] + worker.GUIp_i18n.and + trophy_list[i]);
						}
					} else {
						if (!(forbidden_craft && forbidden_craft.match('b_r'))) {
							if (trophy_boldness[trophy_list[i]]) {
								this.b_r.push(trophy_list[i] + worker.GUIp_i18n.and + trophy_list[j]);
							} else {
								this.b_r.push(trophy_list[j] + worker.GUIp_i18n.and + trophy_list[i]);
							}
						}
					}
				} else {
					break;
				}
			}
		}
	}

	if (!ui_utils.isAlreadyImproved(worker.$('#inventory'))) {
		var inv_content = document.querySelector('#inventory .block_content');
		inv_content.insertAdjacentHTML('beforeend', '<span class="craft_button">' + worker.GUIp_i18n.craft_verb + ':</span>');
		inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.b_b, 'b_b', worker.GUIp_i18n.b_b_hint), null);
		inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.b_r, 'b_r', worker.GUIp_i18n.b_r_hint), null);
		inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.r_r, 'r_r', worker.GUIp_i18n.r_r_hint), null);
	}
};
ui_improver.improveVoiceDialog = function() {
	// Add links and show timeout bar after saying
	if (this.isFirstTime) {
		ui_utils.setVoiceSubmitState(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'), true);
		worker.$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
			if (!ui_utils.setVoiceSubmitState(this.value && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && parseInt(ui_timeout.bar.style.width)), false)) {
				ui_utils.setVoiceSubmitState(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'), true);
			}
		}).on('click', '.gv_text.div_link', function() {
			worker.$('#god_phrase').change();
		});
	}
	var $box = worker.$('#cntrl');
	if (!ui_utils.isAlreadyImproved($box)) {
		worker.$('.gp_label').addClass('l_capt');
		worker.$('.gp_val').addClass('l_val');
		if (ui_data.isDungeon && worker.$('#map').length) {
			var isContradictions = worker.$('#map')[0].textContent.match(/Противоречия|Disobedience/);
			ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.east, (isContradictions ? 'go_west' : 'go_east'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_east);
			ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.west, (isContradictions ? 'go_east' : 'go_west'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_west);
			ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.south, (isContradictions ? 'go_north' : 'go_south'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_south);
			ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.north, (isContradictions ? 'go_south' : 'go_north'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_north);
			if (worker.$('#map')[0].textContent.match(/Бессилия|Anti-influence/)) {
				worker.$('#actions').hide();
			}
		} else {
			if (ui_data.isFight) {
				ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.defend, 'defend', worker.GUIp_i18n.ask4 + ui_data.char_sex[0] + worker.GUIp_i18n.to_defend);
				ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.pray, 'pray', worker.GUIp_i18n.ask5 + ui_data.char_sex[0] + worker.GUIp_i18n.to_pray);
				ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.heal, 'heal', worker.GUIp_i18n.ask6 + ui_data.char_sex[1] + worker.GUIp_i18n.to_heal);
				ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.hit, 'hit', worker.GUIp_i18n.ask7 + ui_data.char_sex[1] + worker.GUIp_i18n.to_hit);
			} else {
				ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.sacrifice, 'sacrifice', worker.GUIp_i18n.ask8 + ui_data.char_sex[1] + worker.GUIp_i18n.to_sacrifice);
				ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.godpower_label, worker.GUIp_i18n.pray, 'pray', worker.GUIp_i18n.ask5 + ui_data.char_sex[0] + worker.GUIp_i18n.to_pray);
				worker.$('#voice_submit').click(function() {
					ui_improver.voiceSubmitted = true;
				});
			}
		}
		//hide_charge_button
		var charge_button = worker.$('#cntrl .hch_link');
		if (charge_button.length) {
			charge_button[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
		}
	}

	// Save stats
	ui_stats.setFromLabelCounter('Godpower', $box, worker.GUIp_i18n.godpower_label);
	ui_informer.update('full godpower', worker.$('#cntrl .p_val').width() === worker.$('#cntrl .p_bar').width());
};
ui_improver.improveNews = function() {
	if (!ui_utils.isAlreadyImproved(worker.$('#news'))) {
		ui_utils.addSayPhraseAfterLabel(worker.$('#news'), worker.GUIp_i18n.enemy_label, worker.GUIp_i18n.hit, 'hit', worker.GUIp_i18n.ask7 + ui_data.char_sex[1] + worker.GUIp_i18n.to_hit);
	}
	var isWantedMonster = false,
		isSpecialMonster = false,
		isTamableMonster = false;
	// Если герой дерется с монстром
	if (worker.$('#news .line')[0].style.display !== 'none') {
		var currentMonster = worker.$('#news .l_val').text();
		isWantedMonster = this.wantedMonsters && currentMonster.match(this.wantedMonsters);
		isSpecialMonster = currentMonster.match(/Врачующий|Дарующий|Зажиточный|Запасливый|Кирпичный|Латающий|Лучезарный|Сияющий|Сюжетный|Линяющий|Bricked|Enlightened|Glowing|Healing|Holiday|Loaded|Questing|Shedding|Smith|Wealthy/);

		if (!worker.so.state.has_pet) {
			var hasArk = parseInt(worker.so.state.stats.wood.value) >= 100;
			var pet, hero_level = ui_stats.get('Level');
			for (var i = 0; i < ui_words.base.pets.length; i++) {
				pet = ui_words.base.pets[i];
				if (currentMonster.toLowerCase().indexOf(pet.name) >= 0 && hero_level >= pet.min_level && hero_level <= (pet.min_level + (hasArk ? 28 : 14))) {
					isTamableMonster = true;
					break;
				}
			}
		}
	}

	ui_informer.update('wanted monster', isWantedMonster);
	ui_informer.update('special monster', isSpecialMonster);
	ui_informer.update('tamable monster', isTamableMonster);
};
ui_improver.MapIteration = function(MapThermo, iPointer, jPointer, step, kRow, kColumn) {
	step++;
	for (var iStep = -1; iStep <= 1; iStep++) {
		for (var jStep = -1; jStep <= 1; jStep++) {
			if (iStep !== jStep && (iStep === 0 || jStep === 0)) {
				var iNext = iPointer + iStep,
					jNext = jPointer + jStep;
				if (iNext >= 0 && iNext < kRow && jNext >= 0 && jNext < kColumn) {
					if (MapThermo[iNext][jNext] !== -1) {
						if (MapThermo[iNext][jNext] > step || MapThermo[iNext][jNext] === 0) {
							MapThermo[iNext][jNext] = step;
							ui_improver.MapIteration(MapThermo, iNext, jNext, step, kRow, kColumn);
						}
					}
				}
			}
		}
	}
};
ui_improver.improveMap = function() {
	if (this.isFirstTime) {
		document.getElementsByClassName('map_legend')[0].nextElementSibling.insertAdjacentHTML('beforeend',
			'<div class="guip_legend"><div class="dmc warning"></div><div> - ' + worker.GUIp_i18n.boss_warning_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc boss"></div><div> - ' + worker.GUIp_i18n.boss_slay_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc bonusGodpower"></div><div> - ' + worker.GUIp_i18n.small_prayer_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc bonusHealth"></div><div> - ' + worker.GUIp_i18n.small_healing_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapUnknown"></div><div> - ' + worker.GUIp_i18n.unknown_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapTrophy"></div><div> - ' + worker.GUIp_i18n.trophy_loss_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapLowDamage"></div><div> - ' + worker.GUIp_i18n.low_damage_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapModerateDamage"></div><div> - ' + worker.GUIp_i18n.moderate_damage_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapMoveLoss"></div><div> - ' + worker.GUIp_i18n.move_loss_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc warning trapMoveLoss"></div><div> - ' + worker.GUIp_i18n.boss_warning_and_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc boss trapMoveLoss"></div><div> - ' + worker.GUIp_i18n.boss_slay_and_trap_hint + '</div></div>'
		);
	}
	if (worker.$('#map .dml').length) {
		if (ui_storage.get('Option:relocateMap')) {
			if (!worker.$('#a_central_block #map').length) {
				worker.$('#map').insertBefore(worker.$('#m_control'));
				worker.$('#m_control').appendTo(worker.$('#a_right_block'));
				if (worker.GUIp_locale === 'ru') {
					worker.$('#m_control .block_title').text('Пульт');
				}
			}
		} else {
			if (!worker.$('#a_right_block #map').length) {
				worker.$('#m_control').insertBefore(worker.$('#map'));
				worker.$('#map').appendTo(worker.$('#a_right_block'));
				if (worker.GUIp_locale === 'ru') {
					worker.$('#m_control .block_title').text('Пульт вмешательства в личную жизнь');
				}
			}
		}
		var i, j,
			$box = worker.$('#cntrl .voice_generator'),
			$boxML = worker.$('#map .dml'),
			$boxMC = worker.$('#map .dmc'),
			kRow = $boxML.length,
			kColumn = $boxML[0].textContent.length,
			isJumping = worker.$('#map')[0].textContent.match(/Прыгучести|Jumping/),
			MaxMap = 0,	// Счетчик указателей
			MapArray = []; // Карта возможного клада
		for (i = 0; i < kRow; i++) {
			MapArray[i] = [];
			for (j = 0; j < kColumn; j++) {
				MapArray[i][j] = ('?!@'.indexOf($boxML[i].textContent[j]) !== - 1) ? 0 : -1;
			}
		}
		// Гласы направления делаем невидимыми
		for (i = 0; i < 4; i++) {
			$box[i].style.visibility = 'hidden';
		}
		for (var si = 0; si < kRow; si++) {
			// Ищем где мы находимся
			j = $boxML[si].textContent.indexOf('@');
			if (j !== -1) {
				var direction = document.querySelector('.sort_ch').textContent === '▼',
					chronicles = document.querySelectorAll('#m_fight_log .d_line');
				if (!(chronicles[direction ? 0 : chronicles.length - 1].classList.contains('trapMoveLoss') && !chronicles[direction ? 1 : chronicles.length - 2].classList.contains('trapMoveLoss'))) {
					//	Проверяем куда можно пройти
					if ($boxML[si - 1].textContent[j] !== '#' || isJumping && (si === 1 || si !== 1 && $boxML[si - 2].textContent[j] !== '#')) {
						$box[0].style.visibility = '';	//	Север
					}
					if ($boxML[si + 1].textContent[j] !== '#' || isJumping && (si === kRow - 2 || si !== kRow - 2 && $boxML[si + 2].textContent[j] !== '#')) {
						$box[1].style.visibility = '';	//	Юг
					}
					if ($boxML[si].textContent[j - 1] !== '#' || isJumping && $boxML[si].textContent[j - 2] !== '#') {
						$box[2].style.visibility = '';	//	Запад
					}
					if ($boxML[si].textContent[j + 1] !== '#' || isJumping && $boxML[si].textContent[j + 2] !== '#') {
						$box[3].style.visibility = '';	//	Восток
					}
				}
			}
			//	Ищем указатели
			for (var sj = 0; sj < kColumn; sj++) {
				var ik, jk,
					Pointer = $boxML[si].textContent[sj];
				if ('←→↓↑↙↘↖↗'.indexOf(Pointer) !== - 1) {
					MaxMap++;
					$boxMC[si * kColumn + sj].style.color = 'green';
					for (ik = 0; ik < kRow; ik++) {
						for (jk = 0; jk < kColumn; jk++) {
							var istep = parseInt((Math.abs(jk - sj) - 1) / 5),
								jstep = parseInt((Math.abs(ik - si) - 1) / 5);
							if ('←→'.indexOf(Pointer) !== -1 && ik >= si - istep && ik <= si + istep ||
								Pointer === '↓' && ik >= si + istep ||
								Pointer === '↑' && ik <= si - istep ||
								'↙↘'.indexOf(Pointer) !== -1 && ik > si + istep ||
								'↖↗'.indexOf(Pointer) !== -1 && ik < si - istep) {
								if (Pointer === '→' && jk >= sj + jstep ||
									Pointer === '←' && jk <= sj - jstep ||
									'↓↑'.indexOf(Pointer) !== -1 && jk >= sj - jstep && jk <= sj + jstep ||
									'↘↗'.indexOf(Pointer) !== -1 && jk > sj + jstep ||
									'↙↖'.indexOf(Pointer) !== -1 && jk < sj - jstep) {
									if (MapArray[ik][jk] >= 0) {
										MapArray[ik][jk]++;
									}
								}
							}
						}
					}
				}
				if ('✺☀♨☁❄✵'.indexOf(Pointer) !== -1) {
					MaxMap++;
					$boxMC[si * kColumn + sj].style.color = 'green';
					var ThermoMinStep = 0;	//	Минимальное количество шагов до клада
					var ThermoMaxStep = 0;	//	Максимальное количество шагов до клада
					switch(Pointer) {
						case '✺': ThermoMinStep = 1; ThermoMaxStep = 2; break;	//	✺ - очень горячо(1-2)
						case '☀': ThermoMinStep = 3; ThermoMaxStep = 5; break;	//	☀ - горячо(3-5)
						case '♨': ThermoMinStep = 6; ThermoMaxStep = 9; break;	//	♨ - тепло(6-9)
						case '☁': ThermoMinStep = 10; ThermoMaxStep = 13; break;	//	☁ - свежо(10-13)
						case '❄': ThermoMinStep = 14; ThermoMaxStep = 18; break;	//	❄ - холодно(14-18)
						case '✵': ThermoMinStep = 19; ThermoMaxStep = 100; break;	//	✵ - очень холодно(19)
					}
					//	Временная карта возможных ходов
					var MapThermo = [];
					for (ik = 0; ik < kRow; ik++) {
						MapThermo[ik] = [];
						for (jk = 0; jk < kColumn; jk++) {
							MapThermo[ik][jk] = ($boxML[ik].textContent[jk] === '#' || ((Math.abs(jk - sj) + Math.abs(ik - si)) > ThermoMaxStep)) ? -1 : 0;
						}
					}
					//	Запускаем итерацию
					ui_improver.MapIteration(MapThermo, si, sj, 0, kRow, kColumn);
					//	Метим возможный клад
					for (ik = ((si - ThermoMaxStep) > 0 ? si - ThermoMaxStep : 0); ik <= ((si + ThermoMaxStep) < kRow ? si + ThermoMaxStep : kRow - 1); ik++) {
						for (jk = ((sj - ThermoMaxStep) > 0 ? sj - ThermoMaxStep : 0); jk <= ((sj + ThermoMaxStep) < kColumn ? sj + ThermoMaxStep : kColumn - 1); jk++) {
							if (MapThermo[ik][jk] >= ThermoMinStep & MapThermo[ik][jk] <= ThermoMaxStep) {
								if (MapArray[ik][jk] >= 0) {
									MapArray[ik][jk]++;
								}
							}
						}
					}
				}
				// На будущее
				// ↻ ↺ ↬ ↫
			}
		}
		//	Отрисовываем возможный клад
		if (MaxMap !== 0) {
			for (i = 0; i < kRow; i++) {
				for (j = 0; j < kColumn; j++) {
					if (MapArray[i][j] === MaxMap) {
						$boxMC[i * kColumn + j].style.color = ($boxML[i].textContent[j] === '@') ? 'blue' : 'red';
					}
				}
			}
		}
	}
};
ui_improver.improveStats = function() {
	//	Парсер строки с золотом
	var gold_parser = function(val) {
		return parseInt(val.replace(/[^0-9]/g, '')) || 0;
	};

	if (ui_data.isDungeon) {
		ui_stats.setFromLabelCounter('Map_HP', worker.$('#m_info'), worker.GUIp_i18n.health_label);
		ui_stats.setFromLabelCounter('Map_Gold', worker.$('#m_info'), worker.GUIp_i18n.gold_label, gold_parser);
		ui_stats.setFromLabelCounter('Map_Inv', worker.$('#m_info'), worker.GUIp_i18n.inventory_label);
		ui_stats.set('Map_Charges', worker.$('#m_control .acc_val').text(), parseFloat);
		ui_stats.set('Map_Alls_HP', ui_improver.GroupHP(true));
		if (ui_storage.get('Logger:Location') === 'Field') {
			ui_storage.set('Logger:Location', 'Dungeon');
			ui_storage.set('Logger:Map_HP', ui_stats.get('Map_HP'));
			ui_storage.set('Logger:Map_Gold', ui_stats.get('Map_Gold'));
			ui_storage.set('Logger:Map_Inv', ui_stats.get('Map_Inv'));
			ui_storage.set('Logger:Map_Charges',ui_stats.get('Map_Charges'));
			ui_storage.set('Logger:Map_Alls_HP', ui_stats.get('Map_Alls_HP'));
		}
		//ui_informer.update('low health', +ui_stats.get('Map_HP') < 130);
		return;
	}
	if (ui_data.isFight) {
		ui_stats.setFromLabelCounter('Hero_HP', worker.$('#m_info'), worker.GUIp_i18n.health_label);
		ui_stats.setFromLabelCounter('Hero_Gold', worker.$('#m_info'), worker.GUIp_i18n.gold_label, gold_parser);
		ui_stats.setFromLabelCounter('Hero_Inv', worker.$('#m_info'), worker.GUIp_i18n.inventory_label);
		ui_stats.set('Hero_Charges', worker.$('#m_control .acc_val').text(), parseFloat);
		ui_stats.setFromLabelCounter('Enemy_Gold', worker.$('#o_info'), worker.GUIp_i18n.gold_label, gold_parser);
		ui_stats.setFromLabelCounter('Enemy_Inv', worker.$('#o_info'), worker.GUIp_i18n.inventory_label);
		ui_stats.set('Hero_Alls_HP', ui_improver.GroupHP(true));
		ui_stats.set('Enemy_HP', ui_improver.GroupHP(false));
		if (this.isFirstTime) {
			ui_storage.set('Logger:Hero_HP', ui_stats.get('Hero_HP'));
			ui_storage.set('Logger:Hero_Gold', ui_stats.get('Hero_Gold'));
			ui_storage.set('Logger:Hero_Inv', ui_stats.get('Hero_Inv'));
			ui_storage.set('Logger:Hero_Charges',ui_stats.get('Hero_Charges'));
			ui_storage.set('Logger:Enemy_HP', ui_stats.get('Enemy_HP'));
			ui_storage.set('Logger:Enemy_Gold', ui_stats.get('Enemy_Gold'));
			ui_storage.set('Logger:Enemy_Inv', ui_stats.get('Enemy_Inv'));
			ui_storage.set('Logger:Hero_Alls_HP', ui_stats.get('Hero_Alls_HP'));
		}
		//ui_informer.update('low health', +ui_stats.get('Hero_HP') < 130);
		return;
	}
	if (ui_storage.get('Logger:Location') !== 'Field') {
		ui_storage.set('Logger:Location', 'Field');
	}
	var $box = worker.$('#stats');
	if (!ui_utils.isAlreadyImproved(worker.$('#stats'))) {
		// Add links
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.level_label, worker.GUIp_i18n.study, 'exp', worker.GUIp_i18n.ask9 + ui_data.char_sex[1] + worker.GUIp_i18n.to_study);
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.health_label, worker.GUIp_i18n.heal, 'heal', worker.GUIp_i18n.ask6 + ui_data.char_sex[1] + worker.GUIp_i18n.to_heal);
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.gold_label, worker.GUIp_i18n.dig, 'dig', worker.GUIp_i18n.ask10 + ui_data.char_sex[1] + worker.GUIp_i18n.to_dig);
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.task_label, worker.GUIp_i18n.cancel_task, 'cancel_task', worker.GUIp_i18n.ask11 + ui_data.char_sex[0] + worker.GUIp_i18n.to_cancel_task);
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.task_label, worker.GUIp_i18n.do_task, 'do_task', worker.GUIp_i18n.ask12 + ui_data.char_sex[1] + worker.GUIp_i18n.to_do_task);
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.death_label, worker.GUIp_i18n.die, 'die', worker.GUIp_i18n.ask13 + ui_data.char_sex[0] + worker.GUIp_i18n.to_die);
	}
	if (!worker.$('#hk_distance .voice_generator').length) {
		ui_utils.addSayPhraseAfterLabel($box, worker.GUIp_i18n.milestones_label, worker.$('#main_wrapper.page_wrapper_5c').length ? '回' : worker.GUIp_i18n.return, 'town', worker.GUIp_i18n.ask14 + ui_data.char_sex[0] + worker.GUIp_i18n.to_return);
	}

	ui_stats.setFromProgressBar('Exp', worker.$('#hk_level .p_bar'));
	ui_stats.setFromProgressBar('Task', worker.$('#hk_quests_completed .p_bar'));
	ui_stats.setFromLabelCounter('Level', $box, worker.GUIp_i18n.level_label);
	ui_stats.setFromLabelCounter('Monster', $box, worker.GUIp_i18n.monsters_label);
	ui_stats.setFromLabelCounter('Death', $box, worker.GUIp_i18n.death_label);
	ui_stats.setFromLabelCounter('Bricks', $box, worker.GUIp_i18n.bricks_label, parseFloat);
	ui_stats.setFromLabelCounter('Logs', $box, worker.GUIp_i18n.logs_label, parseFloat);
	ui_stats.setFromLabelCounter('Savings', $box, worker.GUIp_i18n.savings_label, gold_parser);
	ui_stats.set('Charges', worker.$('#control .acc_val').text(), parseFloat);
	if (ui_storage.get('Stats:Inv') !== ui_stats.setFromLabelCounter('Inv', $box, worker.GUIp_i18n.inventory_label) || worker.$('#inventory li:not(.improved)').length || worker.$('#inventory li:hidden').length) {
		this.inventoryChanged = true;
	}
	ui_informer.update('much gold', ui_stats.setFromLabelCounter('Gold', $box, worker.GUIp_i18n.gold_label, gold_parser) >= (ui_data.hasTemple ? 10000 : 3000));
	ui_informer.update('dead', ui_stats.setFromLabelCounter('HP', $box, worker.GUIp_i18n.health_label) === 0);
	ui_informer.update('guild quest', worker.$('.q_name').text().match(/членом гильдии|member of the guild/) && !worker.$('.q_name').text().match(/\((отменено|cancelled)\)/));
	ui_informer.update('mini quest', worker.$('.q_name').text().match(/\((мини|mini)\)/) && !worker.$('.q_name').text().match(/\((отменено|cancelled)\)/));

	//Shovel pictogramm start
	var $digVoice = worker.$('#hk_gold_we .voice_generator');
	//worker.$('#hk_gold_we .l_val').text('где-то 20 монет');
	if (this.isFirstTime) {
		$digVoice.css('background-image', 'url(' + worker.GUIp_getResource('images/shovel.png') + ')');
	}
	if (worker.$('#hk_gold_we .l_val').text().length > 16 - 2*worker.$('.page_wrapper_5c').length) {
		$digVoice[0].classList.add('shovel');
		if (worker.$('#hk_gold_we .l_val').text().length > 20 - 3*worker.$('.page_wrapper_5c').length) {
			$digVoice[0].classList.add('compact');
		} else {
			$digVoice[0].classList.remove('compact');
		}
	} else {
		$digVoice[0].classList.remove('shovel');
	}
	//Shovel pictogramm end
};
ui_improver.improvePet = function() {
	if (ui_data.isFight) { return; }
	if (worker.so.state.pet.pet_is_dead && worker.so.state.pet.pet_is_dead.value) {
		if (!ui_utils.isAlreadyImproved(worker.$('#pet'))) {
			worker.$('#pet .block_title').after(worker.$('<div id="pet_badge" class="fr_new_badge equip_badge_pos">0</div>'));
		}
		worker.$('#pet_badge').text(ui_utils.findLabel(worker.$('#pet'), worker.GUIp_i18n.pet_status_label).siblings('.l_val').text().replace(/[^0-9:]/g, ''));
		if (worker.$('#pet .block_content')[0].style.display === 'none') {
			worker.$('#pet_badge').show();
		}
		else {
			worker.$('#pet_badge').hide();
		}
	} else {
		if (worker.$('#pet_badge').length === 1) {
			worker.$('#pet_badge').hide();
		}
	}
	// bruise informer
	ui_informer.update('pet knocked out', worker.so.state.pet.pet_is_dead && worker.so.state.pet.pet_is_dead.value);

	ui_stats.setFromLabelCounter('Pet_Level', worker.$('#pet'), worker.GUIp_i18n.pet_level_label);
};
ui_improver.improveEquip = function() {
	// Save stats
	var seq = 0;
	for (var i = 7; i >= 1;) {
		ui_stats.set('Equip' + i--, parseInt(worker.$('#eq_' + i + ' .eq_level').text()));
		seq += parseInt(worker.$('#eq_' + i + ' .eq_level').text()) || 0;
	}
	if (!ui_utils.isAlreadyImproved(worker.$('#equipment'))) {
		worker.$('#equipment .block_title').after(worker.$('<div id="equip_badge" class="fr_new_badge equip_badge_pos">0</div>'));
	}
	worker.$('#equip_badge').text((seq / 7).toFixed(1));
};
ui_improver.GroupHP = function(flag) {
	var seq = 0;
	var $box = flag ? worker.$('#alls .opp_h') : worker.$('#opps .opp_h');
	var GroupCount = $box.length;
	if (GroupCount > 0) {
		for (var i = 0; i < GroupCount; i++) {
			if (parseInt($box[i].textContent)) {
				seq += parseInt($box[i].textContent);
			}
		}
	}
	return seq;
};
ui_improver.improvePantheons = function() {
	if (ui_storage.get('Option:relocateDuelButtons') && ui_storage.get('Option:relocateDuelButtons').match('arena')) {
		if (!worker.$('#pantheons.arena_link_relocated').length) {
			worker.$('#pantheons').addClass('arena_link_relocated');
			worker.$('.arena_link_wrap').insertBefore(worker.$('#pantheons_content')).addClass('p_group_sep').css('padding-top', 0);
		}
	} else if (worker.$('#pantheons.arena_link_relocated').length) {
		worker.$('#pantheons').removeClass('arena_link_relocated').removeClass('both');
		worker.$('.arena_link_wrap').insertBefore(worker.$('#control .arena_msg')).removeClass('p_group_sep').css('padding-top', '0.5em');
	}
	if (ui_storage.get('Option:relocateDuelButtons') && ui_storage.get('Option:relocateDuelButtons').match('chf')) {
		if (!worker.$('#pantheons.chf_link_relocated').length) {
			worker.$('#pantheons').addClass('chf_link_relocated');
			worker.$('.chf_link_wrap:first').insertBefore(worker.$('#pantheons_content'));
			worker.$('#pantheons .chf_link_wrap').addClass('p_group_sep');
		}
	} else if (worker.$('#pantheons.chf_link_relocated').length) {
		worker.$('#pantheons').removeClass('chf_link_relocated').removeClass('both');
		worker.$('.chf_link_wrap').removeClass('p_group_sep');
		worker.$('#pantheons .chf_link_wrap').insertAfter(worker.$('#control .arena_msg'));
	}
	if (worker.$('#pantheons.arena_link_relocated.chf_link_relocated:not(.both)').length) {
		worker.$('#pantheons').addClass('both');
		worker.$('#pantheons .chf_link_wrap').insertBefore(worker.$('#pantheons_content'));
		worker.$('.arena_link_wrap').removeClass('p_group_sep');
	}
};
ui_improver.improveDiary = function() {
	if (ui_data.isFight) { return; }
	var i, len;
	if (this.isFirstTime) {
		var $msgs = document.querySelectorAll('#diary .d_msg:not(.parsed)');
		for (i = 0, len = $msgs.length; i < len; i++) {
			$msgs[i].classList.add('parsed');
		}
	} else {
		var newMessages = worker.$('#diary .d_msg:not(.parsed)');
		if (newMessages.length) {
			if (this.voiceSubmitted) {
				if (newMessages.length - document.querySelectorAll('#diary .d_msg:not(.parsed) .vote_links_b').length >= 2) {
					ui_timeout.start();
				}
				worker.$('#god_phrase').change();
				this.voiceSubmitted = false;
			}
			newMessages.addClass('parsed');
		}
	}
};
ui_improver.parseDungeonPhrases = function(xhr) {
	for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
		temp = xhr.responseText.match(new worker.RegExp('<p>' + this.dungeonPhrases[i] + '\\b([\\s\\S]+?)<\/p>'))[1].replace(/&#8230;/g, '...').replace(/^<br>\n|<br>$/g, '').replace(/<br>\n/g, '|');
		this[this.dungeonPhrases[i] + 'RegExp'] = new worker.RegExp(temp);
		ui_storage.set('Dungeon:' + this.dungeonPhrases[i] + 'Phrases', temp);
	}
	ui_improver.improveChronicles();
};
ui_improver.getDungeonPhrases = function() {
	if (!ui_storage.get('Dungeon:bossPhrases')) {
		ui_utils.getXHR('/gods/' + (worker.GUIp_locale === 'ru' ? 'Спандарамет' : 'God Of Dungeons'), ui_improver.parseDungeonPhrases.bind(ui_improver));
	} else {
		for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
			this[this.dungeonPhrases[i] + 'RegExp'] = new worker.RegExp(ui_storage.get('Dungeon:' + this.dungeonPhrases[i] + 'Phrases'));
		}
		ui_improver.improveChronicles();
	}
};
ui_improver.parseChronicles = function(xhr) {
	var last;
	if (document.querySelector('.sort_ch').textContent === '▼') {
		var temp = document.querySelectorAll('#m_fight_log .d_line .d_msg:not(.m_infl)');
		last = temp[temp.length - 1].textContent;
	} else {
		last = document.querySelector('#m_fight_log .d_line .d_msg:not(.m_infl)').textContent;
	}
	this.old_chronicles = [];
	var direction, entry, matches = xhr.responseText.match(/<div class="text_content ">[\s\S]+?<\/div>/g);
	for (var i = 0, len = matches.length; i < len; i++) {
		matches[i] = matches[i].replace('<div class="text_content ">', '').replace('</div>', '').trim();
		if (matches[i] === last) {
			break;
		} else {
			entry = {};
			direction = matches[i].match(/^.*?[\.!\?](?:\s|$)/)[0].match(/север|восток|юг|запад|north|east|south|west/i);
			if (direction) {
				entry.direction = direction[0];
			}
			for (var j = 0, len2 = this.dungeonPhrases.length; j < len2; j++) {
				if (matches[i].match(this[this.dungeonPhrases[j] + 'RegExp'])) {
					if (!entry.classList) {
						entry.classList = [];
					}
					entry.classList.push(this.dungeonPhrases[j]);
				}
			}
			this.old_chronicles.push(entry);
		}
	}
};
ui_improver.improveChronicles = function() {
	if (this.bossRegExp) {
		// chronicles painting
		var chronicles = document.querySelectorAll('#m_fight_log .d_msg:not(.parsed)');
		for (var i = 0, len = chronicles.length; i < len; i++) {
			for (var j = 0, len2 = this.dungeonPhrases.length; j < len2; j++) {
				if (chronicles[i].textContent.match(this[this.dungeonPhrases[j] + 'RegExp'])) {
					chronicles[i].parentNode.classList.add(this.dungeonPhrases[j]);
				}
			}
			chronicles[i].classList.add('parsed');
		}

		// informer
		ui_informer.update('close to boss', document.querySelector('.sort_ch').textContent === '▼' ? document.querySelectorAll('#m_fight_log .d_line.warning:nth-child(1)').length : document.querySelectorAll('#m_fight_log .d_line.warning:last-child').length);

		ui_improver.colorDungeonMap();
	}
	if (this.isFirstTime) {
		ui_utils.getXHR('/duels/log/' + worker.so.state.stats.perm_link.value, ui_improver.parseChronicles.bind(ui_improver));
	}
	ui_storage.set('Log:current', worker.so.state.stats.perm_link.value);
	ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':steps', worker.$('#m_fight_log .block_title').text().match(/\d+/)[0]);
	ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':map', JSON.stringify(worker.so.state.d_map));
};
ui_improver.colorDungeonMap = function() {
	// map cells painting
	var first_sentence, direction, step, i, len, j, len2,
		x = ui_utils.getNodeIndex(document.getElementsByClassName('map_pos')[0]),
		y = ui_utils.getNodeIndex(document.getElementsByClassName('map_pos')[0].parentNode),
		chronicles = document.querySelectorAll('.d_msg:not(.m_infl)'),
		ch_down = document.querySelector('.sort_ch').textContent === '▼';
	for (len = chronicles.length, i = ch_down ? 0 : len - 1; ch_down ? i < len : i >= 0; ch_down ? i++ : i--) {
		for (j = 0, len2 = this.dungeonPhrases.length; j < len2; j++) {
			if (chronicles[i].parentNode.classList.contains(this.dungeonPhrases[j])) {
				document.querySelectorAll('#map .dml')[y].children[x].classList.add(this.dungeonPhrases[j]);
			}
		}
		first_sentence = chronicles[i].textContent.match(/^.*?[\.!\?](?:\s|$)/);
		if (first_sentence) {
			direction = first_sentence[0].match(/север|восток|юг|запад|north|east|south|west/i);
			step = first_sentence[0].match(this.jumpingDungeonRegExp) ? 2 : 1;
			if (direction) {
				switch(direction[0]) {
				case 'север':
				case 'north': y += step; break;
				case 'восток':
				case 'east': x -= step; break;
				case 'юг':
				case 'south': y -= step; break;
				case 'запад':
				case 'west': x += step; break;
				}
			}
		}
	}
	if (this.old_chronicles && this.old_chronicles.length) {
		for (i = this.old_chronicles.length - 1; i >= 0; i--) {
			if (this.old_chronicles[i].classList) {
				for (j = 0, len2 = this.old_chronicles[i].classList.length; j < len2; j++) {
					document.querySelectorAll('#map .dml')[y].children[x].classList.add(this.old_chronicles[i].classList[j]);
				}
			}
			direction = this.old_chronicles[i].direction;
			step = this.old_chronicles[i].classList && this.old_chronicles[i].classList.indexOf('jumpingDungeon') >= 0 ? 2 : 1;
			if (direction) {
				switch(direction) {
				case 'север':
				case 'north': y += step; break;
				case 'восток':
				case 'east': x -= step; break;
				case 'юг':
				case 'south': y -= step; break;
				case 'запад':
				case 'west': x += step; break;
				}
			}
		}
	}
};
ui_improver.whenWindowResize = function() {
	ui_improver.chatsFix();
	//body widening
	worker.$('body').width(worker.$(worker).width() < worker.$('#main_wrapper').width() ? worker.$('#main_wrapper').width() : '');
};
ui_improver.improveInterface = function() {
	if (this.isFirstTime) {
		worker.$('a[href=#]').removeAttr('href');
		ui_improver.whenWindowResize();
		worker.$(worker).resize((function() {
			worker.clearInterval(this.windowResizeInt);
			this.windowResizeInt = worker.setTimeout(ui_improver.whenWindowResize.bind(ui_improver), 250);
		}).bind(ui_improver));
		if (ui_data.isFight) {
			document.querySelector('#map .block_title, #control .block_title, #m_control .block_title').insertAdjacentHTML('beforeend', ' <a class="broadcast" href="/duels/log/' + worker.so.state.stats.perm_link.value + '" target="_blank">' + worker.GUIp_i18n.broadcast + '</a>');
		}
	}
	if (this.isFirstTime || ui_storage.get('UserCssChanged') === true) {
		ui_storage.set('UserCssChanged', false);
		worker.GUIp_addCSSFromString(ui_storage.get('UserCss'));
	}

	if (worker.localStorage.ui_s !== ui_storage.get('ui_s')) {
		ui_storage.set('ui_s', worker.localStorage.ui_s || 'th_classic');
		this.Shovel = false;
		if (document.body.classList.contains('has_temple')) {
			document.body.className = 'has_temple';
		} else {
			document.body.className = '';
		}
		document.body.classList.add(ui_storage.get('ui_s').replace('th_', ''));
	}

	if (ui_storage.get('Option:useBackground') === 'cloud') {
		if (worker.$('body').css('background-image') !== 'url(' + worker.GUIp_getResource("images/background.jpg") + ')') {
			worker.$('body').css('background-image', 'url(' + worker.GUIp_getResource("images/background.jpg") + ')');
		}
	} else if (ui_storage.get('Option:useBackground')) {
		//Mini-hash to check if that is the same background
		var hash = 0, ch, str = ui_storage.get('Option:useBackground');
		for (var i = 0; i < str.length; i++) {
			ch = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+ch;
			hash = hash & hash; // Convert to 32bit integer
		}
		if (hash !== this.hash) {
			this.hash = hash;
			worker.$('body').css('background-image', 'url(' + ui_utils.escapeHTML(str) + ')');
		}
	} else {
		if (worker.$('body').css('background-image')) {
			worker.$('body').css('background-image', '');
		}
	}
};
ui_improver.improveChat = function() {
	var i, len;

	// friends fetching
	if (this.isFirstTime && (ui_data.isFight || ui_data.isDungeon)) {
		var $friends = document.querySelectorAll('.frline .frname'),
			friends = [];
		for (i = 0, len = $friends.length; i < len; i++) {
			friends.push($friends[i].textContent);
		}
		this.friendsRegexp = new worker.RegExp('^(?:' + friends.join('|') + ')$');
	}

	// links replace
	var $cur_msg, $msgs = worker.$('.fr_msg_l:not(.improved)'),
		$temp = worker.$('<div id="temp" />');
	worker.$('body').append($temp);
	for (i = 1, len = $msgs.length; i < len; i++) {
		$cur_msg = $msgs.eq(i);
		$temp.append(worker.$('.fr_msg_meta', $cur_msg)).append(worker.$('.fr_msg_delete', $cur_msg));
		var text = $cur_msg.text();
		$cur_msg.empty();
		$cur_msg.append(ui_utils.escapeHTML(text).replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="' + worker.GUIp_i18n.open_in_a_new_tab + '">$1</a>'));
		$cur_msg.append(worker.$('.fr_msg_meta', $temp)).append(worker.$('.fr_msg_delete', $temp));
	}
	$msgs.addClass('improved');
	$temp.remove();

	// godnames in gc paste fix
	worker.$('.gc_fr_god:not(.improved)').unbind('click').click(function() {
		var ta = this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('textarea'),
			pos = ta.selectionDirection === 'backward' ? ta.selectionStart : ta.selectionEnd;
		ta.value = ta.value.slice(0, pos) + '@' + this.textContent + ', ' + ta.value.slice(pos);
		ta.focus();
		ta.selectionStart = ta.selectionEnd = pos + this.textContent.length + 3;
	}).addClass('improved');

	//"Shift+Enter → new line" improvement
	var keypresses, handlers,
	$tas = worker.$('.frInputArea textarea:not(.improved)');
	if ($tas.length) {
		var new_keypress = function(handlers) {
			return function(e) {
				if (e.which === 13 && !e.shiftKey) {
					for (var i = 0, len = handlers.length; i < len; i++) {
						handlers[i](e);
					}
				}
			};
		};
		for (i = 0, len = $tas.length; i < len; i++) {
			keypresses = worker.$._data($tas[i], 'events').keypress;
			handlers = [];
			for (var j = 0, klen = keypresses.length; j < klen; j++) {
				handlers.push(keypresses[j].handler);
			}
			$tas.eq(i).unbind('keypress').keypress(new_keypress(handlers));
		}
		$tas.addClass('improved');
		new_keypress = null;
	}
};
ui_improver.improveAllies = function() {
	var i, len, popover, allies_buttons = document.querySelectorAll('#alls .opp_dropdown.popover-button');
	if (this.isFirstTime) {
		this.alliesCount = allies_buttons.length;
		for (i = 0; i < 5; i++) {
			popover = document.getElementById('popover_opp_all' + i);
			if (popover) {
				popover.parentNode.parentNode.classList.add('hidden');
			}
		}
	}
	if (this.currentAlly < this.alliesCount) {
		this.currentAllyObserver = this.currentAlly;
		allies_buttons[this.currentAlly].click();
	} else {
		document.body.click();
		while ((popover = document.querySelector('.popover.hidden'))) {
			popover.classList.remove('hidden');
		}
	}
};
ui_improver.checkButtonsVisibility = function() {
	worker.$('.arena_link_wrap,.chf_link_wrap,.cvs_link_wrap', worker.$('#pantheons')).hide();
	if (ui_storage.get('Stats:Godpower') >= 50) {
		worker.$('#pantheons .chf_link_wrap').show();
		worker.$('#pantheons .cvs_link_wrap').show();
		worker.$('#pantheons .arena_link_wrap').show();
	}
	worker.$('.craft_button,.inspect_button,.voice_generator').hide();
	if (ui_storage.get('Stats:Godpower') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
		worker.$('.voice_generator, .inspect_button').show();
		if (ui_storage.get('Option:disableDieButton')) {
			worker.$('#hk_death_count .voice_generator').hide();
		}
		if (this.b_b.length) { worker.$('.b_b').show(); }
		if (this.b_r.length) { worker.$('.b_r').show(); }
		if (this.r_r.length) { worker.$('.r_r').show(); }
		if (worker.$('.b_b:visible, .b_r:visible, .r_r:visible').length) { worker.$('span.craft_button').show(); }
		//if (worker.$('.f_news').text() !== 'Возвращается к заданию...')fc
		if (!ui_data.isFight) {
			if (worker.$('#hk_distance .l_capt').text().match(/Город|Current Town/) || worker.$('.f_news').text().match('дорогу') || worker.$('#news .line')[0].style.display !== 'none') { worker.$('#hk_distance .voice_generator').hide(); }
			//if (ui_storage.get('Stats:Godpower') === 100) worker.$('#control .voice_generator').hide();
			if (worker.$('#control .p_val').width() === worker.$('#control .p_bar').width() || worker.$('#news .line')[0].style.display !== 'none') { worker.$('#control .voice_generator')[0].style.display = 'none'; }
			if (worker.$('#hk_distance .l_capt').text().match(/Город|Current Town/)) { worker.$('#control .voice_generator')[1].style.display = 'none'; }
		}
		if (worker.$('#hk_quests_completed .q_name').text().match(/\(выполнено\)/)) { worker.$('#hk_quests_completed .voice_generator').hide(); }
		if (worker.$('#hk_health .p_val').width() === worker.$('#hk_health .p_bar').width()) { worker.$('#hk_health .voice_generator').hide(); }
	}
};
ui_improver.chatsFix = function() {
	var i, len, cells = document.querySelectorAll('.frDockCell');
	for (i = 0, len = cells.length; i < len; i++) {
		cells[i].classList.remove('left');
		cells[i].style.zIndex = len - i;
		if (cells[i].getBoundingClientRect().right < 350) {
			cells[i].classList.add('left');
		}
	}
	//padding for page settings link
	var padding_bottom = worker.$('.frDockCell:first').length ? Math.floor(worker.$('.frDockCell:first').position().top + worker.$('.frDockCell').height()) : 0,
		isBottom = worker.scrollY >= worker.scrollMaxY - 10;
	padding_bottom = Math.floor(padding_bottom*10)/10 + 10;
	padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
	worker.$('.reset_layout').css('padding-bottom', padding_bottom);
	if (isBottom) {
		worker.scrollTo(0, worker.scrollMaxY);
	}
};
ui_improver.initSoundsOverride = function() {
	if (worker.so && worker.so.a_notify) {
		worker.so.a_notify_orig = worker.so.a_notify;
		worker.so.a_notify = function() {
			if (ui_storage.get('Option:disableArenaSound')) {
				if((worker.$(document.activeElement).is("input") || worker.$(document.activeElement).is("textarea")) &&
					worker.$(document.activeElement).attr("id") !== "god_phrase" &&
					worker.$(document.activeElement).val().length > 3) {
					var readyness = confirm(Loc.duel_switch_confirm);
					if (!readyness)  {
						return false;
					}
				}
				worker.setTimeout(function() {
					document.location.href = document.location.pathname;
				}, 3e3);
			} else {
				worker.so.a_notify_orig();
			}
		};
	}
	if (worker.so && worker.so.play_sound) {
		worker.so.play_sound_orig = worker.so.play_sound;
		worker.so.play_sound = function(a, b) {
			if (!(ui_storage.get('Option:disablePmSound') && a === 'msg.mp3')) {
				worker.so.play_sound_orig(a, b);
			}
		};
	}
};
ui_improver.activity = function() {
	if (!ui_logger.Updating) {
		ui_logger.Updating = true;
		worker.setTimeout(function() {
			ui_logger.Updating = false;
		}, 500);
		ui_logger.update();
	}
};
ui_improver.nodeInsertion = function() {
	if (!this.improveInProcess) {
		this.improveInProcess = true;
		worker.setTimeout(ui_improver.nodeInsertionDelay.bind(ui_improver), 50);
	}
};
ui_improver.nodeInsertionDelay = function() {
	ui_improver.improve();
	if (ui_data.isFight) {
		ui_logger.update();
	}
};

// ui_laying_timer
var ui_laying_timer = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "laying_timer"}) : worker.GUIp.laying_timer = {};

ui_laying_timer.init = function() {
	if (ui_data.hasTemple && !ui_data.isFight && !ui_data.isDungeon && !ui_storage.get('Option:disableLayingTimer')) {
		document.querySelector('#imp_button').insertAdjacentHTML('afterend', '<div id=\"laying_timer\" class=\"fr_new_badge\" />');
		for (var key in worker) {
			if (key.match(/^diary/)) {
				this.third_eye = key;
				break;
			}
		}
		ui_laying_timer.tick();
		worker.setInterval(ui_laying_timer.tick.bind(ui_laying_timer), 60000);
	}
};
ui_laying_timer.tick = function() {
	var temp, cur, latest, earliest, lastLaying = 0,
		latestFromStorage = ui_storage.get('thirdEyeLatestEntry') && new Date(ui_storage.get('thirdEyeLatestEntry')),
		earliestFromStorage = ui_storage.get('thirdEyeEarliestEntry') && new Date(ui_storage.get('thirdEyeEarliestEntry')),
		lastLayingFromStorage = ui_storage.get('thirdEyeLastLayingEntry') && new Date(ui_storage.get('thirdEyeLastLayingEntry'));
	for (var msg in worker[this.third_eye]) {
		temp = new Date(worker[this.third_eye][msg].time);
		if (msg.match(/^(?:Возложила?|Выставила? тридцать золотых столбиков|I placed \w+? bags of gold)/)) {
			lastLaying = temp > lastLaying ? temp : lastLaying;
		}
		if (!latest || latest < temp) {
			latest = temp;
		}
		if (!earliest || earliest > temp) {
			earliest = temp;
		}
	}
	if (latestFromStorage >= earliest) {
		earliest = earliestFromStorage;
		if (lastLaying) {
			ui_storage.set('thirdEyeLastLayingEntry', lastLaying);
		} else {
			lastLaying = lastLayingFromStorage;
		}
	} else {
		ui_storage.set('thirdEyeEarliestEntry', earliest);
		ui_storage.set('thirdEyeLastLayingEntry', lastLaying ? lastLaying : '');
	}
	ui_storage.set('thirdEyeLatestEntry', latest);
	var $timer = document.querySelector('#laying_timer');
	$timer.classList.remove('green');
	$timer.classList.remove('yellow');
	$timer.classList.remove('red');
	$timer.classList.remove('grey');
	var hours, minutes;
	if (lastLaying) {
		hours = Math.floor(24 - (Date.now() - lastLaying)/1000/60/60);
		minutes = Math.floor(60 - (Date.now() - lastLaying)/1000/60%60);
		if (hours < 0) {
			$timer.textContent = '✓';
			$timer.classList.add('green');
			$timer.title = worker.GUIp_i18n.gte_no_penalty;
		} else {
			$timer.textContent = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
			if (hours >= 12) {
				$timer.classList.add('red');
				$timer.title = worker.GUIp_i18n.gte_major_penalty;
			} else {
				$timer.classList.add('yellow');
				$timer.title = worker.GUIp_i18n.gte_minor_penalty;
			}
		}
	} else {
		if (Math.floor((Date.now() - earliest)/1000/60/60) >= 24) {
			$timer.textContent = '✓';
			$timer.classList.add('green');
			$timer.title = worker.GUIp_i18n.gte_no_penalty;
		} else {
			hours = Math.floor(24 - (Date.now() - earliest)/1000/60/60);
			minutes = Math.floor(60 - (Date.now() - earliest)/1000/60%60);
			$timer.textContent = '?';
			$timer.classList.add('grey');
			$timer.title = worker.GUIp_i18n.gte_unknown_penalty + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
		}
	}
};

// ui_observers
var ui_observers = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "observers"}) : worker.GUIp.observers = {};

ui_observers.init = function() {
	for (var key in this) {
		if (this[key].condition) {
			ui_observers.start(this[key]);
		}
	}
};
ui_observers.process_mutations = function(obj_func, mutations) {
	mutations.forEach(obj_func);
};
ui_observers.start = function(obj) {
	for (var i = 0, len = obj.target.length; i < len; i++) {
		var target = document.querySelector(obj.target[i]);
		if (target) {
			var observer = new MutationObserver(ui_observers.process_mutations.bind(this, obj.func));
			observer.observe(target, obj.config);
			obj.observers.push(observer);
		}
	}
};
ui_observers.chats = {
	condition: true,
	config: { childList: true },
	func: function(mutation) {
		if (mutation.addedNodes.length && !mutation.addedNodes[0].classList.contains('moved')) {
			var newNode = mutation.addedNodes[0];
			newNode.classList.add('moved');
			mutation.target.appendChild(newNode);
			var msgArea = newNode.querySelector('.frMsgArea');
			msgArea.scrollTop = msgArea.scrollTopMax || msgArea.scrollHeight;
		} else if (mutation.addedNodes.length || mutation.removedNodes.length) {
			ui_improver.chatsFix();
		}
	},
	observers: [],
	target: ['.chat_ph']
};
ui_observers.inventory = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: {
		childList: true,
		attributes: true,
		subtree: true,
		attributeFilter: ['style']
	},
	func: function(mutation) {
		if (mutation.target.tagName.toLowerCase() === 'li' && mutation.type === "attributes" &&
			mutation.target.style.display === 'none' && mutation.target.parentNode) {
			mutation.target.parentNode.removeChild(mutation.target);
			ui_improver.improveLoot();
		}
		if (mutation.target.tagName.toLowerCase() === 'ul' && mutation.addedNodes.length) {
			ui_improver.improveLoot();
		}
	},
	observers: [],
	target: ['#inventory ul']
};
ui_observers.refresher = {
	condition: true,
	config: {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true
	},
	func: function(mutation) {
		var tgt = mutation.target,
			id = tgt.id,
			cl = tgt.className;
		if (!(id && id.match(/logger|pet_badge|equip_badge/)) &&
			!(cl && cl.match(/voice_generator|inspect_button|m_hover|craft_button/))) {
			worker.clearInterval(ui_improver.softRefreshInt);
			worker.clearInterval(ui_improver.hardRefreshInt);
			if (!ui_storage.get('Option:disablePageRefresh')) {
				ui_improver.softRefreshInt = worker.setInterval(ui_improver.softRefresh, (ui_data.isFight || ui_data.isDungeon) ? 5e3 : 9e4);
				ui_improver.hardRefreshInt = worker.setInterval(ui_improver.hardRefresh, (ui_data.isFight || ui_data.isDungeon) ? 15e3 : 27e4);
			}
		}
	},
	observers: [],
	target: ['#main_wrapper']
};
ui_observers.diary = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			ui_improver.improveDiary();
		}
	},
	observers: [],
	target: ['#diary .d_content']
};
ui_observers.chronicles = {
	get condition() {
		return ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			ui_improver.improveChronicles();
		}
	},
	observers: [],
	target: ['#m_fight_log .d_content']
};
ui_observers.map_colorization = {
	get condition() {
		return ui_data.isDungeon;
	},
	config: {
		childList: true,
		subtree: true
	},
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			worker.clearTimeout(ui_improver.mapColorizationTmt);
			ui_improver.mapColorizationTmt = worker.setTimeout(ui_improver.colorDungeonMap.bind(ui_improver), 50);
		}
	},
	observers: [],
	target: ['#map .block_content']
};
ui_observers.allies_parse = {
	get condition() {
		return ui_data.isFight || ui_data.isDungeon;
	},
	config: {
		childList: true,
		subtree: true
	},
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			if (ui_improver.currentAlly === ui_improver.currentAllyObserver) {
				var hero_name = document.querySelectorAll('#alls .opp_n')[ui_improver.currentAlly],
					motto_field = mutation.target.querySelector('.h_motto');
				if (motto_field) {
					var special_motto = motto_field.textContent.match(/\[[^\]]+?\]/g);
					if (special_motto) {
						hero_name.textContent = hero_name.textContent + ' ' + special_motto.join('');
					}
				}
				var god_name = mutation.target.querySelector('.l_val').textContent;
				if (god_name.match(ui_improver.friendsRegexp)) {
					hero_name.insertAdjacentHTML('beforeend', ' <a id="openchatwith' + ui_improver.currentAlly + '" title="' + worker.GUIp_i18n.open_chat_with + god_name + '">★</a>');
					document.getElementById('openchatwith' + ui_improver.currentAlly).onclick = function(e) {
						e.preventDefault();
						e.stopPropagation();
						ui_utils.openChatWith(god_name);
					};
				}
				ui_improver.currentAlly += 1;
				var match = mutation.target.id.match(/popover_opp_all(\d)/);
				if (match) {
					ui_observers.allies_parse.observers[ui_improver.currentAlly - 1].disconnect();
				}
				worker.setTimeout(ui_improver.improveAllies.bind(ui_improver), 0);
			}
		}
	},
	observers: [],
	target: ['#popover_opp_all0', '#popover_opp_all1', '#popover_opp_all2', '#popover_opp_all3', '#popover_opp_all4']
};

// ui_trycatcher
var ui_trycatcher = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "trycatcher"}) : worker.GUIp.trycatcher = {};

ui_trycatcher.replace_with = function(method) {
	return function() {
		try {
			return method.apply(this, arguments);
		} catch (error) {
			var name_message = error.name + ': ' + error.message,
				stack = error.stack.replace(name_message, '').replace(/^\n|    at /g, '').replace(/(?:chrome-extension|@resource).*?:(\d+:\d+)/g, '@$1');
			if (!stack.match(/sendPing/)) {
				worker.console.error('Godville UI+ error log:\n' +
							  name_message + '\n' +
							  worker.GUIp_i18n.error_message_stack_trace + ': ' + stack);
				if (!ui_utils.hasShownErrorMessage) {
					ui_utils.hasShownErrorMessage = true;
					ui_utils.showMessage('error', {
						title: worker.GUIp_i18n.error_message_title,
						content: '<div>' + worker.GUIp_i18n.error_message_subtitle + '</div>' +
								 '<div>' + worker.GUIp_i18n.error_message_text + ' <b>' + name_message + '</b>.</div>' +
								 '<div>' + worker.GUIp_i18n.error_message_stack_trace + ': <b>' + stack.replace(/\n/g, '<br>') + '</b></div>',
						callback: function() {
							if (!ui_storage.get('helpDialogVisible')) {
								ui_help.toggleDialog();
							}
						}
					});
				}
			}
		}
	};
};
ui_trycatcher.process = function(object) {
	var method_name, method;
	for (method_name in object) {
		method = object[method_name];
		if (typeof method === "function") {
			object[method_name] = ui_trycatcher.replace_with(method);
		}
	}
};

// ui_starter
var ui_starter = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "starter"}) : worker.GUIp.starter = {};

ui_starter._init = function() {
	ui_data.init();
	ui_storage.migrate();
	ui_utils.addCSS();
	ui_utils.inform();
	ui_words.init();
	ui_logger.create();
	ui_timeout.create();
	ui_help.init();
	ui_informer.init();
	ui_forum.init();
	ui_improver.improve();
	ui_laying_timer.init();
	ui_observers.init();
	ui_improver.initSoundsOverride();
};
ui_starter.start = function() {
	if (worker.$ && (worker.$('#m_info').length || worker.$('#stats').length) && worker.GUIp_browser && worker.GUIp_i18n && worker.GUIp_addCSSFromURL && worker.so.state) {
		worker.clearInterval(starterInt);
		var start = new Date();

		ui_starter._init();

		// Event and listeners
		worker.$(document).bind('DOMNodeInserted', ui_improver.nodeInsertion.bind(ui_improver));

		if (!ui_data.isFight) {
			worker.onmousemove = worker.onscroll = worker.ontouchmove = ui_improver.activity;
		}

		// svg for #logger fade-out in FF
		var is5c = document.getElementsByClassName('page_wrapper_5c').length;
		document.body.insertAdjacentHTML('beforeend',
			'<svg id="fader">' +
				'<defs>' +
					'<linearGradient id="gradient" x1="0" y1="0" x2 ="100%" y2="0">' +
						'<stop stop-color="black" offset="0"></stop>' +
						'<stop stop-color="white" offset="0.0' + (is5c ? '2' : '3') + '"></stop>' +
					'</linearGradient>' +
					'<mask id="fader_masking" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">' +
						'<rect x="0.0' + (is5c ? '2' : '3') + '" width="0.9' + (is5c ? '8' : '7') + '" height="1" fill="url(#gradient)" />' +
					'</mask>' +
				'</defs>' +
			'</svg>'
		);

		var finish = new Date();
		worker.console.info('Godville UI+ log: Initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
	}
};

// Main code
var objects = [ui_data, ui_utils, ui_timeout, ui_help, ui_storage, ui_words, ui_stats, ui_logger,
			   ui_informer, ui_forum, ui_improver, ui_laying_timer, ui_observers, ui_starter];
for (var i = 0, len = objects.length; i < len; i++) {
	ui_trycatcher.process(objects[i]);
}
for (var observer in ui_observers) {
	ui_trycatcher.process(ui_observers[observer]);
}
var starterInt = worker.setInterval(ui_starter.start.bind(ui_starter), 200);

})();