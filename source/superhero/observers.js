// ui_observers
var ui_observers;

if (window.wrappedJSObject) {
	ui_observers = createObjectIn(worker.GUIp, {defineAs: "observers"});
} else {
	ui_observers = worker.GUIp.observers = {};
}

ui_observers.init = function() {
	for (var key in this) {
		if (this[key].condition) {
			this.start(this[key]);
		}
	}
};
ui_observers.process_mutations = function(obj_func, mutations) {
	mutations.forEach(obj_func);
};
ui_observers.start = function(obj) {
	for (var i = 0, len = obj.target.length; i < len; i++) {
		var target = document.querySelector(obj.target[i]);
		if (target) {
			var observer = new MutationObserver(this.process_mutations.bind(this, obj.func));
			observer.observe(target, obj.config);
			obj.observers.push(observer);
		}
	}
};
ui_observers.chats = {
	condition: true,
	config: { childList: true },
	func: function(mutation) {
		if (mutation.addedNodes.length && !mutation.addedNodes[0].classList.contains('moved')) {
			var newNode = mutation.addedNodes[0];
			newNode.classList.add('moved');
			mutation.target.appendChild(newNode);
			var msgArea = newNode.querySelector('.frMsgArea');
			msgArea.scrollTop = msgArea.scrollTopMax || msgArea.scrollHeight;
		} else if (mutation.addedNodes.length || mutation.removedNodes.length) {
			ui_improver.chatsFix();
		}
	},
	observers: [],
	target: ['.chat_ph']
};
ui_observers.inventory = {
	get condition() {
		return !ui_data.isBattle && !ui_data.isDungeon;
	},
	config: {
		childList: true,
		attributes: true,
		subtree: true,
		attributeFilter: ['style']
	},
	func: function(mutation) {
		if (mutation.target.tagName.toLowerCase() === 'li' && mutation.type === "attributes" &&
			mutation.target.style.display === 'none' && mutation.target.parentNode) {
			mutation.target.parentNode.removeChild(mutation.target);
			ui_improver.improveLoot();
		}
		if (mutation.target.tagName.toLowerCase() === 'ul' && mutation.addedNodes.length) {
			ui_improver.improveLoot();
		}
	},
	observers: [],
	target: ['#inventory ul']
};
ui_observers.refresher = {
	condition: true,
	config: {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true
	},
	func: function(mutation) {
		var tgt = mutation.target,
			id = tgt.id,
			cl = tgt.className;
		if (!(id && id.match(/logger|pet_badge|equip_badge/)) &&
			!(cl && cl.match(/voice_generator|inspect_button|m_hover|craft_button/))) {
			worker.clearInterval(ui_improver.softRefreshInt);
			worker.clearInterval(ui_improver.hardRefreshInt);
			if (!ui_storage.get('Option:disablePageRefresh')) {
				ui_improver.softRefreshInt = worker.setInterval(ui_improver.softRefresh, (ui_data.isBattle || ui_data.isDungeon) ? 5e3 : 9e4);
				ui_improver.hardRefreshInt = worker.setInterval(ui_improver.hardRefresh, (ui_data.isBattle || ui_data.isDungeon) ? 15e3 : 27e4);
			}
		}
	},
	observers: [],
	target: ['#main_wrapper']
};
ui_observers.diary = {
	get condition() {
		return !ui_data.isBattle && !ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			ui_improver.improveDiary();
		}
	},
	observers: [],
	target: ['#diary .d_content']
};
ui_observers.chronicles = {
	get condition() {
		return ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			ui_improver.improveChronicles();
		}
	},
	observers: [],
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
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			worker.clearTimeout(ui_improver.mapColorizationTmt);
			ui_improver.mapColorizationTmt = worker.setTimeout(ui_improver.colorDungeonMap.bind(ui_improver), 50);
		}
	},
	observers: [],
	target: ['#map .block_content']
};
ui_observers.allies_parse = {
	get condition() {
		return ui_data.isBattle || ui_data.isDungeon;
	},
	config: {
		childList: true,
		subtree: true
	},
	func: function(mutation) {
		if (mutation.addedNodes.length) {
			if (ui_improver.currentAlly === ui_improver.currentAllyObserver) {
				var hero_name = document.querySelectorAll('#alls .opp_n')[ui_improver.currentAlly],
					motto_field = mutation.target.querySelector('.h_motto');
				if (motto_field) {
					var special_motto = motto_field.textContent.match(/\[[^\]]+?\]/g);
					if (special_motto) {
						hero_name.textContent = hero_name.textContent + ' ' + special_motto.join('');
					}
				}
				var god_name = mutation.target.querySelector('.l_val').textContent;
				if (god_name.match(ui_improver.friendsRegexp)) {
					hero_name.insertAdjacentHTML('beforeend', ' <a id="openchatwith' + ui_improver.currentAlly + '" title="' + worker.GUIp_i18n.open_chat_with + god_name + '">★</a>');
					document.getElementById('openchatwith' + ui_improver.currentAlly).onclick = function(e) {
						e.preventDefault();
						e.stopPropagation();
						ui_utils.openChatWith(god_name);
					};
				}
				ui_improver.currentAlly += 1;
				var match = mutation.target.id.match(/popover_opp_all(\d)/);
				if (match) {
					ui_observers.allies_parse.observers[ui_improver.currentAlly - 1].disconnect();
				}
				worker.setTimeout(ui_improver.improveAllies.bind(ui_improver), 0);
			}
		}
	},
	observers: [],
	target: ['#popover_opp_all0', '#popover_opp_all1', '#popover_opp_all2', '#popover_opp_all3', '#popover_opp_all4']
};
