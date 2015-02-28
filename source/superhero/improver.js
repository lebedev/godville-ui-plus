// ui_improver
var ui_improver = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "improver"}) : worker.GUIp.improver = {};

ui_improver.inventoryChanged = true;
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
ui_improver.chronicles = [];
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
ui_improver.dungeonPhrasesXHRCount = 0;
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
	if (this.isFirstTime && (ui_data.isFight || ui_data.isDungeon)) {
		ui_improver.improveAllies();
	}
	ui_improver.checkButtonsVisibility();
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
			worker.$('#god_phrase').change();
		});
		document.getElementById('voice_edit_wrap').insertAdjacentHTML('afterbegin', '<div id="clear_voice_input" class="div_link_nu gvl_popover hidden" title="' + worker.GUIp_i18n.clear_voice_input + '">×</div>');
		document.getElementById('clear_voice_input').onclick = function() {
			document.getElementById('god_phrase').value = '';
			worker.$('#god_phrase').change();
		};
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
		ui_timers.isDisabled = ui_storage.get('Option:disableLayingTimer');
		ui_timers.layingTimer.style.display = this.isDisabled ? 'none' : 'block';
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
	}
	if (worker.$('#map .dml').length) {
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
				var chronicles = document.querySelectorAll('#m_fight_log .d_line'),
					len = this.chronicles.length,
					isMoveLoss = [];
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
		ui_stats.setFromProgressBar('Map_Exp', worker.$('#hk_level .p_bar'));
		ui_stats.setFromLabelCounter('Map_Gold', worker.$('#m_info'), worker.GUIp_i18n.gold_label, gold_parser);
		ui_stats.setFromLabelCounter('Map_Inv', worker.$('#m_info'), worker.GUIp_i18n.inventory_label);
		ui_stats.set('Map_Charges', worker.$('#m_control .acc_val').text(), parseFloat);
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
		// Add voicegens
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
	if (this.isFirstTime || this.optionsChanged) {
		var relocateDuelButtons = ui_storage.get('Option:relocateDuelButtons') || '';
		if (relocateDuelButtons.match('arena')) {
			if (!worker.$('#pantheons.arena_link_relocated').length) {
				worker.$('#pantheons').addClass('arena_link_relocated');
				worker.$('.arena_link_wrap').insertBefore(worker.$('#pantheons_content')).addClass('p_group_sep').css('padding-top', 0);
			}
		} else if (worker.$('#pantheons.arena_link_relocated').length) {
			worker.$('#pantheons').removeClass('arena_link_relocated').removeClass('both');
			worker.$('.arena_link_wrap').insertBefore(worker.$('#control .arena_msg')).removeClass('p_group_sep').css('padding-top', '0.5em');
		}
		if (relocateDuelButtons.match('chf')) {
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
	if (!ui_storage.get('Dungeon:pointerSignPhrases')) {
		this.dungeonPhrasesXHRCount++;
		ui_utils.getXHR('/gods/' + (worker.GUIp_locale === 'ru' ? 'Спандарамет' : 'God Of Dungeons'), ui_improver.parseDungeonPhrases.bind(ui_improver));
	} else {
		for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
			this[this.dungeonPhrases[i] + 'RegExp'] = new worker.RegExp(ui_storage.get('Dungeon:' + this.dungeonPhrases[i] + 'Phrases'));
		}
		ui_improver.improveChronicles();
	}
};
ui_improver.parseSingleChronicle = function(text) {
	var i, len, chronicle = { direction: null, marks: [], pointers: [], jumping: false, directionless: false };
	text = text.replace(/offered to trust h.. gut feeling\./, '');
	for (i = 0, len = this.dungeonPhrases.length - 1; i < len; i++) {
		if (text.match(this[this.dungeonPhrases[i] + 'RegExp'])) {
			chronicle.marks.push(this.dungeonPhrases[i]);
		}
	}
	var firstSentence = text.match(/^.*?[\.!\?](?:\s|$)/);
	if (firstSentence) {
		var direction = firstSentence[0].match(/север|восток|юг|запад|north|east|south|west/);
		if (direction) {
			chronicle.direction = direction[0];
		}
		chronicle.directionless = !!firstSentence[0].match(/went somewhere|too busy bickering to hear in which direction to go next|The obedient heroes move in the named direction/);
		chronicle.jumping = !!firstSentence[0].match(this.jumpingDungeonRegExp);
	}
	if (text.match(this.pointerSignRegExp)) {
		var middle = text.match(/^.*?\.(.*)[.!?].*?[.!?]$/)[1];
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
	return chronicle;
};
ui_improver.parseChronicles = function(xhr) {
	var last;
	if (document.querySelector('.sort_ch').textContent === '▼') {
		var temp = document.querySelectorAll('#m_fight_log .d_line .d_msg:not(.m_infl)');
		last = temp[temp.length - 1].textContent;
	} else {
		last = document.querySelector('#m_fight_log .d_line .d_msg:not(.m_infl)').textContent;
	}
	var log_chronicles = [];
	var direction, entry, matches = xhr.responseText.match(/<div class="text_content ">[\s\S]+?<\/div>/g);
	for (var i = 0, len = matches.length; i < len; i++) {
		matches[i] = matches[i].replace('<div class="text_content ">', '').replace('</div>', '').trim().replace(/&#39;/g, "'");
		if (matches[i] !== last) {
			log_chronicles.push(ui_improver.parseSingleChronicle(matches[i]));
		} else {
			break;
		}
	}
	this.chronicles = log_chronicles.concat(this.chronicles);
	this.logsAreParsed = true;
	ui_improver.colorDungeonMap();
};
ui_improver.deleteInvalidChronicles = function() {
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
};
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
		if (this.dungeonPhrasesXHRCount < 5) {
			ui_improver.getDungeonPhrases();
		}
	} else {
		ui_improver.deleteInvalidChronicles();

		var i, len, chronicles = document.querySelectorAll('#m_fight_log .d_msg:not(.m_infl):not(.parsed)'),
			ch_down = document.querySelector('.sort_ch').textContent === '▼';
		for (len = chronicles.length, i = ch_down ? len - 1 : 0; ch_down ? i >= 0 : i < len; ch_down ? i-- : i++) {
			this.chronicles.push(ui_improver.parseSingleChronicle(chronicles[i].textContent));
			if (chronicles[i].textContent.match(this.warningRegExp)) {
				chronicles[i].parentNode.classList.add('warning');
			}
			chronicles[i].classList.add('parsed');
		}

		if (!this.logsAreParsed) {
			ui_utils.getXHR('/duels/log/' + worker.so.state.stats.perm_link.value, ui_improver.parseChronicles.bind(ui_improver));
		} else {
			try {
				// informer
				ui_informer.update('close to boss', this.chronicles[this.chronicles.length - 1].marks.indexOf('warning') !== -1);
			} catch(e) {
				if (ui_utils.hasShownInfoMessage !== true) {
					ui_utils.showMessage('info', {
						title: 'Особая ошибка! Special error!',
						content: '<div>Сообщите Бэдлаку это: Tell Bad Luck this:<br>' +
								 e.name + ': ' + e.message + '<br>' + JSON.stringify(this.chronicles)
					});
					ui_utils.hasShownInfoMessage = true;
				}
			}
			ui_improver.colorDungeonMap();
		}
	}
	if (ui_storage.get('Log:current') !== worker.so.state.stats.perm_link.value) {
		ui_storage.set('Log:current', worker.so.state.stats.perm_link.value);
		ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':corrections', '');
	}
	ui_storage.set('Log:' + worker.so.state.stats.perm_link.value + ':steps', worker.$('#m_fight_log .block_title').text().match(/\d+/)[0]);
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
	var i, len, j, len2, currentCell,
		coords = ui_improver.calculateExitXY();
	for (i = 0, len = this.chronicles.length; i < len; i++) {
		if (this.chronicles[i].directionless) {
			var shortCorrection = ui_storage.get('Log:' + worker.so.state.stats.perm_link.value + ':corrections')[this.directionlessMoveIndex++];
			if (shortCorrection) {
				this.chronicles[i].direction = this.corrections[shortCorrection];
			} else {
				this.chronicles[i].direction = ui_improver.calculateDirectionlessMove(coords, i);
			}
			this.chronicles[i].directionless = false;
		}
		ui_improver.moveCoords(coords, this.chronicles[i]);
		currentCell = document.querySelectorAll('#map .dml')[coords.y].children[coords.x];
		for (j = 0, len2 = this.chronicles[i].marks.length; j < len2; j++) {
			currentCell.classList.add(this.chronicles[i].marks[j]);
		}
		if (this.chronicles[i].pointers.length) {
			currentCell.title = worker.GUIp_i18n[this.chronicles[i].pointers[0]] + (this.chronicles[i].pointers[1] ? worker.GUIp_i18n.or + worker.GUIp_i18n[this.chronicles[i].pointers[1]] : '');
		}
	}
	var heroesCoords = ui_improver.calculateXY(document.getElementsByClassName('map_pos')[0]);
	if (heroesCoords.x !== coords.x || heroesCoords.y !== coords.y) {
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
		document.body.className = document.body.className.replace(/th_\w+/g, '') + ' ' + ui_storage.get('ui_s');
	}

	if (this.isFirstTime || this.optionsChanged) {
		var background = ui_storage.get('Option:useBackground');
		if (background === 'cloud') {
			worker.$('body').css('background-image', 'url(' + worker.GUIp_getResource('images/background.jpg') + ')');
		} else {
			worker.$('body').css('background-image', background ? 'url(' + background + ')' : '');
		}
	}
};
ui_improver.improveChat = function() {
	var i, len;

	// friends fetching
	if (this.isFirstTime) {
		var $friends = document.querySelectorAll('.frline .frname'),
			friends = [];
		for (i = 0, len = $friends.length; i < len; i++) {
			friends.push($friends[i].textContent);
		}
		this.friendsRegExp = new worker.RegExp('^(?:' + friends.join('|') + ')$');
	}

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
	worker.$('.arena_link_wrap, .chf_link_wrap', worker.$('#pantheons')).hide();
	if (ui_storage.get('Stats:Godpower') >= 50) {
		worker.$('#pantheons .chf_link_wrap').show();
		worker.$('#pantheons .arena_link_wrap').show();
	}
	worker.$('.craft_button, .inspect_button, .voice_generator').hide();
	if (ui_storage.get('Stats:Godpower') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
		if (!worker.$('.r_blocked:visible').length) {
			worker.$('.voice_generator, .inspect_button').show();
		}
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
	var chats = document.getElementsByClassName('frDockCell'),
		clen = chats.length,
		padding_bottom = clen ? chats[0].getBoundingClientRect().bottom - chats[clen - 1].getBoundingClientRect().top : worker.GUIp_browser === 'Opera' ? 27 : 0,
		isBottom = worker.scrollY >= document.documentElement.scrollHeight - document.documentElement.clientHeight - 10;
	padding_bottom = Math.floor(padding_bottom*10)/10 + 10;
	padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
	worker.$('.reset_layout').css('padding-bottom', padding_bottom);
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
ui_improver.nodeInsertion = function() {
	if (!this.improveInProcess) {
		this.improveInProcess = true;
		worker.setTimeout(ui_improver.nodeInsertionDelay.bind(ui_improver), 50);
	}
};
ui_improver.nodeInsertionDelay = function() {
	ui_improver.improve();
	if (ui_data.isFight) {
		worker.$('#god_phrase').change();
		ui_logger.update();
	}
};
