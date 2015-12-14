// trycatcher
window.GUIp = window.GUIp || {};

GUIp.trycatcher = {};

GUIp.trycatcher.wrap = function(method) {
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

GUIp.trycatcher.process = function(object) {
    var type, method;
    var showOriginalSource = function() {
        return this.original.toString();
    };
    for (var key in object) {
        type = Object.prototype.toString.call(object[key]).slice(8, -1);
        switch(type) {
        case 'Function':
            method = object[key];
            object[key] = GUIp.trycatcher.wrap(method);
            object[key].original = method;
            object[key].toString = showOriginalSource;
            break;
        case 'Object':
            GUIp.trycatcher.process(object[key]);
            break;
        }
    }
};
