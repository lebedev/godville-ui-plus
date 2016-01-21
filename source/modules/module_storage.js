// storage
window.GUIp = window.GUIp || {};

GUIp.storage = {};

GUIp.storage.init = function() {
    GUIp.storage._migrate();
};

GUIp.storage._get_key = function(key) {
    return 'GUIp_' + GUIp.stats.godName() + ':' + key;
};
// gets diff with a value
GUIp.storage._diff = function(id, value) {
    var diff = null;
    var old = GUIp.storage.get(id);
    if (old !== null) {
        diff = value - old;
    }
    return diff;
};
// stores a value
GUIp.storage.set = function(id, value) {
    localStorage.setItem(GUIp.storage._get_key(id), value);
    return value;
};
// reads a value
GUIp.storage.get = function(id) {
    var val = localStorage.getItem(GUIp.storage._get_key(id));
    if (val === 'true') { return true; }
    if (val === 'false') { return false; }
    return val;
};
// deletes single item from storage
GUIp.storage.remove = function(id) {
    return localStorage.removeItem(GUIp.storage._get_key(id));
};
// stores value and gets diff with old
GUIp.storage.set_with_diff = function(id, value) {
    var diff = GUIp.storage._diff(id, value);
    GUIp.storage.set(id, value);
    return diff;
};
// dumps all values related to current god_name
GUIp.storage.dump = function(selector) {
    var lines = [],
        regexp = '^GUIp[_:]' + (selector ? (GUIp.stats.godName() + ':' + selector) : '');
    for (var key in localStorage) {
        if (key.match(regexp)) {
            lines.push(key + ' = ' + localStorage.getItem(key));
        }
    }
    lines.sort();
    window.console.info('Godville UI+ log: Storage:\n' + lines.join('\n'));
};
// resets saved options
GUIp.storage.clear = function(what) {
    if (!what || !what.match(/^(?:GUIp|Godville|All)$/)) {
        if (GUIp.locale === 'ru') {
            window.console.log('Godville UI+: использование storage.clear:\n' +
                               'storage.clear("GUIp") для удаление только настроек Godville UI+\n' +
                               'storage.clear("Godville") для удаления настроек Годвилля, сохранив настройки Godville UI+\n' +
                               'storage.clear("All") для удаления всех настроек');
        } else {
            window.console.log('Godville UI+: storage.clear usage:\n' +
                               'storage.clear("GUIp") to remove Godville UI+ setting only\n' +
                               'storage.clear("Godville") to remove Godville setting and keep Godville UI+ settings\n' +
                               'storage.clear("All") to remove all setting');
        }
        return;
    }
    for (var key in localStorage) {
        if (what === 'GUIp' && key.match(/^GUIp_/) ||
            what === 'Godville' && !key.match(/^GUIp_/) ||
            what === 'All'
        ) {
            localStorage.removeItem(key);
        }
    }
    document.location.reload();
};
GUIp.storage._rename = function(from, to) {
    for (var key in localStorage) {
        if (key.match(from)) {
            localStorage.setItem(key.replace(from, to), localStorage.getItem(key));
            localStorage.removeItem(key);
        }
    }
};
GUIp.storage._delete = function(regexp) {
    for (var key in localStorage) {
        if (key.match(/^GUIp/) && key.match(regexp)) {
            localStorage.removeItem(key);
        }
    }
};
GUIp.storage._migrate = function() {
    if (!GUIp.storage._migratedAt('2015-01-14')) {
        localStorage.setItem('GUIp:beta', localStorage.getItem('GUIp_beta'));
        localStorage.removeItem('GUIp_beta');
        localStorage.setItem('GUIp:godnames', localStorage.getItem('GUIp:godnames').replace(/\|beta|beta\|/, ''));
    }
    if (!GUIp.storage._migratedAt('2015-01-15')) {
        var godnames = localStorage.getItem('GUIp:godnames').split('|'),
            subforum,
            godname,
            subs;
        for (var i = 0; i < godnames.length; i++) {
            subs = {};
            godname = godnames[i];

            for (var subforum_no = 1; subforum_no <= (GUIp.locale === 'ru' ? 6 : 4); subforum_no++) {
                subforum = JSON.parse(localStorage.getItem('GUIp_' + godname + ':Forum' + subforum_no));
                for (var topic_no in subforum) {
                    subs[topic_no] = subforum[topic_no];
                    subs[topic_no].subforum = subforum_no;
                }

                localStorage.removeItem('GUIp_' + godname + ':Forum' + subforum_no);
            }
            localStorage.setItem('GUIp_' + godname + ':Subs', JSON.stringify(subs));

            GUIp.storage._rename('ForumInformers', 'SubsNotifications');
        }
    }
};
GUIp.storage._migratedAt = function(date) {
    var lastMigratedAt = localStorage.getItem('GUIp:lastMigratedAt');
    if (lastMigratedAt && lastMigratedAt < date ||
       !lastMigratedAt
    ) {
        localStorage.setItem('GUIp:lastMigratedAt', date);
        return false;
    } else {
        return true;
    }
};
GUIp.storage.isNewProfile = function(godname) {
    return !~(localStorage.getItem('GUIp:godnames') || '').split('|').indexOf(godname);
};
GUIp.storage.addToNames = function(godname) {
    var godnames = localStorage.getItem('GUIp:godnames');
    localStorage.setItem('GUIp:godnames', (godnames ? godnames + '|' : '') + godname);
};

GUIp.storage.loaded = true;
