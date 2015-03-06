// ui_improver
var ui_improver = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "improver"}) : worker.GUIp.improver = {};

ui_improver.improveInProcess = true;
ui_improver.isFirstTime = true;
ui_improver.voiceSubmitted = false;
ui_improver.wantedMonsters = null;
ui_improver.friendsRegExp = null;
ui_improver.windowResizeInt = 0;
ui_improver.mapColorizationTmt = 0;
ui_improver.alliesCount = 0;
ui_improver.currentAlly = 0;
ui_improver.currentAllyObserver = 0;
// trophy craft combinations
ui_improver.b_b = [];
ui_improver.b_r = [];
ui_improver.r_r = [];
// dungeon
ui_improver.chronicles = {};
ui_improver.directionlessMoveIndex = 0;
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
	'jumpingDungeon',
	'pointerSign'
];
ui_improver.corrections = { n: 'north', e: 'east', s: 'south', w: 'west' };
ui_improver.pointerRegExp = new worker.RegExp('[^а-яa-z](северо-восток|северо-запад|юго-восток|юго-запад|' +
														'север|восток|юг|запад|' +
														'очень холодно|холодно|свежо|тепло|очень горячо|горячо|' +
														'north-east|north-west|south-east|south-west|' +
														'north|east|south|west|' +
														'freezing|very cold|cold|mild|warm|hot|burning|very hot|hot)', 'gi');
ui_improver.dungeonXHRCount = 0;
ui_improver.needLog = true;
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
	ui_informer.update('fight', ui_data.isFight && !ui_data.isDungeon);
	ui_informer.update('arena available', worker.so.state.arena_available());
	ui_informer.update('dungeon available', worker.so.state.dungeon_available());

	this.optionsChanged = this.isFirstTime ? false : ui_storage.get('optionsChanged');
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
	if (ui_data.isFight || ui_data.isDungeon) {
		ui_improver.improveAllies();
	}
	ui_improver.calculateButtonsVisibility();
	this.isFirstTime = false;
	this.improveInProcess = false;
	ui_storage.set('optionsChanged', false);
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
				if (!ui_utils.isAlreadyImproved(items[i])) {
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
				if (!ui_utils.isAlreadyImproved(items[i])) {
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

	if (!ui_utils.isAlreadyImproved(document.getElementById('inventory'))) {
		var inv_content = document.querySelector('#inventory .block_content');
		inv_content.insertAdjacentHTML('beforeend', '<span class="craft_button span">' + worker.GUIp_i18n.craft_verb + ':</span>');
		inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.b_b, 'b_b', worker.GUIp_i18n.b_b_hint), null);
		inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.b_r, 'b_r', worker.GUIp_i18n.b_r_hint), null);
		inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.r_r, 'r_r', worker.GUIp_i18n.r_r_hint), null);
	}
};
ui_improver.improveVoiceDialog = function() {
	if (this.isFirstTime || this.optionsChanged) {
		this.freezeVoiceButton = ui_storage.get('Option:freezeVoiceButton') || '';
	}
	// Add voicegens and show timeout bar after saying
	if (this.isFirstTime) {
		ui_utils.setVoiceSubmitState(this.freezeVoiceButton.match('when_empty'), true);
		worker.$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
			if (!ui_utils.setVoiceSubmitState(this.value && !(ui_improver.freezeVoiceButton.match('after_voice') && parseInt(ui_timeout.bar.style.width)), false)) {
				ui_utils.setVoiceSubmitState(ui_improver.freezeVoiceButton.match('when_empty'), true);
			}
			ui_utils.hideElem(document.getElementById('clear_voice_input'), !this.value);
		}).on('click', '.gv_text.div_link', function() {
			ui_utils.triggerChangeOnVoiceInput();
		});
		document.getElementById('voice_edit_wrap').insertAdjacentHTML('afterbegin', '<div id="clear_voice_input" class="div_link_nu gvl_popover hidden" title="' + worker.GUIp_i18n.clear_voice_input + '">×</div>');
		document.getElementById('clear_voice_input').onclick = function() {
			ui_utils.setVoice('');
		};
		document.getElementById('voice_submit').onclick = function() {
			ui_utils.hideElem(document.getElementById('clear_voice_input'), true);
			ui_improver.voiceSubmitted = true;
		};

			if (!ui_utils.isAlreadyImproved(document.getElementById('cntrl'))) {
			var gp_label = document.getElementsByClassName('gp_label')[0];
			gp_label.classList.add('l_capt');
			document.getElementsByClassName('gp_val')[0].classList.add('l_val');
			if (ui_data.isDungeon && document.getElementById('map')) {
				var isContradictions = document.getElementById('map').textContent.match(/Противоречия|Disobedience/);
				ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.east, (isContradictions ? 'go_west' : 'go_east'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_east);
				ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.west, (isContradictions ? 'go_east' : 'go_west'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_west);
				ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.south, (isContradictions ? 'go_north' : 'go_south'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_south);
				ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.north, (isContradictions ? 'go_south' : 'go_north'), worker.GUIp_i18n.ask3 + ui_data.char_sex[0] + worker.GUIp_i18n.go_north);
				if (document.getElementById('map').textContent.match(/Бессилия|Anti-influence/)) {
					ui_utils.hideElem(document.getElementById('actions'), true);
				}
			} else {
				if (ui_data.isFight) {
					ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.defend, 'defend', worker.GUIp_i18n.ask4 + ui_data.char_sex[0] + worker.GUIp_i18n.to_defend);
					ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.pray, 'pray', worker.GUIp_i18n.ask5 + ui_data.char_sex[0] + worker.GUIp_i18n.to_pray);
					ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.heal, 'heal', worker.GUIp_i18n.ask6 + ui_data.char_sex[1] + worker.GUIp_i18n.to_heal);
					ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.hit, 'hit', worker.GUIp_i18n.ask7 + ui_data.char_sex[1] + worker.GUIp_i18n.to_hit);
				} else {
					ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.sacrifice, 'sacrifice', worker.GUIp_i18n.ask8 + ui_data.char_sex[1] + worker.GUIp_i18n.to_sacrifice);
					ui_utils.addVoicegen(gp_label, worker.GUIp_i18n.pray, 'pray', worker.GUIp_i18n.ask5 + ui_data.char_sex[0] + worker.GUIp_i18n.to_pray);
				}
			}
		}
	}
	//hide_charge_button
	var charge_button = document.querySelector('#cntrl .hch_link');
	charge_button.style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
	// Save stats
	ui_stats.set('Godpower', worker.so.state.stats.godpower.value);
	ui_informer.update('full godpower', worker.so.state.stats.godpower.value === worker.so.state.stats.max_gp.value);
};
ui_improver.improveNews = function() {
	if (!ui_utils.isAlreadyImproved(document.getElementById('news'))) {
		ui_utils.addVoicegen(document.querySelector('#news .l_capt'), worker.GUIp_i18n.hit, 'hit', worker.GUIp_i18n.ask7 + ui_data.char_sex[1] + worker.GUIp_i18n.to_hit);
	}
	var isWantedMonster = false,
		isSpecialMonster = false,
		isTamableMonster = false;
	// Если герой дерется с монстром
	var currentMonster = worker.so.state.stats.monster_name && worker.so.state.stats.monster_name.value;
	if (currentMonster) {
		isWantedMonster = this.wantedMonsters && currentMonster.match(this.wantedMonsters);
		isSpecialMonster = currentMonster.match(/Врачующий|Дарующий|Зажиточный|Запасливый|Кирпичный|Латающий|Лучезарный|Сияющий|Сюжетный|Линяющий|Bricked|Enlightened|Glowing|Healing|Holiday|Loaded|Questing|Shedding|Smith|Wealthy/);

		if (!worker.so.state.has_pet) {
			var hasArk = parseInt(worker.so.state.stats.wood.value) >= 100;
			var pet, hero_level = ui_stats.get('Level');
			for (var i = 0; i < ui_words.base.pets.length; i++) {
				pet = ui_words.base.pets[i];
				if (currentMonster.match(pet.name) && hero_level >= pet.min_level && hero_level <= (pet.min_level + (hasArk ? 28 : 14))) {
					isTamableMonster = true;
					break;
				}
			}
		}
	}

	ui_informer.update('wanted monster', isWantedMonster);
	ui_informer.update('special monster', isSpecialMonster);
	ui_informer.update('tamable monster', isTamableMonster);

	if (ui_data.hasTemple && this.optionsChanged) {
		ui_timers.layingTimerIsDisabled = ui_storage.get('Option:disableLayingTimer');
		ui_utils.hideElem(ui_timers.layingTimer, ui_timers.layingTimerIsDisabled);
		ui_timers.tick();
	}
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
	if (this.isFirstTime || this.optionsChanged) {
		var control = document.getElementById('m_control'),
			map = document.getElementById('map'),
			right_block = document.getElementById('a_right_block');
		if (ui_storage.get('Option:relocateMap')) {
			if (!document.querySelector('#a_central_block #map')) {
				control.parentNode.insertBefore(map, control);
				right_block.insertBefore(control, null);
				if (worker.GUIp_locale === 'ru') {
					document.querySelector('#m_control .block_title').textContent = 'Пульт';
				}
			}
		} else {
			if (!document.querySelector('#a_right_block #map')) {
				map.parentNode.insertBefore(control, map);
				right_block.insertBefore(map, null);
				if (worker.GUIp_locale === 'ru') {
					document.querySelector('#m_control .block_title').textContent = 'Пульт вмешательства в личную жизнь';
				}
			}
		}
	}
	if (document.querySelectorAll('#map .dml').length) {
		var i, j, len,
			$box = worker.$('#cntrl .voice_generator'),
			$boxML = worker.$('#map .dml'),
			$boxMC = worker.$('#map .dmc'),
			kRow = $boxML.length,
			kColumn = $boxML[0].textContent.length,
			isJumping = document.getElementById('map').textContent.match(/Прыгучести|Jumping/),
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
				var chronicles = document.querySelectorAll('#m_fight_log .d_line'),
					isMoveLoss = [];
				len = this.chronicles.length;
				for (i = 0; i < 4; i++) {
					isMoveLoss[i] = len > i && this.chronicles[len - i - 1].marks.indexOf('trapMoveLoss') !== -1;
				}
				var directionsShouldBeShown = !isMoveLoss[0] || (isMoveLoss[1] && (!isMoveLoss[2] || isMoveLoss[3]));
				if (directionsShouldBeShown) {
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
				var ik, jk, ij, ttl,
					pointer = $boxML[si].textContent[sj];
				if ('←→↓↑↙↘↖↗↻↺↬↫'.indexOf(pointer) !== -1) {
					MaxMap++;
					$boxMC[si * kColumn + sj].style.color = 'green';
					ttl = $boxMC[si * kColumn + sj].title.replace(/северо-восток|north-east/,'↗')
														 .replace(/северо-запад|north-west/,'↖')
														 .replace(/юго-восток|south-east/,'↘')
														 .replace(/юго-запад|south-west/,'↙')
														 .replace(/север|north/,'↑')
														 .replace(/восток|east/,'→')
														 .replace(/юг|south/,'↓')
														 .replace(/запад|west/, '←');
					for (ij = 0, len = ttl.length; ij < len; ij++){
						if ('→←↓↑↘↙↖↗'.indexOf(ttl[ij]) != - 1){
							for (ik = 0; ik < kRow; ik++) {
								for (jk = 0; jk < kColumn; jk++) {
									var istep = parseInt((Math.abs(jk - sj) - 1) / 5),
										jstep = parseInt((Math.abs(ik - si) - 1) / 5);
									if ('←→'.indexOf(ttl[ij]) !== -1 && ik >= si - istep && ik <= si + istep ||
										ttl[ij] === '↓' && ik >= si + istep ||
										ttl[ij] === '↑' && ik <= si - istep ||
										'↙↘'.indexOf(ttl[ij]) !== -1 && ik > si + istep ||
										'↖↗'.indexOf(ttl[ij]) !== -1 && ik < si - istep) {
										if (ttl[ij] === '→' && jk >= sj + jstep ||
											ttl[ij] === '←' && jk <= sj - jstep ||
											'↓↑'.indexOf(ttl[ij]) !== -1 && jk >= sj - jstep && jk <= sj + jstep ||
											'↘↗'.indexOf(ttl[ij]) !== -1 && jk > sj + jstep ||
											'↙↖'.indexOf(ttl[ij]) !== -1 && jk < sj - jstep) {
											if (MapArray[ik][jk] >= 0) {
												MapArray[ik][jk]++;
											}
										}
									}
								}
							}
						}
					}
				}
				if ('✺☀♨☁❄✵'.indexOf(pointer) !== -1) {
					MaxMap++;
					$boxMC[si * kColumn + sj].style.color = 'green';
					var ThermoMinStep = 0;	//	Минимальное количество шагов до клада
					var ThermoMaxStep = 0;	//	Максимальное количество шагов до клада
					switch(pointer) {
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
		ui_stats.set('Map_HP', worker.so.state.stats.health.value);
		ui_stats.set('Map_Exp', worker.so.state.stats.exp_progress.value);
		ui_stats.set('Map_Gold', worker.so.state.stats.gold.value);
		ui_stats.set('Map_Inv', worker.so.state.stats.inventory_num.value);
		ui_stats.set('Map_Charges', worker.so.state.stats.accumulator.value);
		ui_stats.set('Map_Alls_HP', ui_improver.GroupHP(true));
		if (ui_storage.get('Logger:Location') === 'Field') {
			ui_storage.set('Logger:Location', 'Dungeon');
			ui_storage.set('Logger:Map_HP', ui_stats.get('Map_HP'));
			ui_storage.set('Logger:Map_Exp', ui_stats.get('Map_Exp'));
			ui_storage.set('Logger:Map_Gold', ui_stats.get('Map_Gold'));
			ui_storage.set('Logger:Map_Inv', ui_stats.get('Map_Inv'));
			ui_storage.set('Logger:Map_Charges',ui_stats.get('Map_Charges'));
			ui_storage.set('Logger:Map_Alls_HP', ui_stats.get('Map_Alls_HP'));
		}
		//ui_informer.update('low health', +ui_stats.get('Map_HP') < 130);
		return;
	}
	if (ui_data.isFight) {
		ui_stats.set('Hero_HP', worker.so.state.stats.health.value);
		ui_stats.set('Hero_Gold', worker.so.state.stats.gold.value);
		ui_stats.set('Hero_Inv', worker.so.state.stats.inventory_num.value);
		ui_stats.set('Hero_Charges', worker.so.state.stats.accumulator.value);
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
	if (!ui_utils.isAlreadyImproved(document.getElementById('stats'))) {
		// Add voicegens
		ui_utils.addVoicegen(document.querySelector('#hk_level .l_capt'), worker.GUIp_i18n.study, 'exp', worker.GUIp_i18n.ask9 + ui_data.char_sex[1] + worker.GUIp_i18n.to_study);
		ui_utils.addVoicegen(document.querySelector('#hk_health .l_capt'), worker.GUIp_i18n.heal, 'heal', worker.GUIp_i18n.ask6 + ui_data.char_sex[1] + worker.GUIp_i18n.to_heal);
		ui_utils.addVoicegen(document.querySelector('#hk_gold_we .l_capt'), worker.GUIp_i18n.dig, 'dig', worker.GUIp_i18n.ask10 + ui_data.char_sex[1] + worker.GUIp_i18n.to_dig);
		ui_utils.addVoicegen(document.querySelector('#hk_quests_completed .l_capt'), worker.GUIp_i18n.cancel_task, 'cancel_task', worker.GUIp_i18n.ask11 + ui_data.char_sex[0] + worker.GUIp_i18n.to_cancel_task);
		ui_utils.addVoicegen(document.querySelector('#hk_quests_completed .l_capt'), worker.GUIp_i18n.do_task, 'do_task', worker.GUIp_i18n.ask12 + ui_data.char_sex[1] + worker.GUIp_i18n.to_do_task);
		ui_utils.addVoicegen(document.querySelector('#hk_death_count .l_capt'), worker.GUIp_i18n.die, 'die', worker.GUIp_i18n.ask13 + ui_data.char_sex[0] + worker.GUIp_i18n.to_die);
	}
	if (!document.querySelector('#hk_distance .voice_generator')) {
		ui_utils.addVoicegen(document.querySelector('#hk_distance .l_capt'), document.querySelector('#main_wrapper.page_wrapper_5c') ? '回' : worker.GUIp_i18n.return, 'town', worker.GUIp_i18n.ask14 + ui_data.char_sex[0] + worker.GUIp_i18n.to_return);
	}
	ui_stats.set('HP', worker.so.state.stats.health.value);
	ui_stats.set('Exp', worker.so.state.stats.exp_progress.value);
	ui_stats.set('Gold', worker.so.state.stats.gold.value);
	ui_stats.set('Inv', worker.so.state.stats.inventory_num.value);
	ui_stats.set('Task', worker.so.state.stats.quest_progress.value);
	ui_stats.set('Level', worker.so.state.stats.level.value);
	ui_stats.set('Monster', worker.so.state.stats.monsters_killed.value);
	ui_stats.set('Death', worker.so.state.stats.death_count.value);
	ui_stats.set('Bricks', worker.so.state.stats.bricks_cnt.value);
	ui_stats.set('Logs', parseFloat(worker.so.state.stats.wood.value)*10);
	ui_stats.set('Savings', worker.so.state.stats.retirement && parseInt(worker.so.state.stats.retirement.value));
	ui_stats.set('Charges', worker.so.state.stats.accumulator.value);

	ui_informer.update('much gold', worker.so.state.stats.gold.value >= (ui_data.hasTemple ? 10000 : 3000));
	ui_informer.update('dead', worker.so.state.stats.health.value === 0);
	var questName = worker.so.state.stats.quest.value;
	ui_informer.update('guild quest', questName.match(/членом гильдии|member of the guild/) && !questName.match(/\((отменено|cancelled)\)/));
	ui_informer.update('mini quest', questName.match(/\((мини|mini)\)/) && !questName.match(/\((отменено|cancelled)\)/));

	//Shovel pictogramm start
	var digVoice = document.querySelector('#hk_gold_we .voice_generator');
	if (this.isFirstTime) {
		digVoice.style.backgroundImage = 'url(' + worker.GUIp_getResource('images/shovel.png') + ')';
	}
	if (worker.so.state.stats.gold_we.value.length > 16 - 2*document.getElementsByClassName('page_wrapper_5c').length) {
		digVoice.classList.add('shovel');
		if (worker.so.state.stats.gold_we.value.length > 20 - 3*document.getElementsByClassName('page_wrapper_5c').length) {
			digVoice.classList.add('compact');
		} else {
			digVoice.classList.remove('compact');
		}
	} else {
		digVoice.classList.remove('shovel');
	}
	//Shovel pictogramm end
};
ui_improver.improvePet = function() {
	if (ui_data.isFight) { return; }
	var pet_badge;
	if (worker.so.state.pet.pet_is_dead && worker.so.state.pet.pet_is_dead.value) {
		if (!ui_utils.isAlreadyImproved(document.getElementById('pet'))) {
			document.querySelector('#pet .block_title').insertAdjacentHTML('beforeend', '<div id="pet_badge" class="fr_new_badge equip_badge_pos hidden">0</div>');
		}
		pet_badge = document.getElementById('pet_badge');
		pet_badge.textContent = ui_utils.findLabel(worker.$('#pet'), worker.GUIp_i18n.pet_status_label).siblings('.l_val').text().replace(/[^0-9:]/g, '');
		ui_utils.hideElem(pet_badge, document.querySelector('#pet .block_content').style.display !== 'none');
	} else {
		pet_badge = document.getElementById('pet_badge');
		if (pet_badge) {
			ui_utils.hideElem(pet_badge, true);
		}
	}
	// bruise informer
	ui_informer.update('pet knocked out', worker.so.state.pet.pet_is_dead && worker.so.state.pet.pet_is_dead.value);

	ui_stats.set('Pet_Level', worker.so.state.pet.pet_level && worker.so.state.pet.pet_level.value);
};
ui_improver.improveEquip = function() {
	// Save stats
	var seq = 0;
	for (var i = 7; i >= 1;) {
		ui_stats.set('Equip' + i--, parseInt(worker.$('#eq_' + i + ' .eq_level').text()));
		seq += parseInt(worker.$('#eq_' + i + ' .eq_level').text()) || 0;
	}
	if (!ui_utils.isAlreadyImproved(document.getElementById('equipment'))) {
		worker.$('#equipment .block_title').after(worker.$('<div id="equip_badge" class="fr_new_badge equip_badge_pos">0</div>'));
	}
	worker.$('#equip_badge').text((seq / 7).toFixed(1));
};
ui_improver.GroupHP = function(allies) {
	var seq = 0, $box = allies ? worker.$('#alls .opp_h') : worker.$('#opps .opp_h');
	for (var i = 0, len = $box.length; i < len; i++) {
		seq += parseInt($box[i].textContent) || 0;
	}
	return seq;
};
ui_improver.improvePantheons = function() {
	var pants = document.querySelector('#pantheons .block_content');
	if (this.isFirstTime) {
		pants.insertAdjacentHTML('afterbegin', '<div class="guip p_group_sep" />');
	}
	if (this.isFirstTime || this.optionsChanged) {
		var relocateDuelButtons = ui_storage.get('Option:relocateDuelButtons') || '';
		var arenaRelocated = relocateDuelButtons.match('arena'),
			arenaInPantheons = document.querySelector('#pantheons .arena_link_wrap');
		if (arenaRelocated && !arenaInPantheons) {
			pants.insertBefore(document.getElementsByClassName('arena_link_wrap')[0], pants.firstChild);
		} else if (!arenaRelocated && arenaInPantheons) {
			document.getElementById('cntrl2').insertBefore(arenaInPantheons, document.querySelector('#control .arena_msg'));
		}
		var chfRelocated = relocateDuelButtons.match('chf'),
			chfInPantheons = document.querySelector('#pantheons .chf_link_wrap');
		if (chfRelocated && !chfInPantheons) {
			pants.insertBefore(document.getElementsByClassName('chf_link_wrap')[0], document.getElementsByClassName('guip p_group_sep')[0]);
		} else if (!chfRelocated && chfInPantheons) {
			document.getElementById('cntrl2').insertBefore(chfInPantheons, document.querySelector('#control .arena_msg').nextSibling);
		}
	}
};
ui_improver.improveDiary = function() {
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
	if (!ui_storage.get('Dungeon:pointerSignPhrases')) {
		this.dungeonXHRCount++;
		ui_utils.getXHR('/gods/' + (worker.GUIp_locale === 'ru' ? 'Спандарамет' : 'God Of Dungeons'), ui_improver.parseDungeonPhrases.bind(ui_improver));
	} else {
		for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
			this[this.dungeonPhrases[i] + 'RegExp'] = new worker.RegExp(ui_storage.get('Dungeon:' + this.dungeonPhrases[i] + 'Phrases'));
		}
		ui_improver.improveChronicles();
	}
};
ui_improver.parseSingleChronicle = function(text, step) {
	if (!this.chronicles[step]) {
		this.chronicles[step] = { direction: null, marks: [], pointers: [], jumping: false, directionless: false, text: text };
	}
	var i, len, chronicle = this.chronicles[step];
	text = text.replace(/offered to trust h.. gut feeling\./, '');
	for (i = 0, len = this.dungeonPhrases.length - 1; i < len; i++) {
		if (text.match(this[this.dungeonPhrases[i] + 'RegExp']) && chronicle.marks.indexOf(this.dungeonPhrases[i]) === -1) {
			chronicle.marks.push(this.dungeonPhrases[i]);
		}
	}
	var firstSentence = text.match(/^.*?[\.!\?](?:\s|$)/);
	if (firstSentence) {
		var direction = firstSentence[0].match(/север|восток|юг|запад|north|east|south|west/);
		if (direction) {
			chronicle.direction = direction[0];
		}
		chronicle.directionless = chronicle.directionless || !!firstSentence[0].match(/went somewhere|too busy bickering to hear in which direction to go next|The obedient heroes move in the named direction/);
		chronicle.jumping = chronicle.jumping || !!firstSentence[0].match(this.jumpingDungeonRegExp);
	}
	if (text.match(this.pointerSignRegExp)) {
		var middle = text.match(/^.*?\.(.*?)[.!?]/)[1];
		var pointer, pointers = middle.match(this.pointerRegExp);
		for (i = 0, len = pointers.length; i < len; i++) {
			switch (pointers[i].replace(/^./, '')) {
			case 'северо-восток':
			case 'north-east': pointer = 'north_east'; break;
			case 'северо-запад':
			case 'north-west': pointer = 'north_west'; break;
			case 'юго-восток':
			case 'south-east': pointer = 'south_east'; break;
			case 'юго-запад':
			case 'south-west': pointer = 'south_west'; break;
			case 'север':
			case 'north': pointer = 'north'; break;
			case 'восток':
			case 'east': pointer = 'east'; break;
			case 'юг':
			case 'south': pointer = 'south'; break;
			case 'запад':
			case 'west': pointer = 'west'; break;
			case 'очень холодно':
			case 'very cold':
			case 'freezing': pointer = 'freezing'; break;
			case 'холодно':
			case 'cold': pointer = 'cold'; break;
			case 'свежо':
			case 'mild': pointer = 'mild'; break;
			case 'тепло':
			case 'warm': pointer = 'warm'; break;
			case 'горячо':
			case 'hot': pointer = 'hot'; break;
			case 'очень горячо':
			case 'very hot':
			case 'burning': pointer = 'burning'; break;
			}
			if (chronicle.pointers.indexOf(pointer) === -1) {
				chronicle.pointers.push(pointer);
			}
		}
	}
};
ui_improver.parseChronicles = function(xhr) {
	this.needLog = false;
	this.dungeonXHRCount++;

	if (worker.Object.keys(this.chronicles)[0] === '1') {
		return;
	}

	var text, step = 1,
		step_max = +worker.Object.keys(this.chronicles)[0],
		matches = xhr.responseText.match(/<div class="new_line" style='[^']*'>[\s\S]*?<div class="text_content .*?">[\s\S]+?<\/div>/g);
	worker.chronicles = matches;
	worker.response = xhr.responseText;
	for (var i = 0; step <= step_max; i++) {
		if (!matches[i].match(/<div class="text_content infl">/)) {
			text = matches[i].match(/<div class="text_content ">([\s\S]+?)<\/div>/)[1].trim().replace(/&#39;/g, "'");
			ui_improver.parseSingleChronicle(text, step);
		}
		if (matches[i].match(/<div class="new_line" style='[^']+'>/)) {
			step++;
		}
	}

			worker.console.log('after log chronicles');
			worker.console.log(this.chronicles);
			worker.console.log(JSON.stringify(this.chronicles));

	ui_improver.colorDungeonMap();
};
/*ui_improver.deleteInvalidChronicles = function() {
	var isHiddenChronicles = true,
		chronicles = document.querySelectorAll('#m_fight_log .line.d_line');
	for (var i = chronicles.length - 1; i >= 0; i--) {
		if (isHiddenChronicles) {
			if (chronicles[i].style.display !== 'none') {
				isHiddenChronicles = false;
			}
		} else {
			if (chronicles[i].style.display === 'none') {
				chronicles[i].parentNode.removeChild(chronicles[i]);
			}
		}
	}
};*/
ui_improver.calculateXY = function(cell) {
	var coords = {};
	coords.x = ui_utils.getNodeIndex(cell);
	coords.y = ui_utils.getNodeIndex(cell.parentNode);
	return coords;
};
ui_improver.calculateExitXY = function() {
	var exit_coords = { x: null, y: null },
		cells = document.querySelectorAll('.dml .dmc');
	for (var i = 0, len = cells.length; i < len; i++) {
		if (cells[i].textContent.trim().match(/В|E/)) {
			exit_coords = ui_improver.calculateXY(cells[i]);
			break;
		}
	}
	if (!exit_coords.x) {
		exit_coords = ui_improver.calculateXY(document.getElementsByClassName('map_pos')[0]);
	}
	return exit_coords;
};
ui_improver.improveChronicles = function() {
	if (!ui_storage.get('Dungeon:pointerSignPhrases')) {
		if (this.dungeonXHRCount < 5) {
			ui_improver.getDungeonPhrases();
		}
	} else {
		//ui_improver.deleteInvalidChronicles();

		var i, len, chronicles = document.querySelectorAll('#m_fight_log .d_msg:not(.parsed)'),
			ch_down = document.querySelector('.sort_ch').textContent === '▼',
			step = document.querySelector('#m_fight_log .block_title').textContent.match(/\d+/)[0];
		worker.console.log('new ', chronicles.length, ' chronicles from step #', step);
		for (len = chronicles.length, i = ch_down ? 0 : len - 1; ch_down ? i < len : i >= 0; ch_down ? i++ : i--) {
			if (!chronicles[i].className.match('m_infl')) {
				ui_improver.parseSingleChronicle(chronicles[i].textContent, step);
				worker.console.log('chronicle #', step);
				worker.console.log(chronicles[i].textContent);
			}
			if (chronicles[i].parentNode.className.match('turn_separator')) {
				step--;
			}
			if (chronicles[i].textContent.match(this.warningRegExp)) {
				chronicles[i].parentNode.classList.add('warning');
			}
			chronicles[i].classList.add('parsed');
		}
		worker.console.log('last step #', step);

		if (!this.initial) {
			this.initial = true;
			worker.console.log('initial chronicles');
			worker.console.log(this.chronicles);
			worker.console.log(JSON.stringify(this.chronicles));
		}

		if (this.needLog) {
			if (worker.Object.keys(this.chronicles)[0] === '1') {
				this.needLog = false;
				ui_improver.colorDungeonMap();
			} else if (this.dungeonXHRCount < 5) {
				ui_utils.getXHR('/duels/log/' + worker.so.state.stats.perm_link.value, ui_improver.parseChronicles.bind(ui_improver));
			}
		}
	}

	// informer
	ui_informer.update('close to boss', this.chronicles[worker.Object.keys(this.chronicles).reverse()[0]].marks.indexOf('warning') !== -1);

	if (ui_storage.get('Log:current') !== worker.so.state.stats.perm_link.value) {
		ui_storage.set('Log:current', worker.so.state.stats.perm_link.value);
		ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':corrections', '');
	}
	ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':steps', (document.querySelector('#m_fight_log .block_title').textContent.match(/\d+/) || [0])[0]);
	ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':map', JSON.stringify(worker.so.state.d_map));
};
ui_improver.moveCoords = function(coords, chronicle) {
	if (chronicle.direction) {
		var step = chronicle.jumping ? 2 : 1;
		switch(chronicle.direction) {
		case 'север':
		case 'north': coords.y -= step; break;
		case 'восток':
		case 'east': coords.x += step; break;
		case 'юг':
		case 'south': coords.y += step; break;
		case 'запад':
		case 'west': coords.x -= step; break;
		}
	}
};
ui_improver.calculateDirectionlessMove = function(initCoords, initStep) {
	var i, len, j, len2, temp, coords = { x: initCoords.x, y: initCoords.y },
		heroesCoords = ui_improver.calculateXY(document.getElementsByClassName('map_pos')[0]),
		directionless = 0;
	for (i = initStep, len = this.chronicles.length; i < len; i++) {
		if (this.chronicles[i].directionless) {
			directionless++;
		}
		ui_improver.moveCoords(coords, this.chronicles[i]);
	}
	var diff = { x: heroesCoords.x - coords.x, y: heroesCoords.y - coords.y };
	var first = '';
	while (diff.y < 0) {
		diff.y++;
		directionless--;
		first += 'n';
	}
	while (diff.x > 0) {
		diff.x--;
		directionless--;
		first += 'e';
	}
	while (diff.y > 0) {
		diff.y--;
		directionless--;
		first += 's';
	}
	while (diff.x < 0) {
		diff.x++;
		directionless--;
		first += 'w';
	}
	first = [first];
	while (directionless > 0) {
		directionless -= 2;
		temp = [];
		for (i = 0, len = first.length; i < len; i++) {
			temp.push(first[i] + 'ns');
			temp.push(first[i] + 'ew');
		}
		first = temp;
	}
	var second = [];
	for (i = 0, len = first.length; i < len; i++) {
		var last = first[i].split('').sort();
		second.push(last.join(''));
		// Narayana algorithm
		while (true) {
			// calculate k
			var k = last.length - 2;
			while (k >= 0 && last[k] >= last[k + 1]) {
				k--;
			}
			// exit if there's no more changes
			if (k === -1) {
				break;
			}
			// calculate t
			var t = last.length - 1;
			while (last[k] >= last[t] && t >= k + 1) {
				t--;
			}
			// swap k with t
			temp = last[k]; last[k] = last[t]; last[t] = temp;
			// reverse k+1..n
			last = last.slice(0, k + 1).concat(last.slice(k + 1).reverse());

			second.push(last.join(''));
		}
	}
	for (i = 0, len = second.length; i < len; i++) {
		coords = { x: initCoords.x, y: initCoords.y };
		directionless = 0;
		for (j = initStep, len2 = this.chronicles.length; j < len2; j++) {
			if (this.chronicles[j].directionless) {
				ui_improver.moveCoords(coords, { direction: this.corrections[second[i][directionless]] });
				directionless++;
			} else {
				ui_improver.moveCoords(coords, this.chronicles[j]);
			}
			if (document.querySelectorAll('#map .dml')[coords.y].children[coords.x].textContent.match(/#|!|\?/)) {
				break;
			}
		}
		if (heroesCoords.x - coords.x === 0 && heroesCoords.y - coords.y === 0) {
			ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':corrections', ui_storage.get('Log:' + worker.so.state.stats.perm_link.value + ':corrections') + second[i]);
			return this.corrections[second[i][0]];
		}
	}
};
ui_improver.colorDungeonMap = function() {
	var step, mark_no, marks_length, currentCell,
		coords = ui_improver.calculateExitXY(),
		steps = worker.Object.keys(this.chronicles),
		steps_max = steps.length;
	for (step = 1; step <= steps_max; step++) {
		if (this.chronicles[step].directionless) {
			var shortCorrection = ui_storage.get('Log:' + worker.so.state.stats.perm_link.value + ':corrections')[this.directionlessMoveIndex++];
			if (shortCorrection) {
				this.chronicles[step].direction = this.corrections[shortCorrection];
			} else {
				this.chronicles[step].direction = ui_improver.calculateDirectionlessMove(coords, step);
			}
			this.chronicles[step].directionless = false;
		}
		ui_improver.moveCoords(coords, this.chronicles[step]);
		currentCell = document.querySelectorAll('#map .dml')[coords.y].children[coords.x];
		for (mark_no = 0, marks_length = this.chronicles[step].marks.length; mark_no < marks_length; mark_no++) {
			currentCell.classList.add(this.chronicles[step].marks[mark_no]);
		}
		if (this.chronicles[step].pointers.length) {
			currentCell.title = worker.GUIp_i18n[this.chronicles[step].pointers[0]] + (this.chronicles[step].pointers[1] ? worker.GUIp_i18n.or + worker.GUIp_i18n[this.chronicles[step].pointers[1]] : '');
		}
	}
	var heroesCoords = ui_improver.calculateXY(document.getElementsByClassName('map_pos')[0]);
	if (heroesCoords.x !== coords.x || heroesCoords.y !== coords.y) {
		worker.console.log('current chronicles');
		worker.console.log(this.chronicles);
		worker.console.log(JSON.stringify(this.chronicles));
		worker.console.log('m_fight_log');
		worker.console.log(document.getElementById('m_fight_log').innerHTML);
		if (ui_utils.hasShownInfoMessage !== true) {
			ui_utils.showMessage('info', {
				title: 'Хера! Ошибка!',
				content: '<div>Кароч, разница координат: по x: ' + (heroesCoords.x - coords.x) + ', по y: ' + (heroesCoords.y - coords.y) + '.</div>'
			});
			ui_utils.hasShownInfoMessage = true;
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
		worker.onresize = function() {
			worker.clearInterval(ui_improver.windowResizeInt);
			ui_improver.windowResizeInt = worker.setTimeout(ui_improver.whenWindowResize.bind(ui_improver), 250);
		};
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
		document.body.className = document.body.className.replace(/th_\w+/g, '') + ' ' + ui_storage.get('ui_s');
	}

	if (this.isFirstTime || this.optionsChanged) {
		var background = ui_storage.get('Option:useBackground');
		if (background === 'cloud') {
			document.body.style.backgroundImage = 'url(' + worker.GUIp_getResource('images/background.jpg') + ')';
		} else {
			document.body.style.backgroundImage = background ? 'url(' + background + ')' : '';
		}
	}
};
ui_improver.improveChat = function() {
	var i, len;

	// friends fetching
	var $friends = document.querySelectorAll('.frline .frname'),
		friends = [];
	for (i = 0, len = $friends.length; i < len; i++) {
		friends.push($friends[i].textContent);
	}
	this.friendsRegExp = new worker.RegExp('^(?:' + friends.join('|') + ')$');

	// links replacing and open chat with friend button adding
	var text, $msgs = document.querySelectorAll('.fr_msg_l:not(.improved)');
	for (i = 0, len = $msgs.length; i < len; i++) {
		text = $msgs[i].childNodes[0].textContent;
		$msgs[i].removeChild($msgs[i].childNodes[0]);
		$msgs[i].insertAdjacentHTML('afterbegin', ui_utils.escapeHTML(text).replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t\, ]+)/g, '<a href="$1" target="_blank" title="' + worker.GUIp_i18n.open_in_a_new_tab + '">$1</a>'));

		var friend = $msgs[i].getElementsByClassName('gc_fr_god')[0];
		if (friend && friend.textContent.match(this.friendsRegExp)) {
			friend.insertAdjacentHTML('beforebegin', '<span class="gc_fr_oc gc_fr_page" title="' + worker.GUIp_i18n.open_chat_with + friend.textContent + '">[✎]</span>');
			$msgs[i].getElementsByClassName('gc_fr_oc')[0].onclick = ui_utils.openChatWith.bind(null, friend.textContent);
		}

		$msgs[i].classList.add('improved');
	}

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
	var ally, opp_n, star;
	for (var number in worker.so.state.alls) {
		ally = worker.so.state.alls[number];
		opp_n = ally.li[0].getElementsByClassName('opp_n')[0];
		if (this.isFirstTime) {
			opp_n.title = ally.god;
			opp_n.insertAdjacentHTML('beforeend', ' <a class="open_chat" title="' + worker.GUIp_i18n.open_chat_with + ally.god + '">★</a>');
		}
		star = opp_n.getElementsByClassName('open_chat')[0];
		if (this.isFirstTime) {
			star.onclick = ui_utils.openChatWith.bind(null, ally.god);
		}
		ui_utils.hideElem(star, !ally.god.match(this.friendsRegExp));
	}
};
ui_improver.calculateButtonsVisibility = function() {
	var i, len, baseCond = worker.so.state.stats.godpower.value >= 5 && !ui_storage.get('Option:disableVoiceGenerators'),
		isMonster = worker.so.state.stats.monster_name && worker.so.state.stats.monster_name.value;
	if (!ui_data.isFight) {
		// pantheon links
		var pantLinks = document.querySelectorAll('#pantheons .arena_link_wrap, #pantheons .chf_link_wrap'),
			pantBefore = [], pantAfter = [];
		for (i = 0, len = pantLinks.length; i < len; i++) {
			pantBefore[i] = !pantLinks[i].classList.contains('hidden');
			pantAfter[i] = worker.so.state.stats.godpower.value >= 50;
		}
		ui_improver.setButtonsVisibility(pantLinks, pantBefore, pantAfter);
		// inspect buttons
		var inspBtns = document.getElementsByClassName('inspect_button'),
			inspBtnsBefore = [], inspBtnsAfter = [];
		for (i = 0, len = inspBtns.length; i < len; i++) {
			inspBtnsBefore[i] = !inspBtns[i].classList.contains('hidden');
			inspBtnsAfter[i] = baseCond && !isMonster;
		}
		ui_improver.setButtonsVisibility(inspBtns, inspBtnsBefore, inspBtnsAfter);
		// craft buttons
		if (this.isFirstTime) {
			this.crftBtns = [document.getElementsByClassName('craft_button b_b')[0],
							 document.getElementsByClassName('craft_button b_r')[0],
							 document.getElementsByClassName('craft_button r_r')[0],
							 document.getElementsByClassName('craft_button span')[0]
							];
		}
		var crftBtnsBefore = [], crftBtnsAfter = [];
		for (i = 0, len = this.crftBtns.length; i < len; i++) {
			crftBtnsBefore[i] = !this.crftBtns[i].classList.contains('hidden');
			crftBtnsAfter[i] = baseCond && !isMonster;
		}
		crftBtnsAfter[0] = crftBtnsAfter[0] && this.b_b.length;
		crftBtnsAfter[1] = crftBtnsAfter[1] && this.b_r.length;
		crftBtnsAfter[2] = crftBtnsAfter[2] && this.r_r.length;
		crftBtnsAfter[3] = crftBtnsAfter[0] || crftBtnsAfter[1] || crftBtnsAfter[2];
		ui_improver.setButtonsVisibility(this.crftBtns, crftBtnsBefore, crftBtnsAfter);
	}
	// voice generators
	if (this.isFirstTime) {
		this.voicegens = document.getElementsByClassName('voice_generator');
		this.voicegenClasses = [];
		for (i = 0, len = this.voicegens.length; i < len; i++) {
			this.voicegenClasses[i] = this.voicegens[i].className;
		}
	}
	var voicegensBefore = [], voicegensAfter = [],
		specialConds, specialClasses;
	if (!ui_data.isFight) {
		var isGoingBack = worker.so.state.stats.dir.value !== 'ft',
			isTown = worker.so.state.stats.town_name && worker.so.state.stats.town_name.value,
			isSearching = worker.so.state.last_news && worker.so.state.last_news.value.match('дорогу'),
			dieIsDisabled = ui_storage.get('Option:disableDieButton'),
			isFullGP = worker.so.state.stats.godpower.value === worker.so.state.stats.max_gp.value,
			isFullHP = worker.so.state.stats.health.value === worker.so.state.stats.max_health.value,
			canQuestBeAffected = !worker.so.state.stats.quest.value.match(/\((?:выполнено|completed|отменено|cancelled)\)/);
		specialClasses = ['heal', 'do_task', 'cancel_task', 'die', 'exp', 'dig', 'town', 'pray'];
		specialConds = [isMonster || isGoingBack || isTown || isSearching || isFullHP,				// heal
						isMonster || isGoingBack || isTown || isSearching || !canQuestBeAffected,	// do_task
																			 !canQuestBeAffected,	// cancel_task
						isMonster ||				isTown ||				 dieIsDisabled,			// die
						isMonster,																	// exp
						isMonster ||										 isTown,				// dig
						isMonster || isGoingBack || isTown ||				 isSearching,			// town
						isMonster ||										 isFullGP				// pray
					   ];
	}
	baseCond = baseCond && !worker.$('.r_blocked:visible').length;
	for (i = 0, len = this.voicegens.length; i < len; i++) {
		voicegensBefore[i] = !this.voicegens[i].classList.contains('hidden');
		voicegensAfter[i] = baseCond;
		if (baseCond && !ui_data.isFight) {
			for (var j = 0, len2 = specialConds.length; j < len2; j++) {
				if (specialConds[j] && this.voicegenClasses[i].match(specialClasses[j])) {
					voicegensAfter[i] = false;
				}
			}
		}
	}
	ui_improver.setButtonsVisibility(this.voicegens, voicegensBefore, voicegensAfter);
};
ui_improver.setButtonsVisibility = function(btns, before, after) {
	for (var i = 0, len = btns.length; i < len; i++) {
		if (before[i] && !after[i]) {
			ui_utils.hideElem(btns[i], true);
		}
		if (!before[i] && after[i]) {
			ui_utils.hideElem(btns[i], false);
		}
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
	var chats = document.getElementsByClassName('frDockCell'),
		clen = chats.length,
		padding_bottom = clen ? chats[0].getBoundingClientRect().bottom - chats[clen - 1].getBoundingClientRect().top : worker.GUIp_browser === 'Opera' ? 27 : 0,
		isBottom = worker.scrollY >= document.documentElement.scrollHeight - document.documentElement.clientHeight - 10;
	padding_bottom = Math.floor(padding_bottom*10)/10 + 10;
	padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
	document.getElementsByClassName('reset_layout')[0].style.paddingBottom = padding_bottom;
	if (isBottom) {
		worker.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
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
	if (!ui_logger.updating) {
		ui_logger.updating = true;
		worker.setTimeout(function() {
			ui_logger.updating = false;
		}, 500);
		ui_logger.update();
	}
};
ui_improver.nodeInsertion = function(e) {
	// to prevent improving WHEN ENTERING FUCKING TEXT IN FUCKING TEXTAREA
	if (e.relatedNode.textContent !== e.target.textContent && !this.improveInProcess) {
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
