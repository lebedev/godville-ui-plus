// ui_trycatcher
var ui_trycatcher = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "trycatcher"}) : worker.GUIp.trycatcher = {};

ui_trycatcher.replaceWithImproved = function(method) {
	return function() {
		try {
			return method.apply(this, arguments);
		} catch (error) {
			if (ui_storage.get('Option:enableDebugMode')) {
				ui_utils.processError(error, true);
			} else {
				ui_utils.checkVersion(ui_utils.processError.bind(null, error, false), ui_utils.informAboutOldVersion);
			}
		}
	};
};
ui_trycatcher.process = function(object) {
	var method_name, method;
	for (method_name in object) {
		method = object[method_name];
		if (typeof method === "function") {
			object[method_name] = ui_trycatcher.replaceWithImproved(method);
			object[method_name].toSource = worker.Function.prototype.toSource.bind(method);
			object[method_name].toString = worker.Function.prototype.toString.bind(method);
		}
	}
};
