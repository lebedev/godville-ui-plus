window.GUIp = window.GUIp || {};

GUIp.browser = 'Firefox';
GUIp.getResource = function(resname) {
    return 'chrome://godville-ui-plus/content/' + resname;
};