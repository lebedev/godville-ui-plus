var ui_data = {
	currentVersion: '$VERSION',
	developers: ['Neniu', 'Ryoko', 'Опытный Кролик', 'Бэдлак', 'Ui Developer', 'Шоп'],
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
		
		$('<div>', {id:"motd"}).insertAfter($('#menu_bar')).hide();
		$('#motd').load('news .game.clearfix:first a', function() {
			ui_improver.monstersOfTheDay = new RegExp($('#motd a:eq(0)').text() + '|' + $('#motd a:eq(1)').text());
			$('#motd').remove();
		});
	},

// gets add-on's page and check it's version
	checkLastVersion: function() {
		$.get('forums/show_topic/2812', function(response) {
			
			if (ui_utils.isDeveloper() || ui_storage.get('Option:forbiddenInformers') != null && !ui_storage.get('Option:forbiddenInformers').match('new_posts')) {
				var posts = parseInt(response.match(/Сообщений\: \d+/)[0].match(/\d+/));
				if (posts > ui_storage.get('posts')) {
					ui_storage.set('posts', posts);
					ui_informer.update('new posts', false);
					ui_informer.update('new posts', true);
				}
			}	
			//var data, timer = 0;
			//this.lastVersion = response.match(/Текущая версия[^<]*<[^<]*<[^<]*/)[0].replace(/[^>]*>[^>]*>/, '');
			/*var r = new RegExp('<[^>]*>Ссылка на скачивание Godville UI\\+ для ' + GM_browser);
			var link = response.match(r)[0].replace(/^([^\"]*\")/, '').replace(/(".*)$/, '');
			if (this.lastVersion == '') {
				data = '<span>Не удалось узнать номер последней версии. Попробуйте обновить страницу.</span>';
			} else if (this.lastVersion > ui_data.currentVersion) {
				data = 'Найдена новая версия аддона (<b>' + ui_utils.escapeHTML(this.lastVersion) + '</b>). Обновление доступно по <a href="' +
				link + '" title="Откроется в новой вкладке" target="about:blank">этой ссылке</a>.';
				$('<div id="version_check" class="hint_bar" style="position: fixed; top: 40px; left: 0; right: 0; z-index: 301; display: none;"><div class="hint_bar_capt"><b>Godville UI+ version check</b></div><div class="hint_bar_content" style="padding: 0.5em;"></div></div>').insertAfter($('#menu_bar'));
				$('#version_check').css('box-shadow', '2px 2px 15px #' + ((localStorage.getItem('ui_s') == 'th_nightly') ? 'ffffff' : '000000'));
				$('#version_check .hint_bar_content').append(data);
				$('#version_check').fadeToggle(1500, function() {
					setTimeout(function() {
						$('#version_check').fadeToggle(1500, function() {
							$('#version_check').remove();
						});
					}, 5000);
				});
				timer = 8000;
			} else if (this.lastVersion < ui_data.currentVersion) {
				var phrases = ['И пусть весь мир подождет',
								 'На шаг впереди',
								 'Пробуешь все новенькое',
								 'Никому не говори об этом',
								 'Салют ловцам багов',
								 'Ты избранный',
								 'Глюки, глюки повсюду',
								 'Это не баг, а фича',
								 'Откуда ты взял эту',
								 'H̴͜͟҉̸͔̠͚̖̟̾ͦ́̓ę͈̹͈̓̑̿͗ͥͯͩ͝͏͘͢ ̶͔̠ͦ͘̕͜c͇̠̮̃҉̵̕ö͚͖͙̺̘̖́͑ͪ̅͑̉̕҉̷m̨̟̣̺̓ͤͤe̦̭̳̪̠͔̺̕͞͏̧͡s͈̝͗͋̏͆̄̈́͝͏҉'
								]
				var mark = ['.', '.', '?', '...', '!', '.', '!', '.', '?', '.']
				var random = Math.floor(Math.random()*(9 + (GM_browser == 'Firefox')));
				data = 'Публичная версия: <b>' + ui_utils.escapeHTML(this.lastVersion) + '</b>. ' + phrases[random] + ', ' + ui_data.god_name + mark[random];
			} else {
				data = 'У вас установлена последняя версия.';
			}	
			setTimeout(function() {
				ui_informer.update('new version', false);
				ui_informer.update('new version', timer != 0); //timer == 0 as false, timer != 0 as true
				ui_menu_bar.append('<div>' + data + '</div>');
			}, timer);*/
		})
		.error(function() {
			ui_menu_bar.append('<span>Не удалось получить количество постов. Попробуйте обновить страницу.</span>');
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
		return str.replace(/[&"<>]/g, function (m) {({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[m]});
	}
};

// ------------------------
//		TIMEOUT BAR
// ------------------------
var ui_timeout_bar = {
// creates timeout bar element
	create: function() {
		this.elem = $('<div id="timeout_bar" />');
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
//		MENU BAR
// ------------------------
var ui_menu_bar = {
// appends element in ui dialog
	append: function($append) {
		this.content.append($append);
	},
// toggles ui dialog	
	toggle: function(visible) {
		ui_storage.set('uiMenuVisible', !ui_storage.get('uiMenuVisible'));
		if (ui_storage.get('Option:useBackground'))
			$('#fader').hide();
		this.bar.slideToggle("slow", function() {
			if (ui_storage.get('Option:useBackground') == 'cloud') {
				var color = new Array(2);
				if (ui_storage.get('uiMenuVisible')) {
					color[0] = '241,247,253';
					color[1] = '233,243,253';
				} else {
					color[0] = '253,252,255';
					color[1] = '243,248,253';
				}
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').css('background', background).show();
			}
		});
	},
// creates ui dialog	
	create: function() {
		this.bar = $('<div id="ui_menu_bar" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' + 
					 '<div class="hint_bar_capt"><b>Godville UI+ (v.' + ui_data.currentVersion + ')</b></div>' + 
					 '<div class="hint_bar_content" style="padding: 0.5em 0.8em;"></div>' + 
					 '<div class="hint_bar_close"></div></div>');
		if (ui_storage.get('uiMenuVisible')) this.bar.show();
		this.content = $('.hint_bar_content', this.bar);
		this.append('<div style="text-align: left;">Если что-то работает не так, как должно, — ' +
						(GM_browser == 'Firefox' ? 'загляните в веб-консоль (Ctrl+Shift+K), а также в консоль ошибок (Ctrl+Shift+J)'
												 : 'обновите страницу и проверьте консоль (Ctrl+Shift+J) на наличие ошибок') +
						'. Если обновление страницы и дымовые сигналы не помогли, напишите об этом в ' + 
						'<a href="skype:angly_cat">скайп</a>,' + 
						' богу <a href="http://godville.net/gods/Бэдлак" title="Откроется в новом окне" target="about:blank">Бэдлак</a>' + 
						' или в <a href="https://godville.net/forums/show_topic/2812" title="Откроется в новой вкладке" target="about:blank">данную тему на форуме</a>.</div>');
		if (ui_utils.isDeveloper()) {
			this.append($('<span>dump: </span>'));
			this.append(this.getDumpButton('all'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('options', 'Option'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('stats', 'Stats'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('logger', 'Logger'));
		} else this.append('<br>')
		ui_data.checkLastVersion();
		$('.hint_bar_close', this.bar).append(this.getToggleButton('закрыть'));
		$('#menu_bar').after(this.bar);
		$('#menu_bar ul').append('<li> | </li>')
						 .append(this.getToggleButton('<strong>ui</strong>'))
						 .append('<li> | </li><a href="user/profile#ui_options">настройки</a>');
	},
// gets toggle button
	getToggleButton: function(text) {
		return $('<a>' + text + '</a>').click(function() {ui_menu_bar.toggle(); return false;});
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
		if (old != null) {
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
		var lines = new Array;
		var r = new RegExp('^GM_' + ui_data.god_name + ':' + (selector == null ? '' : selector));
		for(var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).match(r)) {
				lines.push(localStorage.key(i) + " = " + localStorage[localStorage.key(i)]);
			}
		}
		lines.sort();
		GM_log("Storage:\n" + lines.join("\n"));
	},
// resets saved options
	clear: function() {
		localStorage.setItem('GM_clean050613', 'false');
		location.reload();
		return "Storage cleared. Reloading...";
	},
// deletes all values related to current god_name
	clearStorage: function() {
		if (localStorage.getItem('GM_clean050613') != 'true') {
			try {
				var idx_lst = [];
				var r = new RegExp('^GM_.*');
				var settings = new RegExp('^GM_[^:]+:Option:(?:forbiddenInformers|forcePageRefresh|freezeVoiceButton|relocateDuelButtons|useBackground|useHeil|useHeroName|useShortPhrases|hideChargeButton)');
				var stuff = new RegExp('^GM_[^:]+:(phrases|Stats|Logger).*');
				for (var i = 0; i < localStorage.length; i++) {
					var key = localStorage.key(i);
					if (key.match(r) && (!(key.match(settings) || key.match(stuff)) || key.match('undefined'))) idx_lst.push(key);
				}
				for(key in idx_lst) {
					localStorage.removeItem(idx_lst[key]);
				}
				localStorage.setItem('GM_clean050613', 'true');
				this.set('uiMenuVisible', true);
				$('<div id="first_run" class="hint_bar" style="position: fixed; top: 40px; left: 0; right: 0; z-index: 301; display: none; padding-bottom: 0.7em;">'+
					'<div class="hint_bar_capt"><b>Godville UI+ first run message</b></div>'+
					'<div class="hint_bar_content" style="padding: 0 1em;"></div>'+
					'<div class="hint_bar_close"><a onclick="$(\'#first_run\').fadeToggle(function() {$(\'#first_run\').remove();}); return false;">закрыть</a></div></div>'
					 ).insertAfter($('#menu_bar'));
				var fem = ui_storage.get('sex') == 'female' ? true : false;
				var data = 'Приветствую ' +
							 'бог' + (fem ? 'иню' : 'а') + ', использующ' + (fem ? 'ую' : 'его') + ' аддон расширения интерфейса <b>Godville UI+</b>.<br>'+
							 '<div style="text-align: justify; margin: 0.2em 0 0.3em;">&emsp;<b>Опции</b> находятся в <b>профиле</b> героя, на вкладке <b>Настройки UI</b>. '+
							 'Информация о наличии новых версий аддона отображается в&nbsp;виде <i>всплывающего сообщения</i> (как это) и дублируется' +
							 ' в <i>диалоговом окне</i> (под этим всплывающим сообщением), '+
							 'которое можно открыть/закрыть нажатием на кнопку <b>ui</b>, что чуть правее кнопки <i>выход</i> в верхнем меню.<br style="margin-bottom: 0.5em;">' +
							 '&emsp;Информер можно убрать щелчком мыши по нему (при этом заголовок перестанет мигать) до следующего срабатывания условий информера. Например, Если у вас было <i>больше трех тысяч золота</i> и вы нажали на информер, то он появится в следующий раз только после того, как золота станет меньше, а потом опять больше трех тысяч.</div>' + 
							 'Отображение <b>всех</b> информеров по-умолчанию <b>включено</b>. Возможно, вы захотите отключить информер <b>ВРЕМЕНИ ПЛАВКИ ПРЕДМЕТОВ</b>. Я предупредил.';								 
				$('#first_run').css('box-shadow', '2px 2px 15px #' + ((localStorage.getItem('ui_s') == 'th_nightly') ? 'ffffff' : '000000'));
				$('#first_run .hint_bar_content').append(data);
				$('#first_run').fadeToggle(1500);				
			} catch(error) {
				GM_log(error);
				if (GM_browser == "Firefox")
					GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
			}
		}
		this.set('isStorage', true);
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
		var sects = ['heal', 'pray', 'sacrifice', 'exp', 'dig', 'hit', 'do_task', 'cancel_task', 'die', 'town', 'heil', 'walk_s', 'walk_n', 'walk_w', 'walk_e'];
		for (var i = 0; i < sects.length; i++) {
			var t = sects[i];
			var text = ui_storage.get('phrases_' + t);
			if (text && text != "") {
				this.base['phrases'][t] = text.split("||");
			}
		}
	},
// single phrase gen
	randomPhrase: function(sect) {
		return ui_utils.getRandomItem(this.base['phrases'][sect]);
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
			phrases = this._longPhrase_recursion(this.base['phrases'][sect].slice(), (len || 100) - prefix.length);
		}
		this.currentPhrase = prefix ? prefix + this._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
		return this.currentPhrase;
	},
// inspect button phrase gen
	inspectPhrase: function(item_name) {
		return this.longPhrase('inspect_prefix', item_name);
	},
// merge button phrase gen
	mergePhrase: function(items) {
		return this.longPhrase('merge_prefix', items);
	},

// Checkers
	isCategoryItem: function(cat, item_name) {
		return this.base['items'][cat].indexOf(item_name) >= 0;
	},
	
	canBeActivatedItemType: function(desc) {
		return ['Этот предмет наделяет героя случайной аурой',
				'Данный предмет можно активировать только во время дуэли',
				'Этот предмет может случайным образом повлиять на героя',
				'Этот предмет ищет для героя босса',
				'Этот предмет заводит герою случайного друга из числа активных героев',
				'Активация инвайта увеличит счетчик доступных приглашений',
				'Этот предмет полностью восстанавливает здоровье героя',
				'Этот предмет добавляет заряд в прано-аккумулятор',
				'Этот предмет на несколько минут отправляет героя в поиск соратников для битвы с ископаемым боссом',
				'Этот предмет убивает атакующего героя монстра, либо пытается выплавить из золота героя золотой кирпич',
				'Этот предмет телепортирует героя в случайный город',
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
		return $obj.css("font-weight") == 700;
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
		return ui_utils.getRandomItem(this.base['phrases']['heil']) + ', ' + this._changeFirstLetter(text);
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
		if (id == 'Brick' || id == 'Wood') return this.set(id, Math.floor(value*10 + 0.5))
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
		this.elem.append('<div id="fader" style="position: absolute; left: 0; float: left; width: 50px; height: 100%;" />');
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
		if ($('#fader').position().left != 0) {
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
				if (name === 'exp') {
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
			this.watchStatsValue('Map_Alls_HP', 'a:hp', 'Здоровье союзников', 'brick');
		}
		if (ui_data.isArena && !ui_data.isMap) {
			this.watchStatsValue('Hero_HP', 'h:hp', 'Здоровье героя', 'hp');
			this.watchStatsValue('Enemy_HP', 'e:hp', 'Здоровье соперника', 'death');
			this.watchStatsValue('Hero_Alls_HP', 'a:hp', 'Здоровье союзников', 'brick');
			this.watchStatsValue('Hero_Inv', 'h:inv', 'Инвентарь', 'inv');
			this.watchStatsValue('Hero_Gold', 'h:gld', 'Золото', 'gold'); 
			this.watchStatsValue('Hero_Battery', 'h:bt', 'Заряды', 'battery');
			this.watchStatsValue('Enemy_Gold', 'e:gld', 'Золото', 'monster');
			this.watchStatsValue('Enemy_Inv', 'e:inv', 'Инвентарь', 'monster');
		}
		this.watchStatsValue('Level', 'lvl', 'Уровень');
		this.watchStatsValue('HP', 'hp', 'Здоровье');
		this.watchStatsValue('Prana', 'pr', 'Прана (проценты)');
		this.watchStatsValue('Battery', 'bt', 'Заряды');
		this.watchStatsValue('Exp', 'exp', 'Опыт (проценты)');
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
		this.container = $('<div id="informer_bar" style="position: fixed; top: 0; z-index: 301;"/>');
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
		if (!fl || fl == "") fl = ' {}';
		this.flags = JSON.parse(fl);
	},
	
	save: function() {
		ui_storage.set('informer_flags', JSON.stringify(this.flags));
	},
	
	create_label: function(flag) {
		var $label = $('<div>' + flag + '</div>')
			.click(function() {
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
		document.title = pm + this.title;
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
//	Improvements !!
// ------------------------------------
// -------- Hero Loot -----------------

// Main button creater
var ui_improver = {
	inventoryChanged: true,
	improveInProcess: true,
	Shovel: false,
	isFirstTime: true,
	voiceSubmitted: false,
	monstersOfTheDay: '',
	trophyList: [],
	hucksterNews: '',
	improve: function() {
		this.improveInProcess = true;
		try {
			ui_informer.update('pvp', ui_data.isArena);
			if (!ui_storage.get('isStorage')) throw('No users data!');
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
			if (GM_browser == "Firefox")
				GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
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

	_createMergeButton: function() {
		return $('<a id="merge_button" title="Уговорить ' + ui_data.char_sex[0] + ' склеить два случайных предмета из инвентаря">Склеить что-нибудь</a>')
			.click(function() {
				var rand = Math.floor(Math.random()*ui_improver.trophyList.length);
				item_first = ui_improver.trophyList[rand];
				item_second = (ui_improver.trophyList[rand + 1] && ui_improver.trophyList[rand][0] == ui_improver.trophyList[rand + 1][0])
							? ui_improver.trophyList[rand + 1]
							: ui_improver.trophyList[rand - 1];
				ui_utils.sayToHero(ui_words.mergePhrase(item_first + ' и ' + item_second));
				return false;
			});
	},

	/*_createWalkButton: function(walk) {
		return $('<a	id="' + walk + '_button" title="Попросить ' + ui_data.char_sex[0] + ' повести команду на ' + walk + '">?</a>')
			.click(function() {
				ui_utils.sayToHero(ui_words.walkPhrase(walk));
				return false;
			});
	},*/
	
	improveLoot: function() {
		if (ui_data.isArena) return;
		if (this.inventoryChanged) {
			setTimeout(function() {
				$('#inventory li:hidden').remove();
			}, 1000);
			var flags = ['aura box', 'arena box', 'black box', 'boss box', 'friend box', 'invite', 'heal box', 'prana box', 'raidboss box', 'smelter', 'teleporter', 'transformer', 'quest box', 'bylina box'];
			var types = new Array(flags.length);
			for (var i = 0; i < types.length; i++)
				types[i] = false;
			var good_box = false;
			var to_arena_box = false;
			var bold_item = false;

			ui_improver.trophyList = [];

			// Parse items
			$('#inventory ul li:visible').each(function(ind, obj) {
				var $obj = $(obj);
				if ($obj.css('overflow') == 'visible') {
					var item_name = this.textContent.replace(/\?/, '')
													.replace(/\(@\)/, '')
													.replace(/\(\d + шт\)$/, '')
													.replace(/^\s + |\s + $/g, '');
					// color items and add buttons
					if (ui_words.canBeActivated($obj)) {
						var desc = $('div.item_act_link_div *', $obj).attr('title').replace(/ \(.*/g, '');
						var sect = ui_words.canBeActivatedItemType(desc);
						if (sect != -1)
							types[sect] = true;
						else {
							GM_log('Описание предмета ' + item_name + 'отсутствует в базе. Пожалуйста, скопируйте следующее описание предмета разработчику аддона:\n"' + desc + '"');
							if (ui_words.isCategoryItem('good box', item_name))
								good_box = true;
							else if (ui_words.isCategoryItem('to arena box', item_name))
								to_arena_box = true;
						}
					} else if (ui_words.isHealItem($obj)) {
						if (!ui_utils.isAlreadyImproved($obj)) {
							$obj.css('color', 'green');
							$obj.addClass('heal_item');
						}
					} else {
						if (ui_words.isBoldItem($obj))
							bold_item = true;
						else
							ui_improver.trophyList.push(item_name);
						if (!ui_utils.isAlreadyImproved($obj))
							$obj.append(ui_improver._createInspectButton(item_name));
					}
				}
			});
			
			if (!ui_utils.isAlreadyImproved($('#inventory'))) {
				this._createMergeButton().insertAfter($('#inventory ul'));
				$('#inventory ul').css('text-align', 'left');
				$('#inventory').css('text-align', 'center');
			}
			
			ui_improver.trophyList.sort();
			for (var i = ui_improver.trophyList.length - 1; i >= 0; i--) {
				if (!((ui_improver.trophyList[i - 1] && ui_improver.trophyList[i][0] == ui_improver.trophyList[i - 1][0]) || (ui_improver.trophyList[i + 1] && ui_improver.trophyList[i][0] == ui_improver.trophyList[i + 1][0]))) {
					ui_improver.trophyList.splice(i, 1);
				}
			}
			
			for (var i = 0; i < flags.length; i++) {
				ui_informer.update(flags[i], types[i]);
			}
			// Не понял зачем это, пока отключаю так как не отключается информер
			//ui_informer.update(flags[11], types[11] && !bold_item);
			//ui_informer.update('transform!', types[11] && bold_item);
			
			ui_informer.update('good box', good_box);
			
			ui_informer.update('smelt!', types[9] && ui_storage.get('Stats:Gold') >= 3000);
			ui_informer.update(flags[9], types[9] && !(ui_storage.get('Stats:Gold') >= 3000));
			
			ui_informer.update('to arena box', to_arena_box);
		
			this.inventoryChanged = false;
		}
		
		if (!ui_data.isArena && ui_storage.get('Option:forbiddenInformers') && ui_storage.get('Option:forbiddenInformers').match('SMELT_TIME')) {
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
			if (ui_informer.flags['SMELT TIME'] == true && !$('#smelt_time').length) {
				$('#fader').append('<audio loop preload="auto" id="smelt_time" src="arena.ogg"></audio>');
				$('#smelt_time')[0].play();
			} else if (ui_informer.flags['SMELT TIME'] != true && $('#smelt_time').length) {
				$('#smelt_time')[0].pause();
				$('#smelt_time').remove();
			}
		}
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
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Юг', (isContradictions ? 'walk_s' : 'walk_n'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Юг');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Север', (isContradictions ? 'walk_n' : 'walk_s'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Север');
				if ($('#map')[0].textContent.match('Бессилия'))
					$('#actions').hide();
			} else {
				if (ui_data.isArena) {
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
			$('#cntrl .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : ''; 
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
		if (ui_data.isMap){
			var $box = $('#cntrl .voice_generator');
			var $boxML = $('#map .dml');
			var $boxMC = $('#map .dmc');
			var kRow = $boxML.length;
			var kColumn = $boxML[0].textContent.length;

			//	Гласы направления делаем невидимыми
			for (var i = 0; i < 4; i++){
				$box[i].style.visibility = 'hidden';
			}

			var isJumping = $('#map')[0].textContent.match('Прыгучести'); 

			var MaxMap = 0;	//	Счетчик указателей  
			//	Карта возможного клада
			var MapArray = [];
			for (var i = 0; i < kRow; i++){
				MapArray[i] = [];
				for (var j = 0; j < kColumn; j++)
					MapArray[i][j] = ('?!@'.indexOf($boxML[i].textContent[j]) != - 1) ? 0 : -1;
			}
			for (var si = 0; si < kRow; si++) {
				//	Ищем где мы находимся
				var j = $boxML[si].textContent.indexOf('@');
				if (j != -1){ 
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
					var Pointer = $boxML[si].textContent[sj];
					if ('←→↓↑↙↘↖↗'.indexOf(Pointer) != - 1) {
						MaxMap++;
						$boxMC[si * kColumn + sj].style.color = 'green';
						for (var ik = 0; ik < kRow; ik++) 
							for (var jk = 0; jk < kColumn; jk++) {
								var istep = parseInt((Math.abs(jk - sj) - 1) / 5);
								var jstep = parseInt((Math.abs(ik - si) - 1) / 5);
								if ('←→'.indexOf(Pointer) != - 1 && ik >= si - istep && ik <= si + istep ||
										Pointer == '↓' && ik >= si + istep ||
										Pointer == '↑' && ik <= si - istep ||
										'↙↘'.indexOf(Pointer) != - 1 && ik > si + istep ||
										'↖↗'.indexOf(Pointer) != - 1 && ik < si - istep)
									if (Pointer == '→' && jk >= sj + jstep ||
											Pointer == '←' && jk <= sj - jstep ||
											'↓↑'.indexOf(Pointer) != - 1 && jk >= sj - jstep && jk <= sj + jstep ||
											'↘↗'.indexOf(Pointer) != - 1 && jk > sj + jstep ||
											'↙↖'.indexOf(Pointer) != - 1 && jk < sj - jstep)
										if (MapArray[ik][jk] >= 0)
											MapArray[ik][jk]++;
							}
					}
					if ('✺☀♨☁❄✵'.indexOf(Pointer) != - 1) {
						MaxMap++;
						$boxMC[si * kColumn + sj].style.color = 'green';
						var TermoMinStep = 0;	//	Минимальное количество шагов до клада
						var TermoMaxStep = 0;	//	Максимальное количество шагов до клада
						switch(Pointer){
							case '✺': TermoMinStep = 1; TermoMaxStep = 2; break;	//	✺ - очень горячо(1-2)
							case '☀': TermoMinStep = 3; TermoMaxStep = 5; break;	//	☀ - горячо(3-5)
							case '♨': TermoMinStep = 6; TermoMaxStep = 9; break;	//	♨ - тепло(6-9)
							case '☁': TermoMinStep = 10; TermoMaxStep = 13; break;	//	☁ - свежо(10-13)
							case '❄': TermoMinStep = 14; TermoMaxStep = 18; break;	//	❄ - холодно(14-18)
							case '✵': TermoMinStep = 19; TermoMaxStep = 100; break;	//	✵ - очень холодно(19)
						}
						//	Функция итерации
						var MapIteration = function (MapTermo, iPointer, jPointer, step) {
							step++;
							for (var iStep = -1; iStep <= 1; iStep++)
								for (var jStep = -1; jStep <= 1; jStep++)
									if (iStep != jStep & (iStep == 0 || jStep == 0)){
										 var iNext = iPointer + iStep;
										 var jNext = jPointer + jStep;
										 if (iNext >= 0 & iNext < kRow & jNext >= 0 & jNext < kColumn)
												if (MapTermo[iNext][jNext] != -1)
													if (MapTermo[iNext][jNext] > step || MapTermo[iNext][jNext] == 0) {
														MapTermo[iNext][jNext] = step;
														MapIteration(MapTermo, iNext, jNext, step);
													}
									}
						}; 
						//	Временная карта возможных ходов
						var MapTermo = [];
						for (var ik = 0; ik < kRow; ik++) {
							MapTermo[ik] = [];
							for (var jk = 0; jk < kColumn; jk++)
								MapTermo[ik][jk] = ($boxML[ik].textContent[jk] == '#' || ((Math.abs(jk - sj) + Math.abs(ik - si)) > TermoMaxStep)) ? -1 : 0;
						} 
						//	Запускаем итерацию
						MapIteration(MapTermo, si, sj, 0);
						//	Метим возможный клад
						for (var ik = ((si - TermoMaxStep) > 0 ? si - TermoMaxStep : 0); ik <= ((si + TermoMaxStep) < kRow ? si + TermoMaxStep : kRow - 1); ik++)
							for (var jk = ((sj - TermoMaxStep) > 0 ? sj - TermoMaxStep : 0); jk <= ((sj + TermoMaxStep) < kColumn ? sj + TermoMaxStep : kColumn - 1); jk++)
								if (MapTermo[ik][jk] >= TermoMinStep & MapTermo[ik][jk] <= TermoMaxStep)
									if (MapArray[ik][jk] >= 0)
										MapArray[ik][jk]++;
					}
					// На будущее
					// ↻ ↺ ↬ ↫   
				}
			}
			//	Отрисовываем возможный клад 
			if (MaxMap != 0)
				for (var i = 0; i < kRow; i++)
					for (var j = 0; j < kColumn; j++)
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
			//ui_utils.addSayPhraseAfterLabel($box, 'Смертей', 'умри', 'die');	
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
		ui_informer.update('dead', ui_stats.setFromLabelCounter('HP', $box, 'Здоровье') == 0);

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
				$('#pet .block_title').after($('<div id="pet_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'))
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
			$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'))
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
		if (ui_storage.get('Option:relocateDuelButtons') != null && ui_storage.get('Option:relocateDuelButtons').match('arena')) {
			if (!$('#pantheons.arena_link_relocated').length) {
				$('#pantheons').addClass('arena_link_relocated');
				$('.arena_link_wrap').insertBefore($('#pantheons_content')).addClass('p_group_sep').css('padding-top', 0);
			}
		} else if ($('#pantheons.arena_link_relocated').length) {
			$('#pantheons').removeClass('arena_link_relocated').removeClass('both');
			$('.arena_link_wrap').insertBefore($('#control .arena_msg')).removeClass('p_group_sep').css('padding-top', '0.5em');
		}
		if (ui_storage.get('Option:relocateDuelButtons') != null && ui_storage.get('Option:relocateDuelButtons').match('chf')) {
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
		if (ui_storage.get('Option:relocateDuelButtons') != null && ui_storage.get('Option:relocateDuelButtons').match('cvs')) {
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

		if (ui_storage.get('Option:useBackground') == 'cloud') {
			if (!$('#fader.cloud').length) {
				$('body').css('background-image', 'url(' + GM_getResource("images/background.jpg") + ')');
				var color = new Array(2);
				if (ui_storage.get('uiMenuVisible')) {color[0] = '241,247,253'; color[1] = '233,243,253';}
				else {color[0] = '253,252,255'; color[1] = '243,248,253';}
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').show().css('background', background).addClass('cloud').removeClass('custom');
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
				$('#fader').hide().removeClass('cloud').addClass('custom');
			}
		} else if ($('#fader.cloud, #fader.custom').length) {
			$('#fader').show();
			$('body').css('background-image', '');
			var color;
			if (ui_storage.get('ui_s') == 'th_nightly') color = '0,0,0';
			else color = '255,255,255';
			var background = 'linear-gradient(to right, rgba(' + color + ',2) 30%, rgba(' + color + ',0) 100%)';
			$('#fader').css('background', background).removeClass('cloud').removeClass('custom');
		}
		
		if (localStorage.getItem('ui_s') != ui_storage.get('ui_s')) {
			ui_improver.Shovel = false;
			ui_storage.set('ui_s', localStorage.getItem('ui_s'));
			if (!ui_storage.get('Option:useBackground')) {
				var color;
				if (ui_storage.get('ui_s') == 'th_nightly') color = '0,0,0';
				else color = '255,255,255';
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').css('background', background);
			}
		}
	},
	
	improveChat: function() {
		for (var i = 1; i < $('.fr_msg_l:not(.improved)').length; i++) {
			$cur_msg = $('.fr_msg_l:not(.improved)').eq(i);
			$('#fader').append($('.fr_msg_meta', $cur_msg)).append($('.fr_msg_delete', $cur_msg));
			var text = $cur_msg.text();
			$cur_msg.empty();
			$cur_msg.append(text.replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="Откроется в новой вкладке">$1</a>'));
			$cur_msg.append($('#fader .fr_msg_meta')).append($('#fader .fr_msg_delete'));
		}
		$('.fr_msg_l:not(.improved)').addClass('improved');
		
		$('.frInputArea textarea:not(.improved)').keypress(function(event) {
			if (event.which == 32 && event.ctrlKey) {
				event.preventDefault();
				var pos = this.selectionStart;
				$(this).val($(this).val().substr(0, pos) + '\n' + $(this).val().substr(pos));
				this.setSelectionRange(pos + 1, pos + 1);
			}
		}).addClass('improved');

	},

	checkButtonsVisibility: function() {
		$('.arena_link_wrap,.chf_link_wrap,.cvs_link_wrap', $('#pantheons')).hide();
		if (ui_storage.get('Stats:Prana') >= 50){
			$('#pantheons .chf_link_wrap').show();
			$('#pantheons .cvs_link_wrap').show();
			$('#pantheons .arena_link_wrap').show();
		}
		$('#merge_button,.inspect_button,.voice_generator').hide();
		if (ui_storage.get('Stats:Prana') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
			$('.voice_generator,.inspect_button').show();
			if (ui_improver.trophyList.length) $('#merge_button').show();
			//if ($('.f_news').text() != 'Возвращается к заданию...')
			if (!ui_data.isArena){
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
			if (ui_storage.get('Option:useBackground') == 'cloud')
				$('body').css('background-position', ($('#fader').offset().left ? ($('#fader').offset().left - 163.75) : 0) + 'px 0');
			//body widening
			$('body').width($(window).width() < $('#main_wrapper').width() ? $('#main_wrapper').width() : '');
		}
		
		//proper message tabs appearance
		if ($('.frDockCell').length && $('.frDockCell:last').position().top != 0) {
			var row_capacity;
			$('.frDockCell').css('clear', '');
			for (var i = 0; i < $('.frDockCell').length; i++) {
				if ($('.frDockCell').eq(i).position().top != 0) {
					row_capacity = i;
					break;
				}
			}
			for (var i = $('.frDockCell').length%row_capacity; i < $('.frDockCell').length; i+=row_capacity)
				$('.frDockCell').eq(i).css('clear', 'right');
		}
		
		//padding for page settings link
		var padding_bottom = $('.frDockCell:last').length ? Math.floor($('.frDockCell:last').position().top/26.3 + 0.5)*$('.frDockCell').height() : 0;
		padding_bottom = Math.floor(padding_bottom*10)/10 + 40;
		padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
		$('.reset_layout').css('padding-bottom', padding_bottom);
		
		//settings dialod
		if (!ui_utils.isAlreadyImproved($('#facebox'))) {
			$('#facebox').css('left', ($(window).width() - $('#facebox').width())/2 + 'px');
			$('#facebox').css('top', ($(window).height() - $('#facebox').height())/2 + 'px');
		}
	},
		
	add_css: function () {
		if ($('#ui_css').length == 0) {
			GM_addGlobalStyleURL('godville-ui.css', 'ui_css');
		}
	}
};

// Main code
var starter = setInterval(function() {
	if ($('#m_info').length || $('#stats').length) {
		var start = new Date();
		clearInterval(starter);
		ui_data.init();
		ui_storage.clearStorage();
		ui_improver.add_css();
		ui_words.init();
		ui_logger.create();
		ui_timeout_bar.create();
		ui_menu_bar.create();
		ui_informer.init();
		ui_improver.improve();
		if (ui_utils.isDeveloper()) {
			setInterval(function() {
				$('#fader').load('forums/show/2 td', function() {
					var posts = parseInt($('#fader .entry-title:contains("Аддоны для Firefox и Chrome - дополнения в интерфейс игры")').parent().next().text());
					if (posts > ui_storage.get('posts')) {
						ui_storage.set('posts', posts);
						ui_informer.update('new posts', false);
						ui_informer.update('new posts', true);
					}
					$('#fader').empty();
				});
			}, 300000);
		}
		var finish = new Date();
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
	}
}, 200);

// Event and listeners
$(document).bind("DOMNodeInserted", function() {
	if(!ui_improver.improveInProcess){
		ui_improver.improveInProcess = true;
		setTimeout(function() {
			ui_improver.improve();
			if (ui_data.isArena) {
				ui_logger.update();
			}
		}, 0);
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