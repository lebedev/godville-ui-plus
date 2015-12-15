window.GUIp = window.GUIp || {};

GUIp.common = GUIp.common || {};

GUIp.browser = 'Firefox';
GUIp.common.getResourceURL = function(aResName) {
    return 'chrome://godville-ui-plus/content/' + aResName;
};

GUIp.common.loaded_specific = true;
