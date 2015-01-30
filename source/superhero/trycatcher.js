// ui_trycatcher
var ui_trycatcher;

if (window.wrappedJSObject) {
	ui_trycatcher = createObjectIn(worker.GUIp, {defineAs: "trycatcher"});
} else {
	ui_trycatcher = worker.GUIp.trycatcher = {};
}

ui_trycatcher.replace_with = function(method) {
	return function() {
		try {
			return method.apply(this, arguments);
		} catch (error) {
			var name_message = error.name + ': ' + error.message,
				stack = error.stack.replace(name_message, '').replace(/^\n|    at /g, '').replace(/(?:chrome-extension|@resource).*?:(\d+:\d+)/g, '@$1');
			if (!stack.match(/sendPing/)) {
				worker.console.error('Godville UI+ error log:\n' +
							  name_message + '\n' +
							  worker.GUIp_i18n.error_message_stack_trace + ': ' + stack);
				if (!ui_utils.hasShownErrorMessage) {
					ui_utils.hasShownErrorMessage = true;
					ui_utils.showMessage('error', {
						title: worker.GUIp_i18n.error_message_title,
						content: '<div>' + worker.GUIp_i18n.error_message_subtitle + '</div>' +
								 '<div>' + worker.GUIp_i18n.error_message_text + ' <b>' + name_message + '</b>.</div>' +
								 '<div>' + worker.GUIp_i18n.error_message_stack_trace + ': <b>' + stack.replace(/\n/g, '<br>') + '</b></div>',
						callback: function() {
							if (!ui_storage.get('helpDialogVisible')) {
								ui_help_dialog.toggle();
							}
						}
					});
				}
			}
		}
	};
};
ui_trycatcher.process = function(object) {
	var method_name, method;
	for (method_name in object) {
		method = object[method_name];
		if (typeof method === "function") {
			object[method_name] = this.replace_with(method);
		}
	}
};
