// base functions and variables initialization
window.GUIp = window.GUIp || {};

var doc = document;
GUIp.$id = function(id) {
    return doc.getElementById(id);
};
GUIp.$C = function(classname) {
    return doc.getElementsByClassName(classname);
};
GUIp.$c = function(classname) {
    return doc.getElementsByClassName(classname)[0];
};
GUIp.$Q = function(sel, el) {
    return (el || doc).querySelectorAll(sel);
};
GUIp.$q = function(sel, el) {
    return (el || doc).querySelector(sel);
};
GUIp.storage = {
    _getKey: function(key) {
        return "GUIp_" + this.god_name + ':' + key;
    },
    set: function(id, value) {
        localStorage.setItem(this._getKey(id), value);
        return value;
    },
    get: function(id) {
        var value = localStorage.getItem(this._getKey(id));
        if (value === 'true') { return true; }
        else if (value === 'false') { return false; }
        else { return value; }
    },
    god_name: ''
};

var setInitVariables = function() {
    GUIp.isTopic = location.pathname.match(/topic/) !== null;
    GUIp.subforumId = 'Forum' + (GUIp.isTopic ? GUIp.$q('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
                                              : location.pathname.match(/forums\/show\/(\d+)/)[1]);
    var greetings = GUIp.$id('menu_top').textContent;
    GUIp.storage.god_name = greetings.match(localStorage.getItem('GUIp:lastGodname'))[0] ||
                            greetings.match(localStorage.getItem('GUIp:godnames'))[0];
};

var main = function() {
    try {
        if (!GUIp.i18n ||
            !GUIp.initLinks ||
            !GUIp.initTopicFormattingFeatures ||
            !GUIp.initOtherTopicFeatures ||
            !GUIp.addCSSFromURL
        ) {
            return;
        }

        clearInterval(starter);

        setInitVariables();

        GUIp.initLinks();

        if (GUIp.isTopic) {
            GUIp.addCSSFromURL(GUIp.getResource('forum.css'), 'forum_css');
            GUIp.initTopicFormattingFeatures();
            GUIp.initOtherTopicFeatures();
        }
    } catch(e) {
        window.console.error(e);
    }
};
var starter = setInterval(function() { main(); }, 100);
