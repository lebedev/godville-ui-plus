window.GUIp = window.GUIp || {};

GUIp.common = GUIp.common || {};

GUIp.browser = 'Chrome';
GUIp.common.getResourceURL = function(aResName) {
    return sessionStorage.getItem('GUIp_prefix') + aResName;
};

GUIp.common.loaded_specific = true;
