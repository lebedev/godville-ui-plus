// observers
window.GUIp = window.GUIp || {};

GUIp.observers = {};

GUIp.observers.init = function() {
    var condition;
    for (var key in this) {
        if (typeof this[key].condition === 'function' && this[key].condition() ||
            typeof this[key].condition === 'boolean'  && this[key].condition
        ) {
            GUIp.observers.start(this[key]);
        }
    }
};
GUIp.observers.start = function(obj) {
    for (var i = 0, len = obj.target.length; i < len; i++) {
        var target = document.querySelector(obj.target[i]);
        if (target) {
            var observer = new MutationObserver(obj.func);
            observer.observe(target, obj.config);
        }
    }
};
GUIp.observers.mutationChecker = function(mutations, check, callback) {
    var callbackRunRequired = false;
    for (var i = 0, len = mutations.length; i < len; i++) {
        if (check(mutations[i])) {
            callbackRunRequired = true;
            break;
        }
    }
    if (callbackRunRequired) {
        callback();
    }
};
GUIp.observers.chats = {
    condition: true,
    config: { childList: true },
    func: function(mutations) {
        for (var i = 0, len = mutations.length; i < len; i++) {
            if (mutations[i].addedNodes.length && !mutations[i].addedNodes[0].classList.contains('moved')) {
                var newNode = mutations[i].addedNodes[0];
                newNode.classList.add('moved');
                mutations[i].target.appendChild(newNode);
                var msgArea = newNode.querySelector('.frMsgArea');
                msgArea.scrollTop = msgArea.scrollTopMax || msgArea.scrollHeight;
            }
        }
        GUIp.observers.mutationChecker(mutations, function(mutation) {
            return mutation.addedNodes.length || mutation.removedNodes.length;
        }, function() { GUIp.improver.chatsFix(); GUIp.informer.clearTitle(); });
    },
    target: ['.chat_ph']
};
GUIp.observers.clearTitle = {
    condition: true,
    config: {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ['style']
    },
    func: function(mutations) {
        GUIp.observers.mutationChecker(mutations, function(mutation) {
            return mutation.target.className.match(/fr_new_(?:msg|badge)/) ||
                  (mutation.target.className.match(/dockfrname_w/) && mutation.removedNodes.length && mutation.removedNodes[0].className.match(/fr_new_msg/));
        }, GUIp.informer.clearTitle.bind(GUIp.informer));
    },
    target: ['.msgDockWrapper']
};
GUIp.observers.refresher = {
    condition: true,
    config: {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
    },
    func: function(mutations) {
        var toReset = false;
        for (var i = 0, len = mutations.length; i < len; i++) {
            var tgt = mutations[i].target,
                id = tgt.id,
                cl = tgt.className;
            if (!(id && id.match && id.match(/logger|pet_badge|equip_badge/)) &&
                !(cl && cl.match && cl.match(/voice_generator|inspect_button|m_hover|craft_button/))) {
                toReset = true;
                break;
            }
        }
        if (toReset) {
            clearInterval(GUIp.improver.softRefreshInt);
            clearInterval(GUIp.improver.hardRefreshInt);
            if (!GUIp.storage.get('Option:disablePageRefresh')) {
                GUIp.improver.softRefreshInt = setInterval(function() { GUIp.improver.softRefresh(); }, GUIp.stats.isField() ?  9e4 :  5e3);
                GUIp.improver.hardRefreshInt = setInterval(function() { GUIp.improver.hardRefresh(); }, GUIp.stats.isField() ? 27e4 : 15e3);
            }
        }
    },
    target: ['#main_wrapper']
};
/*GUIp.observers.diary = {
    condition: function() {
        return GUIp.stats.isField();
    },
    config: { childList: true },
    func: function(mutations) {
        GUIp.observers.mutationChecker(mutations, function(mutation) { return mutation.addedNodes.length; }, GUIp.improver.improveDiary);
    },
    target: ['#diary .d_content']
};
GUIp.observers.news = {
    condition: function() {
        return GUIp.stats.isField();
    },
    config: { childList: true, characterData: true, subtree: true },
    func: function() {
        GUIp.improver.improvementDebounce();
    },
    target: ['.f_news']
};*/
GUIp.observers.chronicles = {
    condition: function() {
        return GUIp.stats.isDungeon();
    },
    config: { childList: true },
    func: function(mutations) {
        GUIp.observers.mutationChecker(mutations, function(mutation) { return mutation.addedNodes.length; }, GUIp.improver.improveChronicles.bind(GUIp.improver));
    },
    target: ['#m_fight_log .d_content']
};
GUIp.observers.map_colorization = {
    condition: function() {
        return GUIp.stats.isDungeon();
    },
    config: {
        childList: true,
        subtree: true
    },
    func: function(mutations) {
        GUIp.observers.mutationChecker(mutations, function(mutation) { return mutation.addedNodes.length;    }, GUIp.improver.colorDungeonMap.bind(GUIp.improver));
    },
    target: ['#map .block_content']
};
GUIp.observers.node_insertion = {
    condition: true,
    config: {
        childList: true,
        subtree: true
    },
    func: function(mutations) {
        GUIp.observers.mutationChecker(mutations, function(mutation) {
            return mutation.addedNodes.length && !mutation.target.parentElement.classList.contains('frInputArea');
        }, GUIp.improver.improvementDebounce);
    },
    target: ['body']
};

GUIp.observers.loaded = true;
