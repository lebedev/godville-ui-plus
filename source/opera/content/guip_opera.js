window.GUIp = window.GUIp || {};

GUIp.common = GUIp.common || {};

GUIp.browser = 'Opera';
GUIp.common.getResourceURL = function(aResName) {
    return 'https://raw.githubusercontent.com/zeird/godville-ui-plus/master/' + aResName;
};

GUIp.common.loaded_specific = true;
