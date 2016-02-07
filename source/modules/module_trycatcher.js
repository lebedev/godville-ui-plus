// trycatcher
window.GUIp = window.GUIp || {};

GUIp.trycatcher = {};

GUIp.trycatcher.init = function() {
    GUIp.trycatcher._process(GUIp);
};

GUIp.trycatcher._wrap = function(method) {
    return function() {
        try {
            return method.apply(this, arguments);
        } catch (error) {
            if (GUIp.storage.get('Option:enableDebugMode')) {
                GUIp.utils.processError(error, true);
            } else {
                GUIp.utils.checkVersion(GUIp.utils.processError.bind(null, error, false), GUIp.utils.informAboutOldVersion);
            }
        }
    };
};

GUIp.trycatcher._process = function(object) {
    var type, method;
    var showOriginalSource = function() {
        return this.original.toString();
    };
    for (var key in object) {
        type = Object.prototype.toString.call(object[key]).slice(8, -1);
        switch(type) {
        case 'Function':
            method = object[key];
            object[key] = GUIp.trycatcher._wrap(method);
            object[key].original = method;
            object[key].toString = showOriginalSource;
            break;
        case 'Object':
            GUIp.trycatcher._process(object[key]);
            break;
        }
    }
};

GUIp.trycatcher.loaded = true;
