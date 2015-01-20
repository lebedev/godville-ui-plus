(function() {
'use strict';

var worker = window.wrappedJSObject || window;

var ui_data = {
	currentVersion: '$VERSION',
// base variables initialization
	init: function() {
		this.isBattle = worker.so.state.is_fighting();
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

		// init forum data
		if (!ui_storage.get('Forum1')) {
			if (worker.GUIp_locale === 'ru') {
				ui_storage.set('Forum1', '{}');
				ui_storage.set('Forum2', '{"2812": 0}');
				ui_storage.set('Forum3', '{}');
				ui_storage.set('Forum4', '{}');
				ui_storage.set('Forum5', '{}');
				ui_storage.set('Forum6', '{}');
				ui_storage.set('ForumInformers', '{}');

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
				ui_storage.set('Forum2', '{}');
				ui_storage.set('Forum3', '{}');
				ui_storage.set('Forum4', '{}');
				ui_storage.set('ForumInformers', '{}');
			}
		}

		if (!this.isBattle && !this.isDungeon) {
			for (var i = 0, lines = [], len = worker.localStorage.length; i < len; i++) {
				if (worker.localStorage.key(i).match(/Dungeon:/)) {
					lines.push(worker.localStorage.key(i));
				}
			}
			for (i = 0, len = lines.length; i < len; i++) {
				worker.localStorage.removeItem(lines[i]);
			}
		}

		this.getLEMRestrictions();
		setInterval(this.getLEMRestrictions, 60*60*1000);

		// get monsters of the day
		this.getWantedMonster();
		setInterval(this.getWantedMonster, 5*60*1000);
	},
	getLEMRestrictions: function() {
		if (isNaN(ui_storage.get('LEMRestrictions:Date')) || Date.now() - ui_storage.get('LEMRestrictions:Date') > 24*60*60*1000) {
			ui_utils.getXHR('http://www.godalert.info/Dungeons/guip.cgi', ui_data.parseLEMRestrictions);
		}
	},
	parseLEMRestrictions: function(xhr) {
		var restrictions = JSON.parse(xhr.responseText);
		ui_storage.set('LEMRestrictions:Date', Date.now());
		ui_storage.set('LEMRestrictions:FirstRequest', restrictions.first_request);
		ui_storage.set('LEMRestrictions:TimeFrame', restrictions.time_frame);
		ui_storage.set('LEMRestrictions:RequestLimit', restrictions.request_limit);
	},
	getWantedMonster: function() {
		if (isNaN(ui_storage.get('WantedMonster:Date')) ||
			ui_utils.dateToMoscowTimeZone(+ui_storage.get('WantedMonster:Date')) < ui_utils.dateToMoscowTimeZone(Date.now())) {
			ui_utils.getXHR('/news', ui_data.parseWantedMonster);
		} else {
			ui_improver.wantedMonsters = new RegExp(ui_storage.get('WantedMonster:Value'));
		}
	},
	parseWantedMonster: function(xhr) {
		var temp = xhr.responseText.match(/(?:Разыскиваются|Wanted)[\s\S]+?>([^<]+?)<\/a>[\s\S]+?>([^<]+?)<\/a>/),
			newWantedMonster = temp ? temp[1] + '|' + temp[2] : '';
		if (newWantedMonster !== ui_storage.get('WantedMonster:Value')) {
			ui_storage.set('WantedMonster:Date', Date.now());
			ui_storage.set('WantedMonster:Value', newWantedMonster);
			ui_improver.wantedMonsters = new RegExp(newWantedMonster);
		}
	}
};

// ------------------------
//		UTILS
// ------------------------
var ui_utils = {
	hasShownErrorMessage: false,
	hasShownInfoMessage: false,
	get isDebugMode() {
		return ui_storage.get('Option:enableDebugMode');
	},
// base phrase say algorythm
	sayToHero: function(phrase) {
		worker.$('#god_phrase').val(phrase).change();
	},
// checks if $elem already improved
	isAlreadyImproved: function($elem) {
		if ($elem.hasClass('improved')) { return true; }
		$elem.addClass('improved');
		return false;
	},
// finds a label with given name
	findLabel: function($base_elem, label_name) {
		return worker.$('.l_capt', $base_elem).filter(function(index) {
			return worker.$(this).text() === label_name;
		});
	},
// finds a label with given name and appends given elem after it
	addAfterLabel: function($base_elem, label_name, $elem) {
		ui_utils.findLabel($base_elem, label_name).after($elem.addClass('voice_generator').addClass(ui_data.isDungeon ? 'dungeon' : ui_data.isBattle ? 'battle' : 'field'));
	},
// generic voice generator
	getGenSayButton: function(title, section, hint) {
		return worker.$('<a title="' + hint + '">' + title + '</a>').click(function() {
					 ui_utils.sayToHero(ui_words.longPhrase(section));
					 ui_words.currentPhrase = "";
					 return false;
				 });
	},
// Хелпер объединяет addAfterLabel и getGenSayButton
// + берет фразы из words['phrases']
	addSayPhraseAfterLabel: function($base_elem, label_name, btn_name, section, hint) {
		ui_utils.addAfterLabel($base_elem, label_name, ui_utils.getGenSayButton(btn_name, section, hint));
	},
// Случайный индекс в массиве
	getRandomIndex: function(arr) {
		return Math.floor(Math.random()*arr.length);
	},
// Случайный элемент массива
	getRandomItem: function(arr) {
		return arr[ui_utils.getRandomIndex(arr)];
	},
// Вытаскивает случайный элемент из массива
	popRandomItem: function(arr) {
		var ind = ui_utils.getRandomIndex(arr);
		var res = arr[ind];
		arr.splice(ind, 1);
		return res;
	},
	createInspectButton: function(item_name) {
		var a = document.createElement('a');
		a.className = 'inspect_button';
		a.title = worker.GUIp_i18n.ask1 + ui_data.char_sex[0] + worker.GUIp_i18n.inspect + item_name;
		a.textContent = '?';
		a.onclick = function() {
			ui_utils.sayToHero(ui_words.inspectPhrase(item_name));
			return false;
		};
		return a;
	},

	createCraftButton: function(combo, combo_list, hint) {
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
	},
// Escapes HTML symbols
	escapeHTML: function(str) {
		return String(str).replace(/&/g, "&amp;")
						  .replace(/"/g, "&quot;")
						  .replace(/</g, "&lt;")
						  .replace(/>/g, "&gt;");
	},
	addCSS: function () {
		if (!document.getElementById('ui_css')) {
			worker.GUIp_addCSSFromURL(worker.GUIp_getResource('superhero.css'), 'guip_css');
		}
	},
	getXHR: function(path, success_callback, fail_callback, extra_arg) {
		var xhr = new XMLHttpRequest();
		if (extra_arg) {
			xhr.extra_arg = extra_arg;
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState < 4) {
				return;
			}
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					if (success_callback) {
						success_callback(xhr);
					}
				} else {
					if (fail_callback) {
						fail_callback(xhr);
					}
				}
			}
		};

		xhr.open('GET', path, true);
		xhr.send('');
	},
	showMessage: function(msg_no, msg) {
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

		setTimeout(function() {
			$msg.fadeToggle(1500, msg.callback);
		}, 1000);
	},
	inform: function() {
		var last_shown = !isNaN(ui_storage.get('lastShownMessage')) ? +ui_storage.get('lastShownMessage') : -1;
		for (var i = 0, len = this.messages[worker.GUIp_locale].length; i < len; i++) {
			if (this.messages[worker.GUIp_locale][i].msg_no > last_shown) {
				this.showMessage(this.messages[worker.GUIp_locale][i].msg_no, this.messages[worker.GUIp_locale][i]);
			}
		}
	},
	messages: {
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
					ui_help_dialog.toggle();
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
					ui_help_dialog.toggle();
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
	},
	getNodeIndex: function(node) {
		var i = 0;
		while ((node = node.previousElementSibling)) {
			i++;
		}
		return i;
	},
	openChatWith: function(friend) {
		var current, friends = document.querySelectorAll('.msgDockPopupW .frline');
		for (var i = 0, len = friends.length; i < len; i++) {
			current = friends[i].querySelector('.frname');
			if (current.textContent === friend) {
				current.click();
				break;
			}
		}
	},
	dateToMoscowTimeZone: function(date) {
		var temp = new Date(date);
		temp.setTime(temp.getTime() + (temp.getTimezoneOffset() + 180)*60*1000);
		return temp.getFullYear() + '/' +
			  (temp.getMonth() + 1 < 10 ? '0' : '') + (temp.getMonth() + 1) + '/' +
			  (temp.getDate() < 10 ? '0' : '') + temp.getDate();
	}
};

// ------------------------
//		TIMEOUT BAR
// ------------------------
var ui_timeout = {
	bar: null,
	timeout: 0,
	_finishtDate: 0,
	_tickInt: 0,
	_tick: function() {
		if (Date.now() > this._finishDate) {
			clearInterval(this._tickInt);
			if (this.bar.style.transitionDuration) {
				this.bar.style.transitionDuration = '';
			}
			this.bar.classList.remove('running');
			if (!ui_data.isBattle && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) || document.querySelector('#god_phrase').value) {
				document.querySelector('#voice_submit').removeAttribute('disabled');
			}
		}
	},
// creates timeout bar element
	create: function() {
		this.bar = document.createElement('div');
		this.bar.id = 'timeout_bar';
		document.body.insertBefore(this.bar, document.body.firstChild);
	},
// starts timeout bar
	start: function() {
		clearInterval(this._tickInt);
		this.bar.style.transitionDuration = '';
		this.bar.classList.remove('running');
		setTimeout(this._delayedStart, 10);
		this._finishtDate = Date.now() + this.timeout*1000;
		this._tickInt = setInterval(this._tick.bind(this), 100);
		if (!ui_data.isBattle && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice')) {
			document.querySelector('#voice_submit').setAttribute('disabled', 'disabled');
		}
	},

	_delayedStart: function() {
		var customTimeout = ui_storage.get('Option:voiceTimeout');
		if (!isNaN(customTimeout)) {
			ui_timeout.timeout = customTimeout;
			ui_timeout.bar.style.transitionDuration = customTimeout + 's';
		} else {
			ui_timeout.timeout = 30;
		}
		ui_timeout.bar.classList.add('running');
	}
};

// ------------------------
//		HELP DIALOG
// ------------------------
var ui_help_dialog = {
// toggles ui dialog	
	toggle: function(visible) {
		ui_storage.set('helpDialogVisible', !ui_storage.get('helpDialogVisible'));
		worker.$('#ui_help_dialog').slideToggle("slow");
	},
// creates ui dialog	
	create: function() {
		var menu_bar = document.querySelector('#menu_bar ul');
		menu_bar.insertAdjacentHTML('beforeend', '<li> | </li><a href="user/profile#ui_options">' + worker.GUIp_i18n.ui_settings_top_menu + '</a><li> | </li>');
		this.addToggleButton(menu_bar, '<strong>' + worker.GUIp_i18n.ui_help + '</strong>');
		document.getElementById('menu_bar').insertAdjacentHTML('afterend',
			'<div id="ui_help_dialog" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' + 
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

		if (ui_utils.isDebugMode) {
			this.addDumpButton('<span>dump: </span>', 'all');
			this.addDumpButton('<span>, </span>', 'options', 'Option');
			this.addDumpButton('<span>, </span>', 'stats', 'Stats');
			this.addDumpButton('<span>, </span>', 'logger', 'Logger');
			this.addDumpButton('<span>, </span>', 'forum', 'Forum');
			this.addDumpButton('<span>, </span>', 'log', 'Log:');
		}
		this.addToggleButton(document.getElementsByClassName('hint_bar_close')[0], worker.GUIp_i18n.close);
		if (ui_storage.get('helpDialogVisible')) { worker.$('#ui_help_dialog').show(); }
		document.getElementById('check_version').onclick = function() {
			this.textContent = worker.GUIp_i18n.getting_version_no;
			this.classList.remove('div_link');
			ui_utils.getXHR('/forums/show/' + (worker.GUIp_locale === 'ru' ? '2' : '1'), ui_help_dialog.onXHRSuccess, ui_help_dialog.onXHRFail);
			return false;
		};
	},
	onXHRSuccess: function(xhr) {
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
				worker.$('#ui_help_dialog ol li.update_required.' + worker.GUIp_browser).removeClass('hidden');
			} else {
				worker.$('#ui_help_dialog ol li.worker.console.' + worker.GUIp_browser).removeClass('hidden');
			}
		} else {
			ui_help_dialog.onXHRFail();
		}
	},
	onXHRFail: function() {
		worker.$('#check_version')[0].textContent = worker.GUIp_i18n.getting_version_failed;
		worker.$('#ui_help_dialog ol li.' + worker.GUIp_browser).removeClass('hidden');
	},
// gets toggle button
	addToggleButton: function(elem, text) {
		elem.insertAdjacentHTML('beforeend', '<a class="close_button">' + text + '</a>');
		elem.getElementsByClassName('close_button')[0].onclick = function() {
			ui_help_dialog.toggle();
			return false;
		};
	},
// gets fump button with a given label and selector
	addDumpButton: function(text, label, selector) {
		var hint_bar_content = document.getElementsByClassName('hint_bar_content')[0];
		hint_bar_content.insertAdjacentHTML('beforeend', text + '<a class="devel_link" id="dump_' + label + '">' + label + '</a>');
		document.getElementById('dump_' + label).onclick = function() {
			ui_storage.dump(selector);
		};
	}
};

// ------------------------
//		STORAGE
// ------------------------
var ui_storage = {
	get_key: function(key) {
		return "GUIp_" + ui_data.god_name + ':' + key;
	},
// stores a value
	set: function(id, value) {
		worker.localStorage[this.get_key(id)] = value;
		return value;
	},
// reads a value
	get: function(id) {
		var val = worker.localStorage[this.get_key(id)];
		if (val === 'true') { return true; }
		if (val === 'false') { return false; }
		return val;
	},
// gets diff with a value
	diff: function(id, value) {
		var diff = null;
		var old = this.get(id);
		if (old !== null) {
			diff = value - old;
		}
		return diff;
	},
// stores value and gets diff with old
	set_with_diff: function(id, value) {
		var diff = this.diff(id, value);
		this.set(id, value);
		return diff;
	},
// dumps all values related to current god_name
	dump: function(selector) {
		var lines = [];
		var r = new RegExp('^GUIp_' + (selector === undefined ? '' : (ui_data.god_name + ':' + selector)));
		for (var i = 0; i < worker.localStorage.length; i++) {
			if (worker.localStorage.key(i).match(r)) {
				lines.push(worker.localStorage.key(i) + " = " + worker.localStorage[worker.localStorage.key(i)]);
			}
		}
		lines.sort();
		worker.console.info("Godville UI+ log: Storage:\n" + lines.join("\n"));
	},
// resets saved options
	clear: function() {
		var i, len, key, keys = [],
			r = new RegExp('^GUIp_.*');
		for (i = 0, len = worker.localStorage.length; i < len; i++) {
			key = worker.localStorage.key(i);
			if (key.match(r)) {
				keys.push(key);
			}
		}
		for (i = 0, len = keys.length; i < len; i++) {
			worker.localStorage.removeItem(keys[i]);
		}
		location.reload();
		return "Storage cleared. Reloading...";
	},
	migrate: function() {
		var i, len, lines = [];
		if (!worker.localStorage.GUIp_migrated) {
			for (i = 0, len = worker.localStorage.length; i < len; i++) {
				if (worker.localStorage.key(i).match(/^GM_/)) {
					lines.push(worker.localStorage.key(i));
				}
			}
			for (i = 0, len = lines.length; i < len; i++) {
				worker.localStorage[lines[i].replace(/^GM_/, 'GUIp_')] = worker.localStorage[lines[i]];
				worker.localStorage.removeItem(lines[i]);
			}
			worker.localStorage.GUIp_migrated = '151114';
		}
		if (worker.localStorage.GUIp_migrated === '151114' || worker.localStorage.GUIp_migrated < '150113') {
			if (this.get('phrases_walk_n')) {
				this.set('CustomPhrases:go_north', this.get('phrases_walk_n'));
				worker.localStorage.removeItem(this.get_key('phrases_walk_n'));
			}
			if (this.get('phrases_walk_e')) {
				this.set('CustomPhrases:go_east', this.get('phrases_walk_e'));
				worker.localStorage.removeItem(this.get_key('phrases_walk_e'));
			}
			if (this.get('phrases_walk_s')) {
				this.set('CustomPhrases:go_south', this.get('phrases_walk_s'));
				worker.localStorage.removeItem(this.get_key('phrases_walk_s'));
			}
			if (this.get('phrases_walk_w')) {
				this.set('CustomPhrases:go_west', this.get('phrases_walk_w'));
				worker.localStorage.removeItem(this.get_key('phrases_walk_w'));
			}
			for (i = 0, len = worker.localStorage.length; i < len; i++) {
				if (worker.localStorage.key(i).match(/:phrases_/)) {
					lines.push(worker.localStorage.key(i));
				}
			}
			for (i = 0, len = lines.length; i < len; i++) {
				worker.localStorage[lines[i].replace(/:phrases_/, ':CustomPhrases:')] = worker.localStorage[lines[i]];
				worker.localStorage.removeItem(lines[i]);
			}
			worker.localStorage.GUIp_migrated = '150113';
		}
	}
};

// ------------------------
//		WORDS
// ------------------------
var ui_words = {
	currentPhrase: "",
// gets words from phrases.js file and splits them into sections
	init: function() {
		this.base = worker.GUIp_words();
		for (var sect in this.base.phrases) {
			var text = ui_storage.get('CustomPhrases:' + sect);
			if (text && text !== "") {
				this.base.phrases[sect] = text.split("||");
			}
		}
	},
// single phrase gen
	randomPhrase: function(sect) {
		return ui_utils.getRandomItem(this.base.phrases[sect]);
	},
// main phrase constructor
	longPhrase: function(sect, item_name, len) {
		if (ui_storage.get('phrasesChanged')) {
			ui_words.init();
			ui_storage.set('phrasesChanged', 'false');
		}
		var prefix = this._addHeroName(this._addExclamation(''));
		var phrases;
		if (item_name) {
			phrases = [this.randomPhrase(sect) + ' ' + item_name + '!'];
		} else if (ui_storage.get('Option:useShortPhrases') || sect.match(/go_/)) {
			phrases = [this.randomPhrase(sect)];
		} else {
			phrases = this._longPhrase_recursion(this.base.phrases[sect].slice(), (len || 100) - prefix.length);
		}
		this.currentPhrase = prefix ? prefix + this._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
		return this.currentPhrase;
	},
// inspect button phrase gen
	inspectPhrase: function(item_name) {
		return this.longPhrase('inspect_prefix', item_name);
	},
// craft button phrase gen
	craftPhrase: function(items) {
		return this.longPhrase('craft_prefix', items);
	},

// Checkers
	isCategoryItem: function(cat, item_name) {
		return this.base.items[cat].indexOf(item_name) >= 0;
	},

	usableItemType: function(desc) {
		return this.base.usable_items.descriptions.indexOf(desc);
	},
	
	isHealItem: function(item) {
		return item.style.fontStyle === "italic";
	},

	isUsableItem: function(item) {
		return item.textContent.match(/\(@\)/);
	},
	
	isBoldItem: function(item) {
		return item.style.fontWeight === 700 || item.style.fontWeight === "bold";
	},

	_changeFirstLetter: function(text) {
		return text.charAt(0).toLowerCase() + text.slice(1);
	},

	_addHeroName: function(text) {
		if (!ui_storage.get('Option:useHeroName')) { return text; }
		return ui_data.char_name + ', ' + this._changeFirstLetter(text);
	},

	_addExclamation: function(text) {
		if (!ui_storage.get('Option:useExclamations')) { return text; }
		return ui_utils.getRandomItem(this.base.phrases.exclamation) + ', ' + this._changeFirstLetter(text);
	},

// Private (или типа того)
	_longPhrase_recursion: function(source, len) {
		while (source.length) {
			var next = ui_utils.popRandomItem(source);
			var remainder = len - next.length - 2; // 2 for ', '
			if (remainder > 0) {
				return [next].concat(this._longPhrase_recursion(source, remainder));
			}
		}
		return [];
	},
};

// ------------------------
// Stats storage
// ------------------------
var ui_stats = {
	get: function(key) {
		return ui_storage.get('Stats:' + key);
	},
	
	set: function(key, value) {
		return ui_storage.set('Stats:' + key, value);
	},
	
	setFromProgressBar: function(id, $elem) {	
		var value = $elem.attr('title').replace(/[^0-9]/g, '');
		return this.set(id, value);
	},
	
	setFromLabelCounter: function(id, $container, label, parser) {
		parser = parser || parseInt;
		var $label = ui_utils.findLabel($container, label);
		var $field = $label.siblings('.l_val');
		var value = parser($field.text());
		if (id === 'Bricks' || id === 'Logs') { return this.set(id, Math.floor(value*10 + 0.5)); }
		else { return this.set(id, value); }
	}
};

// ------------------------
// Oneline logger
// ------------------------
// ui_logger.create -- создать объект
// ui_logger.appendStr -- добавить строчку в конец лога
// ui_logger.needSepratorHere -- перед первой же следующей записью вставится разделитель
// ui_logger.watchProgressBar -- следить за полоской
// ui_logger.watchLabelCounter -- следить за значением лабела
var ui_logger = {
	Updating: false,
	bar: null,
	create: function() {
		this.bar = worker.$('<ul id="logger" style="mask: url(#fader_masking);"/>');
		worker.$('#menu_bar').after(this.bar);
		this.need_separator = false;
	},

	appendStr: function(id, klass, str, descr) {
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
	},

	watchStatsValue: function(id, name, descr, klass) {
		klass = (klass || id).toLowerCase();
		var diff = ui_storage.set_with_diff('Logger:' + id, ui_stats.get(id));
		if (diff) {
			// Если нужно, то преобразовываем в число с одним знаком после запятой
			if (parseInt(diff) !== diff) { diff = diff.toFixed(1); }
			// Добавление плюcа, минуса или стрелочки
			var s;
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
			this.appendStr(id, klass, name + s, descr);
		}
	},

	update: function() {
		if (ui_storage.get('Option:disableLogger')) {
			this.bar.hide();
			return;
		} else {
			this.bar.show();
		}
		if (ui_data.isDungeon) {
			this.watchStatsValue('Map_HP', 'hp', worker.GUIp_i18n.hero_health, 'hp');
			this.watchStatsValue('Map_Inv', 'inv', worker.GUIp_i18n.inventory, 'inv');
			this.watchStatsValue('Map_Gold', 'gld', worker.GUIp_i18n.gold, 'gold'); 
			this.watchStatsValue('Map_Charges', 'ch', worker.GUIp_i18n.charges, 'charges');
			this.watchStatsValue('Map_Alls_HP', 'a:hp', worker.GUIp_i18n.allies_health, 'charges');
		}
		if (ui_data.isBattle && !ui_data.isDungeon) {
			this.watchStatsValue('Hero_HP', 'h:hp', worker.GUIp_i18n.hero_health, 'hp');
			this.watchStatsValue('Enemy_HP', 'e:hp', worker.GUIp_i18n.enemy_health, 'death');
			this.watchStatsValue('Hero_Alls_HP', 'a:hp', worker.GUIp_i18n.allies_health, 'charges');
			this.watchStatsValue('Hero_Inv', 'h:inv', worker.GUIp_i18n.inventory, 'inv');
			this.watchStatsValue('Hero_Gold', 'h:gld', worker.GUIp_i18n.gold, 'gold');
			this.watchStatsValue('Hero_Charges', 'h:ch', worker.GUIp_i18n.charges, 'charges');
			this.watchStatsValue('Enemy_Gold', 'e:gld', worker.GUIp_i18n.gold, 'monster');
			this.watchStatsValue('Enemy_Inv', 'e:inv', worker.GUIp_i18n.inventory, 'monster');
		}
		this.watchStatsValue('Exp', 'exp', worker.GUIp_i18n.exp);
		this.watchStatsValue('Level', 'lvl', worker.GUIp_i18n.level);
		this.watchStatsValue('HP', 'hp', worker.GUIp_i18n.health);
		this.watchStatsValue('Godpower', 'gp', worker.GUIp_i18n.godpower);
		this.watchStatsValue('Charges', 'ch', worker.GUIp_i18n.charges);
		this.watchStatsValue('Task', 'tsk', worker.GUIp_i18n.task);
		this.watchStatsValue('Monster', 'mns', worker.GUIp_i18n.monsters);
		this.watchStatsValue('Inv', 'inv', worker.GUIp_i18n.inventory);
		this.watchStatsValue('Gold', 'gld', worker.GUIp_i18n.gold);
		this.watchStatsValue('Bricks', 'br', worker.GUIp_i18n.bricks);
		this.watchStatsValue('Logs', 'wd', worker.GUIp_i18n.logs);
		this.watchStatsValue('Savings', 'rtr', worker.GUIp_i18n.savings);
		this.watchStatsValue('Equip1', 'eq1', worker.GUIp_i18n.weapon, 'equip');
		this.watchStatsValue('Equip2', 'eq2', worker.GUIp_i18n.shield, 'equip');
		this.watchStatsValue('Equip3', 'eq3', worker.GUIp_i18n.head, 'equip');
		this.watchStatsValue('Equip4', 'eq4', worker.GUIp_i18n.body, 'equip');
		this.watchStatsValue('Equip5', 'eq5', worker.GUIp_i18n.arms, 'equip');
		this.watchStatsValue('Equip6', 'eq6', worker.GUIp_i18n.legs, 'equip');
		this.watchStatsValue('Equip7', 'eq7', worker.GUIp_i18n.talisman, 'equip');
		this.watchStatsValue('Death', 'death', worker.GUIp_i18n.death_count);
		this.watchStatsValue('Pet_Level', 'pet_level', worker.GUIp_i18n.pet_level, 'monster');
		this.need_separator = true;
	}
};

// ------------------------------------
// Информаер для важной информации
// * мигает заголовком
// * показывает попапы
// ------------------------------------
var ui_informer = {
	flags: {},
	init: function() {
		//title saver
		this.title = document.title;
		// container
		document.getElementById('main_wrapper').insertAdjacentHTML('afterbegin', '<div id="informer_bar" />');
		this.container = document.getElementById('informer_bar');
		// load and draw labels
		this.load();
		for (var flag in this.flags) {
			if (this.flags[flag]) {
				this.create_label(flag);
			}
		}
		// run flicker
		this.tick();
	},
	// устанавливает или удаляет флаг
	update: function(flag, value) {
		if (value && (flag === 'pvp' || !(ui_data.isBattle && !ui_data.isDungeon)) && !(ui_storage.get('Option:forbiddenInformers') &&
			ui_storage.get('Option:forbiddenInformers').match(flag.replace(/ /g, '_')))) {
			if (!(flag in this.flags)) {
				this.flags[flag] = true;
				this.create_label(flag);
				this.save();
			}
		} else if (flag in this.flags) {
			delete this.flags[flag];
			this.delete_label(flag);
			this.save();
		}
		if (!this.tref) {
			this.tick();
		}
	},
	// убирает оповещение о событии
	hide: function(flag) {
		this.flags[flag] = false;
		this.delete_label(flag);
		this.save();
	},
	// PRIVATE
	load: function() {
		var fl = ui_storage.get('informer_flags');
		if (!fl || fl === "") { fl = '{}'; }
		this.flags = JSON.parse(fl);
	},
	
	save: function() {
		ui_storage.set('informer_flags', JSON.stringify(this.flags));
	},
	
	create_label: function(flag) {
		var id = flag.replace(/ /g, '_');
		this.container.insertAdjacentHTML('beforeend', '<div id="' + id + '">' + flag + '</div>');
		document.getElementById(id).onclick = function() {
			ui_informer.hide(flag);
			return false;
		};
	},
	
	delete_label: function(flag) {
		var label = document.getElementById(flag.replace(/ /g, '_'));
		if (label) {
			this.container.removeChild(label);
		}
	},
	
	tick: function() {
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
			this.update_title(to_show);
			this.tref = setTimeout(this.tick.bind(this), 700);
		} else {
			this.clear_title();
			this.tref = undefined;
		}
	},

	clear_title: function() {
		var forbidden_title_notices = ui_storage.get('Option:forbiddenTitleNotices') || '';
		var pm = 0;
		if (!forbidden_title_notices.match('pm')) {
			var pm_badge = document.querySelector('.fr_new_badge_pos');
			if (pm_badge && pm_badge.style.display !== 'none') {
				pm = +pm_badge.textContent;
			}
			var stars = document.querySelectorAll('.msgDock .fr_new_msg');
			for (var i = 0, len = stars.length; i < len; i++) {
				if (!stars[i].parentNode.getElementsByClassName('dockfrname')[0].textContent.match(/Гильдсовет|Guild Council/)) {
					pm++;
				}
			}
		}
		pm = pm ? '[' + pm + ']' : '';

		var gm = false;
		if (!forbidden_title_notices.match('gm')) {
			gm = document.getElementsByClassName('gc_new_badge')[0].style.display !== 'none';
		}
		gm = gm ? '[g]' : '';

		var fi = 0;
		if (!forbidden_title_notices.match('fi')) {
			for (var topic in JSON.parse(ui_storage.get('ForumInformers'))) {
				fi++;
			}
		}
		fi = fi ? '[f]' : '';

		document.title = pm + gm + fi + (pm || gm || fi ? ' ' : '') + this.title;
		document.head.removeChild(document.querySelector('link[rel="shortcut icon"]'));
		document.head.insertAdjacentHTML('beforeend', '<link rel="shortcut icon" href="images/favicon.ico" />');
	},
	
	update_title: function(arr) {
		this.odd_tick = ! this.odd_tick;
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
	}
};

// ------------------------------------
// Информер для форума
// * показывает попапы
// ------------------------------------
var ui_forum = {
	init: function() {
		document.body.insertAdjacentHTML('afterbegin', '<div id="forum_informer_bar" />');
		this.check();
		setInterval(this.check.bind(this), 300000);
	},
	check: function() {
		for (var forum_no = 1; forum_no <= (worker.GUIp_locale === 'ru' ? 6 : 4); forum_no++) {
			var current_forum = JSON.parse(ui_storage.get('Forum' + forum_no)),
				topics = [];
			for (var topic in current_forum) {
				// to prevent simultaneous ForumInformers access
				setTimeout(ui_utils.getXHR.bind(this, '/forums/show/' + forum_no, this.parse, undefined, forum_no), 500*forum_no);
				break;
			}
		}
	},
	process: function(forum_no) {
		var informers = JSON.parse(ui_storage.get('ForumInformers')),
			topics = JSON.parse(ui_storage.get('Forum' + forum_no));
		for (var topic in topics) {
			if (informers[topic]) {
				this.set_informer(topic, informers[topic], topics[topic]);
			}
		}
	},
	set_informer: function(topic_no, topic_data, posts_count) {
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
					worker.$(document).trigger("DOMNodeInserted");
					worker.$(this).slideToggle("fast", function() {
						if (this.parentElement) {
							this.parentElement.removeChild(this);
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
	},
	parse: function(xhr) {
		var i, diff, temp, old_diff,
			forum = JSON.parse(ui_storage.get('Forum' + xhr.extra_arg)),
			informers = JSON.parse(ui_storage.get('ForumInformers')),
			topics = [];
		for (var topic in forum) {
			topics.push(topic);
		}
		for (i = 0, len = topics.length; i < len; i++) {
			temp = xhr.responseText.match(new RegExp("show_topic\\/" + topics[i] + "[^\\d>]+>([^<]+)(?:.*?\\n*?)*?<td class=\"ca inv stat\">(\\d+)<\\/td>(?:.*?\\n*?)*?<strong class=\"fn\">([^<]+)<\\/strong>(?:.*?\\n*?)*?show_topic\\/" + topics[i]));
			if (temp) {
				diff = +temp[2] - forum[topics[i]];
				if (diff) {
					forum[topics[i]] = +temp[2];
					if (diff > 0) {
						if (temp[3] !== ui_data.god_name) {
							if (!informers[topics[i]]) {
								//create
								informers[topics[i]] = {diff: diff, name: temp[1].replace(/&quot;/g, '"')};
							} else {
								//update
								old_diff = informers[topics[i]].diff;
								delete informers[topics[i]];
								informers[topics[i]] = {diff: old_diff + diff, name: temp[1].replace(/&quot;/g, '"')};
							}
						} else {
							delete informers[topics[i]];
						}
					}
				}
			}
		}
		ui_storage.set('ForumInformers', JSON.stringify(informers));
		ui_storage.set('Forum' + xhr.extra_arg, JSON.stringify(forum));
		ui_forum.process(xhr.extra_arg);
	}
};

// ------------------------------------
//	Improvements !!
// ------------------------------------
var ui_improver = {
	inventoryChanged: true,
	improveInProcess: true,
	isFirstTime: true,
	voiceSubmitted: false,
	wantedMonsters: null,
	friendsRegexp: null,
	windowResizeInt: 0,
	mapColorizationTmt: 0,
	alliesCount: 0,
	currentAlly: 0,
	currentAllyObserver: 0,
	// trophy craft combinations
	b_b: [],
	b_r: [],
	r_r: [],
	// dungeon phrases
	dungeonPhrases: [
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
	],
	// resresher
	softRefreshInt: 0,
	hardRefreshInt: 0,
	softRefresh: function() {
		worker.console.info('Godville UI+ log: Soft reloading...');
		document.getElementById('d_refresh').click();
	},
	hardRefresh: function() {
		worker.console.warn('Godville UI+ log: Hard reloading...');
		location.reload();
	},
	improve: function() {
		this.improveInProcess = true;
		ui_informer.update('pvp', ui_data.isBattle && !ui_data.isDungeon);
		ui_informer.update('arena available', worker.so.state.arena_available());
		ui_informer.update('dungeon available', worker.so.state.dungeon_available());
		if (this.isFirstTime) {
			if (!ui_data.isBattle && !ui_data.isDungeon) {
				this.improveDiary();
				this.improveLoot();
			}
			if (ui_data.isDungeon) {
				this.getDungeonPhrases();
			}
		}
		this.improveStats();
		this.improvePet();
		this.improveVoiceDialog();
		if (!ui_data.isBattle) {
			this.improveNews();
			this.improveEquip();
			this.improvePantheons();
		}
		if (ui_data.isDungeon) {
			this.improveMap();
		}
		this.improveInterface();
		this.improveChat();
		if (this.isFirstTime && (ui_data.isBattle || ui_data.isDungeon)) {
			this.improveAllies();
		}
		this.checkButtonsVisibility();
		this.isFirstTime = false;
		this.improveInProcess = false;
	},
	
	improveLoot: function() {
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
	},

	improveVoiceDialog: function() {
		// Add links and show timeout bar after saying
		if (this.isFirstTime) {
			if (!ui_data.isBattle && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) {
				worker.$('#voice_submit').attr('disabled', 'disabled');
			}
			worker.$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
				if (!ui_data.isBattle && worker.$(this).val() && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && parseInt(ui_timeout.bar.style.width))) {
					worker.$('#voice_submit').removeAttr('disabled');
				} else if (!ui_data.isBattle && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) {
					worker.$('#voice_submit').attr('disabled', 'disabled');
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
				if (ui_data.isBattle) {
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
	},

// ----------- Вести с полей ----------------
	improveNews: function() {
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
	},

			//	Функция итерации
	MapIteration: function(MapThermo, iPointer, jPointer, step, kRow, kColumn) {
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
								this.MapIteration(MapThermo, iNext, jNext, step, kRow, kColumn);
							}
						}
					}
				}
			}
		}
	},

// ---------- Map --------------
	improveMap: function() {
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
						this.MapIteration(MapThermo, si, sj, 0, kRow, kColumn);
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
	},

// ---------- Stats --------------
	improveStats: function() {
		//	Парсер строки с золотом
		var gold_parser = function(val) {
			return parseInt(val.replace(/[^0-9]/g, '')) || 0;
		};

		if (ui_data.isDungeon) {
			ui_stats.setFromLabelCounter('Map_HP', worker.$('#m_info'), worker.GUIp_i18n.health_label);
			ui_stats.setFromLabelCounter('Map_Gold', worker.$('#m_info'), worker.GUIp_i18n.gold_label, gold_parser);
			ui_stats.setFromLabelCounter('Map_Inv', worker.$('#m_info'), worker.GUIp_i18n.inventory_label);
			ui_stats.set('Map_Charges', worker.$('#m_control .acc_val').text(), parseFloat);
			ui_stats.set('Map_Alls_HP', this.GroupHP(true));
			if (ui_storage.get('Logger:Location') === 'Field') {
				ui_storage.set('Logger:Location', 'Dungeon');
				ui_storage.set('Logger:Map_HP', ui_stats.get('Map_HP'));
				ui_storage.set('Logger:Map_Gold', ui_stats.get('Map_Gold'));
				ui_storage.set('Logger:Map_Inv', ui_stats.get('Map_Inv'));
				ui_storage.set('Logger:Map_Charges',ui_stats.get('Map_Charges'));
				ui_storage.set('Logger:Map_Alls_HP', ui_stats.get('Map_Alls_HP'));
			}
			ui_informer.update('low health', ui_stats.get('Map_HP') < 120);
			return;
		}
		if (ui_data.isBattle) {
			ui_stats.setFromLabelCounter('Hero_HP', worker.$('#m_info'), worker.GUIp_i18n.health_label);
			ui_stats.setFromLabelCounter('Hero_Gold', worker.$('#m_info'), worker.GUIp_i18n.gold_label, gold_parser);
			ui_stats.setFromLabelCounter('Hero_Inv', worker.$('#m_info'), worker.GUIp_i18n.inventory_label);
			ui_stats.set('Hero_Charges', worker.$('#m_control .acc_val').text(), parseFloat);
			ui_stats.setFromLabelCounter('Enemy_Gold', worker.$('#o_info'), worker.GUIp_i18n.gold_label, gold_parser);
			ui_stats.setFromLabelCounter('Enemy_Inv', worker.$('#o_info'), worker.GUIp_i18n.inventory_label);
			ui_stats.set('Hero_Alls_HP', this.GroupHP(true));
			ui_stats.set('Enemy_HP', this.GroupHP(false));
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
			ui_informer.update('low health', ui_stats.get('Hero_HP') < 120);
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
	},
// ---------- Pet --------------
	improvePet: function() {
		if (ui_data.isBattle) { return; }
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
	},
// ---------- Equipment --------------
	improveEquip: function() {
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
	},
// ---------- Group HP --------------
	GroupHP: function(flag) {		
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
	},
// ---------- Pantheons --------------	
	improvePantheons: function() {
		if (ui_storage.get('Option:relocateDuelButtons') !== undefined && ui_storage.get('Option:relocateDuelButtons').match('arena')) {
			if (!worker.$('#pantheons.arena_link_relocated').length) {
				worker.$('#pantheons').addClass('arena_link_relocated');
				worker.$('.arena_link_wrap').insertBefore(worker.$('#pantheons_content')).addClass('p_group_sep').css('padding-top', 0);
			}
		} else if (worker.$('#pantheons.arena_link_relocated').length) {
			worker.$('#pantheons').removeClass('arena_link_relocated').removeClass('both');
			worker.$('.arena_link_wrap').insertBefore(worker.$('#control .arena_msg')).removeClass('p_group_sep').css('padding-top', '0.5em');
		}
		if (ui_storage.get('Option:relocateDuelButtons') !== undefined && ui_storage.get('Option:relocateDuelButtons').match('chf')) {
			if (!worker.$('#pantheons.chf_link_relocated').length) {
				worker.$('#pantheons').addClass('chf_link_relocated');
				worker.$('.chf_link_wrap:first').insertBefore(worker.$('#pantheons_content'));
				worker.$('#pantheons .chf_link_wrap').addClass('p_group_sep');
			}
		} else if (worker.$('#pantheons.chf_link_relocated').length) {
			worker.$('#pantheons').removeClass('chf_link_relocated').removeClass('both');
			worker.$('.chf_link_wrap').removeClass('p_group_sep');
			worker.$('#pantheons .chf_link_wrap').insertAfter(worker.$('#control .arena_msg'));
		}/*
		if (ui_storage.get('Option:relocateDuelButtons') !== undefined && ui_storage.get('Option:relocateDuelButtons').match('cvs')) {
			if (!worker.$('#pantheons.cvs_link_relocated').length) {
				worker.$('#pantheons').addClass('cvs_link_relocated');
				worker.$('.chf_link_wrap:first').insertBefore(worker.$('#pantheons_content'));
				worker.$('#pantheons .chf_link_wrap').addClass('p_group_sep');
			}
		} else if (worker.$('#pantheons.cvs_link_relocated').length) {
			worker.$('#pantheons').removeClass('cvs_link_relocated').removeClass('both');
			worker.$('.chf_link_wrap').removeClass('p_group_sep');
			worker.$('#pantheons .chf_link_wrap').insertAfter(worker.$('#control .arena_msg'));
		}	*/
		if (worker.$('#pantheons.arena_link_relocated.chf_link_relocated:not(.both)').length) {
			worker.$('#pantheons').addClass('both');
			worker.$('#pantheons .chf_link_wrap').insertBefore(worker.$('#pantheons_content'));
			worker.$('.arena_link_wrap').removeClass('p_group_sep');
		}
	},
// ---------- Diary --------------		
	improveDiary: function() {
		if (ui_data.isBattle) { return; }
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
	},

	parseDungeonPhrases: function(xhr) {
		for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
			temp = xhr.responseText.match(new RegExp('<p>' + this.dungeonPhrases[i] + '\\b([\\s\\S]+?)<\/p>'))[1].replace(/&#8230;/g, '...').replace(/^<br>\n|<br>$/g, '').replace(/<br>\n/g, '|');
			this[this.dungeonPhrases[i] + 'RegExp'] = new RegExp(temp);
			ui_storage.set('Dungeon:' + this.dungeonPhrases[i] + 'Phrases', temp);
		}
		this.improveChronicles();
	},
	getDungeonPhrases: function() {
		if (!ui_storage.get('Dungeon:bossPhrases')) {
			ui_utils.getXHR('/gods/' + (worker.GUIp_locale === 'ru' ? 'Спандарамет' : 'God Of Dungeons'), this.parseDungeonPhrases.bind(this));
		} else {
			for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
				this[this.dungeonPhrases[i] + 'RegExp'] = new RegExp(ui_storage.get('Dungeon:' + this.dungeonPhrases[i] + 'Phrases'));
			}
			this.improveChronicles();
		}
	},
	parseChronicles: function(xhr) {
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
	},
	improveChronicles: function() {
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

			this.colorDungeonMap();
		}
		if (this.isFirstTime) {
			ui_utils.getXHR('/duels/log/' + worker.so.state.stats.perm_link.value, this.parseChronicles.bind(this));
		}
		ui_storage.set('Log:current', worker.so.state.stats.perm_link.value);
		ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':steps', worker.$('#m_fight_log .block_title').text().match(/\d+/)[0]);
		ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':map', JSON.stringify(worker.so.state.d_map));
	},

	colorDungeonMap: function() {
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
	},

	whenWindowResize: function() {
		this.chatsFix();
		//body widening
		worker.$('body').width(worker.$(worker).width() < worker.$('#main_wrapper').width() ? worker.$('#main_wrapper').width() : '');
	},

	improveInterface: function() {
		if (this.isFirstTime) {
			worker.$('a[href=#]').removeAttr('href');
			this.whenWindowResize();
			worker.$(worker).resize((function() {
				clearInterval(this.windowResizeInt);
				this.windowResizeInt = setTimeout(this.whenWindowResize.bind(this), 250);
			}).bind(this));
			if (ui_data.isBattle) {
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
	},
	
	improveChat: function() {
		var i, len;

		// friends fetching
		if (this.isFirstTime && (ui_data.isBattle || ui_data.isDungeon)) {
			var $friends = document.querySelectorAll('.frline .frname'),
				friends = [];
			for (i = 0, len = $friends.length; i < len; i++) {
				friends.push($friends[i].textContent);
			}
			this.friendsRegexp = new RegExp('^(?:' + friends.join('|') + ')$');
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
			$cur_msg.append(ui_utils.escapeHTML(text).replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="Откроется в новой вкладке">$1</a>'));
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
	},

	improveAllies: function() {
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
	},

	checkButtonsVisibility: function() {
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
			if (!ui_data.isBattle) {
				if (worker.$('#hk_distance .l_capt').text().match(/Город|Current Town/) || worker.$('.f_news').text().match('дорогу') || worker.$('#news .line')[0].style.display !== 'none') { worker.$('#hk_distance .voice_generator').hide(); }
				//if (ui_storage.get('Stats:Godpower') === 100) worker.$('#control .voice_generator').hide();
				if (worker.$('#control .p_val').width() === worker.$('#control .p_bar').width() || worker.$('#news .line')[0].style.display !== 'none') { worker.$('#control .voice_generator')[0].style.display = 'none'; }
				if (worker.$('#hk_distance .l_capt').text().match(/Город|Current Town/)) { worker.$('#control .voice_generator')[1].style.display = 'none'; }
			}
			if (worker.$('#hk_quests_completed .q_name').text().match(/\(выполнено\)/)) { worker.$('#hk_quests_completed .voice_generator').hide(); }
			if (worker.$('#hk_health .p_val').width() === worker.$('#hk_health .p_bar').width()) { worker.$('#hk_health .voice_generator').hide(); }
		}
	},

	chatsFix: function() {
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
	},

	initSoundsOverride: function() {
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
					setTimeout(function() {
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
	},

	mouseMove: function() {
		if (!ui_logger.Updating) {
			ui_logger.Updating = true;
			setTimeout(function() {
				ui_logger.Updating = false;
			}, 500);
			ui_logger.update();
		}
	},

	nodeInsertion: function() {
		if (!this.improveInProcess) {
			this.improveInProcess = true;
			setTimeout(this.nodeInsertionDelay.bind(this), 50);
		}
	},

	nodeInsertionDelay: function() {
		this.improve();
		if (ui_data.isBattle) {
			ui_logger.update();
		}
	}
};

var ui_laying_timer = {
	init: function() {
		if (ui_data.hasTemple && !ui_data.isBattle && !ui_data.isDungeon && !ui_storage.get('Option:disableLayingTimer')) {
			document.querySelector('#imp_button').insertAdjacentHTML('afterend', '<div id=\"laying_timer\" class=\"fr_new_badge\" />');
			for (var key in worker) {
				if (key.match(/^diary/)) {
					this.third_eye = key;
					break;
				}
			}
			this.tick();
			setInterval(this.tick.bind(this), 60000);
		}
	},
	tick: function() {
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
	}
};

var ui_observers = {
	init: function() {
		for (var key in this) {
			if (this[key].condition) {
				this.start(this[key]);
			}
		}
	},
	process_mutations: function(obj_func, mutations) {
		mutations.forEach(obj_func);
	},
	start: function(obj) {
		for (var i = 0, len = obj.target.length; i < len; i++) {
			var target = document.querySelector(obj.target[i]);
			if (target) {
				var observer = new MutationObserver(this.process_mutations.bind(this, obj.func));
				observer.observe(target, obj.config);
				obj.observers.push(observer);
			}
		}
	},
	chats: {
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
	},
	inventory: {
		get condition() {
			return !ui_data.isBattle && !ui_data.isDungeon;
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
	},
	refresher: {
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
				clearInterval(ui_improver.softRefreshInt);
				clearInterval(ui_improver.hardRefreshInt);
				if (!ui_storage.get('Option:disablePageRefresh')) {
					ui_improver.softRefreshInt = setInterval(ui_improver.softRefresh, (ui_data.isBattle || ui_data.isDungeon) ? 5e3 : 9e4);
					ui_improver.hardRefreshInt = setInterval(ui_improver.hardRefresh, (ui_data.isBattle || ui_data.isDungeon) ? 15e3 : 27e4);
				}
			}
		},
		observers: [],
		target: ['#main_wrapper']
	},
	diary: {
		get condition() {
			return !ui_data.isBattle && !ui_data.isDungeon;
		},
		config: { childList: true },
		func: function(mutation) {
			if (mutation.addedNodes.length) {
				ui_improver.improveDiary();
			}
		},
		observers: [],
		target: ['#diary .d_content']
	},
	chronicles: {
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
	},
	map_colorization: {
		get condition() {
			return ui_data.isDungeon;
		},
		config: {
			childList: true,
			subtree: true
		},
		func: function(mutation) {
			if (mutation.addedNodes.length) {
				clearTimeout(ui_improver.mapColorizationTmt);
				ui_improver.mapColorizationTmt = setTimeout(ui_improver.colorDungeonMap.bind(ui_improver), 50);
			}
		},
		observers: [],
		target: ['#map .block_content']
	},
	allies_parse: {
		get condition() {
			return ui_data.isBattle || ui_data.isDungeon;
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
					setTimeout(ui_improver.improveAllies.bind(ui_improver), 0);
				}
			}
		},
		observers: [],
		target: ['#popover_opp_all0', '#popover_opp_all1', '#popover_opp_all2', '#popover_opp_all3', '#popover_opp_all4']
	}
};
      
var ui_trycatcher = {
	replace_with: function(method) {
		return function() {
			try {
				return method.apply(this, arguments);
			} catch (error) {
				var name_message = error.name + ': ' + error.message,
					stack = error.stack.replace(name_message, '').replace(/^\n|    at /g, '').replace(/(?:chrome-extension|@resource).*?:(\d+:\d+)/g, '@$1');
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
								ui_help_dialog.toggle();
							}
						}
					});
				}
			}
		};
	},
	process: function(object) {
		var method_name, method;
		for (method_name in object) {
			method = object[method_name];
			if (typeof method === "function") {
				object[method_name] = this.replace_with(method);
			}
		}
	}
};

var ui_starter = {
	start: function() {
		if (worker.$ && (worker.$('#m_info').length || worker.$('#stats').length) && worker.GUIp_browser && worker.GUIp_i18n && worker.GUIp_addCSSFromURL && worker.so.state) {
			clearInterval(starterInt);
			var start = new Date();
			ui_data.init();
			ui_storage.migrate();
			ui_utils.addCSS();
			ui_utils.inform();
			ui_words.init();
			ui_logger.create();
			ui_timeout.create();
			ui_help_dialog.create();
			ui_informer.init();
			ui_forum.init();
			ui_improver.improve();
			ui_laying_timer.init();
			ui_observers.init();
			ui_improver.initSoundsOverride();
			
			// Event and listeners
			worker.$(document).bind('DOMNodeInserted', ui_improver.nodeInsertion.bind(ui_improver));

			if (!ui_data.isBattle) {
				worker.$('html').mousemove(ui_improver.mouseMove);
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

			if (ui_utils.isDebugMode) {
				worker.GUIp = {
					data: ui_data,
					utils: ui_utils,
					timeout: ui_timeout,
					help_dialog: ui_help_dialog,
					storage: ui_storage,
					words: ui_words,
					stats: ui_stats,
					logger: ui_logger,
					informer: ui_informer,
					forum: ui_forum,
					improver: ui_improver,
					observers: ui_observers,
					starter: ui_starter,
					laying_timer: ui_laying_timer
				};
			}

			var finish = new Date();
			worker.console.info('Godville UI+ log: Initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
		}
	}
};

// Main code
var objects = [ui_data, ui_utils, ui_timeout, ui_help_dialog, ui_storage, ui_words,
			   ui_stats, ui_logger, ui_informer, ui_forum, ui_improver, ui_observers, ui_starter];
for (var i = 0, len = objects.length; i < len; i++) {
	ui_trycatcher.process(objects[i]);
}
for (var observer in ui_observers) {
	ui_trycatcher.process(ui_observers[observer]);
}
var starterInt = setInterval(ui_starter.start, 200);

})();