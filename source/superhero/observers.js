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
			obj.observers.push(observer);
		}
	}
};
ui_observers.chats = {
	condition: true,
	config: { childList: true },
	func: function(mutations) {
		var toFix = false;
		for (var i = 0, len = mutations.length; i < len; i++) {
			if (mutations[i].addedNodes.length && !mutations[i].addedNodes[0].classList.contains('moved')) {
				var newNode = mutations[i].addedNodes[0];
				newNode.classList.add('moved');
				mutations[i].target.appendChild(newNode);
				var msgArea = newNode.querySelector('.frMsgArea');
				msgArea.scrollTop = msgArea.scrollTopMax || msgArea.scrollHeight;
			}
			if (!toFix && (mutations[i].addedNodes.length || mutations[i].removedNodes.length)) {
				toFix = true;
			}
		}
		if (toFix) {
			ui_improver.chatsFix();
			ui_informer.clearTitle();
		}
	},
	observers: [],
	target: ['.chat_ph']
};
ui_observers.inventory = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: {
		childList: true,
		attributes: true,
		subtree: true,
		attributeFilter: ['style']
	},
	func: function(mutations) {
		var toImprove = false;
		for (var i = 0, len = mutations.length; i < len; i++) {
			if (mutations[i].target.tagName.toLowerCase() === 'li' && mutations[i].type === "attributes" &&
				mutations[i].target.style.display === 'none' && mutations[i].target.parentNode) {
				mutations[i].target.parentNode.removeChild(mutations[i].target);
				toImprove = true;
			}
			if (mutations[i].target.tagName.toLowerCase() === 'ul' && mutations[i].addedNodes.length) {
				toImprove = true;
			}
		}
		if (toImprove) {
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
	observers: [],
	target: ['#main_wrapper']
};
ui_observers.diary = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutations) {
		var toImprove = false;
		for (var i = 0, len = mutations.length; i < len; i++) {
			if (mutations[i].addedNodes.length) {
				toImprove = true;
				break;
			}
		}
		if (toImprove) {
			ui_improver.improveDiary();
		}
	},
	observers: [],
	target: ['#diary .d_content']
};
ui_observers.news = {
	get condition() {
		return !ui_data.isFight && !ui_data.isDungeon;
	},
	config: { childList: true, characterData: true, subtree: true },
	func: ui_improver.calculateButtonsVisibility.bind(ui_improver),
	observers: [],
	target: ['.f_news']
};
ui_observers.chronicles = {
	get condition() {
		return ui_data.isDungeon;
	},
	config: { childList: true },
	func: function(mutations) {
		var toImprove = false;
		for (var i = 0, len = mutations.length; i < len; i++) {
			if (mutations[i].addedNodes.length) {
				toImprove = true;
				break;
			}
		}
		if (toImprove) {
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
	func: function(mutations) {
		var toColor = false;
		for (var i = 0, len = mutations.length; i < len; i++) {
			if (mutations[i].addedNodes.length) {
				toColor = true;
				break;
			}
		}
		if (toColor) {
			ui_improver.colorDungeonMap();
		}
	},
	observers: [],
	target: ['#map .block_content']
};
ui_observers.allies_parse = {
	get condition() {
		return (ui_data.isFight || ui_data.isDungeon) && worker.$('#alls:visible').length;
	},
	config: {
		childList: true,
		subtree: true
	},
	func: function(mutations) {
		var openChatWith = function(god_name, e) {
			e.preventDefault();
			e.stopPropagation();
			ui_utils.openChatWith(god_name);
		};
		for (var i = 0, len = mutations.length; i < len; i++) {
			if (mutations[i].addedNodes.length && ui_improver.currentAlly === ui_improver.currentAllyObserver) {
				var hero_name = document.querySelectorAll('#alls .opp_n')[ui_improver.currentAlly],
					motto_field = mutations[i].target.querySelector('.h_motto');
				hero_name.innerHTML = '<span class="hero_name">' + hero_name.textContent + '</span>';
				if (motto_field) {
					var special_motto = motto_field.textContent.match(/\[[^\]]+?\]/g);
					if (special_motto) {
						hero_name.insertAdjacentHTML('beforeend', '<span class="motto">' + special_motto.join('') + '</span>');
					}
				}
				var god_name = mutations[i].target.querySelector('.l_val').textContent;
				hero_name.title = god_name;
				if (god_name.match(ui_improver.friendsRegExp)) {
					hero_name.insertAdjacentHTML('beforeend', ' <a id="openchatwith' + ui_improver.currentAlly + '" title="' + worker.GUIp_i18n.open_chat_with + god_name + '">★</a>');
					document.getElementById('openchatwith' + ui_improver.currentAlly).onclick = openChatWith.bind(null, god_name);
				}
				ui_improver.currentAlly += 1;
				var match = mutations[i].target.id.match(/popover_opp_all(\d)/);
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