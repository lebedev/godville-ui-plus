// ui_logger
var ui_logger = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "logger"}) : worker.GUIp.logger = {};

ui_logger.create = function() {
	this.updating = false;
	this.bar = worker.$('<ul id="logger" style="mask: url(#fader_masking);"/>');
	worker.$('#menu_bar').after(this.bar);
	this.need_separator = false;
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
		this._appendStr(id, klass, name + s, descr);
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
		this._watchStatsValue('Map_HP', 'hp', worker.GUIp_i18n.hero_health, 'hp');
		this._watchStatsValue('Map_Inv', 'inv', worker.GUIp_i18n.inventory, 'inv');
		this._watchStatsValue('Map_Gold', 'gld', worker.GUIp_i18n.gold, 'gold');
		this._watchStatsValue('Map_Charges', 'ch', worker.GUIp_i18n.charges, 'charges');
		this._watchStatsValue('Map_Alls_HP', 'a:hp', worker.GUIp_i18n.allies_health, 'allies');
	}
	if (ui_data.isBattle && !ui_data.isDungeon) {
		this._watchStatsValue('Hero_HP', 'h:hp', worker.GUIp_i18n.hero_health, 'hp');
		this._watchStatsValue('Enemy_HP', 'e:hp', worker.GUIp_i18n.enemy_health, 'death');
		this._watchStatsValue('Hero_Alls_HP', 'a:hp', worker.GUIp_i18n.allies_health, 'allies');
		this._watchStatsValue('Hero_Inv', 'h:inv', worker.GUIp_i18n.inventory, 'inv');
		this._watchStatsValue('Hero_Gold', 'h:gld', worker.GUIp_i18n.gold, 'gold');
		this._watchStatsValue('Hero_Charges', 'ch', worker.GUIp_i18n.charges, 'charges');
		this._watchStatsValue('Enemy_Gold', 'e:gld', worker.GUIp_i18n.gold, 'monster');
		this._watchStatsValue('Enemy_Inv', 'e:inv', worker.GUIp_i18n.inventory, 'monster');
	}
	this._watchStatsValue('Exp', 'exp', worker.GUIp_i18n.exp);
	this._watchStatsValue('Level', 'lvl', worker.GUIp_i18n.level);
	this._watchStatsValue('HP', 'hp', worker.GUIp_i18n.health);
	this._watchStatsValue('Godpower', 'gp', worker.GUIp_i18n.godpower);
	this._watchStatsValue('Charges', 'ch', worker.GUIp_i18n.charges);
	this._watchStatsValue('Task', 'tsk', worker.GUIp_i18n.task);
	this._watchStatsValue('Monster', 'mns', worker.GUIp_i18n.monsters);
	this._watchStatsValue('Inv', 'inv', worker.GUIp_i18n.inventory);
	this._watchStatsValue('Gold', 'gld', worker.GUIp_i18n.gold);
	this._watchStatsValue('Bricks', 'br', worker.GUIp_i18n.bricks);
	this._watchStatsValue('Logs', 'wd', worker.GUIp_i18n.logs);
	this._watchStatsValue('Savings', 'rtr', worker.GUIp_i18n.savings);
	this._watchStatsValue('Equip1', 'eq1', worker.GUIp_i18n.weapon, 'equip');
	this._watchStatsValue('Equip2', 'eq2', worker.GUIp_i18n.shield, 'equip');
	this._watchStatsValue('Equip3', 'eq3', worker.GUIp_i18n.head, 'equip');
	this._watchStatsValue('Equip4', 'eq4', worker.GUIp_i18n.body, 'equip');
	this._watchStatsValue('Equip5', 'eq5', worker.GUIp_i18n.arms, 'equip');
	this._watchStatsValue('Equip6', 'eq6', worker.GUIp_i18n.legs, 'equip');
	this._watchStatsValue('Equip7', 'eq7', worker.GUIp_i18n.talisman, 'equip');
	this._watchStatsValue('Death', 'death', worker.GUIp_i18n.death_count);
	this._watchStatsValue('Pet_Level', 'pet_level', worker.GUIp_i18n.pet_level, 'monster');
	this.need_separator = true;
};
