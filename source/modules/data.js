// data
window.GUIp = window.GUIp || {};

GUIp.data = {};

// base variables initialization
GUIp.data.init = function() {
    GUIp.data._initVariables();
    GUIp.data._initForumData();
    GUIp.data._clearOldDungeonData();

    // init mobile cookies
    if (navigator.userAgent.match(/Android/)) {
        document.cookie = 'm_f=1';
        document.cookie = 'm_pp=1';
        document.cookie = 'm_fl=1';
    }

    /* [E] desktop notifications - asking user for a permission */
    if ((GUIp.storage.get('Option:enableInformerAlerts') || GUIp.storage.get('Option:enablePmAlerts')) && GUIp.browser !== 'Opera' && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    GUIp.data._getLEMRestrictions();
    setInterval(function() { GUIp.data._getLEMRestrictions(); }, 60*60*1000);

    GUIp.data._getWantedMonster();
    setInterval(function() { GUIp.data._getWantedMonster(); }, 5*60*1000);
};
GUIp.data._initVariables = function() {
    document.body.classList.add(
        GUIp.stats.isDungeon() ? 'dungeon' :
        GUIp.stats.isSail()    ? 'sail'    :
        GUIp.stats.isFight()   ? 'fight'   : 'field');
    this.char_sex = GUIp.stats.isMale() ? GUIp.i18n.hero : GUIp.i18n.heroine;
    GUIp.storage.set('ui_s', '');
    GUIp.storage.set('charIsMale', GUIp.stats.isMale());

    if (GUIp.storage.isNewProfile(GUIp.stats.godName())) {
        GUIp.storage.addToNames(GUIp.stats.godName());
    }
    localStorage.setItem('GUIp:lastGodname', GUIp.stats.godName());

    if (GUIp.stats.hasTemple()) {
        document.body.classList.add('has_temple');
    }
    GUIp.utils.voiceInput = document.getElementById('god_phrase');
};
GUIp.data._initForumData = function() {
    if (!GUIp.storage.get('Forum1')) {
        GUIp.storage.set('Forum1', '{}');
        GUIp.storage.set('Forum2', '{}');
        GUIp.storage.set('Forum3', '{}');
        GUIp.storage.set('Forum4', '{}');
        GUIp.storage.set('ForumInformers', '{}');

        if (GUIp.locale === 'ru') {
            //GUIp.storage.set('Forum2', '{"2812": {"posts": 0, "date": 0}}');
            GUIp.storage.set('Forum5', '{}');
            GUIp.storage.set('Forum6', '{}');
        } else {
            //GUIp.storage.set('Forum1', '{"2800": {"posts": 0, "date": 0}}');
        }
    }
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
GUIp.data._getLEMRestrictions = function() {
    if (isNaN(GUIp.storage.get('LEMRestrictions:Date')) || Date.now() - GUIp.storage.get('LEMRestrictions:Date') > 24*60*60*1000) {
        GUIp.utils.getXHR({
            url: '//www.godalert.info/Dungeons/guip.cgi',
            onSuccess: GUIp.data._parseLEMRestrictions
        });
    }
};
GUIp.data._parseLEMRestrictions = function(xhr) {
    var restrictions = JSON.parse(xhr.responseText);
    GUIp.storage.set('LEMRestrictions:Date', Date.now());
    GUIp.storage.set('LEMRestrictions:FirstRequest', restrictions.first_request);
    GUIp.storage.set('LEMRestrictions:TimeFrame', restrictions.time_frame);
    GUIp.storage.set('LEMRestrictions:RequestLimit', restrictions.request_limit);
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
