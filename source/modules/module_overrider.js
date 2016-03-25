// overrider
window.GUIp = window.GUIp || {};

GUIp.overrider = {};

GUIp.overrider.init = function() {
    this._overrideSounds();
    this._overridePMNotifications();
};

GUIp.overrider._overrideSounds = function() {
    if (window.so && window.so.a_notify) {
        window.so.a_notify_orig = window.so.a_notify;
        window.so.a_notify = function() {
            if (GUIp.storage.get('Option:disableArenaSound')) {
                var activeElement = document.activeElement;
                if (activeElement.tagName.toLowerCase().match(/textarea|input/) &&
                    activeElement.id !== 'god_phrase' &&
                    activeElement.value.length > 3) {
                    var readyness = window.confirm(window.Loc.duel_switch_confirm);
                    if (!readyness)  {
                        return false;
                    }
                }
                setTimeout(function() {
                    document.location.reload();
                }, 3e3);
            } else {
                window.so.a_notify_orig();
            }
        };
    }
    if (window.so && window.so.play_sound) {
        window.so.play_sound_orig = window.so.play_sound;
        window.so.play_sound = function(a, b) {
            if (!(GUIp.storage.get('Option:disablePmSound') && a === 'msg.mp3')) {
                window.so.play_sound_orig(a, b);
            }
        };
    }
};

GUIp.overrider._overridePMNotifications = function() {
    if (GUIp.storage.get('Option:enablePmAlerts') && GUIp.browser !== 'opera' && Notification.permission === "granted") {
        setTimeout(function() {
            // assume that all messages are loaded at this point, make a list of existing unread ones
            for (var contact in window.so.messages.h_friends) {
                var hfriend = window.so.messages.h_friends[contact];
                if (hfriend.ms === "upd" && hfriend.msg) {
                    GUIp.improver.pmNoted[contact] = hfriend.msg.id;
                }
            }
            // replace original messages update with modified one
            if (window.so && window.so.messages.nm.notify) {
                window.so.messages.nm.notify_orig = window.so.messages.nm.notify;
                window.so.messages.nm.notify = function() {
                    // check for a new messages in the updated list and inform about them
                    if (arguments[0] === "messages") {
                        var callback_fn = function(cname) {
                            return function() {
                                if (GUIp.utils.getCurrentChat() !== cname) {
                                    GUIp.utils.openChatWith(cname);
                                }
                            };
                        };
                        for (var contact in window.so.messages.h_friends) {
                            var hfriend = window.so.messages.h_friends[contact];
                            if (hfriend.ms === "upd" && hfriend.msg.from === contact && (!GUIp.improver.pmNoted[contact] || (GUIp.improver.pmNoted[contact] < hfriend.msg.id))) {
                                GUIp.improver.pmNoted[contact] = hfriend.msg.id;
                                // show a notification if chat with contact is closed OR godville tab is unfocused
                                // (we're NOT using document.hidden because it returns false when tab is active but the whole browser window unfocused)
                                if (GUIp.utils.getCurrentChat() !== contact || !document.hasFocus()) {
                                    var title = '[PM] ' + contact,
                                        text = hfriend.msg.msg.substring(0,200) + (hfriend.msg.msg.length > 200 ? '...' : ''),
                                        callback = callback_fn(contact);
                                    GUIp.utils.showNotification(title,text,callback);
                                }
                            }
                        }
                    }
                    // return original result in case it will appear some time
                    return window.so.messages.nm.notify_orig.apply(this, arguments);
                };
            }
        }, 2000);
    }
};

GUIp.overrider.loaded = true;
