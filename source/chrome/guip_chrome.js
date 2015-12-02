window.GUIp = window.GUIp || {};

GUIp.browser = 'Chrome';
GUIp.getResource = function(res) {
    return localStorage.getItem('GUIp_prefix') + res;
};