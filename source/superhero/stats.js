// ui_stats
var ui_stats = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "stats"}) : worker.GUIp.stats = {};

ui_stats.Bricks = function() {
	return worker.so.state.stats.bricks_cnt.value;
};
ui_stats.Charges =
ui_stats.Map_Charges =
ui_stats.Hero_Charges = function() {
	return worker.so.state.stats.accumulator.value;
};
ui_stats.Death = function() {
	return worker.so.state.stats.death_count.value;
};
ui_stats.Enemy_Gold = function() {
	return worker.so.state.o_stats.gold.value;
};
ui_stats.Enemy_HP = function() {
	var opps_hp = 0;
	for (var opp in worker.so.state.opps) {
		opps_hp += worker.so.state.opps[opp].hp;
	}
	return opps_hp;
};
ui_stats.EnemySingle_HP = function(enemy) {
	return worker.so.state.opps[enemy-1] && worker.so.state.opps[enemy-1].hp || 0;
};
ui_stats.Enemy_Inv = function() {
	return worker.so.state.o_stats.inventory_num.value;
};
ui_stats.Enemy_HasAbility = function(ability) {
	for (var opp in worker.so.state.opps) {
		for (var ab in worker.so.state.opps[opp].ab) {
			if (worker.so.state.opps[opp].ab[ab].id === ability) {
				return true;
			}
		}
	}
	return false;
};
ui_stats.Enemy_Count = function() {
	var enemies_cnt = 0;
	for (var opp in worker.so.state.opps) {
		enemies_cnt++;
	}
	return enemies_cnt;
};
ui_stats.Enemy_AliveCount = function() {
	var enemies_cnt = 0;
	for (var opp in worker.so.state.opps) {
		if (worker.so.state.opps[opp].hp > 0) {
			enemies_cnt++;
		}
	}
	return enemies_cnt;
};
ui_stats.Equip1 = function() {
	return +worker.so.state.equipment.weapon.level;
};
ui_stats.Equip2 = function() {
	return +worker.so.state.equipment.shield.level;
};
ui_stats.Equip3 = function() {
	return +worker.so.state.equipment.head.level;
};
ui_stats.Equip4 = function() {
	return +worker.so.state.equipment.body.level;
};
ui_stats.Equip5 = function() {
	return +worker.so.state.equipment.arms.level;
};
ui_stats.Equip6 = function() {
	return +worker.so.state.equipment.legs.level;
};
ui_stats.Equip7 = function() {
	return +worker.so.state.equipment.talisman.level;
};
ui_stats.Exp =
ui_stats.Map_Exp =
ui_stats.Hero_Exp = function() {
	return worker.so.state.stats.exp_progress.value;
};
ui_stats.Godpower = function() {
	return worker.so.state.stats.godpower.value;
};
ui_stats.Gold =
ui_stats.Map_Gold =
ui_stats.Hero_Gold = function() {
	return worker.so.state.stats.gold.value;
};
ui_stats.HP =
ui_stats.Map_HP =
ui_stats.Hero_HP = function() {
	return worker.so.state.stats.health.value;
};
ui_stats.Inv =
ui_stats.Map_Inv =
ui_stats.Hero_Inv = function() {
	return worker.so.state.stats.inventory_num.value;
};
ui_stats.Level = function() {
	return worker.so.state.stats.level.value;
};
ui_stats.Logs = function() {
	return parseFloat(worker.so.state.stats.wood.value)*10;
};
ui_stats.Map_Alls_HP =
ui_stats.Hero_Alls_HP = function() {
	var allies_hp = 0;
	for (var ally in worker.so.state.alls) {
		allies_hp += worker.so.state.alls[ally].hp;
	}
	return allies_hp;
};
ui_stats.Map_Ally_HP =
ui_stats.Hero_Ally_HP = function(ally) {
	return worker.so.state.alls[ally-1] && worker.so.state.alls[ally-1].hp || 0;
};
ui_stats.Hero_Alls_MaxHP = function() {
	var allies_hp = 0;
	for (var ally in worker.so.state.alls) {
		allies_hp += worker.so.state.alls[ally].hpm;
	}
	return allies_hp;
};
ui_stats.Hero_Alls_Count = function() {
	var allies_cnt = 0;
	for (var ally in worker.so.state.alls) {
		allies_cnt++;
	}
	return allies_cnt;
};
ui_stats.Max_Godpower = function() {
	return worker.so.state.stats.max_gp.value;
};
ui_stats.Max_HP = function() {
	return worker.so.state.stats.max_health.value;
};
ui_stats.Monster = function() {
	return worker.so.state.stats.monsters_killed.value;
};
ui_stats.Pet_Level = function() {
	return worker.so.state.pet.pet_level && worker.so.state.pet.pet_level.value;
};
ui_stats.Pet_NameType = function() {
	var pName = worker.so.state.pet.pet_name && worker.so.state.pet.pet_name.value.match(/^(.*?)(\ «.*»)?$/) || '',
		pType = worker.so.state.pet.pet_class && worker.so.state.pet.pet_class.value || '';
	return pName[1] + ':' + pType;
};
ui_stats.Task = function() {
	return worker.so.state.stats.quest_progress.value;
};
ui_stats.Task_Name = function() {
	return worker.so.state.stats.quest.value;
};
ui_stats.Savings = function() {
	if (worker.so.state.stats.retirement) {
		var savingsValue = worker.so.state.stats.retirement.value.match(/^((\d+)M, )?(\d+)k$/i);
		if (savingsValue) {
			return 1000 * savingsValue[2] + 1 * savingsValue[3];
		} else {
			return parseInt(worker.so.state.stats.retirement.value);
		}
	}
	return null;
};
ui_stats.petIsKnockedOut = function() {
	return worker.so.state.pet.pet_is_dead && worker.so.state.pet.pet_is_dead.value;
};
ui_stats.charName = function() {
	return worker.so.state.stats.name.value;
};
ui_stats.godName = function() {
	return worker.so.state.stats.godname.value;
};
ui_stats.guildName = function() {
	return worker.so.state.stats.clan && worker.so.state.stats.clan.value;
};
ui_stats.goldTextLength = function() {
	return worker.so.state.stats.gold_we.value.length;
};
ui_stats.heroHasPet = function() {
	return worker.so.state.has_pet;
};
ui_stats.isArenaAvailable = function() {
	return worker.so.state.arena_available();
};
ui_stats.isDungeon = function() {
	return worker.so.state.fight_type() === 'dungeon';
};
ui_stats.isDungeonAvailable = function() {
	return worker.so.state.dungeon_available();
};
ui_stats.isFight = function() {
	return worker.so.state.is_fighting();
};
ui_stats.isMale = function() {
	return worker.so.state.stats.gender.value === 'male';
};
ui_stats.monsterName = function() {
	return worker.so.state.stats.monster_name && worker.so.state.stats.monster_name.value;
};
ui_stats.logId = function() {
	return worker.so.state.stats.perm_link.value;
};
ui_stats.townName = function() {
	return worker.so.state.stats.town_name && worker.so.state.stats.town_name.value;
};