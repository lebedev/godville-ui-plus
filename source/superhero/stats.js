// stats
window.GUIp = window.GUIp || {};

GUIp.stats = {};

GUIp.stats.Bricks = function() {
	return so.state.stats.bricks_cnt.value;
};
GUIp.stats.Charges =
GUIp.stats.Map_Charges =
GUIp.stats.Hero_Charges = function() {
	return so.state.stats.accumulator.value;
};
GUIp.stats.Death = function() {
	return so.state.stats.death_count.value;
};
GUIp.stats.Females = function() {
	return so.state.stats.ark_f && so.state.stats.ark_f.value || 0;
};
GUIp.stats.Enemy_Gold = function() {
	return so.state.o_stats.gold_we && so.state.o_stats.gold_we.value && +(so.state.o_stats.gold_we.value.match(/\d+/) || [0])[0] || 0;
};
GUIp.stats.Enemy_HP = function() {
	var opps_hp = 0;
	for (var opp in so.state.opps) {
		opps_hp += so.state.opps[opp].hp;
	}
	return opps_hp;
};
GUIp.stats.EnemySingle_HP = function(enemy) {
	return so.state.opps[enemy-1] && so.state.opps[enemy-1].hp || 0;
};
GUIp.stats.Enemy_Inv = function() {
	return so.state.o_stats.inventory_num && so.state.o_stats.inventory_num.value || 0;
};
GUIp.stats.Enemy_HasAbility = function(ability) {
	for (var opp in so.state.opps) {
		for (var ab in so.state.opps[opp].ab) {
			if (so.state.opps[opp].ab[ab].id === ability) {
				return true;
			}
		}
	}
	return false;
};
GUIp.stats.Enemy_Count = function() {
	var enemies_cnt = 0;
	for (var opp in so.state.opps) {
		enemies_cnt++;
	}
	return enemies_cnt;
};
GUIp.stats.Enemy_AliveCount = function() {
	var enemies_cnt = 0;
	for (var opp in so.state.opps) {
		if (so.state.opps[opp].hp > 0) {
			enemies_cnt++;
		}
	}
	return enemies_cnt;
};
GUIp.stats.Equip1 = function() {
	return +so.state.equipment.weapon.level;
};
GUIp.stats.Equip2 = function() {
	return +so.state.equipment.shield.level;
};
GUIp.stats.Equip3 = function() {
	return +so.state.equipment.head.level;
};
GUIp.stats.Equip4 = function() {
	return +so.state.equipment.body.level;
};
GUIp.stats.Equip5 = function() {
	return +so.state.equipment.arms.level;
};
GUIp.stats.Equip6 = function() {
	return +so.state.equipment.legs.level;
};
GUIp.stats.Equip7 = function() {
	return +so.state.equipment.talisman.level;
};
GUIp.stats.Exp =
GUIp.stats.Map_Exp =
GUIp.stats.Hero_Exp = function() {
	return so.state.stats.exp_progress.value;
};
GUIp.stats.Godpower = function() {
	return so.state.stats.godpower.value;
};
GUIp.stats.Gold =
GUIp.stats.Map_Gold =
GUIp.stats.Hero_Gold = function() {
	return so.state.stats.gold.value;
};
GUIp.stats.HP =
GUIp.stats.Map_HP =
GUIp.stats.Hero_HP = function() {
	return so.state.stats.health.value;
};
GUIp.stats.Inv =
GUIp.stats.Map_Inv =
GUIp.stats.Hero_Inv = function() {
	return so.state.stats.inventory_num.value;
};
GUIp.stats.Level = function() {
	return so.state.stats.level.value;
};
GUIp.stats.Logs = function() {
	return parseFloat(so.state.stats.wood.value)*10;
};
GUIp.stats.Males = function() {
	return so.state.stats.ark_m && so.state.stats.ark_m.value || 0;
};
GUIp.stats.Map_Alls_HP =
GUIp.stats.Hero_Alls_HP = function() {
	var allies_hp = 0;
	for (var ally in so.state.alls) {
		allies_hp += so.state.alls[ally].hp;
	}
	return allies_hp;
};
GUIp.stats.Map_Ally_HP =
GUIp.stats.Hero_Ally_HP = function(ally) {
	return so.state.alls[ally-1] && so.state.alls[ally-1].hp || 0;
};
GUIp.stats.Hero_Alls_MaxHP = function() {
	var allies_hp = 0;
	for (var ally in so.state.alls) {
		allies_hp += so.state.alls[ally].hpm;
	}
	return allies_hp;
};
GUIp.stats.Hero_Alls_Count = function() {
	var allies_cnt = 0;
	for (var ally in so.state.alls) {
		allies_cnt++;
	}
	return allies_cnt;
};
GUIp.stats.Max_Godpower = function() {
	return so.state.stats.max_gp.value;
};
GUIp.stats.Max_HP = function() {
	return so.state.stats.max_health.value;
};
GUIp.stats.Monster = function() {
	return so.state.stats.monsters_killed.value;
};
GUIp.stats.Pet_Level = function() {
	return so.state.pet.pet_level && so.state.pet.pet_level.value;
};
GUIp.stats.Pet_NameType = function() {
	var pName = so.state.pet.pet_name && so.state.pet.pet_name.value.match(/^(.*?)(\ «.*»)?$/) || '',
		pType = so.state.pet.pet_class && so.state.pet.pet_class.value || '';
	return pName[1] + ':' + pType;
};
GUIp.stats.Task = function() {
	return so.state.stats.quest_progress.value;
};
GUIp.stats.Task_Name = function() {
	return so.state.stats.quest.value;
};
GUIp.stats.Savings = function() {
	if (so.state.stats.retirement) {
		var savingsValue = so.state.stats.retirement.value.match(/^((\d+)M, )?(\d+)k$/i);
		if (savingsValue) {
			return 1000 * savingsValue[2] + 1 * savingsValue[3];
		} else {
			return parseInt(so.state.stats.retirement.value);
		}
	}
	return null;
};
GUIp.stats.petIsKnockedOut = function() {
	return so.state.pet.pet_is_dead && so.state.pet.pet_is_dead.value;
};
GUIp.stats.charName = function() {
	return so.state.stats.name.value;
};
GUIp.stats.godName = function() {
	return so.state.stats.godname.value;
};
GUIp.stats.guildName = function() {
	return so.state.stats.clan && so.state.stats.clan.value;
};
GUIp.stats.goldTextLength = function() {
	return so.state.stats.gold_we.value.length;
};
GUIp.stats.heroHasPet = function() {
	return so.state.has_pet;
};
GUIp.stats.isArenaAvailable = function() {
	return so.state.arena_available();
};
GUIp.stats.isDungeon = function() {
	return so.state.fight_type() === 'dungeon';
};
GUIp.stats.isDungeonAvailable = function() {
	return so.state.dungeon_available();
};
GUIp.stats.isFight = function() {
	return so.state.is_fighting();
};
GUIp.stats.isMale = function() {
	return so.state.stats.gender.value === 'male';
};
GUIp.stats.monsterName = function() {
	return so.state.stats.monster_name && so.state.stats.monster_name.value;
};
GUIp.stats.logId = function() {
	return so.state.stats.perm_link.value;
};
GUIp.stats.townName = function() {
	return so.state.stats.town_name && so.state.stats.town_name.value;
};
