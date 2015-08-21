// ui_logger
var ui_logger = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "logger"}) : worker.GUIp.logger = {};

ui_logger.create = function() {
	this.updating = false;
	this.bar = worker.$('<ul id="logger" style="mask: url(#fader_masking);"/>');
	worker.$('#menu_bar').after(this.bar);
	this.need_separator = false;
	this.dungeonWatchers = [
		['Map_HP', 'hp', worker.GUIp_i18n.hero_health, 'hp'],
		['Map_Exp', 'exp', worker.GUIp_i18n.exp, 'exp'],
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
	this.commonWatchers = [
		['Godpower', 'gp', worker.GUIp_i18n.godpower]
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
	if (name === 'a:hp' && !ui_storage.get('Option:sumAlliesHp')) {
		var diff, damageData = [];
		for (var i = 1; i <= ui_stats.Hero_Alls_Count(); i++)
		{
			diff = ui_storage.set_with_diff('Logger:'+(id === 'Hero_Alls_HP' ? 'Hero' : 'Map')+'_Ally'+i+'_HP', ui_stats.Hero_Ally_HP(i));
			if (diff) {
				damageData.push({num:i, diff:diff, cnt:0, fuzz:0, cntf:0});
			}
		}
		if (!damageData.length) {
			return;
		}
		for (var i = 0; i < damageData.length; i++) {
			for (var j = (i + 1); j < damageData.length; j++) {
				if (damageData[j].processed) {
					continue;
				}
				if (damageData[i].diff == damageData[j].diff) {
					damageData[i].cnt++;
					damageData[j].processed = true;
				} else if (Math.abs(damageData[i].diff - damageData[j].diff) < 3) {
					damageData[i].cntf++;
					damageData[i].fuzz && (damageData[i].fuzz += damageData[j].diff) || (damageData[i].fuzz = damageData[i].diff + damageData[j].diff);
					damageData[j].processed = true;
				}
			}
		}
		damageData.sort(function(a,b) {return a.cnt == b.cnt ? a.num - b.num : b.cnt - a.cnt});
		for (var i = 0; i < damageData.length; i++) {
		  if (damageData[i].processed) continue;
		  if (damageData[i].fuzz) {
		  	ui_logger._appendStr(id, klass, 'a:hp' + (damageData[i].fuzz > 0 ? '⨦' : '≂') + Math.abs(Math.round((damageData[i].fuzz + damageData[i].diff * damageData[i].cnt)/(damageData[i].cnt + damageData[i].cntf + 1))) + 'x' + (damageData[i].cnt + damageData[i].cntf + 1), descr);
		  } else if (damageData[i].cnt > 0) {
		    ui_logger._appendStr(id, klass, 'a:hp' + (damageData[i].diff > 0 ? '+' : '') + damageData[i].diff + 'x' + (damageData[i].cnt + 1), descr);
		  } else {
		  	ui_logger._appendStr(id, klass, 'a' + damageData[i].num + ':hp' + (damageData[i].diff > 0 ? '+' : '') + damageData[i].diff, descr);
		  }
		}
		return;
	}
	if (name === 'e:hp' && !ui_storage.get('Option:sumAlliesHp')) {
		var diff;
		for (var i = 1, len = ui_stats.Enemy_Count(); i <= len; i++)
		{
			diff = ui_storage.set_with_diff('Logger:Enemy'+i+'_HP', ui_stats.EnemySingle_HP(i));
			if (diff) {
				ui_logger._appendStr(id, klass, 'e' + (len > 1 ? i : '') + ':hp' + (diff > 0 ? '+' : '') + diff, descr);
			}
		}
		return;
	}
	var s, diff = ui_storage.set_with_diff('Logger:' + id, ui_stats[id]());
	if (diff) {
		// Если нужно, то преобразовываем в число с одним знаком после запятой
		if (parseInt(diff) !== diff) { diff = diff.toFixed(1); }
		// Добавление плюcа, минуса или стрелочки
		if (diff < 0) {
			if (name === 'exp' && +ui_storage.get('Logger:Level') !== ui_stats.Level()) {
				s = '→' + ui_stats.Exp();
			} else if (name === 'tsk' && ui_storage.get('Logger:Task_Name') !== ui_stats.Task_Name()) {
				ui_storage.set('Logger:Task_Name', ui_stats.Task_Name());
				s = '→' + ui_stats.Task();
			} else {
				s = diff;
			}
		} else {
			s = '+' + diff;
		}
		// pet changing
		if (name === 'pet_level' && ui_storage.get('Logger:Pet_NameType') !== ui_stats.Pet_NameType()) {
			s = '→' + ui_stats.Pet_Level();
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
	ui_logger._updateWatchers(this.commonWatchers);
	this.need_separator = true;
};
