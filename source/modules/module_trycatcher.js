// trycatcher
window.GUIp = window.GUIp || {};

GUIp.trycatcher = {};

GUIp.trycatcher.init = function() {
    GUIp.trycatcher._process(GUIp);
    GUIp.trycatcher._isErrorShown = false;
};

GUIp.trycatcher._recursive = false;

GUIp.trycatcher._wrap = function(method) {
    return function() {
        try {
            return method.apply(this, arguments);
        } catch (error) {
            if (!GUIp.trycatcher._recursive) {
                GUIp.trycatcher._recursive = true;
                if (GUIp.storage.get('Option:enableDebugMode')) {
                    GUIp.trycatcher.processError(error, true);
                } else {
                    GUIp.utils.checkVersion(GUIp.trycatcher.processError.bind(null, error, false), GUIp.utils.informAboutOldVersion);
                }
                GUIp.trycatcher._recursive = false;
            } else {
                GUIp.trycatcher.processError(error, false);
                GUIp.trycatcher._recursive = false;
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
            if (key !== 'trycatcher') {
                GUIp.trycatcher._process(object[key]);
            }
            break;
        }
    }
};

GUIp.trycatcher.processError = function(error, isDebugMode) {
    var name_message = error.name + ': ' + error.message;
    var stack = error.stack && error.stack.replace(/(?:chrome-extension|@resource).*?:(\d+:\d+)/g, '@$1').split('\n').filter(function(step) {return !step.match(/GUIp\.trycatcher\._wrap/);}).join('\n') || 'no stacktrace';

    GUIp.i18n = GUIp.i18n || {};

    window.console.error('Godville UI+ error log:\n' +
        name_message + '\n' +
        GUIp.i18n.error_message_stack_trace + ': ' + stack
    );

    if (isDebugMode) {
        window.console.warn(GUIp.i18n.debug_mode_warning);
    }
    if (!GUIp.trycatcher._isErrorShown) {
        GUIp.trycatcher._isErrorShown = true;
        GUIp.common.showMessage('error', {
            title: GUIp.i18n.error_message_title,
            content: (isDebugMode ? '<div><b class="debug_mode_warning">' + GUIp.i18n.debug_mode_warning + '</b></div>' : '') +
                     '<div id="possible_actions">' +
                        '<div>' + GUIp.i18n.error_message_text + ' <b>' + name_message + '</b>.</div>' +
                        '<div>' + GUIp.i18n.possible_actions + '</div>' +
                        '<ol>' +
                            '<li>' + GUIp.i18n.if_first_time + '<a id="press_here_to_reload">' + GUIp.i18n.press_here_to_reload + '</a></li>' +
                            '<li>' + GUIp.i18n.if_repeats + '<a id="press_here_to_show_details">' + GUIp.i18n.press_here_to_show_details + '</a></li>' +
                        '</ol>' +
                     '</div>' +
                     '<div id="error_details" style="display: none;">' +
                        '<div>' + GUIp.i18n.error_message_subtitle + '</div>' +
                        '<div>' + GUIp.i18n.browser + ' <b>' + GUIp.browser + ' ' + navigator.userAgent.match(RegExp(GUIp.browser + '\/([\\d.]+)', 'i'))[1] +'</b>.</div>' +
                        '<div>' + GUIp.i18n.version + ' <b>' + GUIp.version + '</b>.</div>' +
                        '<div>URL: <b>' + window.location.href + '</b>.</div>' +
                        '<div>' + GUIp.i18n.error_message_text + ' <b>' + name_message + '</b>.</div>' +
                        '<div>' + GUIp.i18n.error_message_stack_trace + ': <b>' + stack.replace(/\n/g, '<br>') + '</b></div>' +
                     '</div>',
            callback: function() {
                document.getElementById('press_here_to_reload').onclick = document.location.reload.bind(document.location);
                document.getElementById('press_here_to_show_details').onclick = function() {
                    document.getElementById('possible_actions').style.display = 'none';
                    document.getElementById('error_details').style.display = 'block';
                    if (GUIp.storage && GUIp.help && !GUIp.storage.get('helpDialogVisible')) {
                        GUIp.help.toggleDialog();
                    }
                };
            }
        });
    }
};

GUIp.trycatcher.loaded = true;
