// ui_improver
var ui_improver = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "improver"}) : worker.GUIp.improver = {};

ui_improver.improveTmt = 0;
ui_improver.isFirstTime = true;
ui_improver.pmParsed = false;
ui_improver.pmNoted = {};
ui_improver.voiceSubmitted = false;
ui_improver.wantedMonsters = null;
ui_improver.friendsRegExp = null;
ui_improver.windowResizeInt = 0;
ui_improver.mapColorizationTmt = 0;
// trophy craft combinations
ui_improver.b_b = [];
ui_improver.b_r = [];
ui_improver.r_r = [];
// dungeon
ui_improver.chronicles = {};
ui_improver.directionlessMoveIndex = 0;
ui_improver.dungeonPhrases = [
	'bossHint',
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
	'pointerMarker'
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
	ui_informer.update('arena available', ui_stats.isArenaAvailable());
	ui_informer.update('dungeon available', ui_stats.isDungeonAvailable());

	this.optionsChanged = this.isFirstTime ? false : ui_storage.get('optionsChanged');
	if (this.isFirstTime) {
		if (!ui_data.isFight && !ui_data.isDungeon) {
			ui_improver.improveDiary();
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
	if (this.isFirstTime && ui_data.isDungeon) {
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
ui_improver.improveVoiceDialog = function() {
	// If playing in pure ZPG mode there won't be present voice input block at all;
	if (!document.getElementById('voice_edit_wrap')) {
		return;
	}
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
	ui_informer.update('full godpower', ui_stats.Godpower() === ui_stats.Max_Godpower());
};
ui_improver.improveNews = function() {
	if (!ui_utils.isAlreadyImproved(document.getElementById('news'))) {
		ui_utils.addVoicegen(document.querySelector('#news .l_capt'), worker.GUIp_i18n.hit, 'hit', worker.GUIp_i18n.ask7 + ui_data.char_sex[1] + worker.GUIp_i18n.to_hit);
	}
	var isWantedMonster = false,
		isSpecialMonster = false,
		isTamableMonster = false,
		isFavoriteMonster = false;
	// Если герой дерется с монстром
	var currentMonster = ui_stats.monsterName();
	if (currentMonster) {
		isWantedMonster = this.wantedMonsters && currentMonster.match(this.wantedMonsters);
		if (ui_words.base.special_monsters.length) {
			isSpecialMonster = currentMonster.match(new RegExp(ui_words.base.special_monsters.join('|'),'i'));
		}
		if (ui_words.base.chosen_monsters.length) {
			isFavoriteMonster = currentMonster.match(new RegExp(ui_words.base.chosen_monsters.join('|'),'i'));
		}
		if (!ui_stats.heroHasPet()) {
			var hasArk = ui_stats.Logs() >= 1000;
			var pet, hero_level = ui_stats.Level();
			for (var i = 0; i < ui_words.base.pets.length; i++) {
				pet = ui_words.base.pets[i];
				if (currentMonster.toLowerCase() == pet.name.toLowerCase() && hero_level >= pet.min_level && hero_level <= (pet.min_level + (hasArk ? 29 : 14))) {
					isTamableMonster = true;
					break;
				}
			}
		}
	}

	ui_informer.update('wanted monster', isWantedMonster);
	ui_informer.update('special monster', isSpecialMonster);
	ui_informer.update('tamable monster', isTamableMonster);
	ui_informer.update('chosen monster', isFavoriteMonster);

	if (ui_data.hasTemple && this.optionsChanged) {
		ui_timers.layingTimerIsDisabled = ui_storage.get('Option:disableLayingTimer');
		ui_utils.hideElem(ui_timers.layingTimer, ui_timers.layingTimerIsDisabled);
		ui_timers.tick();
	}
};
ui_improver.improveMap = function() {
	if (this.isFirstTime) {
		var legendDiv = document.getElementsByClassName('map_legend')[0].nextElementSibling;
		legendDiv.style.marginLeft = 0;
		legendDiv.insertAdjacentHTML('beforeend',
			'<div class="guip_legend"><div class="dmc bossHint"></div><div> - ' + worker.GUIp_i18n.boss_warning_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc boss"></div><div> - ' + worker.GUIp_i18n.boss_slay_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc bonusGodpower"></div><div> - ' + worker.GUIp_i18n.small_prayer_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc bonusHealth"></div><div> - ' + worker.GUIp_i18n.small_healing_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapUnknown"></div><div> - ' + worker.GUIp_i18n.unknown_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapTrophy"></div><div> - ' + worker.GUIp_i18n.trophy_loss_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapLowDamage"></div><div> - ' + worker.GUIp_i18n.low_damage_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapModerateDamage"></div><div> - ' + worker.GUIp_i18n.moderate_damage_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc trapMoveLoss"></div><div> - ' + worker.GUIp_i18n.move_loss_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc bossHint trapMoveLoss"></div><div> - ' + worker.GUIp_i18n.boss_warning_and_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc boss trapMoveLoss"></div><div> - ' + worker.GUIp_i18n.boss_slay_and_trap_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc" style="color: red;">?</div><div> - ' + worker.GUIp_i18n.treasury_hint + '</div></div>' +
			'<div class="guip_legend"><div class="dmc" style="color: darkorange;">?</div><div> - ' + worker.GUIp_i18n.treasury_th_hint + '</div></div>'
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
		var i, j, len, chronolen = +worker.Object.keys(this.chronicles).reverse()[0],
			$box = worker.$('#cntrl .voice_generator'),
			$boxML = worker.$('#map .dml'),
			$boxMC = worker.$('#map .dmc'),
			kRow = $boxML.length,
			kColumn = $boxML[0].textContent.length,
			isJumping = document.getElementById('map').textContent.match(/Прыгучести|Jumping|Загадки|Mystery/), /* [E] allow moving almost everywhere in Mystery as it could be Jumping or Disobedience */
			MaxMap = 0,      	// count of any pointers
			MaxMapThermo = 0, // count of thermo pointers
			MapArray = [];
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
				var isMoveLoss = [];
				for (i = 0; i < 4; i++) {
					isMoveLoss[i] = chronolen > i && this.chronicles[chronolen - i].marks.indexOf('trapMoveLoss') !== -1;
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
				var ik, jk, ij, ttl = '',
					pointer = $boxML[si].textContent[sj],
					chronopointers = chronolen > 1 ? this.chronicles[chronolen].pointers : [];
				/* [E] check if current position has some directions in chronicle */
				if (pointer == '@' && chronopointers.length) {
					for (i = 0, len = chronopointers.length; i < len; i++) {
						switch (chronopointers[i]) {
							case 'north_east': ttl += '↗'; break;
							case 'north_west': ttl += '↖'; break;
							case 'south_east': ttl += '↘'; break;
							case 'south_west': ttl += '↙'; break;
							case 'north':      ttl += '↑'; break;
							case 'east':       ttl += '→'; break;
							case 'south':      ttl += '↓'; break;
							case 'west':       ttl += '←'; break;
							case 'freezing': ttl += '✵'; break;
							case 'cold':     ttl += '❄'; break;
							case 'mild':     ttl += '☁'; break;
							case 'warm':     ttl += '♨'; break;
							case 'hot':      ttl += '☀'; break;
							case 'burning':  ttl += '✺'; break;
						}
					}
					worker.console.log("current position has pointers: "+ttl);
				}
				if ('←→↓↑↙↘↖↗⌊⌋⌈⌉∨<∧>'.indexOf(pointer) !== -1 || ttl.length && ttl.match('←|→|↓|↑|↙|↘|↖|↗')) {
					MaxMap++;
					$boxMC[si * kColumn + sj].style.color = 'green';
					/* [E] get directions from the arrows themselves, not relying on parsed chronicles */
					if (!ttl.length) {
						switch (pointer) {
							case '⌊': ttl = '↑→'; break;
							case '⌋': ttl = '↑←'; break;
							case '⌈': ttl = '↓→'; break;
							case '⌉': ttl = '↓←'; break;
							case '∨': ttl = '↖↗'; break;
							case '<': ttl = '↗↘'; break;
							case '∧': ttl = '↙↘'; break;
							case '>': ttl = '↖↙'; break;
							default: ttl = pointer; break;
						}
					}
					for (ij = 0, len = ttl.length; ij < len; ij++){
						if ('→←↓↑↘↙↖↗'.indexOf(ttl[ij]) !== - 1){
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
												MapArray[ik][jk]+=1024;
											}
										}
									}
								}
							}
						}
					}
				}
				if ('✺☀♨☁❄✵'.indexOf(pointer) !== -1 || ttl.length && '✺☀♨☁❄✵'.indexOf(ttl) !== -1) {
					MaxMapThermo++;
					$boxMC[si * kColumn + sj].style.color = 'green';
					/* [E] if we're standing on the pointer - use parsed value from chronicle */
					if (ttl.length) {
						pointer = ttl;
					}
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
					//	thermo map data
					var MapData = {
						kColumn: kColumn,
						kRow: kRow,
						minStep: ThermoMinStep,
						maxStep: ThermoMaxStep,
						scanList: []
					};
					for (ik = -1; ik <= kRow; ik++) {
						for (jk = -1; jk <= kColumn; jk++) {
							if (ik < 0 || jk < 0 || ik == kRow || jk == kColumn) {
								MapData[ik+':'+jk] = { explored: false, specway: false, scanned: false, wall: false, unknown: true };
								continue;
							}
							MapData[ik+':'+jk] = {
								explored: '#?!'.indexOf($boxML[ik].textContent[jk]) === -1,
								specway: false,
								scanned: false,
								wall: $boxML[ik].textContent[jk] === '#',
								unknown: $boxML[ik].textContent[jk] === '?'
							}
						}
					}
					// remove unknown marks from cells located near explored ones
					for (ik = 0; ik < kRow; ik++) {
						for (jk = 0; jk < kColumn; jk++) {
							if (MapData[ik+':'+jk].explored) {
								for (i = -1; i <= 1; i++) {
									for (j = -1; j <= 1; j++) {
										if (MapData[(ik+i)+':'+(jk+j)]) { MapData[(ik+i)+':'+(jk+j)].unknown = false; }
									}
								}
							}
						}
					}
					// 
					worker.GUIp_mapIteration(MapData, si, sj, 0, false);
					//
					for (ik = 0; ik < kRow; ik++) {
						for (jk = 0; jk < kColumn; jk++) {
							if (MapData[ik+':'+jk].step < ThermoMinStep && MapData[ik+':'+jk].explored && !MapData[ik+':'+jk].specway) {
								MapData[ik+':'+jk].scanned = true;
								MapData['scanList'].push({i:ik, j:jk, lim:(ThermoMinStep - MapData[ik+':'+jk].step)});
							}
						}
					}
					while (MapData['scanList'].length) {
						var scanCell = MapData['scanList'].shift();
						for (var cell in MapData) { if (MapData[cell].substep) MapData[cell].substep = 0; }
						worker.GUIp_mapSubIteration(MapData, scanCell.i, scanCell.j, 0, scanCell.lim, false);
					}
					//
					for (ik = ((si - ThermoMaxStep) > 0 ? si - ThermoMaxStep : 0); ik <= ((si + ThermoMaxStep) < kRow ? si + ThermoMaxStep : kRow - 1); ik++) {
						for (jk = ((sj - ThermoMaxStep) > 0 ? sj - ThermoMaxStep : 0); jk <= ((sj + ThermoMaxStep) < kColumn ? sj + ThermoMaxStep : kColumn - 1); jk++) {
							if (MapData[ik+':'+jk].step >= ThermoMinStep & MapData[ik+':'+jk].step <= ThermoMaxStep) {
								if (MapArray[ik][jk] >= 0) {
									MapArray[ik][jk]+=128;
								}
							} else if (MapData[ik+':'+jk].step < ThermoMinStep && MapData[ik+':'+jk].specway) {
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
		if (MaxMap !== 0 || MaxMapThermo !== 0) {
			for (i = 0; i < kRow; i++) {
				for (j = 0; j < kColumn; j++) {
					if (MapArray[i][j] == 1024*MaxMap + 128*MaxMapThermo) {
						$boxMC[i * kColumn + j].style.color = ($boxML[i].textContent[j] === '@') ? 'blue' : 'red';
					} else {
						for (ik = 0; ik < MaxMapThermo; ik++) {
							if (MapArray[i][j] == 1024*MaxMap + 128*ik + (MaxMapThermo - ik)) {
								$boxMC[i * kColumn + j].style.color = ($boxML[i].textContent[j] === '@') ? 'blue' : 'darkorange';
							}
						}
					}
				}
			}
		}
	}
};
ui_improver.improveOppsHP = function(isAlly) {
	var color, opp, opp_type = isAlly ? 'alls' : 'opps';
	for (var number in worker.so.state[opp_type]) {
		opp = worker.so.state[opp_type][number];
		if (opp.hp < 1 || (isAlly && opp.hp == 1)) {
			color = 'darkgray';
		} else if (opp.hp < opp.hpm * 0.30) {
			color = 'rgb(235,0,0)';
		} else {
			color = '';
		}
		if (opp.li.opp_hp && opp.li.opp_hp[0]) {
			opp.li.opp_hp[0].style.color = color;
		}
	}
};
ui_improver.improveStats = function() {
	//	Парсер строки с золотом
	var gold_parser = function(val) {
		return parseInt(val.replace(/[^0-9]/g, '')) || 0;
	};

	if (ui_data.isDungeon) {
		if (ui_storage.get('Logger:Location') === 'Field') {
			ui_storage.set('Logger:Location', 'Dungeon');
			ui_storage.set('Logger:Map_HP', ui_stats.HP());
			ui_storage.set('Logger:Map_Exp', ui_stats.Exp());
			ui_storage.set('Logger:Map_Gold', ui_stats.Gold());
			ui_storage.set('Logger:Map_Inv', ui_stats.Inv());
			ui_storage.set('Logger:Map_Charges',ui_stats.Charges());
			ui_storage.set('Logger:Map_Alls_HP', ui_stats.Map_Alls_HP());
			for (var i = 1; i <= 4; i++) {
				ui_storage.set('Logger:Map_Ally'+i+'_HP', ui_stats.Map_Ally_HP(i));
			}
		}
		/* [E] informer to notify about low health when in dungeon mode */
		ui_informer.update('low health', ui_stats.Map_HP() < 130 && ui_stats.Map_HP() > 1);
		ui_improver.improveOppsHP(true);
		return;
	}
	if (ui_data.isFight) {
		if (this.isFirstTime) {
			ui_storage.set('Logger:Hero_HP', ui_stats.HP());
			ui_storage.set('Logger:Hero_Gold', ui_stats.Gold());
			ui_storage.set('Logger:Hero_Inv', ui_stats.Inv());
			ui_storage.set('Logger:Hero_Charges', ui_stats.Charges());
			ui_storage.set('Logger:Enemy_HP', ui_stats.Enemy_HP());
			ui_storage.set('Logger:Enemy_Gold', ui_stats.Enemy_Gold());
			ui_storage.set('Logger:Enemy_Inv', ui_stats.Enemy_Inv());
			ui_storage.set('Logger:Hero_Alls_HP', ui_stats.Hero_Alls_HP());
			for (var i = 1; i <= 4; i++) {
				ui_storage.set('Logger:Hero_Ally'+i+'_HP', ui_stats.Hero_Ally_HP(i));
			}
			for (var i = 1; i <= 5; i++) {
				ui_storage.set('Logger:Enemy'+i+'_HP', ui_stats.EnemySingle_HP(i));
			}
			ui_storage.set('Logger:Enemy_AliveCount', ui_stats.Enemy_AliveCount());
		}
		/* [E] informer to notify about low health when in fight mode */
		var health_lim;
		if (ui_stats.Hero_Alls_Count() == 0 && ui_stats.Enemy_Count() > 2) { // corovan
			health_lim = ui_stats.Max_HP() * 0.05 * ui_stats.Enemy_AliveCount();
		} else if (ui_stats.Hero_Alls_Count() == 0) { // single enemy
			health_lim = ui_stats.Max_HP() * 0.15;
		} else { // raid boss or dungeon boss
			health_lim = (ui_stats.Hero_Alls_MaxHP() + ui_stats.Max_HP()) * (ui_stats.Enemy_HasAbility("second_strike") ? 0.094 : 0.068);
			if (ui_stats.Enemy_AliveCount() > 1) { // boss has an active minion
				health_lim *= 1.3;
			}
			if (ui_stats.Hero_Alls_Count() < 4) { // allies count less than 4 -- clearly speculative calculation below!
				health_lim *= (4 - ui_stats.Hero_Alls_Count()) * 0.2 + 1;
			}
		}
		ui_informer.update('low health', ui_stats.HP() < health_lim && ui_stats.HP() > 1);
		ui_improver.improveOppsHP(true);
		ui_improver.improveOppsHP(false);
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

	ui_informer.update('much gold', ui_stats.Gold() >= (ui_data.hasTemple ? 10000 : 3000));
	ui_informer.update('dead', ui_stats.HP() === 0);
	var questName = ui_stats.Task_Name();
	ui_informer.update('guild quest', questName.match(/членом гильдии|member of the guild/) && !questName.match(/\((отменено|cancelled)\)/));
	ui_informer.update('mini quest', questName.match(/\((мини|mini)\)/) && !questName.match(/\((отменено|cancelled)\)/));

	//Shovel pictogramm start
	var digVoice = document.querySelector('#hk_gold_we .voice_generator');
	if (this.isFirstTime) {
		digVoice.style.backgroundImage = 'url(' + worker.GUIp_getResource('images/shovel.png') + ')';
	}
	if (ui_stats.goldTextLength() > 16 - 2*document.getElementsByClassName('page_wrapper_5c').length) {
		digVoice.classList.add('shovel');
		if (ui_stats.goldTextLength() > 20 - 3*document.getElementsByClassName('page_wrapper_5c').length) {
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
	if (ui_data.isFight) {
		return;
	}
	var pet_badge;
	if (ui_stats.petIsKnockedOut()) {
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
	// knock out informer
	ui_informer.update('pet knocked out', ui_stats.petIsKnockedOut());
};
ui_improver.improveEquip = function() {
	if (!ui_utils.isAlreadyImproved(document.getElementById('equipment'))) {
		document.querySelector('#equipment .block_title').insertAdjacentHTML('afterend', '<div id="equip_badge" class="fr_new_badge equip_badge_pos">0</div>');
	}
	var equipBadge = document.getElementById('equip_badge'),
		averageEquipLevel = 0;
	for (var i = 1; i <= 7; i++) {
		averageEquipLevel += ui_stats['Equip' + i]();
	}
	averageEquipLevel = (averageEquipLevel/7).toFixed(1) + '';
	if (equipBadge.textContent !== averageEquipLevel) {
		equipBadge.textContent = averageEquipLevel;
	}
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
	if (ui_improver.isFirstTime) {
		var $msgs = document.querySelectorAll('#diary .d_msg:not(.parsed)');
		for (i = 0, len = $msgs.length; i < len; i++) {
			$msgs[i].classList.add('parsed');
		}
	} else {
		var newMessages = worker.$('#diary .d_msg:not(.parsed)');
		if (newMessages.length) {
			if (ui_improver.voiceSubmitted) {
				if (newMessages.length - document.querySelectorAll('#diary .d_msg:not(.parsed) .vote_links_b').length >= 2) {
					ui_timeout.start();
				}
				ui_improver.voiceSubmitted = false;
			}
			newMessages.addClass('parsed');
		}
	}
	ui_improver.improvementDebounce();
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
	if (!ui_storage.get('Dungeon:pointerMarkerPhrases')) {
		this.dungeonXHRCount++;
		var customChronicler = ui_storage.get('Option:customDungeonChronicler') || '';
		ui_utils.getXHR('/gods/' + (customChronicler.length >= 3 ? customChronicler : 'Dungeoneer'), ui_improver.parseDungeonPhrases.bind(ui_improver));
	} else {
		for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
			this[this.dungeonPhrases[i] + 'RegExp'] = new worker.RegExp(ui_storage.get('Dungeon:' + this.dungeonPhrases[i] + 'Phrases'));
		}
		ui_improver.improveChronicles();
	}
};
ui_improver.parseSingleChronicle = function(texts, step) {
	if (!this.chronicles[step]) {
		this.chronicles[step] = { direction: null, marks: [], pointers: [], jumping: false, directionless: false, text: texts.join(' ') };
	}
	var i, len, j, len2, chronicle = this.chronicles[step];
	for (j = 0, len2 = texts.length; j < len2; j++) {
		texts[j] = texts[j].replace(/offered to trust h.. gut feeling\./, '');
		for (i = 0, len = this.dungeonPhrases.length - 1; i < len; i++) {
			if (texts[j].match(this[this.dungeonPhrases[i] + 'RegExp']) && chronicle.marks.indexOf(this.dungeonPhrases[i]) === -1) {
				chronicle.marks.push(this.dungeonPhrases[i]);
			}
		}
		var firstSentence = texts[j].match(/^.*?[\.!\?](?:\s|$)/);
		if (firstSentence) {
			var direction = firstSentence[0].match(/[^\w\-А-Яа-я](север|восток|юг|запад|north|east|south|west)/);
			if (direction) {
				chronicle.direction = direction[1];
			}
			chronicle.directionless = chronicle.directionless || !!firstSentence[0].match(/went somewhere|too busy bickering to hear in which direction to go next|The obedient heroes move in the named direction/);
			chronicle.jumping = chronicle.jumping || !!firstSentence[0].match(this.jumpingDungeonRegExp);
		}
	}
	if (texts.join(' ').match(this.pointerMarkerRegExp)) {
		var middle = texts.join(' ').match(/^.+?\.(.+)[.!?].+?[.!?]$/)[1];
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

	var lastNotParsed, texts = [],
		step = 1,
		step_max = +worker.Object.keys(this.chronicles)[0],
		matches = xhr.responseText.match(/<div class="new_line" style='[^']*'>[\s\S]*?<div class="text_content .*?">[\s\S]+?<\/div>/g);
	worker.chronicles = matches;
	worker.response = xhr.responseText;
	for (var i = 0; step <= step_max; i++) {
		lastNotParsed = true;
		if (!matches[i].match(/<div class="text_content infl">/)) {
			texts.push(matches[i].match(/<div class="text_content ">([\s\S]+?)<\/div>/)[1].trim().replace(/&#39;/g, "'"));
		}
		if (matches[i].match(/<div class="new_line" style='[^']+'>/)) {
			ui_improver.parseSingleChronicle(texts, step);
			lastNotParsed = false;
			texts = [];
			step++;
		}
	}
	if (lastNotParsed) {
		ui_improver.parseSingleChronicle(texts, step);
	}

	worker.console.log('after log chronicles');
	worker.console.log(this.chronicles);
	worker.console.log(JSON.stringify(this.chronicles));

	ui_improver.colorDungeonMap();
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
ui_improver.improveChronicles = function() {
	if (!ui_storage.get('Dungeon:pointerMarkerPhrases')) {
		if (this.dungeonXHRCount < 5) {
			ui_improver.getDungeonPhrases();
		}
	} else {
		var numberInBlockTitle = document.querySelector('#m_fight_log .block_title').textContent.match(/\d+/);
		if (!numberInBlockTitle) {
			return;
		}
		ui_improver.deleteInvalidChronicles();
		var i, len, lastNotParsed, texts = [],
			chronicles = document.querySelectorAll('#m_fight_log .d_msg:not(.parsed)'),
			ch_down = document.querySelector('.sort_ch').textContent === '▼',
			step = +numberInBlockTitle[0];
		worker.console.log('new ', chronicles.length, ' chronicles from step #', step);
		for (len = chronicles.length, i = ch_down ? 0 : len - 1; (ch_down ? i < len : i >= 0) && step; ch_down ? i++ : i--) {
			lastNotParsed = true;
			if (!chronicles[i].className.match('m_infl')) {
				texts = [chronicles[i].textContent].concat(texts);
			}
			if (chronicles[i].parentNode.className.match('turn_separator')) {
				ui_improver.parseSingleChronicle(texts, step);
				worker.console.log('chronicle #', step);
				worker.console.log(chronicles[i].textContent);
				lastNotParsed = false;
				texts = [];
				step--;
			}
			if (chronicles[i].textContent.match(this.bossHintRegExp)) {
				chronicles[i].parentNode.classList.add('bossHint');
			}
			chronicles[i].classList.add('parsed');
		}
		if (lastNotParsed) {
			ui_improver.parseSingleChronicle(texts, step);
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
				ui_utils.getXHR('/duels/log/' + ui_stats.logId(), ui_improver.parseChronicles.bind(ui_improver));
			}
		}
		// informer
		ui_informer.update('close to boss', this.chronicles[worker.Object.keys(this.chronicles).reverse()[0]].marks.indexOf('bossHint') !== -1);

		if (ui_storage.get('Log:current') !== ui_stats.logId()) {
			ui_storage.set('Log:current', ui_stats.logId());
			ui_storage.set('Log:' + ui_stats.logId() + ':corrections', '');
		}
		ui_storage.set('Log:' + ui_stats.logId() + ':steps', (document.querySelector('#m_fight_log .block_title').textContent.match(/\d+/) || [0])[0]);
		ui_storage.set('Log:' + ui_stats.logId() + ':map', JSON.stringify(worker.so.state.d_map));
	}
	ui_improver.improvementDebounce();
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

ui_improver.getRPerms = function(array, size, initialStuff, output) {
	if (initialStuff.length >= size) {
		output.push(initialStuff);
	} else {
		for (var i = 0; i < array.length; ++i) {	
			this.getRPerms(array, size, initialStuff.concat(array[i]), output);
		}
	}
}

ui_improver.getAllRPerms = function(array, size) {
	var output = []
	this.getRPerms(array, size, [], output);
	return output;
}

ui_improver.calculateDirectionlessMove = function(initCoords, initStep) {
	var i, len, j, len2, coords = { x: initCoords.x, y: initCoords.y },
		dmap = document.querySelectorAll('#map .dml'),
		heroesCoords = ui_improver.calculateXY(document.getElementsByClassName('map_pos')[0]),
		steps = worker.Object.keys(this.chronicles),
		directionless = 0;

	worker.console.log('going to calculate directionless move from step #'+initStep);
	for (i = initStep, len = steps.length; i <= len; i++) {
		if (this.chronicles[i].directionless) {
			directionless++;
		}
		ui_improver.moveCoords(coords, this.chronicles[i]);
	}
	
	var variations = this.getAllRPerms('nesw'.split(''),directionless);
	
	for (i = 0, len = variations.length; i < len; i++) {
		//worker.console.log('trying combo '+variations[i].join());
		coords = { x: initCoords.x, y: initCoords.y };
		directionless = 0;
		for (j = initStep, len2 = steps.length; j <= len2; j++) {
			if (this.chronicles[j].directionless) {
				ui_improver.moveCoords(coords, { direction: this.corrections[variations[i][directionless]] });
				directionless++;
			} else {
				ui_improver.moveCoords(coords, this.chronicles[j]);
			}
			if (!dmap[coords.y] || !dmap[coords.y].children[coords.x] || dmap[coords.y].children[coords.x].textContent.match(/#|!|\?/)) {
				break;
			}
		}
		if (heroesCoords.x - coords.x === 0 && heroesCoords.y - coords.y === 0) {
			var currentCorrections = ui_storage.get('Log:' + ui_stats.logId() + ':corrections') || '';
			worker.console.log('found result: '+variations[i].join());
			ui_storage.set('Log:' + ui_stats.logId() + ':corrections', currentCorrections + variations[i].join(''));
			return this.corrections[variations[i][0]];
		}
	}
};
ui_improver.colorDungeonMap = function() {
	if (ui_improver.colorDungeonMapTimer) {
		worker.clearTimeout(ui_improver.colorDungeonMapTimer);
	}
	ui_improver.colorDungeonMapTimer = worker.setTimeout(ui_improver.colorDungeonMapInternal.bind(ui_improver), 150);
};
ui_improver.colorDungeonMapTimer = null;
ui_improver.colorDungeonMapInternal = function() {
	if (!ui_data.isDungeon) return;
	ui_improver.improveMap();
	var step, mark_no, marks_length, steptext, lasttext, titlemod, titletext, currentCell,
		trapMoveLossCount = 0,
		coords = ui_improver.calculateExitXY(),
		steps = worker.Object.keys(this.chronicles),
		steps_max = steps.length;
	for (step = 1; step <= steps_max; step++) {
		if (this.chronicles[step].directionless) {
			var shortCorrection = ui_storage.get('Log:' + ui_stats.logId() + ':corrections')[this.directionlessMoveIndex++];
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
		if (!currentCell.title.length && this.chronicles[step].pointers.length) {
			currentCell.title = '[' + worker.GUIp_i18n.map_pointer + ': ' + worker.GUIp_i18n[this.chronicles[step].pointers[0]] + (this.chronicles[step].pointers[1] ? worker.GUIp_i18n.or + worker.GUIp_i18n[this.chronicles[step].pointers[1]] : '') + ']';
		}
		//currentCell.title += (currentCell.title.length ? '\n\n' : '') + '#' + step + ' : ' + this.chronicles[step].text;
		steptext = this.chronicles[step].text.replace('.»','».').replace(/(\!»|\?»)/g,'$1.'); // we're not going to do natural language processing, so just simplify nested sentence (yeah, result will be a bit incorrect)
		steptext = steptext.match(/[^\.]+[\.]+/g);
		if (step == 1) {
			steptext = steptext.slice(0,-1);
		} else if (step == steps_max) {
			steptext = steptext.slice(1);
		} else if (this.chronicles[step].marks.indexOf('boss') !== -1) {
			steptext = steptext.slice(1,-2);
		} else if (this.chronicles[step].marks.indexOf('trapMoveLoss') !== -1 || trapMoveLossCount) {
			if (!trapMoveLossCount) {
				steptext = steptext.slice(1);
				trapMoveLossCount++;
			} else {
				steptext = steptext.slice(0,-1);
				trapMoveLossCount = 0;
			}
		} else {
			steptext = steptext.length > 2 ? steptext.slice(1,-1) : steptext.slice(0,-1);
		}
		steptext = steptext.join('').trim();
		if (currentCell.title.length) {
			titlemod = false, titletext = currentCell.title.split('\n');
			for (var i = 0, len = titletext.length; i < len; i++) {
				lasttext = titletext[i].match(/^(.*?) : (.*?)$/);
				if (lasttext && lasttext[2] == steptext) {
					titletext[i] = lasttext[1] + ', #' + step + ' : ' + steptext;
					titlemod = true;
					break;
				}
			}
			if (!titlemod) {
				titletext.push('#' + step + ' : ' + steptext);
			}
			currentCell.title = titletext.join('\n');
		} else {
			currentCell.title = '#' + step + ' : ' + steptext;
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
				title: worker.GUIp_i18n.coords_error_title,
				content: '<div>' + worker.GUIp_i18n.coords_error_desc + ': [x:' + (heroesCoords.x - coords.x) + ', y:' + (heroesCoords.y - coords.y) + '].</div>'
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
ui_improver._clockToggle = function(e) {
	e && e.stopPropagation();
	if (!ui_improver.clockToggling) ui_improver.clockToggling = true; else return;
	var restoreText, clockElem = worker.$('#control .block_title');
	if (ui_improver.clock) {
		worker.clearInterval(ui_improver.clock.updateTimer);
		restoreText = ui_improver.clock.prevText;
		clockElem.fadeOut(500, function() {
			clockElem.css('color', '');
			clockElem.text(restoreText).fadeIn(500);
			clockElem.prop('title', worker.GUIp_i18n.show_godville_clock);
			ui_improver.clockToggling = false;
		});
		delete ui_improver.clock;
	} else {
		ui_improver.clock = {};
		ui_improver.clock.prevText = clockElem.text();
		ui_improver.clock.blocked = true;
		clockElem.fadeOut(500, function() {
			clockElem.text('--:--:--').fadeIn(500);
			clockElem.prop('title', worker.GUIp_i18n.hide_godville_clock);
			ui_improver.clock.timeBegin = new Date();
			ui_improver.clock.useGVT = (document.location.protocol == 'https:');
			if (ui_improver.clock.useGVT) {
				ui_utils.getXHR('/forums', ui_improver._clockSync, function(xhr) {ui_improver.clockToggling = false; ui_improver._clockToggle(e);}); /* syncing this way is too inaccurate unfortunately */
			} else {
				ui_utils.getXHR('http://time.akamai.com/?iso', ui_improver._clockSync, function(xhr) {ui_improver.clockToggling = false; ui_improver._clockToggle();});
			}
		});
	}
};
ui_improver._clockSync = function(xhr) {
	ui_improver.clockToggling = false;
	var currentTime = new Date(),
		offsetHours = ui_storage.get("Option:offsetGodvilleClock") || 3,
		clockTitle = worker.$('#control .block_title');
	if (currentTime - ui_improver.clock.timeBegin > 500) {
		clockTitle.css('color', '#CC0000');
	}
	if (!ui_improver.clock.useGVT) {
		ui_improver.clock.timeDiff = new Date(xhr.responseText) - currentTime + (ui_storage.get('Option:localtimeGodvilleClock') ? (currentTime.getTimezoneOffset() * -60000) : (offsetHours * 3600000));
	} else {
		ui_improver.clock.timeDiff = new Date(xhr.getResponseHeader("Date")) - currentTime + (ui_storage.get('Option:localtimeGodvilleClock') ? (currentTime.getTimezoneOffset() * -60000) : (offsetHours * 3600000));
	}
	ui_improver.clock.updateTimer = worker.setInterval(ui_improver._clockUpdate, 250);
	ui_improver._clockUpdate();
};
ui_improver._clockUpdate = function() {
	var currentTime = new Date();
	if (currentTime.getTime() - ui_improver.clock.timeBegin.getTime() > (300 * 1000)) {
		ui_improver._clockToggle();
		return;
	}
	var clockElem = worker.$('#control .block_title'),
		godvilleTime = new Date(currentTime.getTime() + ui_improver.clock.timeDiff);
	if (!ui_improver.clock.useGVT) {
		clockElem.text(ui_utils.formatClock(godvilleTime));
	} else {
		clockElem.text(ui_utils.formatClock(godvilleTime) + ' (via GVT)');
		clockElem.prop('title', worker.GUIp_i18n.warning_godville_clock);
	}
}

ui_improver.improveInterface = function() {
	if (this.isFirstTime) {
		worker.$('a[href=#]').removeAttr('href');
		ui_improver.whenWindowResize();
		worker.onresize = function() {
			worker.clearInterval(ui_improver.windowResizeInt);
			ui_improver.windowResizeInt = worker.setTimeout(ui_improver.whenWindowResize.bind(ui_improver), 250);
		};
		if (ui_data.isFight && document.querySelector('#map .block_title, #control .block_title, #m_control .block_title')) {
			document.querySelector('#map .block_title, #control .block_title, #m_control .block_title').insertAdjacentHTML('beforeend', ' <a class="broadcast" href="/duels/log/' + ui_stats.logId() + '" target="_blank">' + worker.GUIp_i18n.broadcast + '</a>');
		}
		/* [E] clock is to be initialized somewhere here */
		else if (!ui_storage.get('Option:disableGodvilleClock') && document.querySelector('#control .block_title')) {
			var controlTitle = document.querySelector('#control .block_title');
			controlTitle.title = worker.GUIp_i18n.show_godville_clock;
			controlTitle.style.cursor = 'pointer';
			controlTitle.onclick = ui_improver._clockToggle.bind(null);
		}
	}
	if (this.isFirstTime || ui_storage.get('UserCssChanged') === true) {
		ui_storage.set('UserCssChanged', false);
		worker.GUIp_addCSSFromString(ui_storage.get('UserCss'));
	}

	if (localStorage.getItem('ui_s') !== ui_storage.get('ui_s')) {
		ui_storage.set('ui_s', localStorage.getItem('ui_s') || 'th_classic');
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
		$msgs[i].insertAdjacentHTML('afterbegin', '<span>' + ui_utils.escapeHTML(text).replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t\, ]+)/g, '<a href="$1" target="_blank" title="' + worker.GUIp_i18n.open_in_a_new_tab + '">$1</a>') + '</span>');

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

	// "Shift+Enter → new line" improvement
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
	var ally, opp_n, star, anspan;
	for (var number in worker.so.state.alls) {
		ally = worker.so.state.alls[number];
		opp_n = ally.li[0].getElementsByClassName('opp_n')[0];
		star = opp_n.getElementsByClassName('open_chat')[0] || document.createElement('a');
		if (!opp_n.classList.contains('improved')) {
			opp_n.classList.add('improved');
			anspan = document.createElement('span');
			anspan.textContent = ally.hero;
			anspan.title = ally.god;
			if (ally.clan == ui_stats.guildName()) {
				anspan.className = "guildsmanAlly";
			}
			opp_n.textContent = '';
			opp_n.insertBefore(anspan, null);
			opp_n.insertBefore(document.createTextNode(' '), null);
			opp_n.insertBefore(star, null);
			star.className = 'open_chat';
			star.title = worker.GUIp_i18n.open_chat_with + ally.god;
			star.textContent = '★';
			star.onclick = ui_utils.openChatWith.bind(null, ally.god);
		}
		ui_utils.hideElem(star, !ally.god.match(this.friendsRegExp));
	}
};
ui_improver.calculateButtonsVisibility = function() {
	var i, len, baseCond = ui_stats.Godpower() >= 5 && !ui_storage.get('Option:disableVoiceGenerators'),
		isMonster = ui_stats.monsterName();
	if (!ui_data.isFight) {
		// pantheon links
		var pantLinks = document.querySelectorAll('#pantheons .arena_link_wrap, #pantheons .chf_link_wrap'),
			pantBefore = [], pantAfter = [];
		for (i = 0, len = pantLinks.length; i < len; i++) {
			pantBefore[i] = !pantLinks[i].classList.contains('hidden');
			pantAfter[i] = ui_stats.Godpower() >= 50;
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
		crftBtnsAfter[0] = crftBtnsAfter[0] && ui_inventory.b_b.length;
		crftBtnsAfter[1] = crftBtnsAfter[1] && ui_inventory.b_r.length;
		crftBtnsAfter[2] = crftBtnsAfter[2] && ui_inventory.r_r.length;
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
			isTown = ui_stats.townName(),
			isSearching = worker.so.state.last_news && worker.so.state.last_news.value.match('дорогу'),
			dieIsDisabled = ui_storage.get('Option:disableDieButton'),
			isFullGP = ui_stats.Godpower() === ui_stats.Max_Godpower(),
			isFullHP = ui_stats.HP() === ui_stats.Max_HP(),
			canQuestBeAffected = !ui_stats.Task_Name().match(/\((?:выполнено|completed|отменено|cancelled)\)/);
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
ui_improver.initOverrides = function() {
	if (worker.so && worker.so.a_notify) {
		worker.so.a_notify_orig = worker.so.a_notify;
		worker.so.a_notify = function() {
			if (ui_storage.get('Option:disableArenaSound')) {
				if((worker.$(document.activeElement).is("input") || worker.$(document.activeElement).is("textarea")) &&
					worker.$(document.activeElement).attr("id") !== "god_phrase" &&
					worker.$(document.activeElement).val().length > 3) {
					var readyness = worker.confirm(worker.Loc.duel_switch_confirm);
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
	if (ui_storage.get('Option:enablePmAlerts') && worker.GUIp_browser !== 'Opera' && Notification.permission === "granted")
	setTimeout(function() {
		// assume that all messages are loaded at this point, make a list of existing unread ones
		for (var contact in worker.so.messages.h_friends) {
			var hfriend = worker.so.messages.h_friends[contact];
			if (hfriend.ms == "upd" && hfriend.msg) {
				ui_improver.pmNoted[contact] = hfriend.msg.id;
			}
		}
		// replace original messages update with modified one
		if (worker.so && worker.so.messages.nm.notify) {
			worker.so.messages.nm.notify_orig = worker.so.messages.nm.notify;
			worker.so.messages.nm.notify = function() {
				// check for a new messages in the updated list and inform about them
				if (arguments[0] == "messages")
				for (var contact in worker.so.messages.h_friends) {
					var hfriend = worker.so.messages.h_friends[contact];
					if (hfriend.ms == "upd" && hfriend.msg.from == contact && (!ui_improver.pmNoted[contact] || (ui_improver.pmNoted[contact] < hfriend.msg.id))) {
						ui_improver.pmNoted[contact] = hfriend.msg.id;
						// show a notification if chat with contact is closed OR godville tab is unfocused
						// (we're NOT using document.hidden because it returns false when tab is active but the whole browser window unfocused)
						if (ui_utils.getCurrentChat() != contact || !document.hasFocus()) {
							var title = '[PM] ' + contact,
								text = hfriend.msg.msg.substring(0,200) + (hfriend.msg.msg.length > 200 ? '...' : ''),
								callback = function(cname) { return function() { if (ui_utils.getCurrentChat() != cname) ui_utils.openChatWith(cname); }; }(contact);
							ui_utils.showNotification(title,text,callback);
						}
					}
				}
				// return original result in case it will appear some time
				return worker.so.messages.nm.notify_orig.apply(this, arguments);
			}
		}
	}, 2000);
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
ui_improver.improvementDebounce = function(mutations) {
	worker.clearTimeout(ui_improver.improveTmt);
	ui_improver.improveTmt = worker.setTimeout(function() {
		ui_improver.improve();
		if (ui_data.isFight) {
			ui_logger.update();
		}
	}, 250);
};
