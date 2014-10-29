var ui_data = {
	currentVersion: '$VERSION',
	developers: ['Neniu', 'Ryoko', 'Опытный Кролик', 'Бэдлак', 'Ui Developer', 'Шоп', 'Спандарамет'],
// base variables initialization
	init: function() {
		this.isArena = ($('#m_info').length > 0);
		this.isBoss = ($('#o_info .line').length > 0);
		this.isMap = ($('#map .dml').length > 0);
		if (this.isArena) {
			this.god_name = $('#m_info .l_val')[0].textContent.replace('庙','').replace('畜','').replace('舟','');
			this.char_name = $('#m_info .l_val')[1].textContent;
		} else {
			var $user = $('#stats.block div a[href^="/gods/"]')[0];
			this.god_name = decodeURI($user.href.replace(/http(s)?:\/\/godville\.net\/gods\//, ''));
			this.char_name = $user.textContent;
		}
		ui_storage.set('sex', document.title.match('героиня') ? 'female' : 'male');
		this.char_sex = document.title.match('героиня') ? ['героиню', 'героине'] : ['героя', 'герою'];
		ui_storage.set('ui_s', '');
		localStorage.setItem('GM_CurrentUser', this.god_name);

		// init forum data
		if (!ui_storage.get('Forum1')) {
			ui_storage.set('Forum1', '{}');
			ui_storage.set('Forum2', '{"2812": 0}');
			ui_storage.set('Forum3', '{}');
			ui_storage.set('Forum4', '{}');
			ui_storage.set('Forum5', '{}');
			ui_storage.set('Forum6', '{}');
			ui_storage.set('ForumInformers', '{}');

			// clear old data
			localStorage.removeItem('GM_' + this.god_name + ':posts');
			localStorage.removeItem('GM_Options:User');
			var informer_flags = JSON.parse(ui_storage.get('informer_flags'));
			if (informer_flags) {
				delete informer_flags['new posts'];
				ui_storage.set('informer_flags', JSON.stringify(informer_flags));
			}
		}

		// get monsters of the day
		$('<div>', {id:"motd"}).insertAfter($('#menu_bar')).hide();
		$('#motd').load('news .game.clearfix:first a', function() {
			ui_improver.monstersOfTheDay = new RegExp($('#motd a:eq(0)').text() + '|' + $('#motd a:eq(1)').text());
			$('#motd').remove();
		});
	}
};

// ------------------------
//		UTILS
// ------------------------
var ui_utils = {
	hasShownErrorMessage: false,
	hasShownInfoMessage: false,
	isDeveloper: function () {
		return ui_data.developers.indexOf(ui_data.god_name) >= 0;
	},
// base phrase say algorythm
	sayToHero: function(phrase) {
		$('#god_phrase').val(phrase).change();
	},
// checks if $elem already improved
	isAlreadyImproved: function($elem) {
		if ($elem.hasClass('improved')) return true;
		$elem.addClass('improved');
		return false;
	},
// finds a label with given name
	findLabel: function($base_elem, label_name) {
		return $('.l_capt', $base_elem).filter(function(index) {
			return $(this).text() == label_name;
		});
	},
// finds a label with given name and appends given elem after it
	addAfterLabel: function($base_elem, label_name, $elem) {
		ui_utils.findLabel($base_elem, label_name).after($elem.addClass('voice_generator'));
	},
// generic voice generator
	getGenSayButton: function(title, section, hint) {
		return $('<a title="' + hint + '">' + title + '</a>').click(function() {
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
		a.title = 'Упросить ' + ui_data.char_sex[0] + ' ' + ['потрясти', 'исследовать', 'осмотреть'][Math.floor(Math.random()*3)] + ' ' + item_name;
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
		a.title = 'Уговорить ' + ui_data.char_sex[0] + ' склеить случайную комбинацию ' + hint + ' предметов из инвентаря';
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
		if ($('#ui_css').length === 0) {
			GUIp_addGlobalStyleURL('godville-ui-plus.css', 'ui_css');
		}
	},
	get: function(forum_no, success_callback, fail_callback) {
		var xhr = new XMLHttpRequest();
		xhr.forum_no = forum_no;
		xhr.onreadystatechange = ensureReadiness;

		function ensureReadiness() {
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
		}

		xhr.open('GET', '/forums/show/' + forum_no, true);
		xhr.send('');
	},
	showMessage: function(msg_no, msg) {
		ui_storage.set('helpDialogVisible', true);
		var id = 'msg' + msg_no,
			$msg = $('<div id="' + id + '" class="hint_bar ui_msg">'+
						'<div class="hint_bar_capt"><b>' + msg.title + '</b></div>'+
						'<div class="hint_bar_content">' + msg.content + '</div>'+
						'<div class="hint_bar_close"><a id="' + id + '_close">закрыть</a></div>' +
					 '</div>').insertAfter($('#menu_bar'));
		$('#' + id + '_close').click(function() {
			$('#' + id).fadeToggle(function() {
				$('#' + id).remove();
				if (!isNaN(msg_no)) {
					ui_storage.set('lastShownMessage', msg_no);
				}
			});
			return false;
		});
		$msg.css('box-shadow', '2px 2px 15px #' + ((localStorage.getItem('ui_s') == 'th_nightly') ? 'ffffff' : '000000'));

		setTimeout(function() {
			$msg.fadeToggle(1500);
			if (msg.callback) {
				msg.callback();
			}
		}, 1000);
	},
	inform: function() {
		var last_shown = (ui_storage.get('lastShownMessage') !== null) ? +ui_storage.get('lastShownMessage') : -1;
		if (last_shown < this.messages.length) {
			for (var i = last_shown + 1, len = this.messages.length; i < len; i++) {
				this.showMessage(i, this.messages[i]);
			}
		}
	},
	messages: [
		{
			title: 'Приветственное сообщение <b>Godville UI+</b>',
			content: '<div>Приветствую бог' + (document.title.match('её') ? 'иню' : 'а') + ', использующ' + (document.title.match('её') ? 'ую' : 'его') +
					 ' дополнение <b>Godville UI+</b>.</div>'+

					 '<div style="text-align: justify; margin: 0.2em 0 0.3em;">&emsp;Нажмите на кнопку <b>настройки ui+</b> в верхнем меню или ' +
					 'откройте вкладку <b>Настройки UI+</b> в <b>профиле</b> героя и ознакомьтесь с настройками дополнения, если еще этого не сделали.<br>' +

					 '&emsp;Касательно форумных информеров: по умолчанию, вы подписаны только на тему дополнения и, скорее всего, видите ее <i>форумный информер</i> в левом верхнем углу.<br>' +

					 '&emsp;Если с каким-то функционалом дополнения не удалось интуитивно разобраться — прочтите <b>статью дополнения в богии</b> ' +
					 'или задайте вопрос мне (богу <b>Бэдлак</b>) или в соответствующей <b>теме на форуме</b>.<br>' +

					 '&emsp;Инструкции на случай проблем можно прочесть в <i>диалоговом окне помощи</i> (оно сейчас открыто), которое открывается/закрывается ' +
					 'по щелчку на кнопке <b style="text-decoration: underline;">help</b> в верхнем меню. Ссылки на все ранее упомянутое находятся там же.<br>' +

					 '<div style="text-align: right;">Приятной игры!<br>~~Бэдлак</div>',
			callback: function() {
				ui_storage.set('helpDialogVisible', true);
			}
		},
		{
			title: 'Новые опции',
			content: '<div style="text-align: justify;">&emsp;В <a href="user/profile#ui_options" target="_blank" title="Откроется в новой вкладке">настройках</a> появилась пара новых опций: ' +
			'можно отключить логгер, кнопку "умри" и изменить время таймаута после успешных гласов, которое сейчас составляет 30 сек.</div>'+
					 '<div style="text-align: right;">Такие дела.<br>~~Бэдлак</div>'
		}
	]
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
			if (!ui_data.isArena && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) || document.querySelector('#god_phrase').value) {
				document.querySelector('#voice_submit').removeAttribute('disabled');
			}
		}
	},
// creates timeout bar element
	create: function() {
		this.bar = document.createElement('div');
		this.bar.id = 'timeout_bar';
		this.bar.className = (ui_storage.get('ui_s') == 'th_nightly' ? 'night' : 'day');
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
		if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice')) {
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
// appends element in ui dialog
	append: function($append) {
		this.content.append($append);
	},
// toggles ui dialog	
	toggle: function(visible) {
		ui_storage.set('helpDialogVisible', !ui_storage.get('helpDialogVisible'));
		this.bar.slideToggle("slow");
	},
// creates ui dialog	
	create: function() {
		this.bar = $('<div id="ui_help_dialog" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' + 
					 '<div class="hint_bar_capt"><b>Godville UI+ (v' + ui_data.currentVersion + ')</b>, если что-то пошло не так...</div>' + 
					 '<div class="hint_bar_content" style="padding: 0.5em 0.8em;"></div>' + 
					 '<div class="hint_bar_close"></div></div>');
		if (ui_storage.get('helpDialogVisible')) this.bar.show();
		this.content = $('.hint_bar_content', this.bar);
		this.append('<div style="text-align: left;">' +
						'<div>Если что-то работает не так, как должно:</div>' +
						'<ol>' +
						'<li>Обновите страницу. Если баг повторяется - переходите к следующему шагу.</li>' +
						'<li><div id="check_version" class="div_link" style="display: inline;">Нажмите сюда, чтоб проверить, последняя ли у вас версия дополнения.</div></li>' +
						'<li class="update_required Chrome hidden">Откройте страницу настроек Хрома (2). <a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/chrome_manual_update_1.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.</li>' +
						'<li class="update_required Chrome hidden">Выберите "Расширения" (3), поставьте флажок "Режим разработчика" (4), нажмите появившуюся кнопку "Обновить расширения" (5), подождите, пока браузер обновит расширение, снимите флажок (6). ' +
							'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/chrome_manual_update_2.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.</li>' +
						'<li class="update_required Firefox hidden">Откройте страницу дополнений Файрфокса (2 или <b>Ctrl+Shift+A</b>). <a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/firefox_manual_update_1.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.</li>' +
						'<li class="update_required Firefox hidden">Нажмите на шестеренку (3), потом "Проверить наличие обновлений" (4), подождите несколько секунд и согласитеcь на перезапуск браузера. ' +
							'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/firefox_manual_update_2.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.</li>' +
						'<li class="update_required Chrome Firefox hidden">Обратно к шагу 1.</li>' +
						'<li class="console Chrome Firefox hidden">Если баг остался — проверьте, нет ли пойманного вами бага в списке багов по ссылке ниже.</li>' +
						'<li class="console Chrome Firefox hidden">Если его нет в списке и не выдавалось сообщения с текстом и местом ошибки — откройте консоль (через меню или комбинацией <b>Ctrl+Shift+' + (GUIp_browser == 'Firefox' ? 'K' : 'J') + '</b>). ' +
							'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/' + (GUIp_browser == 'Firefox' ? 'firefox' : 'chrome') + '_console.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.</li>' +
						'<li class="console Chrome Firefox hidden">Попробуйте найти в консоли что-нибудь, похожее на информацию об ошибке ' +
							'(<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/' + (GUIp_browser == 'Firefox' ? 'firefox' : 'chrome') + '_console_error.png" target="_blank" title="Откроется в новой вкладке">картинка</a>). ' +
						'И с этой информацией напишите Бэдлаку или в тему на форуме по ссылкам ниже.</li>' +
						'</ol>' +
						'<div>Полезные ссылки: ' +
							'<a href="/gods/Бэдлак" title="Откроется в новой вкладке" target="about:blank">Бэдлак</a>, ' +
							'его <a href="skype:angly_cat">скайп</a>, ' +
							'<a href="https://github.com/zeird/godville-ui-plus/wiki/TODO-list" title="Откроется в новой вкладке" target="_blank">список багов</a>, ' +
							'<a href="/forums/show_topic/2812" title="Откроется в новой вкладке" target="_blank">тема на форуме</a>, ' +
							'<a href="http://wiki.godville.net/Godville_UI+" title="Откроется в новой вкладке" target="about:blank">статья в богии</a>.' +
					'</div>');
		if (ui_utils.isDeveloper()) {
			this.append($('<span>dump: </span>'));
			this.append(this.getDumpButton('all'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('options', 'Option'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('stats', 'Stats'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('logger', 'Logger'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('forum', 'Forum'));
			this.append('<br>');
		}
		$('.hint_bar_close', this.bar).append(this.getToggleButton('закрыть'));
		$('#menu_bar').after(this.bar);
		$('#menu_bar ul').append('<li> | </li>')
						 .append('<a href="user/profile#ui_options">настройки <strong>ui+</strong></a><li> | </li>')
						 .append(this.getToggleButton('<strong>help</strong>'));

		$('#check_version').click(function() {
			console.log('Godville UI+ log: Checking version number...');
			this.textContent = "Получения номера последней версии дополнения...";
			this.classList.remove('div_link');
			ui_utils.get(2, ui_help_dialog.onXHRSuccess, ui_help_dialog.onXHRFail);
			return false;
		});
	},
	onXHRSuccess: function(xhr) {
		console.log('azaza');
		var match;
		if ((match = xhr.responseText.match(/Godville UI\+ (\d+\.\d+\.\d+\.\d+)/))) {
			var temp_cur = ui_data.currentVersion.split('.'),
				last_version = match[1],
				temp_last = last_version.split('.'),
				isNewest = +temp_cur[0] >= +temp_last[0] &&
						   +temp_cur[1] >= +temp_last[1] &&
						   +temp_cur[2] >= +temp_last[2] &&
						   +temp_cur[3] >= +temp_last[3];
			$('#check_version')[0].innerHTML = (isNewest ? 'У вас последняя версия.' : 'Последняя версия - <b>' + last_version + '</b>. Нужно обновить вручную.') + ' Переходите к следующему шагу.';
			if (!isNewest) {
				console.log(GUIp_browser);
				$('#ui_help_dialog ol li.update_required.' + GUIp_browser).removeClass('hidden');
			} else {
				$('#ui_help_dialog ol li.console.' + GUIp_browser).removeClass('hidden');
			}
		} else {
			this.onXHRFail();
		}
	},
	onXHRFail: function() {
		console.log('ololo');
		$('#check_version')[0].innerHTML = 'Не удалось узнать номер последней версии. Если вы еще не обновлялись вручную, переходите к шагу 2, иначе к шагу 6.';
		$('#ui_help_dialog ol li.' + GUIp_browser).removeClass('hidden');
	},
// gets toggle button
	getToggleButton: function(text) {
		return $('<a>' + text + '</a>').click(function() {ui_help_dialog.toggle(); return false;});
	},
// gets fump button with a given label and selector
	getDumpButton: function(label, selector) {
		return $('<a class="devel_link">' + label + '</a>').click(function() {ui_storage.dump(selector);});
	}
};

// ------------------------
//		STORAGE
// ------------------------
var ui_storage = {
	get_key: function(key) {
		return "GM_" + ui_data.god_name + ':' + key;
	},
// stores a value
	set: function(id, value) {
		localStorage.setItem(this.get_key(id), value);
		return value;
	},
// reads a value
	get: function(id) {
		var val = localStorage.getItem(this.get_key(id));
		if (val) val = val.replace(/^[NSB]\]/, '');
		if (val == 'true') return true;
		if (val == 'false') return false;
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
		var r = new RegExp('^GM_' + (selector === undefined ? '' : (ui_data.god_name + ':' + selector)));
		for (var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).match(r)) {
				lines.push(localStorage.key(i) + " = " + localStorage[localStorage.key(i)]);
			}
		}
		lines.sort();
		console.info("Godville UI+ log: Storage:\n" + lines.join("\n"));
	},
// resets saved options
	clear: function() {
		var key,
			r = new RegExp('^GM_.*');
		for (var i = 0; i < localStorage.length; i++) {
			key = localStorage.key(i);
			if (key.match(r)) {
				localStorage.removeItem(key);
			}
		}
		location.reload();
		return "Storage cleared. Reloading...";
	}
};

// ------------------------
//		WORDS
// ------------------------
var ui_words = {
	currentPhrase: "",
// gets words from phrases.js file and splits them into sections
	init: function() {
		this.base = getWords();
		var sects = ['heal', 'pray', 'sacrifice', 'exp', 'dig', 'hit', 'do_task', 'cancel_task', 'die', 'town', 'heil', 'inspect_prefix', 'craft_prefix', 'walk_n', 'walk_s', 'walk_w', 'walk_e'];
		for (var i = 0; i < sects.length; i++) {
			var t = sects[i];
			var text = ui_storage.get('phrases_' + t);
			if (text && text !== "") {
				this.base.phrases[t] = text.split("||");
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
		var prefix = this._addHeroName(this._addHeil(''));
		var phrases;
		if (item_name) {
			phrases = [this.randomPhrase(sect) + ' ' + item_name + '!'];
		} else if (ui_storage.get('Option:useShortPhrases')) {
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
	
	canBeActivatedItemType: function(desc) {
		return ['Этот предмет наделяет героя случайной аурой',
				'Данный предмет можно активировать только во время дуэли',
				'Этот предмет может случайным образом повлиять на героя',
				'Этот предмет ищет для героя босса',
				'Этот предмет сочиняет о герое былину',
				'Этот предмет заводит герою случайного друга из числа активных героев',
				'Активация этого предмета может преподнести герою приятный сюрприз',
				'Активация инвайта увеличит счетчик доступных приглашений',
				'Этот предмет полностью восстанавливает здоровье героя',
				'Этот предмет добавляет заряд в прано-аккумулятор',
				'Этот предмет на несколько минут отправляет героя в поиск соратников для битвы с ископаемым боссом',
				'Этот предмет убивает атакующего героя монстра, либо пытается выплавить из золота героя золотой кирпич',
				'Этот предмет телепортирует героя в случайный город',
				'Этот предмет отправляет героя на арену',
				'Этот предмет превращает один или несколько жирных предметов из инвентаря героя в золотые кирпичи',
				'Этот предмет отправляет героя в мини-квест'
			   ].indexOf(desc);
	},
	
	isHealItem: function(item) {
		return item.style.fontStyle == "italic";
	},

	canBeActivated: function(item) {
		return item.textContent.match(/\(@\)/);
	},
	
	isBoldItem: function(item) {
		return item.style.fontWeight == 700 || item.style.fontWeight == "bold";
	},

	_changeFirstLetter: function(text) {
		return text.charAt(0).toLowerCase() + text.slice(1);
	},

	_addHeroName: function(text) {
		if (!ui_storage.get('Option:useHeroName')) return text;
		return ui_data.char_name + ', ' + this._changeFirstLetter(text);
	},

	_addHeil: function(text) {
		if (!ui_storage.get('Option:useHeil')) return text;
		return ui_utils.getRandomItem(this.base.phrases.heil) + ', ' + this._changeFirstLetter(text);
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
	}
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
		if (id == 'Brick' || id == 'Wood') return this.set(id, Math.floor(value*10 + 0.5));
		else return this.set(id, value);
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
		this.bar = $('<ul id="logger" style="mask: url(#fader_masking);"/>');
		$('#menu_bar').after(this.bar);
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
		while ($('#logger li').position().left + $('#logger li').width() < 0 || $('#logger li')[0].className == "separator") {
			$('#logger li:first').remove();
		}
	},

	watchStatsValue: function(id, name, descr, klass) {
		klass = (klass || id).toLowerCase();
		var diff = ui_storage.set_with_diff('Logger:' + id, ui_stats.get(id));
		if (diff) {
			// Если нужно, то преобразовываем в число с одним знаком после запятой
			if (parseInt(diff) != diff) diff = diff.toFixed(1);
			// Добавление плюcа, минуса или стрелочки
			var s;
			if (diff < 0) {
				if (name === 'exp' && ui_storage.get('Logger:Level') !== $('#hk_level .l_val').text()) {
					s = '→' + ui_stats.get(id);
				} else if (name === 'tsk' && ui_storage.get('Stats:Task_Name') !== $('.q_name').text()) {
					ui_storage.set('Stats:Task_Name', $('.q_name').text());
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
		if (ui_data.isMap) {
			this.watchStatsValue('Map_HP', 'hp', 'Здоровье героя', 'hp');
			this.watchStatsValue('Map_Inv', 'inv', 'Инвентарь', 'inv');
			this.watchStatsValue('Map_Gold', 'gld', 'Золото', 'gold'); 
			this.watchStatsValue('Map_Battery', 'bt', 'Заряды', 'battery');
			this.watchStatsValue('Map_Alls_HP', 'a:hp', 'Здоровье союзников', 'battery');
		}
		if (ui_data.isArena && !ui_data.isMap) {
			this.watchStatsValue('Hero_HP', 'h:hp', 'Здоровье героя', 'hp');
			this.watchStatsValue('Enemy_HP', 'e:hp', 'Здоровье соперника', 'death');
			this.watchStatsValue('Hero_Alls_HP', 'a:hp', 'Здоровье союзников', 'battery');
			this.watchStatsValue('Hero_Inv', 'h:inv', 'Инвентарь', 'inv');
			this.watchStatsValue('Hero_Gold', 'h:gld', 'Золото', 'gold'); 
			this.watchStatsValue('Hero_Battery', 'h:bt', 'Заряды', 'battery');
			this.watchStatsValue('Enemy_Gold', 'e:gld', 'Золото', 'monster');
			this.watchStatsValue('Enemy_Inv', 'e:inv', 'Инвентарь', 'monster');
		}
		this.watchStatsValue('Exp', 'exp', 'Опыт (проценты)');
		this.watchStatsValue('Level', 'lvl', 'Уровень');
		this.watchStatsValue('HP', 'hp', 'Здоровье');
		this.watchStatsValue('Prana', 'pr', 'Прана (проценты)');
		this.watchStatsValue('Battery', 'bt', 'Заряды');
		this.watchStatsValue('Task', 'tsk', 'Задание (проценты)');
		this.watchStatsValue('Monster', 'mns', 'Монстры');
		this.watchStatsValue('Inv', 'inv', 'Инвентарь');
		this.watchStatsValue('Gold', 'gld', 'Золото');
		this.watchStatsValue('Brick', 'br', 'Кирпичи');
		this.watchStatsValue('Wood', 'wd', 'Дерево');
		this.watchStatsValue('Retirement', 'rtr', 'Сбережения (тысячи)');
		this.watchStatsValue('Equip1', 'eq1', 'Оружие', 'equip');
		this.watchStatsValue('Equip2', 'eq2', 'Щит', 'equip');
		this.watchStatsValue('Equip3', 'eq3', 'Голова', 'equip');
		this.watchStatsValue('Equip4', 'eq4', 'Тело', 'equip');
		this.watchStatsValue('Equip5', 'eq5', 'Руки', 'equip');
		this.watchStatsValue('Equip6', 'eq6', 'Ноги', 'equip');
		this.watchStatsValue('Equip7', 'eq7', 'Талисман', 'equip');
		this.watchStatsValue('Death', 'death', 'Смерти');
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
		this.container = $('<div id="informer_bar" />');
		$('#main_wrapper').prepend(this.container);
		// load and draw labels
		this.load();
		for (var flag in this.flags) {
			if (this.flags[flag])
				this.create_label(flag);
		}
		// run flicker
		this.tick();
	},
	// устанавливает или удаляет флаг
	update: function(flag, value) {
		if (value && (flag == 'pvp' || !ui_data.isArena) && !(ui_storage.get('Option:forbiddenInformers') &&
			ui_storage.get('Option:forbiddenInformers').match(flag.replace(/= /g, '').replace(/> /g, '').replace(/ /g, '_')))) {
			if (!(flag in this.flags)) {
				this.flags[flag] = true;
				this.create_label(flag);
				this.save();
			}
		} else {
			if (flag in this.flags) {
				delete this.flags[flag];
				this.delete_label(flag);
				this.save();
			}
		}
		if (!this.tref)
			this.tick();
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
		if (!fl || fl === "") fl = ' {}';
		this.flags = JSON.parse(fl);
	},
	
	save: function() {
		ui_storage.set('informer_flags', JSON.stringify(this.flags));
	},
	
	create_label: function(flag) {
		var $label = $('<div>' + flag + '</div>').click(function() {
			ui_informer.hide(flag);
			return false;
		});
		this.container.append($label);
	},
	
	delete_label: function(flag) {
		$('div', this.container)
			.each(function() {
						var $this = $(this);
						if ($this.text() == flag) {
							$this.remove();
					 }
				 });
	},
	
	tick: function() {
		// пройти по всем флагам и выбрать те, которые надо показывать
		var to_show = [];
		for (var flag in this.flags) {
			if (this.flags[flag])
				to_show.push(flag);
		}
		to_show.sort();

		// если есть чё, показать или вернуть стандартный заголовок
		if (to_show.length > 0) {
			this.update_title(to_show);
			this.tref = setTimeout(function() {ui_informer.tick.call(ui_informer);}, 700);
		} else {
			this.clear_title();
			this.tref = undefined;
		}
	},

	clear_title: function() {
		var pm = +$('.fr_new_badge_pos:visible').text() + $('.msgDock .fr_new_msg').length;
		pm = pm ? '[' + pm + '] ' : '';

		var fi = 0;
		for (var topic in JSON.parse(ui_storage.get('ForumInformers'))) {
			fi++;
		}
		fi = fi ? '[f]' : '';

		document.title = pm + fi + this.title;
		$('link[rel="shortcut icon"]').remove();
		$('head').append('<link rel="shortcut icon" href="images/favicon.ico" />');
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
		$('link[rel="shortcut icon"]').remove();
		$('head').append('<link rel="shortcut icon" href=' + favicon + ' />');		
	}
};

// ------------------------------------
// Информер для форума
// * показывает попапы
// ------------------------------------
var ui_forum = {
	init: function() {
		this.container = $('<div id="forum_informer_bar" />');
		$('body').prepend(this.container);
		this.check();
		setInterval(this.check.bind(this), 300000);
	},
	check: function() {
		for (var forum_no = 1; forum_no <= 6; forum_no++) {
			var current_forum = JSON.parse(ui_storage.get('Forum' + forum_no)),
				topics = [];
			for (var topic in current_forum) {
				// to prevent simultaneous ForumInformers access
				setTimeout(ui_utils.get.bind(this, forum_no, this.parse), 500*forum_no);
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
		var informer = $('#topic' + topic_no)[0];
		if (!informer) {
			var $informer = $('<a id="topic' + topic_no + '" target="_blank"><span /><div class="fr_new_badge" /></a>').click(function(e) {
				if (e.which == 1) {
					e.preventDefault();
				}
			}).bind('mouseup', function(e) {
				if (e.which == 1 || e.which == 2) {
					var informers = JSON.parse(ui_storage.get('ForumInformers'));
					delete informers[this.id.match(/\d+/)[0]];
					ui_storage.set('ForumInformers', JSON.stringify(informers));
					$(document).trigger("DOMNodeInserted");
					$(this).slideToggle("fast", function() {
						this.parentElement.removeChild(this);
					});
				}
			});
			this.container.append($informer);
			informer = $informer[0];
		}
		var page = Math.floor((posts_count - topic_data.diff)/25) + 1;
		informer.href = '/forums/show_topic/' + topic_no + '?page=' + page;
		informer.style.paddingRight = (16 + String(topic_data.diff).length*6) + 'px';
		informer.getElementsByTagName('span')[0].textContent = topic_data.name;
		informer.getElementsByTagName('div')[0].textContent = topic_data.diff;
	},
	parse: function(xhr) {
		var i, diff, temp, old_diff,
			forum = JSON.parse(ui_storage.get('Forum' + xhr.forum_no)),
			informers = JSON.parse(ui_storage.get('ForumInformers')),
			topics = [];
		for (var topic in forum) {
			topics.push(topic);
		}
		for (i = 0, len = topics.length; i < len; i++) {
			temp = xhr.responseText.match(RegExp("show_topic\\/" + topics[i] + "[^\\d>]+>([^<]+)(?:.*?\\n*?)*?<td class=\"ca inv stat\">(\\d+)<\\/td>(?:.*?\\n*?)*?<strong class=\"fn\">([^<]+)<\\/strong>(?:.*?\\n*?)*?show_topic\\/" + topics[i]));
			if (temp) {
				diff = +temp[2] - forum[topics[i]];
				if (diff) {
					forum[topics[i]] = +temp[2];
					if (temp[3] != ui_data.god_name && diff > 0) {
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
		ui_storage.set('ForumInformers', JSON.stringify(informers));
		ui_storage.set('Forum' + xhr.forum_no, JSON.stringify(forum));
		ui_forum.process(xhr.forum_no);
	}
};

// ------------------------------------
//	Improvements !!
// ------------------------------------
// -------- Hero Loot -----------------

// Main button creator
var ui_improver = {
	inventoryChanged: true,
	improveInProcess: true,
	Shovel: false,
	isFirstTime: true,
	voiceSubmitted: false,
	monstersOfTheDay: null,
	// trophy craft combinations
	b_b: [],
	b_r: [],
	r_r: [],
	//hucksterNews: '',
	improve: function() {
		this.improveInProcess = true;
		ui_informer.update('pvp', ui_data.isArena);
		if (this.isFirstTime && !ui_data.isArena) {
			this.improveLoot();
		}
		this.improveStats();
		this.improvePet();
		this.improveVoiceDialog();
		this.improveNews();
		this.improveEquip();
		this.improvePantheons();
		this.improveDiary();
		this.improveMap();
		this.improveInterface();
		this.improveChat();
		this.checkButtonsVisibility();
		this.isFirstTime = false;
		ui_improver.improveInProcess = false;
	},
	
	improveLoot: function() {
		var i, j, len, items = document.querySelectorAll('#inventory li'),
			flag_names = ['aura box', 'arena box', 'black box', 'boss box', 'coolstory box', 'friend box', 'good box', 'invite', 'heal box', 'prana box', 'raidboss box', 'smelter', 'teleporter', 'to arena box', 'transformer', 'quest box'],
			flags = new Array(flag_names.length),
			bold_items = false,
			trophy_list = [],
			trophy_boldness = {},
			forbidden_craft = ui_storage.get('Option:forbiddenCraft');

		for (i = 0, len = flags.length; i < len; i++) {
			flags[i] = false;
		}

		// Parse items
		for (i = 0, len = items.length; i < len; i++) {
			if (window.getComputedStyle(items[i]).overflow == 'visible') {
				var item_name = items[i].textContent.replace(/\?/, '')
													.replace(/\(@\)/, '')
													.replace(/\(\d + шт\)$/, '')
													.replace(/^\s+|\s+$/g, '');
				// color items and add buttons
				if (ui_words.canBeActivated(items[i])) {
					var desc = items[i].querySelector('.item_act_link_div *').getAttribute('title').replace(/ \(.*/g, ''),
						sect = ui_words.canBeActivatedItemType(desc);
					if (sect != -1) {
						flags[sect] = true;
					} else if (!ui_utils.hasShownInfoMessage) {
						ui_utils.hasShownInfoMessage = true;
						ui_utils.showMessage('info', {
							title: 'Неизвестный тип предмета в Godville UI+!',
							content: '<div>Дополнение обнаружило в вашем инвентаре неизвестную доселе категорию предмета. Пожалуйста, сообщите разработчику следующее описание: <b>"' + desc + '</b>"'
						});
					}
					if (!(forbidden_craft && (forbidden_craft.match('activatable') || (forbidden_craft.match('b_b') && forbidden_craft.match('b_r'))))) {
						trophy_list.push(item_name);
						trophy_boldness[item_name] = true;
					}
				} else if (ui_words.isHealItem(items[i])) {
					if (!ui_utils.isAlreadyImproved($(items[i]))) {
						items[i].classList.add('heal_item');
					}
					if (!(forbidden_craft && (forbidden_craft.match('heal') || (forbidden_craft.match('b_r') && forbidden_craft.match('r_r'))))) {
						trophy_list.push(item_name);
						trophy_boldness[item_name] = false;
					}
				} else {
					if (ui_words.isBoldItem(items[i])) {
						bold_items = true;
						if (!(forbidden_craft && forbidden_craft.match('b_b') && forbidden_craft.match('b_r')) &&
							!item_name.match('золотой кирпич') && !item_name.match(' босса ')) {
							trophy_list.push(item_name);
							trophy_boldness[item_name] = true;
						}
					} else {
						if (!(forbidden_craft && forbidden_craft.match('b_r') && forbidden_craft.match('r_r'))) {
							trophy_list.push(item_name);
							trophy_boldness[item_name] = false;
						}
					}
					if (!ui_utils.isAlreadyImproved($(items[i]))) {
						items[i].insertBefore(ui_utils.createInspectButton(item_name), null);
					}
				}
			}
		}

		for (i = 0, len = flag_names.length; i < len; i++) {
			ui_informer.update(flag_names[i], flags[i]);
		}

		// Склейка трофеев, формирование списков
		this.b_b = [];
		this.b_r = [];
		this.r_r = [];
		if (trophy_list.length) {
			trophy_list.sort();
			for (i = 0, len = trophy_list.length - 1; i < len; i++) {
				for (j = i + 1; j < len + 1; j++) {
					if (trophy_list[i][0] == trophy_list[j][0]) {
						if (trophy_boldness[trophy_list[i]] && trophy_boldness[trophy_list[j]]) {
							if (!(forbidden_craft && forbidden_craft.match('b_b'))) {
								this.b_b.push(trophy_list[i] + ' и ' + trophy_list[j]);
								this.b_b.push(trophy_list[j] + ' и ' + trophy_list[i]);
							}
						} else if (!trophy_boldness[trophy_list[i]] && !trophy_boldness[trophy_list[j]]) {
							if (!(forbidden_craft && forbidden_craft.match('r_r'))) {
								this.r_r.push(trophy_list[i] + ' и ' + trophy_list[j]);
								this.r_r.push(trophy_list[j] + ' и ' + trophy_list[i]);
							}
						} else {
							if (!(forbidden_craft && forbidden_craft.match('b_r'))) {
								if (trophy_boldness[trophy_list[i]]) {
									this.b_r.push(trophy_list[i] + ' и ' + trophy_list[j]);
								} else {
									this.b_r.push(trophy_list[j] + ' и ' + trophy_list[i]);
								}
							}
						}
					} else {
						break;
					}
				}
			}
		}

		if (!ui_utils.isAlreadyImproved($('#inventory'))) {
			var inv_content = document.querySelector('#inventory .block_content');
			inv_content.insertAdjacentHTML('beforeend', '<span class="craft_button">' + ['Склей', 'Собери', 'Скрафти', 'Соедини', 'Сделай', 'Слепи'][Math.floor(Math.random()*6)] + ':</span>');
			inv_content.insertBefore(ui_utils.createCraftButton('<b>ж</b>+<b>ж</b>', 'b_b', 'жирных'), null);
			inv_content.insertBefore(ui_utils.createCraftButton('<b>ж</b>+нж', 'b_r', 'жирного и нежирного'), null);
			inv_content.insertBefore(ui_utils.createCraftButton('нж+нж', 'r_r', 'нежирных'), null);
		}

		//ui_informer.update(flag_names[11], flags[11] && !bold_items);
		//ui_informer.update('transform!', flags[11] && bold_items);

		//ui_informer.update('smelt!', flags[10] && ui_storage.get('Stats:Gold') >= 3000);
		//ui_informer.update(flag_names[10], flags[10] && ui_storage.get('Stats:Gold') < 3000);
	},

	improveVoiceDialog: function() {
		// Add links and show timeout bar after saying
		if (this.isFirstTime) {
			if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'))
				$('#voice_submit').attr('disabled', 'disabled');
			$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
				if (!ui_data.isArena && $(this).val() && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && parseInt(ui_timeout.bar.style.width))) {
					$('#voice_submit').removeAttr('disabled');
				} else if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) {
					$('#voice_submit').attr('disabled', 'disabled');
				}
			}).on('click', '.gv_text.div_link', function() {
				$('#god_phrase').change();
			});
		}
		var $box = $('#cntrl');
		if (!ui_utils.isAlreadyImproved($box)) {
			$('.gp_label').addClass('l_capt');
			$('.gp_val').addClass('l_val');
			if (ui_data.isMap){
				if (ui_storage.get('Option:relocateMap')){
					$('#map').insertBefore($('#m_control')); 
					$('#m_control').appendTo($('#a_right_block'));
					$('#m_control .block_title').text('Пульт');
				} 
				var isContradictions = $('#map')[0].textContent.match('Противоречия');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Восток', (isContradictions ? 'walk_w' : 'walk_e'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Восток');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Запад', (isContradictions ? 'walk_e' : 'walk_w'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Запад');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Юг', (isContradictions ? 'walk_n' : 'walk_s'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Юг');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Север', (isContradictions ? 'walk_s' : 'walk_n'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Север');
				if ($('#map')[0].textContent.match('Бессилия'))
					$('#actions').hide();
			} else {
				if (ui_data.isArena) {
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'отбивай', 'defend', 'Попытаться заставить ' + ui_data.char_sex[0] + ' принять защитную стойку, поднять щит и отбить атаку противника');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
				} else {
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'жертвуй', 'sacrifice', 'Послать ' + ui_data.char_sex[1] + ' требование кровавой или золотой жертвы для внушительного пополнения праны');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					$('#voice_submit').click(function () {ui_improver.voiceSubmitted = true;});
				}
			}
			//hide_charge_button
			var charge_button = $('#cntrl .hch_link')[0];
			if (charge_button) {
				charge_button.style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
			}
		}
		
		// Save stats
		ui_stats.setFromLabelCounter('Prana', $box, 'Прана');
		ui_informer.update('full prana', $('#cntrl .p_val').width() == $('#cntrl .p_bar').width());
	},

	refresher: function() {
		if (ui_storage.get('Option:forcePageRefresh')) {
			if (!ui_improver.news.match($('.f_news.line').text()) || !ui_improver.news.match(ui_storage.get('Stats:HP'))) {
				ui_improver.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
				ui_improver.lastNews = new Date();
			}
			var now = new Date();
			if (now.getTime() - ui_improver.lastNews.getTime() > 180000) {
				if ($('.t_red').length) {
					console.warn('Godville UI+ log: RED ALERT! HARD RELOADING!');
					location.reload();
				}
				console.warn('Godville UI+ log: Soft reloading');
				$('#d_refresh').click();
			}
		}
	},

// ----------- Вести с полей ----------------
	improveNews: function() {
		if (ui_data.isArena) return;
		if (!ui_utils.isAlreadyImproved($('#news'))) {
			ui_utils.addSayPhraseAfterLabel($('#news'), 'Противник', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
		}
		var isMonsterOfTheDay = false;
		var isMonsterWithCapabilities = false;
		// Если герой дерется с монстром
		if ($('#news .line')[0].style.display != 'none') {
			var currentMonster = $('#news .l_val').text();
			isMonsterOfTheDay = ui_improver.monstersOfTheDay && currentMonster.match(ui_improver.monstersOfTheDay);
			isMonsterWithCapabilities = currentMonster.match(/Врачующий|Дарующий|Зажиточный|Запасливый|Кирпичный|Латающий|Лучезарный|Сияющий|Сюжетный|Линяющий/);
		}
		ui_informer.update('monster of the day', isMonsterOfTheDay);
		ui_informer.update('monster with capabilities', isMonsterWithCapabilities);
		if (this.isFirstTime) {
			this.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
			this.lastNews = new Date();
			
			var refresher = setInterval(this.refresher, 60000);
		}
	},

// ---------- Map --------------
	improveMap: function() {
		if (ui_data.isMap) {
			var i, j,
				$box = $('#cntrl .voice_generator'),
				$boxML = $('#map .dml'),
				$boxMC = $('#map .dmc'),
				kRow = $boxML.length,
				kColumn = $boxML[0].textContent.length;

			//	Функция итерации
			var MapIteration = function (MapThermo, iPointer, jPointer, step) {
				step++;
				for (var iStep = -1; iStep <= 1; iStep++) {
					for (var jStep = -1; jStep <= 1; jStep++) {
						if (iStep !== jStep && (iStep === 0 || jStep === 0)) {
							var iNext = iPointer + iStep,
								jNext = jPointer + jStep;
							if (iNext >= 0 && iNext < kRow && jNext >= 0 && jNext < kColumn) {
								if (MapThermo[iNext][jNext] != -1) {
									if (MapThermo[iNext][jNext] > step || MapThermo[iNext][jNext] === 0) {
										MapThermo[iNext][jNext] = step;
										MapIteration(MapThermo, iNext, jNext, step);
									}
								}
							}
						}
					}
				}
			};

			//	Гласы направления делаем невидимыми
			for (i = 0; i < 4; i++){
				$box[i].style.visibility = 'hidden';
			}

			var isJumping = $('#map')[0].textContent.match('Прыгучести'); 

			var MaxMap = 0;	//	Счетчик указателей  
			//	Карта возможного клада
			var MapArray = [];
			for (i = 0; i < kRow; i++) {
				MapArray[i] = [];
				for (j = 0; j < kColumn; j++) {
					MapArray[i][j] = ('?!@'.indexOf($boxML[i].textContent[j]) != - 1) ? 0 : -1;
				}
			}
			for (var si = 0; si < kRow; si++) {
				//	Ищем где мы находимся
				j = $boxML[si].textContent.indexOf('@');
				if (j != -1) { 
					//	Проверяем куда можно пройти
					if ($boxML[si-1].textContent[j] != '#' || isJumping && (si == 1 || si != 1 && $boxML[si-2].textContent[j] != '#'))
						$box[0].style.visibility = '';	//	Север
					if ($boxML[si+1].textContent[j] != '#' || isJumping && (si == kRow - 2 || si != kRow - 2 && $boxML[si+2].textContent[j] != '#'))
						$box[1].style.visibility = '';	//	Юг
					if ($boxML[si].textContent[j-1] != '#' || isJumping && $boxML[si].textContent[j-2] != '#')
						$box[2].style.visibility = '';	//	Запад
					if ($boxML[si].textContent[j+1] != '#' || isJumping && $boxML[si].textContent[j+2] != '#')
						$box[3].style.visibility = '';	//	Восток
				} 
				//	Ищем указатели
				for (var sj = 0; sj < kColumn; sj++) {
					var ik, jk,
						Pointer = $boxML[si].textContent[sj];
					if ('←→↓↑↙↘↖↗'.indexOf(Pointer) != - 1) {
						MaxMap++;
						$boxMC[si * kColumn + sj].style.color = 'green';
						for (ik = 0; ik < kRow; ik++) 
							for (jk = 0; jk < kColumn; jk++) {
								var istep = parseInt((Math.abs(jk - sj) - 1) / 5),
									jstep = parseInt((Math.abs(ik - si) - 1) / 5);
								if ('←→'.indexOf(Pointer) != -1 && ik >= si - istep && ik <= si + istep ||
										Pointer == '↓' && ik >= si + istep ||
										Pointer == '↑' && ik <= si - istep ||
										'↙↘'.indexOf(Pointer) != -1 && ik > si + istep ||
										'↖↗'.indexOf(Pointer) != -1 && ik < si - istep)
									if (Pointer == '→' && jk >= sj + jstep ||
											Pointer == '←' && jk <= sj - jstep ||
											'↓↑'.indexOf(Pointer) != -1 && jk >= sj - jstep && jk <= sj + jstep ||
											'↘↗'.indexOf(Pointer) != -1 && jk > sj + jstep ||
											'↙↖'.indexOf(Pointer) != -1 && jk < sj - jstep)
										if (MapArray[ik][jk] >= 0)
											MapArray[ik][jk]++;
							}
					}
					if ('✺☀♨☁❄✵'.indexOf(Pointer) != -1) {
						MaxMap++;
						$boxMC[si * kColumn + sj].style.color = 'green';
						var ThermoMinStep = 0;	//	Минимальное количество шагов до клада
						var ThermoMaxStep = 0;	//	Максимальное количество шагов до клада
						switch(Pointer){
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
							for (jk = 0; jk < kColumn; jk++)
								MapThermo[ik][jk] = ($boxML[ik].textContent[jk] == '#' || ((Math.abs(jk - sj) + Math.abs(ik - si)) > ThermoMaxStep)) ? -1 : 0;
						} 
						//	Запускаем итерацию
						MapIteration(MapThermo, si, sj, 0);
						//	Метим возможный клад
						for (ik = ((si - ThermoMaxStep) > 0 ? si - ThermoMaxStep : 0); ik <= ((si + ThermoMaxStep) < kRow ? si + ThermoMaxStep : kRow - 1); ik++)
							for (jk = ((sj - ThermoMaxStep) > 0 ? sj - ThermoMaxStep : 0); jk <= ((sj + ThermoMaxStep) < kColumn ? sj + ThermoMaxStep : kColumn - 1); jk++)
								if (MapThermo[ik][jk] >= ThermoMinStep & MapThermo[ik][jk] <= ThermoMaxStep)
									if (MapArray[ik][jk] >= 0)
										MapArray[ik][jk]++;
					}
					// На будущее
					// ↻ ↺ ↬ ↫   
				}
			}
			//	Отрисовываем возможный клад 
			if (MaxMap !== 0)
				for (i = 0; i < kRow; i++)
					for (j = 0; j < kColumn; j++)
						if (MapArray[i][j] == MaxMap)
							$boxMC[i * kColumn + j].style.color = ($boxML[i].textContent[j] == '@') ? 'blue' : 'red';
		}
	},

// ---------- Stats --------------
	improveStats: function() {
		//	Парсер строки с золотом
		var gold_parser = function(val) {
			return parseInt(val.replace(/[^0-9]/g, '')) || 0;
		};

		if (ui_data.isMap) {
			ui_stats.setFromLabelCounter('Map_HP', $('#m_info'), 'Здоровье');
			ui_stats.setFromLabelCounter('Map_Gold', $('#m_info'), 'Золота', gold_parser);
			ui_stats.setFromLabelCounter('Map_Inv', $('#m_info'), 'Инвентарь');
			ui_stats.set('Map_Battery',$('#m_control .acc_val').text(), parseFloat);
			ui_stats.set('Map_Alls_HP', this.GroupHP(true));
			if (ui_storage.get('Logger:LocationPrev') == 'Pole') {
				ui_storage.set('Logger:LocationPrev', 'Map');
				ui_storage.set('Logger:Map_HP', ui_stats.get('Map_HP'));
				ui_storage.set('Logger:Map_Gold', ui_stats.get('Map_Gold'));
				ui_storage.set('Logger:Map_Inv', ui_stats.get('Map_Inv'));
				ui_storage.set('Logger:Map_Battery',ui_stats.get('Map_Battery'));
				ui_storage.set('Logger:Map_Alls_HP', ui_stats.get('Map_Alls_HP'));
			}
			return;
		}
		if (ui_data.isArena) {
			ui_stats.setFromLabelCounter('Hero_HP', $('#m_info'), 'Здоровье');
			ui_stats.setFromLabelCounter('Hero_Gold', $('#m_info'), 'Золота', gold_parser);
			ui_stats.setFromLabelCounter('Hero_Inv', $('#m_info'), 'Инвентарь');
			ui_stats.set('Hero_Battery',$('#m_control .acc_val').text(), parseFloat);
			ui_stats.setFromLabelCounter('Enemy_Gold', $('#o_info'), 'Золота', gold_parser);
			ui_stats.setFromLabelCounter('Enemy_Inv', $('#o_info'), 'Инвентарь');
			ui_stats.set('Hero_Alls_HP', this.GroupHP(true));
			ui_stats.set('Enemy_HP', this.GroupHP(false));
			if (this.isFirstTime) {
				ui_storage.set('Logger:Hero_HP', ui_stats.get('Hero_HP'));
				ui_storage.set('Logger:Hero_Gold', ui_stats.get('Hero_Gold'));
				ui_storage.set('Logger:Hero_Inv', ui_stats.get('Hero_Inv'));
				ui_storage.set('Logger:Hero_Battery',ui_stats.get('Hero_Battery'));
				ui_storage.set('Logger:Enemy_HP', ui_stats.get('Enemy_HP'));
				ui_storage.set('Logger:Enemy_Gold', ui_stats.get('Enemy_Gold'));
				ui_storage.set('Logger:Enemy_Inv', ui_stats.get('Enemy_Inv'));
				ui_storage.set('Logger:Hero_Alls_HP', ui_stats.get('Hero_Alls_HP'));
			}
			return;
		}
		if (ui_storage.get('Logger:LocationPrev') != 'Pole')
			ui_storage.set('Logger:LocationPrev', 'Pole');
		var $box = $('#stats');
		if (!ui_utils.isAlreadyImproved($('#stats'))) {
			// Add links
			ui_utils.addSayPhraseAfterLabel($box, 'Уровень', 'учись', 'exp', 'Предложить ' + ui_data.char_sex[1] + ' получить порцию опыта');
			ui_utils.addSayPhraseAfterLabel($box, 'Здоровье', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
			ui_utils.addSayPhraseAfterLabel($box, 'Золота', 'копай', 'dig', 'Указать ' + ui_data.char_sex[1] + ' место для копания клада или босса');
			ui_utils.addSayPhraseAfterLabel($box, 'Задание', 'отмени', 'cancel_task', 'Убедить ' + ui_data.char_sex[0] + ' отменить текущее задание');
			ui_utils.addSayPhraseAfterLabel($box, 'Задание', 'делай', 'do_task', 'Открыть ' + ui_data.char_sex[1] + ' секрет более эффективного выполнения задания');
			ui_utils.addSayPhraseAfterLabel($box, 'Смертей', 'умри', 'die', 'Попросить ' + ui_data.char_sex[0] + ' увеличить на единичку счетчик смертей');
		}
		if (!$('#hk_distance .voice_generator').length)
			ui_utils.addSayPhraseAfterLabel($box, 'Столбов от столицы', $('#main_wrapper.page_wrapper_5c').length ? '回' : 'дом', 'town', 'Наставить ' + ui_data.char_sex[0] + ' на путь в ближайший город');

		ui_stats.setFromProgressBar('Exp', $('#hk_level .p_bar'));
		ui_stats.setFromProgressBar('Task', $('#hk_quests_completed .p_bar'));
		ui_stats.setFromLabelCounter('Level', $box, 'Уровень');
		ui_stats.setFromLabelCounter('Monster', $box, 'Убито монстров');
		ui_stats.setFromLabelCounter('Death', $box, 'Смертей');
		ui_stats.setFromLabelCounter('Brick', $box, 'Кирпичей для храма', parseFloat);
		ui_stats.setFromLabelCounter('Wood', $box, 'Дерева для ковчега', parseFloat);
		ui_stats.setFromLabelCounter('Retirement', $box, 'Сбережения', gold_parser);
		ui_stats.set('Battery',$('#control .acc_val').text(), parseFloat);
		if (ui_storage.get('Stats:Inv') != ui_stats.setFromLabelCounter('Inv', $box, 'Инвентарь') || $('#inventory li:not(.improved)').length || $('#inventory li:hidden').length)
			this.inventoryChanged = true;
		ui_informer.update('much gold', ui_stats.setFromLabelCounter('Gold', $box, 'Золота', gold_parser) >= (ui_stats.get('Brick') > 1000 ? 10000 : 3000));
		ui_informer.update('dead', ui_stats.setFromLabelCounter('HP', $box, 'Здоровье') === 0);

		//Shovel pictogramm start
		var digVoice = $('#hk_gold_we .voice_generator');
		//$('#hk_gold_we .l_val').text('где-то 20 монет');
		if ($('#hk_gold_we .l_val').text().length > 16 - 2*$('#main_wrapper.page_wrapper_5c').length) {
			if (!ui_improver.Shovel) {
				var path = GUIp_getResource('images/shovel_');
				var brightness = (ui_storage.get('ui_s') == 'th_nightly') ? 'dark' : 'bright';
				digVoice.empty();
				digVoice.append('<img id="red" src="' + path + 'red_' + brightness + '.gif" style="display: none; cursor: pointer; margin: auto;">' + 
							 '<img id="blue" src="' + path + 'blue_' + brightness + '.gif" style="display: inline; cursor: pointer; margin: auto;">');
				ui_improver.Shovel = 'blue';
			}
			if ($('#hk_gold_we .l_val').text().length > 20 - 2*$('#main_wrapper.page_wrapper_5c').length) {
				digVoice.css('margin', "4px -4px 0 0");
			} else {
				digVoice.css('margin', "4px 0 0 3px");
			}
			digVoice.hover(function() {
				if (ui_improver.Shovel == 'blue') {
					ui_improver.Shovel = 'red';
					$('#red').show();
					$('#blue').hide();
				}
			}, function() {
				if (ui_improver.Shovel == 'red') {
					ui_improver.Shovel = 'blue';
					$('#red').hide();
					$('#blue').show();
				}
			});
		} else {
			ui_improver.Shovel = false;
			digVoice.empty();
			digVoice.append('копай');
			digVoice.css('margin', "");
		}
	//Shovel pictogramm end
	},
// ---------- Pet --------------
	improvePet: function() {
		if (ui_data.isArena) return;
		if (ui_utils.findLabel($('#pet'), 'Статус')[0].style.display!='none'){
			if (!ui_utils.isAlreadyImproved($('#pet'))){
				$('#pet .block_title').after($('<div id="pet_badge" class="fr_new_badge equip_badge_pos">0</div>'));
			} 
			$('#pet_badge').text(ui_utils.findLabel($('#pet'), 'Статус').siblings('.l_val').text().replace(/[^0-9:]/g, ''));
			if ($('#pet .block_content')[0].style.display == 'none') 
				$('#pet_badge').show(); 
			else 
				$('#pet_badge').hide();
		}
		else
			if ($('#pet_badge').length == 1) 
				$('#pet_badge').hide();
	},
// ---------- Equipment --------------
	improveEquip: function() {
		if (ui_data.isArena) return;
		// Save stats
		var seq = 0;
		for (var i = 7; i >= 1;) {
			ui_stats.set('Equip' + i--, parseInt($('#eq_' + i + ' .eq_level').text()));
			seq += parseInt($('#eq_' + i + ' .eq_level').text()) || 0;
		}
		if (!ui_utils.isAlreadyImproved($('#equipment')))
			$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge equip_badge_pos">0</div>'));
		$('#equip_badge').text((seq / 7).toFixed(1));
	},
// ---------- Group HP --------------
	GroupHP: function(flag) {		
		var seq = 0;
		var $box = flag ? $('#alls .opp_h') : $('#opps .opp_h');
		var GroupCount = $box.length;
		if (GroupCount > 0)
			for (var i = 0; i < GroupCount; i++)
				if (parseInt($box[i].textContent))
					seq += parseInt($box[i].textContent);
		return seq; 
	},
// ---------- Pantheons --------------	
	improvePantheons: function() {
		if (ui_data.isArena) return;
		if (ui_storage.get('Option:relocateDuelButtons') !== null && ui_storage.get('Option:relocateDuelButtons').match('arena')) {
			if (!$('#pantheons.arena_link_relocated').length) {
				$('#pantheons').addClass('arena_link_relocated');
				$('.arena_link_wrap').insertBefore($('#pantheons_content')).addClass('p_group_sep').css('padding-top', 0);
			}
		} else if ($('#pantheons.arena_link_relocated').length) {
			$('#pantheons').removeClass('arena_link_relocated').removeClass('both');
			$('.arena_link_wrap').insertBefore($('#control .arena_msg')).removeClass('p_group_sep').css('padding-top', '0.5em');
		}
		if (ui_storage.get('Option:relocateDuelButtons') !== null && ui_storage.get('Option:relocateDuelButtons').match('chf')) {
			if (!$('#pantheons.chf_link_relocated').length) {
				$('#pantheons').addClass('chf_link_relocated');
				$('.chf_link_wrap:first').insertBefore($('#pantheons_content'));
				$('#pantheons .chf_link_wrap').addClass('p_group_sep');
			}
		} else if ($('#pantheons.chf_link_relocated').length) {
			$('#pantheons').removeClass('chf_link_relocated').removeClass('both');
			$('.chf_link_wrap').removeClass('p_group_sep');
			$('#pantheons .chf_link_wrap').insertAfter($('#control .arena_msg'));
		}/*
		if (ui_storage.get('Option:relocateDuelButtons') !== null && ui_storage.get('Option:relocateDuelButtons').match('cvs')) {
			if (!$('#pantheons.cvs_link_relocated').length) {
				$('#pantheons').addClass('cvs_link_relocated');
				$('.chf_link_wrap:first').insertBefore($('#pantheons_content'));
				$('#pantheons .chf_link_wrap').addClass('p_group_sep');
			}
		} else if ($('#pantheons.cvs_link_relocated').length) {
			$('#pantheons').removeClass('cvs_link_relocated').removeClass('both');
			$('.chf_link_wrap').removeClass('p_group_sep');
			$('#pantheons .chf_link_wrap').insertAfter($('#control .arena_msg'));
		}	*/
		if ($('#pantheons.arena_link_relocated.chf_link_relocated:not(.both)').length) {
			$('#pantheons').addClass('both');
			$('#pantheons .chf_link_wrap').insertBefore($('#pantheons_content'));
			$('.arena_link_wrap').removeClass('p_group_sep');
		}
	},
// ---------- Diary --------------		
	improveDiary: function() {
		if (ui_data.isArena) return;
		
		if (this.isFirstTime) {
			$('#diary .d_msg').addClass('parsed');
		} else {
			var newMessagesCount = $('#diary .d_msg:not(.parsed)').length;
			if (newMessagesCount) {
				if (ui_improver.voiceSubmitted) {
					if (newMessagesCount >= 2)
						ui_timeout.start();
					$('#god_phrase').change();
					ui_improver.voiceSubmitted = false;
				}
				for (var i = 0; i < newMessagesCount; i++)
					$('#diary .d_msg').eq(i).addClass('parsed');
			}
		}
	},

	whenWindowResize: function() {
		if ($(window).width() != ui_storage.get('windowWidth')) {
			ui_storage.set('windowWidth', $(window).width());
			this.chatsFix();
			//body widening
			$('body').width($(window).width() < $('#main_wrapper').width() ? $('#main_wrapper').width() : '');
		}
	},

	improveInterface: function() {
		if (this.isFirstTime) {
			$('a[href=#]').removeAttr('href');
			ui_storage.set('windowWidth', $(window).width());
			this.whenWindowResize();
			$(window).resize(this.whenWindowResize.bind(this));
		}

		if (localStorage.getItem('ui_s') !== ui_storage.get('ui_s')) {
			ui_storage.set('ui_s', localStorage.getItem('ui_s') || 'th_classic');
			ui_improver.Shovel = false;
			if (ui_storage.get('ui_s') == 'th_nightly') {
				$('#timeout_bar').addClass('night').removeClass('day');
			} else {
				$('#timeout_bar').addClass('day').removeClass('night');
			}
			ui_forum.container[0].className = ui_storage.get('ui_s').replace('th_', '');
		}

		if (ui_storage.get('Option:useBackground') == 'cloud') {
			if ($('body').css('background-image') !== 'url(' + GUIp_getResource("images/background.jpg") + ')') {
				$('body').css('background-image', 'url(' + GUIp_getResource("images/background.jpg") + ')');
			}
		} else if (ui_storage.get('Option:useBackground')) {
			//Mini-hash to check if that is the same background
			var hash = 0, ch, str = ui_storage.get('Option:useBackground');
			for (var i = 0; i < str.length; i++) {
				ch = str.charCodeAt(i);
				hash = ((hash<<5)-hash)+ch;
				hash = hash & hash; // Convert to 32bit integer
			}
			if (hash != this.hash) {
				this.hash = hash;
				$('body').css('background-image', 'url(' + ui_utils.escapeHTML(str) + ')');
			}
		} else {
			if ($('body').css('background-image')) {
				$('body').css('background-image', '');
			}
		}
	},
	
	improveChat: function() {
		// links replace
		var $cur_msg, $msgs = $('.fr_msg_l:not(.improved)'),
			$temp = $('<div id="temp" />');
		$('body').append($temp);
		for (var i = 1, len = $msgs.length; i < len; i++) {
			$cur_msg = $msgs.eq(i);
			$temp.append($('.fr_msg_meta', $cur_msg)).append($('.fr_msg_delete', $cur_msg));
			var text = $cur_msg.text();
			$cur_msg.empty();
			$cur_msg.append(text.replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="Откроется в новой вкладке">$1</a>'));
			$cur_msg.append($('.fr_msg_meta', $temp)).append($('.fr_msg_delete', $temp));
		}
		$msgs.addClass('improved');
		$temp.remove();
	},

	checkButtonsVisibility: function() {
		$('.arena_link_wrap,.chf_link_wrap,.cvs_link_wrap', $('#pantheons')).hide();
		if (ui_storage.get('Stats:Prana') >= 50){
			$('#pantheons .chf_link_wrap').show();
			$('#pantheons .cvs_link_wrap').show();
			$('#pantheons .arena_link_wrap').show();
		}
		$('.craft_button,.inspect_button,.voice_generator').hide();
		if (ui_storage.get('Stats:Prana') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
			$('.voice_generator, .inspect_button').show();
			if (ui_storage.get('Option:disableDieButton')) {
				$('#hk_death_count .voice_generator').hide();
			}
			if (ui_improver.b_b.length) $('.b_b').show();
			if (ui_improver.b_r.length) $('.b_r').show();
			if (ui_improver.r_r.length) $('.r_r').show();
			if ($('.b_b:visible, .b_r:visible, .r_r:visible').length) $('span.craft_button').show();
			//if ($('.f_news').text() != 'Возвращается к заданию...')fc
			if (!ui_data.isArena) {
				if ($('#hk_distance .l_capt').text() == 'Город' || $('.f_news').text().match('дорогу') || $('#news .line')[0].style.display != 'none') 
					$('#hk_distance .voice_generator').hide();
				//if (ui_storage.get('Stats:Prana') == 100) $('#control .voice_generator').hide();
				if ($('#control .p_val').width() == $('#control .p_bar').width() || $('#news .line')[0].style.display != 'none') $('#control .voice_generator')[0].style.display = 'none';
				if ($('#hk_distance .l_capt').text() == 'Город') $('#control .voice_generator')[1].style.display = 'none';
			}
			if ($('#hk_quests_completed .q_name').text().match(/\(выполнено\)/)) $('#hk_quests_completed .voice_generator').hide();
			if ($('#hk_health .p_val').width() == $('#hk_health .p_bar').width()) $('#hk_health .voice_generator').hide();
		}
	},

	chatsFix: function() {
		var cells = document.querySelectorAll('.frDockCell');
		for (var i = 0, len = cells.length; i < len; i++) {
			cells[i].classList.remove('left');
			cells[i].style.zIndex = len - i;
			if (cells[i].getBoundingClientRect().right < 350) {
				cells[i].classList.add('left');
			}
		}
		//padding for page settings link
		var padding_bottom = $('.frDockCell:last').length ? Math.floor($('.frDockCell:last').position().top/26.3 + 0.5)*$('.frDockCell').height() : 0,
			isBottom = window.scrollY >= window.scrollMaxY - 10;
		padding_bottom = Math.floor(padding_bottom*10)/10 + 40;
		padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
		$('.reset_layout').css('padding-bottom', padding_bottom);
		if (isBottom) {
			window.scrollTo(0, window.scrollMaxY);
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
		if(!ui_improver.improveInProcess) {
			ui_improver.improveInProcess = true;
			setTimeout(ui_improver.nodeInsertionDelay, 50);
		}
	},

	nodeInsertionDelay: function() {
		ui_improver.improve();
		if (ui_data.isArena) {
			ui_logger.update();
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
	start: function(obj) {
		var target = document.querySelector(obj.target);
		if (target) {
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(obj.func);
			});
			observer.observe(target, obj.config);
		}
	},
	chats: {
		condition: true,
		config: { childList: true },
		func: function(mutation) {
			if (mutation.addedNodes.length && !mutation.addedNodes[0].classList.contains('moved')) {
				var newNode = mutation.addedNodes[0];
				mutation.target.appendChild(newNode);
				newNode.classList.add('moved');
				var msgArea = newNode.querySelector('.frMsgArea');
				msgArea.scrollTop = msgArea.scrollTopMax;
			} else if (mutation.addedNodes.length || mutation.removedNodes.length) {
				ui_improver.chatsFix();
			}
		},
		target: '.chat_ph'
	},
	inventory: {
		condition: !ui_data.isArena && !ui_data.isMap,
		config: {
			childList: true,
			attributes: true,
			subtree: true,
			attributeFilter: ['style']
		},
		func: function(mutation) {
			if (mutation.target.tagName.toLowerCase() == 'li' && mutation.type == "attributes" &&
				mutation.target.style.display == 'none' && mutation.target.parentNode) {
				mutation.target.parentNode.removeChild(mutation.target);
				ui_improver.improveLoot();
			}
			if (mutation.target.tagName.toLowerCase() == 'ul' && mutation.addedNodes.length) {
				ui_improver.improveLoot();
			}
		},
		target: '#inventory ul'
	}
};

var ui_trycatcher = {
	replacer: function(object_name, method_name, method) {
		return function() {
			try {
				return method.apply(this, arguments);
			} catch (error) {
				console.error('Godville UI+ error log:\n' +
							  error.message + '\n' +
							  '↑ ошибка произошла в объекте ' + object_name + ', методе ' + method_name + "().");
				if (!ui_utils.hasShownErrorMessage) {
					ui_utils.hasShownErrorMessage = true;
					ui_utils.showMessage('error', {
						title: 'Ошибка в Godville UI+!',
						content: '<div>Произошла ошибка. Скопируйте следующую информацию и действуйте по инструции из окошка помощи:</div>' +
								 '<div>Текст ошибки: <b>' + error.message + '</b>.</div>' +
								 '<div>Место ошибки: объект <b>' + object_name + '</b>, метод <b>' + method_name + '()</b>.</div>',
						callback: function() {
							if (!ui_storage.get('helpDialogVisible')) {
								ui_storage.set('helpDialogVisible', true);
								ui_help_dialog.toggle();
							}
						}
					});
				}
			}
		};
	},
	process: function(object, object_name) {
		var method_name, method;
		for (method_name in object){
			method = object[method_name];
			if (typeof method == "function") {
				object[method_name] = this.replacer(object_name, method_name, method);
			}
		}
	}
};

var ui_starter = {
	start: function() {
		if ($ && ($('#m_info').length || $('#stats').length)) {
			clearInterval(starterInt);
			var start = new Date();
			ui_data.init();
			ui_utils.addCSS();
			ui_utils.inform();
			ui_words.init();
			ui_logger.create();
			ui_timeout.create();
			ui_help_dialog.create();
			ui_informer.init();
			ui_forum.init();
			ui_improver.improve();
			ui_observers.init();
			
			// Event and listeners
			$(document).bind('DOMNodeInserted', ui_improver.nodeInsertion);

			if (!ui_data.isArena) {
				$('html').mousemove(ui_improver.mouseMove);
			}

			// "Shift+Enter → new line" improvement by external-script to bypass stupid Chrome restrictions
			var shiftEnterScript = document.createElement('script');
			shiftEnterScript.src = GUIp_getResource('shift_enter.js');
			document.head.appendChild(shiftEnterScript);

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

			/*var layingTimerScript = document.createElement('script');
			layingTimerScript.src = GUIp_getResource('laying_timer.js');
			document.body.appendChild(layingTimerScript);*/

			var finish = new Date();
			console.info('Godville UI+ log: Initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
		}
	}
};

// Main code
var objects = [ui_data, ui_utils, ui_timeout, ui_help_dialog, ui_storage, ui_words,
			   ui_stats, ui_logger, ui_informer, ui_forum, ui_improver, ui_observers, ui_starter],
	object_names = ['ui_data', 'ui_utils', 'ui_timeout', 'ui_help_dialog', 'ui_storage', 'ui_words',
					'ui_stats', 'ui_logger', 'ui_informer', 'ui_forum', 'ui_improver', 'ui_observers', 'ui_starter'];
for (var i = 0, len = objects.length; i < len; i++) {
	ui_trycatcher.process(objects[i], object_names[i]);
}
var starterInt = setInterval(ui_starter.start, 200);