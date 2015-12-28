// stats
window.GUIp = window.GUIp || {};

GUIp.stats = {};

GUIp.stats.init = function() {};

GUIp.stats._count = function(aParty) {
    return Object.keys(window.so.state[aParty]).length;
};
GUIp.stats._totalHP = function(aParty, aProperty) {
    // Temporal length property to mimic an array-like object.
    window.so.state[aParty].length = GUIp.stats._count(aParty);
    var hp = Array.prototype.slice.call(window.so.state[aParty]).reduce(function(aSumm, aMember) { return aSumm + aMember[aProperty]; }, 0);
    delete window.so.state[aParty].length;
    return hp;
};

// Capitalized stats are used in logger.

GUIp.stats.Allies_Count = function() {
    return GUIp.stats._count('alls');
};
GUIp.stats.Allies_HP = function() {
    return GUIp.stats._totalHP('alls', 'hp');
};
GUIp.stats.Allies_MaxHP = function() {
    return GUIp.stats._totalHP('alls', 'hpm');
};
GUIp.stats.Ally_HP = function(aAlly) {
    return window.so.state.alls[aAlly - 1] && window.so.state.alls[aAlly - 1].hp || 0;
};
GUIp.stats.Bricks = function() {
    return window.so.state.stats.bricks_cnt.value;
};
GUIp.stats.Charges = function() {
    return window.so.state.stats.accumulator.value;
};
GUIp.stats.Death = function() {
    return window.so.state.stats.death_count.value;
};
GUIp.stats.Enemies_AliveCount = function() {
    // Temporal length property to mimic an array-like object.
    window.so.state.opps.length = GUIp.stats.Enemies_Count();
    var count = Array.prototype.slice.call(window.so.state.opps).filter(function(opp) { return opp.hp > 0; }).length;
    delete window.so.state.opps.length;
    return count;
};
GUIp.stats.Enemies_Count = function() {
    return GUIp.stats._count('opps');
};
GUIp.stats.Enemies_HP = function() {
    return GUIp.stats._totalHP('opps', 'hp');
};
GUIp.stats.Enemy_Gold = function() {
    return window.so.state.o_stats.gold_we && window.so.state.o_stats.gold_we.value && +(window.so.state.o_stats.gold_we.value.match(/\d+/) || [0])[0] || 0;
};
GUIp.stats.Enemy_HasAbility = function(aAbility) {
    return window.so.state.opps[0].ab && window.so.state.opps[0].ab.map(function(aAbility) { return aAbility.id; }).join().match(aAbility);
};
GUIp.stats.Enemy_HP = function(aOpp) {
    return window.so.state.opps[aOpp - 1] && window.so.state.opps[aOpp - 1].hp || 0;
};
GUIp.stats.Enemy_Inv = function() {
    return window.so.state.o_stats.inventory_num && window.so.state.o_stats.inventory_num.value || 0;
};
GUIp.stats.Equip1 = function() {
    return +window.so.state.equipment.weapon.level;
};
GUIp.stats.Equip2 = function() {
    return +window.so.state.equipment.shield.level;
};
GUIp.stats.Equip3 = function() {
    return +window.so.state.equipment.head.level;
};
GUIp.stats.Equip4 = function() {
    return +window.so.state.equipment.body.level;
};
GUIp.stats.Equip5 = function() {
    return +window.so.state.equipment.arms.level;
};
GUIp.stats.Equip6 = function() {
    return +window.so.state.equipment.legs.level;
};
GUIp.stats.Equip7 = function() {
    return +window.so.state.equipment.talisman.level;
};
GUIp.stats.Exp = function() {
    return window.so.state.stats.exp_progress.value;
};
GUIp.stats.Females = function() {
    return window.so.state.stats.ark_f && window.so.state.stats.ark_f.value || 0;
};
GUIp.stats.Godpower = function() {
    return window.so.state.stats.godpower.value;
};
GUIp.stats.Gold = function() {
    return window.so.state.stats.gold.value;
};
GUIp.stats.HP = function() {
    return window.so.state.stats.health.value;
};
GUIp.stats.Inv = function() {
    return window.so.state.stats.inventory_num.value;
};
GUIp.stats.Level = function() {
    return window.so.state.stats.level.value;
};
GUIp.stats.Logs = function() {
    return parseFloat(window.so.state.stats.wood.value)*10;
};
GUIp.stats.Males = function() {
    return window.so.state.stats.ark_m && window.so.state.stats.ark_m.value || 0;
};
GUIp.stats.Max_Godpower = function() {
    return window.so.state.stats.max_gp.value;
};
GUIp.stats.Max_HP = function() {
    return window.so.state.stats.max_health.value;
};
GUIp.stats.Monster = function() {
    return window.so.state.stats.monsters_killed.value;
};
GUIp.stats.Pet_Level = function() {
    return window.so.state.pet.pet_level && window.so.state.pet.pet_level.value;
};
GUIp.stats.Pet_NameType = function() {
    var pName = window.so.state.pet.pet_name && window.so.state.pet.pet_name.value.match(/^(.*?)(\ «.*»)?$/) || '',
        pType = window.so.state.pet.pet_class && window.so.state.pet.pet_class.value || '';
    return pName[1] + ':' + pType;
};
GUIp.stats.Savings = function() {
    if (window.so.state.stats.retirement) {
        var savingsValue = window.so.state.stats.retirement.value.match(/^((\d+)M, )?(\d+)k$/i);
        if (savingsValue) {
            return 1000*savingsValue[2] + 1*savingsValue[3];
        } else {
            return parseInt(window.so.state.stats.retirement.value);
        }
    }
    return null;
};
GUIp.stats.Task = function() {
    return window.so.state.stats.quest_progress.value;
};
GUIp.stats.Task_Name = function() {
    return window.so.state.stats.quest.value;
};

// Stats for internal use.

GUIp.stats.charName = function() {
    return window.so.state.stats.name.value;
};
GUIp.stats.fightType = function() {
    return window.so.state.fight_type();
};
GUIp.stats.godName = function() {
    return window.so.state.stats.godname.value;
};
GUIp.stats.guildName = function() {
    return window.so.state.stats.clan && window.so.state.stats.clan.value;
};
GUIp.stats.goldTextLength = function() {
    return window.so.state.stats.gold_we.value.length;
};
GUIp.stats.hasTemple = function() {
    return GUIp.stats.Bricks() === 1000;
};
GUIp.stats.heroHasPet = function() {
    return window.so.state.has_pet;
};
GUIp.stats.isArenaAvailable = function() {
    return window.so.state.arena_available();
};
GUIp.stats.isDungeon = function() {
    return window.so.state.fight_type() === 'dungeon';
};
GUIp.stats.isDungeonAvailable = function() {
    return window.so.state.dungeon_available();
};
GUIp.stats.isField = function() {
    return !window.so.state.is_fighting();
};
GUIp.stats.isFight = function() {
    return window.so.state.is_fighting() && !window.so.state.fight_type().match('dungeon|sail');
};
GUIp.stats.isMale = function() {
    return window.so.state.stats.gender.value === 'male';
};
GUIp.stats.isSail = function() {
    return window.so.state.is_fighting() === 'sail';
};
GUIp.stats.monsterName = function() {
    return window.so.state.stats.monster_name && window.so.state.stats.monster_name.value;
};
GUIp.stats.logId = function() {
    return window.so.state.stats.perm_link.value;
};
GUIp.stats.petIsKnockedOut = function() {
    return window.so.state.pet.pet_is_dead && window.so.state.pet.pet_is_dead.value;
};
GUIp.stats.townName = function() {
    return window.so.state.stats.town_name && window.so.state.stats.town_name.value;
};

GUIp.stats.loaded = true;
