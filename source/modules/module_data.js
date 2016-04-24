// data
window.GUIp = window.GUIp || {};

GUIp.data = {};

// base variables initialization
GUIp.data.init = function() {
    GUIp.data._initVariables();
    GUIp.data._clearOldDungeonData();

    // init mobile cookies
    if (navigator.userAgent.match(/Android/)) {
        document.cookie = 'm_f=1';
        document.cookie = 'm_pp=1';
        document.cookie = 'm_fl=1';
    }

    /*if ((GUIp.storage.get('Option:enableInformerAlerts') || GUIp.storage.get('Option:enablePmAlerts')) && GUIp.browser !== 'opera' && Notification.permission !== "granted") {
        Notification.requestPermission();
    }*/

    //GUIp.data._getWantedMonster();
    //setInterval(function() { GUIp.data._getWantedMonster(); }, 5*60*1000);
};
GUIp.data._initVariables = function() {
    document.body.classList.add(
        GUIp.stats.isDungeon() ? 'dungeon' :
        GUIp.stats.isSail()    ? 'sail'    :
        GUIp.stats.isFight()   ? 'fight'   : 'field');
    this.char_sex = GUIp.stats.isMale() ? GUIp.i18n.hero : GUIp.i18n.heroine;
    GUIp.storage.set('ui_s', '');
    /*GUIp.storage.set('charIsMale', GUIp.stats.isMale());*/

    if (GUIp.storage.isNewProfile(GUIp.stats.godName())) {
        GUIp.storage.addToNames(GUIp.stats.godName());
    }
    localStorage.setItem('GUIp:lastGodname', GUIp.stats.godName());

    /*if (GUIp.stats.hasTemple()) {
        document.body.classList.add('has_temple');
    }*/
};
GUIp.data._clearOldDungeonData = function() {
    if (GUIp.stats.isField()) {
        for (var key in localStorage) {
            if (key.match(/:Dungeon:/)) {
                localStorage.removeItem(key);
            }
        }
    }
};
GUIp.data._getWantedMonster = function() {
    if (isNaN(GUIp.storage.get('WantedMonster:Date')) ||
        GUIp.utils.dateToMoscowTimeZone(+GUIp.storage.get('WantedMonster:Date')) < GUIp.utils.dateToMoscowTimeZone(Date.now())) {
        GUIp.utils.getXHR({
            url: '/news',
            onSuccess: GUIp.data._parseWantedMonster
        });
    } else {
        GUIp.improver.wantedMonsters = new RegExp(GUIp.storage.get('WantedMonster:Value'));
    }
};
GUIp.data._parseWantedMonster = function(xhr) {
    var temp = xhr.responseText.match(/(?:Разыскиваются|Wanted)[\s\S]+?>([^<]+?)<\/a>[\s\S]+?>([^<]+?)<\/a>/),
        newWantedMonster = temp ? temp[1] + '|' + temp[2] : '';
    if (newWantedMonster && newWantedMonster !== GUIp.storage.get('WantedMonster:Value')) {
        GUIp.storage.set('WantedMonster:Date', Date.now());
        GUIp.storage.set('WantedMonster:Value', newWantedMonster);
        GUIp.improver.wantedMonsters = new RegExp(newWantedMonster);
    }
};

GUIp.data.loaded = true;
