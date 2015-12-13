window.GUIp = window.GUIp || {};

GUIp.common = GUIp.common || {};

GUIp.browser = 'Firefox';
GUIp.common.getResourceURL = function(resname) {
    return 'chrome://godville-ui-plus/content/' + resname;
};