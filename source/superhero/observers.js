// ui_observers
var ui_observers = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "observers"}) : worker.GUIp.observers = {};

ui_observers.init = function() {
	for (var key in this) {
		if (this[key].condition) {
			ui_observers.start(this[key]);
		}
	}
};
ui_observers.start = function(obj) {
	for (var i = 0, len = obj.target.length; i < len; i++) {
		var target = document.querySelector(obj.target[i]);
		if (target) {
			var observer = new MutationObserver(obj.func);
			observer.observe(target, obj.config);
		}
	}
};
ui_observers.mutationChecker = function(mutations, check, callback) {
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
ui_observers.chats = {
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
		ui_observers.mutationChecker(mutations, function(mutation) {
			return mutation.addedNodes.length || mutation.removedNodes.length;
		}, function() { ui_improver.chatsFix(); ui_informer.clearTitle(); });
	},
	target: ['.chat_ph']
};
ui_observers.clearTitle = {
	condition: true,
	config: {
		childList: true,
		attributes: true,
		subtree: true,
		attributeFilter: ['style']
	},
	func: function(mutations) {
		ui_observers.mutationChecker(mutations, function(mutation) {
			return mutation.target.className.match(/fr_new_(?:msg|badge)/) ||
				  (mutation.target.className.match(/dockfrname_w/) && mutation.removedNodes.length && mutation.removedNodes[0].className.match(/fr_new_msg/));
		}, ui_informer.clearTitle.bind(ui_informer));
	},
	target: ['.msgDockWrapper']
};
ui_observers.refresher = {
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
			if (!(id && id.match(/logger|pet_badge|equip_badge/)) &&
				!(cl && cl.match(/voice_generator|inspect_button|m_hover|craft_button/))) {
				toReset = true;
				break;
			}
		}
		if (toReset) {
			worker.clearInterval(ui_improver.softRefreshInt);
			worker.clearInterval(ui_improver.hardRefreshInt);
			if (!ui_storage.get('Option:disablePageRefresh')) {
				ui_improver.softRefreshInt = worker.setInterval(ui_improver.softRefresh, (ui_data.isFight || ui_data.isDungeon) ? 5e3 : 9e4);
				ui_improver.hardRefreshInt = worker.setInterval(ui_improver.hardRefresh, (ui_data.isFight || ui_data.isDungeon) ? 15e3 : 27e4);
			}
		}
	},
	target: ['#main_wrapper']
};
ui_observers.diary = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutations) {
		ui_observers.mutationChecker(mutations, function(mutation) { return mutation.addedNodes.length;	}, ui_improver.improveDiary.bind(ui_improver));
	},
	target: ['#diary .d_content']
};
ui_observers.news = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: { childList: true, characterData: true, subtree: true },
	func: ui_improver.improve.bind(ui_improver),
	target: ['.f_news']
};
ui_observers.chronicles = {
	get condition() {
		return ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutations) {
		ui_observers.mutationChecker(mutations, function(mutation) { return mutation.addedNodes.length;	}, ui_improver.improveChronicles.bind(ui_improver));
	},
	target: ['#m_fight_log .d_content']
};
ui_observers.map_colorization = {
	get condition() {
		return ui_data.isDungeon;
	},
	config: {
		childList: true,
		subtree: true
	},
	func: function(mutations) {
		ui_observers.mutationChecker(mutations, function(mutation) { return mutation.addedNodes.length;	}, ui_improver.colorDungeonMap.bind(ui_improver));
	},
	target: ['#map .block_content']
};