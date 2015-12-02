// logger
window.GUIp = window.GUIp || {};

GUIp.logger = {};

GUIp.logger.create = function() {
	this.updating = false;
	this.bar = $('<ul id="logger" style="mask: url(#fader_masking);"/>');
	$('#menu_bar').after(this.bar);
	this.need_separator = false;
	this.dungeonWatchers = [
		['Map_HP', 'hp', GUIp.i18n.hero_health, 'hp'],
		['Map_Exp', 'exp', GUIp.i18n.exp, 'exp'],
		['Map_Inv', 'inv', GUIp.i18n.inventory, 'inv'],
		['Map_Gold', 'gld', GUIp.i18n.gold, 'gold'],
		['Map_Charges', 'ch', GUIp.i18n.charges, 'charges'],
		['Map_Allies_HP', 'a:hp', GUIp.i18n.allies_health, 'allies']
	];
	this.battleWatchers = [
		['Hero_HP', 'h:hp', GUIp.i18n.hero_health, 'hp'],
		['Enemies_HP', 'e:hp', GUIp.i18n.enemy_health, 'death'],
		['Hero_Allies_HP', 'a:hp', GUIp.i18n.allies_health, 'allies'],
		['Hero_Inv', 'h:inv', GUIp.i18n.inventory, 'inv'],
		['Hero_Gold', 'h:gld', GUIp.i18n.gold, 'gold'],
		['Hero_Charges', 'ch', GUIp.i18n.charges, 'charges'],
		['Enemy_Gold', 'e:gld', GUIp.i18n.gold, 'monster'],
		['Enemy_Inv', 'e:inv', GUIp.i18n.inventory, 'monster']
	];
	this.fieldWatchers = [
		['Exp', 'exp', GUIp.i18n.exp],
		['Level', 'lvl', GUIp.i18n.level],
		['HP', 'hp', GUIp.i18n.health],
		['Charges', 'ch', GUIp.i18n.charges],
		['Task', 'tsk', GUIp.i18n.task],
		['Monster', 'mns', GUIp.i18n.monsters],
		['Inv', 'inv', GUIp.i18n.inventory],
		['Gold', 'gld', GUIp.i18n.gold],
		['Bricks', 'br', GUIp.i18n.bricks],
		['Logs', 'wd', GUIp.i18n.logs],
		['Savings', 'rtr', GUIp.i18n.savings],
		['Equip1', 'eq1', GUIp.i18n.weapon, 'equip'],
		['Equip2', 'eq2', GUIp.i18n.shield, 'equip'],
		['Equip3', 'eq3', GUIp.i18n.head, 'equip'],
		['Equip4', 'eq4', GUIp.i18n.body, 'equip'],
		['Equip5', 'eq5', GUIp.i18n.arms, 'equip'],
		['Equip6', 'eq6', GUIp.i18n.legs, 'equip'],
		['Equip7', 'eq7', GUIp.i18n.talisman, 'equip'],
		['Death', 'death', GUIp.i18n.death_count],
		['Pet_Level', 'pet_level', GUIp.i18n.pet_level, 'monster']
	];
	this.commonWatchers = [
		['Females', 'females', GUIp.i18n.females, 'godmonster'],
		['Godpower', 'gp', GUIp.i18n.godpower],
		['Males', 'males', GUIp.i18n.males, 'godmonster']
	];
};
GUIp.logger._appendStr = function(id, klass, str, descr) {
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
	while ($('#logger li').position().left + $('#logger li').width() < 0 || $('#logger li')[0].className === "separator") {
		$('#logger li:first').remove();
	}
};
GUIp.logger._watchStatsValue = function(id, name, descr, klass) {
	// Remove id prefixes.
	id = id.replace(/^Hero_|^Map_/, '');

	klass = (klass || id).toLowerCase();
	var i, len, diff;
	if (name === 'a:hp' && !GUIp.storage.get('Option:sumAlliesHp')) {
		var damageData = [];
		for (i = 1, len = GUIp.stats.Allies_Count(); i <= len; i++)
		{
			diff = GUIp.storage.set_with_diff('Logger:'+ (GUIp.data.isDungeon ? 'Map' : 'Hero') + '_Ally' + i + '_HP', GUIp.stats.Ally_HP(i));
			if (diff) {
				damageData.push({ num: i, diff: diff, cnt: 0, fuzz: 0, cntf: 0 });
			}
		}
		if (!damageData.length) {
			return;
		}
		for (i = 0, len = damageData.length; i < len; i++) {
			for (var j = (i + 1); j < damageData.length; j++) {
				if (damageData[j].processed) {
					continue;
				}
				if (damageData[i].diff === damageData[j].diff) {
					damageData[i].cnt++;
					damageData[j].processed = true;
				} else if (Math.abs(damageData[i].diff - damageData[j].diff) < 3) {
					damageData[i].cntf++;
					damageData[i].fuzz = (damageData[i].fuzz ? damageData[i].fuzz : damageData[i].diff) + damageData[j].diff;
					damageData[j].processed = true;
				}
			}
		}
		damageData.sort(function(a,b) {return a.cnt === b.cnt ? a.num - b.num : b.cnt - a.cnt;});
		for (i = 0, len = damageData.length; i < len; i++) {
			if (damageData[i].processed) {
				continue;
			}
			if (damageData[i].fuzz) {
				GUIp.logger._appendStr(id, klass, 'a:hp' + (damageData[i].fuzz > 0 ? '⨦' : '≂') + Math.abs(Math.round((damageData[i].fuzz + damageData[i].diff * damageData[i].cnt)/(damageData[i].cnt + damageData[i].cntf + 1))) + 'x' + (damageData[i].cnt + damageData[i].cntf + 1), descr);
			} else if (damageData[i].cnt > 0) {
				GUIp.logger._appendStr(id, klass, 'a:hp' + (damageData[i].diff > 0 ? '+' : '') + damageData[i].diff + 'x' + (damageData[i].cnt + 1), descr);
			} else {
				GUIp.logger._appendStr(id, klass, 'a' + damageData[i].num + ':hp' + (damageData[i].diff > 0 ? '+' : '') + damageData[i].diff, descr);
			}
		}
		return;
	}
	if (name === 'e:hp' && !GUIp.storage.get('Option:sumAlliesHp')) {
		for (i = 1, len = GUIp.stats.Enemies_Count(); i <= len; i++)
		{
			diff = GUIp.storage.set_with_diff('Logger:Enemy'+i+'_HP', GUIp.stats.Enemy_HP(i));
			if (diff) {
				GUIp.logger._appendStr(id, klass, 'e' + (len > 1 ? i : '') + ':hp' + (diff > 0 ? '+' : '') + diff, descr);
			}
		}
		return;
	}
	var s;
	diff = GUIp.storage.set_with_diff('Logger:' + id, GUIp.stats[id]());
	if (diff) {
		// Если нужно, то преобразовываем в число с одним знаком после запятой
		if (parseInt(diff) !== diff) { diff = diff.toFixed(1); }
		// Добавление плюcа, минуса или стрелочки
		if (diff < 0) {
			if (name === 'exp' && +GUIp.storage.get('Logger:Level') !== GUIp.stats.Level()) {
				s = '→' + GUIp.stats.Exp();
			} else if (name === 'tsk' && GUIp.storage.get('Logger:Task_Name') !== GUIp.stats.Task_Name()) {
				GUIp.storage.set('Logger:Task_Name', GUIp.stats.Task_Name());
				s = '→' + GUIp.stats.Task();
			} else {
				s = diff;
			}
		} else {
			s = '+' + diff;
		}
		// pet changing
		if (name === 'pet_level' && GUIp.storage.get('Logger:Pet_NameType') !== GUIp.stats.Pet_NameType()) {
			s = '→' + GUIp.stats.Pet_Level();
		}
		GUIp.logger._appendStr(id, klass, name + s, descr);
	}
};
GUIp.logger._updateWatchers = function(watchersList) {
	for (var i = 0, len = watchersList.length; i < len; i++) {
		GUIp.logger._watchStatsValue.apply(null, watchersList[i]);
	}
};
GUIp.logger.update = function() {
	if (GUIp.storage.get('Option:disableLogger')) {
		this.bar.hide();
		return;
	} else {
		this.bar.show();
	}
	if (GUIp.data.isDungeon) {
		GUIp.logger._updateWatchers(this.dungeonWatchers);
	} else if (GUIp.data.isFight) {
		GUIp.logger._updateWatchers(this.battleWatchers);
	} else {
		GUIp.logger._updateWatchers(this.fieldWatchers);
	}
	GUIp.logger._updateWatchers(this.commonWatchers);
	this.need_separator = true;
};
