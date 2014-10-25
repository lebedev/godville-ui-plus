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
// Escapes HTML symbols
	escapeHTML: function(str) {
		return String(str).replace(/&/g, "&amp;")
						  .replace(/"/g, "&quot;")
						  .replace(/</g, "&lt;")
						  .replace(/>/g, "&gt;");
	},
	get: function(forum_no, success_callback, fail_callback) {
		var xhr = new XMLHttpRequest();
		xhr.forum_no = forum_no;
		xhr.onreadystatechange = ensureReadiness;

		function ensureReadiness() {
			try {
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
			} catch (error) {
				GM_log(error);
				if (GM_browser == "Firefox") {
					GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
				}
			}
		}

		xhr.open('GET', '/forums/show/' + forum_no, true);
		xhr.send('');
	},
	showMessage: function(msg_no, title) {
		ui_storage.set('helpDialogVisible', true);
		var $msg = $('<div id="msg' + msg_no + '" class="hint_bar ui_msg">'+
			'<div class="hint_bar_capt"><b>' + title + '</b></div>'+
			'<div class="hint_bar_content"></div>'+
			'<div class="hint_bar_close"><a onclick="$(\'#msg' + msg_no + '\').fadeToggle(function() {$(\'#msg' + msg_no + '\').remove();}); return false;">закрыть</a></div></div>'
			 ).insertAfter($('#menu_bar'));
		var fem = ui_storage.get('sex') == 'female' ? true : false;
		var content = 'Приветствую ' +
					'бог' + (fem ? 'иню' : 'а') + ', использующ' + (fem ? 'ую' : 'его') + ' аддон расширения интерфейса <b>Godville UI+</b>.<br>'+
					'<div style="text-align: justify; margin: 0.2em 0 0.3em;">&emsp;<b>Опции</b> находятся в <b>профиле</b> героя, на вкладке <b>Настройки UI</b>. '+
					'Информация о наличии новых версий аддона отображается в&nbsp;виде <i>всплывающего сообщения</i> (как это) и дублируется' +
					' в <i>диалоговом окне</i> (под этим всплывающим сообщением), '+
					'которое можно открыть/закрыть нажатием на кнопку <b>ui</b>, что чуть правее кнопки <i>выход</i> в верхнем меню.<br style="margin-bottom: 0.5em;">' +
					'&emsp;Информер можно убрать щелчком мыши по нему (при этом заголовок перестанет мигать) до следующего срабатывания условий информера. Например, Если у вас было <i>больше трех тысяч золота</i> и вы нажали на информер, то он появится в следующий раз только после того, как золота станет меньше, а потом опять больше трех тысяч.</div>' + 
					'Отображение <b>всех</b> информеров по-умолчанию <b>включено</b>. Возможно, вы захотите отключить информер <b>ВРЕМЕНИ ПЛАВКИ ПРЕДМЕТОВ</b>. Я предупредил.';
		$('.hint_bar_content', $msg).append(content);
		$msg.css('box-shadow', '2px 2px 15px #' + ((localStorage.getItem('ui_s') == 'th_nightly') ? 'ffffff' : '000000'))
			.fadeToggle(1500);
	},
	inform: function() {

	}
};

// ------------------------
//		TIMEOUT BAR
// ------------------------
var ui_timeout_bar = {
// creates timeout bar element
	create: function() {
		this.elem = $('<div id="timeout_bar" class="' + (ui_storage.get('ui_s') == 'th_nightly' ? 'night' : 'day') + '"/>');
		$('#menu_bar').after(this.elem);
	},
// starts timeout bar
	start: function(timeout) {
		timeout = timeout || 20;
		$elem = this.elem;
		$elem.stop();
		$elem.css('width', '100%');
		if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice')) {
			$('#voice_submit').attr('disabled', 'disabled');
			var startDate = new Date();
			var tick = setInterval(function() {
				var finishDate = new Date();
				if (finishDate.getTime() - startDate.getTime() > timeout * 1000) {
					clearInterval(tick);
					if (!ui_data.isArena && !ui_storage.get('Option:freezeVoiceButton').match('when_empty') || $('#god_phrase').val())
						$('#voice_submit').removeAttr('disabled');
				}
			}, 100);
		}
		$elem.animate({width: 0}, timeout * 1000, 'linear');
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
		var cloud = $('#fader.cloud').length;
		if (cloud) {
			$('#fader').removeClass('up');
		}
		this.bar.slideToggle("slow", function() {
			if (cloud && !ui_storage.get('helpDialogVisible')) {
				$('#fader').addClass('up');
			}
		});
	},
// creates ui dialog	
	create: function() {
		this.bar = $('<div id="ui_help_dialog" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' + 
					 '<div class="hint_bar_capt"><b>Godville UI+ (v' + ui_data.currentVersion + ')</b>, если что-то пошло не так...</div>' + 
					 '<div class="hint_bar_content" style="padding: 0.5em 0.8em;"></div>' + 
					 '<div class="hint_bar_close"></div></div>');
		if (ui_storage.get('helpDialogVisible')) this.bar.show();
		this.content = $('.hint_bar_content', this.bar);
		this.append('<div style="text-align: left;"><div>Если что-то работает не так, как должно:</div>' +
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
					'<li class="console Chrome Firefox hidden">Если баг остался — проверьте, нет ли пойманного вами бага в <a href="https://github.com/zeird/godville-ui-plus/wiki/TODO-list" target="_blank" title="Откроется в новой вкладке">этом списке</a>.</li>' +
					'<li class="console Chrome Firefox hidden">Если его нет в списке — откройте консоль (через меню или комбинацией <b>Ctrl+Shift+' + (GM_browser == 'Firefox' ? 'K' : 'J') + '</b>). ' +
						'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/' + (GM_browser == 'Firefox' ? 'firefox' : 'chrome') + '_console.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.</li>' +
					'<li class="console Chrome Firefox hidden">Попробуйте найти в консоли что-нибудь, похожее на информацию об ошибке. И с этой информацией напишите ' +					
						'богу <a href="/gods/Бэдлак" title="Откроется в новой вкладке" target="about:blank">Бэдлак</a>, ' +
						'в его <a href="skype:angly_cat">скайп</a> ' +
						'или в <a href="/forums/show_topic/2812" title="Откроется в новой вкладке" target="_blank">данную тему на форуме</a>.</li>' +
					'</ol>');
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
				console.log(GM_browser);
				$('#ui_help_dialog ol li.update_required.' + GM_browser).removeClass('hidden');
			} else {
				$('#ui_help_dialog ol li.console.' + GM_browser).removeClass('hidden');
			}
		} else {
			this.onXHRFail();
		}
	},
	onXHRFail: function() {
		console.log('ololo');
		$('#check_version')[0].innerHTML = 'Не удалось узнать номер последней версии. Если вы еще не обновлялись вручную, переходите к шагу 2, иначе к шагу 6.';
		$('#ui_help_dialog ol li.' + GM_browser).removeClass('hidden');
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
		GM_log("Storage:\n" + lines.join("\n"));
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
				'Этот предмет отправляет героя в мини-квест',
				'Этот предмет сочиняет о герое былину',
			   ].indexOf(desc);
	},
	
	isHealItem: function($obj) {
		return $obj.css("font-style") == "italic";
	},

	canBeActivated: function($obj) {
		return $obj.text().match(/\(@\)/);
	},
	
	isBoldItem: function($obj) {
		return $obj.css("font-weight") == 700 || $obj.css("font-weight") == "bold";
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
	create: function() {
		this.elem = $('<ul id="stats_log" />');
		$('#menu_bar').after(this.elem);
		this.elem.append('<div id="fader" />');
		this.need_separator = false;
	},

	appendStr: function(id, klass, str, descr) {
		// append separator if needed
		if (this.need_separator) {
			this.need_separator = false;
			if (this.elem.children().length > 0) {
				this.elem.append('<li class="separator">|</li>');
			}
		}
		// append string	
		this.elem.append('<li class="' + klass + '" title="' + descr + '">' + str + '</li>');
		this.elem.scrollLeft(10000); //Dirty fix		
		while ($('#stats_log li').position().left + $('#stats_log li').width() < 0 || $('#stats_log li')[0].className == "separator") {
			$('#stats_log li:first').remove();
		}
		if ($('#fader').position().left !== 0) {
			$('#fader').css("left", parseFloat($('#fader').css("left").replace('px', '')) - $('#fader').position().left);
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
		if (ui_data.isMap){
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
		var pm = $('.fr_new_badge_pos:visible').text();
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
					if (temp[3] != ui_data.god_name) {
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
		try {
			ui_informer.update('pvp', ui_data.isArena);
			this.improveStats();
			this.improvePet();
			this.improveLoot();
			this.improveVoiceDialog();
			this.improveNews();
			this.improveEquip();
			this.improvePantheons();
			this.improveDiary();
			this.improveMap();
			this.improveInterface();
			this.improveChat();
			this.improveWindowWidthChangeAndNewElementsInsertionRelatedStuff();
			this.checkButtonsVisibility();
			this.isFirstTime = false;
		} catch (error) {
			GM_log(error);
			if (GM_browser == "Firefox") {
				GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
			}
		} finally {
			ui_improver.improveInProcess = false;
		}
	},

	_createInspectButton: function(item_name) {
		return $('<a class="inspect_button" style="margin-left:0.3em" title="Упросить ' + ui_data.char_sex[0] + ' потрясти ' + item_name + '">?</a>')
			.click(function() {
				ui_utils.sayToHero(ui_words.inspectPhrase(item_name));
				return false;
			});
	},

	_createCraftButton: function(combo, combo_list, hint) {
		return $('<a class="craft_button ' + combo_list + '" title="Уговорить ' + ui_data.char_sex[0] + ' склеить случайную комбинацию ' + hint + ' предметов из инвентаря">' + combo + '</a>')
			.click(function() {
				var rand = Math.floor(Math.random()*ui_improver[combo_list].length),
					items = ui_improver[combo_list][rand];
				ui_utils.sayToHero(ui_words.craftPhrase(items));
				return false;
			});
	},
	
	improveLoot: function() {
		if (ui_data.isArena) return;
		if (this.inventoryChanged) {
			setTimeout(function() {
				$('#inventory li:hidden').remove();
			}, 1000);
			var i, j, len,
				flags = ['aura box', 'arena box', 'black box', 'boss box', 'friend box', 'good box', 'invite', 'heal box', 'prana box', 'raidboss box', 'smelter', 'teleporter', 'to arena box', 'transformer', 'quest box', 'bylina box'],
				types = new Array(flags.length),
				bold_items = false;

			for (i = 0, len = types.length; i < len; i++) {
				types[i] = false;
			}

			var l, trophyList = [],
				trophyBoldness = {},
				forbiddenCraft = ui_storage.get('Option:forbiddenCraft');

			// Parse items
			$('#inventory ul li:visible').each(function(ind, obj) {
				var $obj = $(obj);
				if ($obj.css('overflow') == 'visible') {
					var item_name = this.textContent.replace(/\?/, '')
													.replace(/\(@\)/, '')
													.replace(/\(\d + шт\)$/, '')
													.replace(/^\s+|\s+$/g, '');
					// color items and add buttons
					if (ui_words.canBeActivated($obj)) {
						var desc = $('div.item_act_link_div *', $obj).attr('title').replace(/ \(.*/g, ''),
							sect = ui_words.canBeActivatedItemType(desc);
						if (sect != -1) {
							types[sect] = true;
						} else {
							GM_log('Описание предмета ' + item_name + 'отсутствует в базе. Пожалуйста, скопируйте следующее описание предмета разработчику аддона:\n"' + desc + '"');
						}
						if (!(forbiddenCraft && (forbiddenCraft.match('activatable') || (forbiddenCraft.match('b_b') && forbiddenCraft.match('b_r'))))) {
							trophyList.push(item_name);
							trophyBoldness[item_name] = true;
						}
					} else if (ui_words.isHealItem($obj)) {
						if (!ui_utils.isAlreadyImproved($obj)) {
							$obj.addClass('heal_item');
						}
						if (!(forbiddenCraft && (forbiddenCraft.match('heal') || (forbiddenCraft.match('b_r') && forbiddenCraft.match('r_r'))))) {
							trophyList.push(item_name);
							trophyBoldness[item_name] = false;
						}
					} else {
						if (ui_words.isBoldItem($obj)) {
							bold_items = true;
							if (!(forbiddenCraft && forbiddenCraft.match('b_b') && forbiddenCraft.match('b_r')) &&
								!item_name.match('золотой кирпич') && !item_name.match(' босса ')) {
								trophyList.push(item_name);
								trophyBoldness[item_name] = true;
							}
						} else {
							if (!(forbiddenCraft && forbiddenCraft.match('b_r') && forbiddenCraft.match('r_r'))) {
								trophyList.push(item_name);
								trophyBoldness[item_name] = false;
							}
						}
						if (!ui_utils.isAlreadyImproved($obj)) {
							$obj.append(ui_improver._createInspectButton(item_name));
						}
					}
				}
			});

			this.b_b = [];
			this.b_r = [];
			this.r_r = [];
			if (trophyList.length) {
				trophyList.sort();
				for (i = 0, len = trophyList.length - 1; i < len; i++) {
					for (j = i + 1; j < len + 1; j++) {
						if (trophyList[i][0] == trophyList[j][0]) {
							if (trophyBoldness[trophyList[i]] && trophyBoldness[trophyList[j]]) {
								if (!(forbiddenCraft && forbiddenCraft.match('b_b'))) {
									this.b_b.push(trophyList[i] + ' и ' + trophyList[j]);
								}
							} else if (!trophyBoldness[trophyList[i]] && !trophyBoldness[trophyList[j]]) {
								if (!(forbiddenCraft && forbiddenCraft.match('r_r'))) {
									this.r_r.push(trophyList[i] + ' и ' + trophyList[j]);
								}
							} else {
								if (!(forbiddenCraft && forbiddenCraft.match('b_r'))) {
									this.b_r.push(trophyList[i] + ' и ' + trophyList[j]);
								}
							}
						} else {
							break;
						}
					}
				}
			}

			if (!ui_utils.isAlreadyImproved($('#inventory'))) {
				this._createCraftButton('нж+нж', 'r_r', 'нежирных').insertAfter($('#inventory ul'));
				this._createCraftButton('<b>ж</b>+нж', 'b_r', 'жирного и нежирного').insertAfter($('#inventory ul'));
				this._createCraftButton('<b>ж</b>+<b>ж</b>', 'b_b', 'жирных').insertAfter($('#inventory ul'));
				$('<span class="craft_button">Склей:</span>').insertAfter($('#inventory ul'));
			}

			for (i = 0, len = flags.length; i < len; i++) {
				ui_informer.update(flags[i], types[i]);
			}

			//ui_informer.update(flags[11], types[11] && !bold_items);
			//ui_informer.update('transform!', types[11] && bold_items);
			
			//ui_informer.update('smelt!', types[10] && ui_storage.get('Stats:Gold') >= 3000);
			//ui_informer.update(flags[10], types[10] && ui_storage.get('Stats:Gold') < 3000);

			this.inventoryChanged = false;
		}

		/*if (!ui_data.isArena && ui_storage.get('Option:forbiddenInformers') && ui_storage.get('Option:forbiddenInformers').match('SMELT_TIME')) {
			if (ui_storage.get('Stats:Prana') == 100 &&
				$('#hk_distance .l_capt').text() == 'Город' &&
				$('#hk_health .p_val').width() == $('#hk_health .p_bar').width() &&
				 !$('#inventory ul li:not(.heal_item)').filter(function() {return $(this).css('overflow') == 'visible';}).length &&
				ui_storage.get('Stats:Gold') > 3000) {
				if (!ui_improver.hucksterNews.length) {
					ui_improver.hucksterNews = "1" + $('.f_news.line').text();
				} else if (ui_improver.hucksterNews[0] == '1' && !ui_improver.hucksterNews.match($('.f_news.line').text())) {
					ui_improver.hucksterNews = "2" + $('.f_news.line').text();
				} else if (ui_improver.hucksterNews[0] == '2' && !ui_improver.hucksterNews.match($('.f_news.line').text())) {
					ui_improver.hucksterNews = '';
				}
			} else {
				ui_improver.hucksterNews = '';
			}
			ui_informer.update('SMELT TIME', ui_improver.hucksterNews && ui_improver.hucksterNews[0] == "2");
			if (ui_informer.flags['SMELT TIME'] === true && !$('#smelt_time').length) {
				$('#fader').append('<audio loop preload="auto" id="smelt_time" src="arena.ogg"></audio>');
				$('#smelt_time')[0].play();
			} else if (ui_informer.flags['SMELT TIME'] !== true && $('#smelt_time').length) {
				$('#smelt_time')[0].pause();
				$('#smelt_time').remove();
			}
		}*/
	},

	improveVoiceDialog: function() {
		// Add links and show timeout bar after saying
		if (this.isFirstTime) {
			if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'))
				$('#voice_submit').attr('disabled', 'disabled');
			$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
				if (!ui_data.isArena && $(this).val() && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && ui_timeout_bar.elem.width())) {
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
			
			var refresher = setInterval (function() {
				if (ui_storage.get('Option:forcePageRefresh')) {
					if (!ui_improver.news.match($('.f_news.line').text()) || !ui_improver.news.match(ui_storage.get('Stats:HP'))) {
						ui_improver.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
						ui_improver.lastNews = new Date();
					}
					var now = new Date();
					if (now.getTime() - ui_improver.lastNews.getTime() > 180000) {
						if ($('.t_red').length) {
							GM_log('RED ALERT! HARD RELOADING!');
							location.reload();
						}
						GM_log('Soft reloading');
						$('#d_refresh').click();
					}
				}
			}, 60000);
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

		if (this.isFirstTime)
			$('#hk_clan .l_val').width(Math.floor(100 - 100*$('#hk_clan .l_capt').width() / (ui_data.isArena ? $('#m_info .block_content') : $('#stats .block_content')).width()) + '%');
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
		ui_informer.update('much_gold', ui_stats.setFromLabelCounter('Gold', $box, 'Золота', gold_parser) >= (ui_stats.get('Brick') > 1000 ? 10000 : 3000));
		ui_informer.update('dead', ui_stats.setFromLabelCounter('HP', $box, 'Здоровье') === 0);

		//Shovel pictogramm start
		var digVoice = $('#hk_gold_we .voice_generator');
		//$('#hk_gold_we .l_val').text('где-то 20 монет');
		if ($('#hk_gold_we .l_val').text().length > 16 - 2*$('#main_wrapper.page_wrapper_5c').length) {
			if (!ui_improver.Shovel) {
				var path = GM_getResource('images/shovel_');
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
				$('#pet .block_title').after($('<div id="pet_badge" class="fr_new_badge gu_new_badge_pos">0</div>'));
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
			$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge gu_new_badge_pos">0</div>'));
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
						ui_timeout_bar.start();
					$('#god_phrase').change();
					ui_improver.voiceSubmitted = false;
				}
				for (var i = 0; i < newMessagesCount; i++)
					$('#diary .d_msg').eq(i).addClass('parsed');
			}
		}
	},
	
	improveInterface : function(){
		if (this.isFirstTime) {
			$('a[href=#]').removeAttr('href');
			ui_storage.set('windowWidth', $(window).width());
			$(window).resize(function() {
				if ($(this).width() != ui_storage.get('windowWidth')) {
					ui_storage.set('windowWidth', $(window).width());
					ui_improver.improveWindowWidthChangeAndNewElementsInsertionRelatedStuff();
				}
			});
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
			if (!$('#fader.cloud').length) {
				$('body').css('background-image', 'url(' + GM_getResource("images/background.jpg") + ')');
				if (ui_storage.get('helpDialogVisible')) {
					$('#fader').addClass('down');
				} else {
					$('#fader').addClass('up');
				}
				$('#fader').addClass('cloud').removeClass('day night');
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
				$('#fader').removeClass('cloud up down day night');
			}
		} else {
			$('body').css('background-image', '');
			if (ui_storage.get('ui_s') == 'th_nightly' && !$('#fader.night').length) {
				$('#fader').addClass('night').removeClass('cloud up down day');
			} else if (ui_storage.get('ui_s') != 'th_nightly' && !$('#fader.day').length) {
				$('#fader').addClass('day').removeClass('cloud up down night');
			}
		}
	},
	
	improveChat: function() {
		// links replace
		var $msgs = $('.fr_msg_l:not(.improved)');
		for (var i = 1, len = $msgs.length; i < len; i++) {
			$cur_msg = $msgs.eq(i);
			$('#fader').append($('.fr_msg_meta', $cur_msg)).append($('.fr_msg_delete', $cur_msg));
			var text = $cur_msg.text();
			$cur_msg.empty();
			$cur_msg.append(text.replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="Откроется в новой вкладке">$1</a>'));
			$cur_msg.append($('#fader .fr_msg_meta')).append($('#fader .fr_msg_delete'));
		}
		$msgs.addClass('improved');
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
	
	improveWindowWidthChangeAndNewElementsInsertionRelatedStuff: function() {
		if (ui_storage.get('Option:useBackground')) {
			//background offset
			if (ui_storage.get('Option:useBackground') == 'cloud') {
				$('body').css('background-position', ($('#fader').offset().left ? ($('#fader').offset().left - 163.75) : 0) + 'px 0');
			}
			//body widening
			$('body').width($(window).width() < $('#main_wrapper').width() ? $('#main_wrapper').width() : '');
		}
		
		this.chatsFix();
		
		//padding for page settings link
		var padding_bottom = $('.frDockCell:last').length ? Math.floor($('.frDockCell:last').position().top/26.3 + 0.5)*$('.frDockCell').height() : 0,
			isBottom = window.scrollY >= window.scrollMaxY - 10;
		padding_bottom = Math.floor(padding_bottom*10)/10 + 40;
		padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
		$('.reset_layout').css('padding-bottom', padding_bottom);
		if (isBottom) {
			window.scrollTo(0, window.scrollMaxY);
		}
		
		//settings dialod
		if (!ui_utils.isAlreadyImproved($('#facebox'))) {
			$('#facebox').css('left', ($(window).width() - $('#facebox').width())/2 + 'px');
			$('#facebox').css('top', ($(window).height() - $('#facebox').height())/2 + 'px');
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
	},
		
	add_css: function () {
		if ($('#ui_css').length === 0) {
			GM_addGlobalStyleURL('godville-ui-plus.css', 'ui_css');
		}
	}
};

var ui_observers = {
	init: function() {
		for (var key in this) {
			if (this[key].observer) {
				this[key].interval = setInterval(this.start.bind(this[key]), 100);
			}
		}
	},
	start: function() {
		var target = document.querySelector(this.target);
		if (target) {
			clearInterval(this.interval);
			this.observer.observe(target, this.config);
		}
	},
	chats: {
		config: { childList: true },
		interval: 0,
		observer: new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.addedNodes.length && !mutation.addedNodes[0].classList.contains('moved')) {
					var newNode = mutation.addedNodes[0];
					mutation.target.appendChild(newNode);
					newNode.classList.add('moved');
				} else if (mutation.addedNodes.length || mutation.removedNodes.length) {
					ui_improver.chatsFix();
				}
			});
		}),
		target: '.chat_ph'
	}
};

// Main code
var starter = setInterval(function() {
	if ($ && ($('#m_info').length || $('#stats').length)) {
		try {
			var start = new Date();
			clearInterval(starter);
			ui_data.init();
			//ui_utils.inform();
			ui_improver.add_css();
			ui_words.init();
			ui_logger.create();
			ui_timeout_bar.create();
			ui_help_dialog.create();
			ui_informer.init();
			ui_forum.init();
			ui_improver.improve();
			ui_observers.init();
			var finish = new Date();
			GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
		} catch (error) {
			GM_log(error);
			if (GM_browser == 'Firefox') {
				GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
			}
		}
	}
}, 200);

// Event and listeners
$(document).bind('DOMNodeInserted', function() {
	if(!ui_improver.improveInProcess){
		ui_improver.improveInProcess = true;
		setTimeout(function() {
			ui_improver.improve();
			if (ui_data.isArena) {
				ui_logger.update();
			}
		}, 50);
	}
});

$('html').mousemove(function() {
	if (!ui_logger.Updating) {
		ui_logger.Updating = true;
		if (!ui_data.isArena)
			ui_logger.update();
		setTimeout(function() {
			ui_logger.Updating = false;
		}, 500);
	}
});

// "Shift+Enter → new line" improvement by external-script to bypass stupid Chrome restrictions
var shiftEnterScript = document.createElement('script');
shiftEnterScript.src = GM_getResource('shift_enter.js');
document.head.appendChild(shiftEnterScript);

/*var layingTimerScript = document.createElement('script');
layingTimerScript.src = GM_getResource('laying_timer.js');
document.body.appendChild(layingTimerScript);*/