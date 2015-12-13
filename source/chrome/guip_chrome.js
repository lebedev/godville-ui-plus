window.GUIp = window.GUIp || {};

GUIp.common = GUIp.common || {};

GUIp.browser = 'Chrome';
GUIp.common.getResourceURL = function(res) {
    return localStorage.getItem('GUIp_prefix') + res;
};