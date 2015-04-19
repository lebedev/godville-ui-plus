// ui_inventory
var ui_inventory = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "inventory"}) : worker.GUIp.inventory = {};

ui_inventory.observer = {
	config: {
		childList: true,
		attributes: true,
		subtree: true,
		attributeFilter: ['style']
	},
	func: function(mutations) {
		ui_observers.mutationChecker(mutations, function(mutation) {
			return mutation.target.tagName.toLowerCase() === 'li' && mutation.type === "attributes" &&
				   mutation.target.style.display === 'none' && mutation.target.parentNode ||
				   mutation.target.tagName.toLowerCase() === 'ul' && mutation.addedNodes.length;
		}, ui_inventory._update);
	},
	target: ['#inventory ul']
};
ui_inventory.init = function() {
	if (ui_data.isFight) {
		return;
	}
	ui_inventory._createCraftButtons();
	ui_inventory._update();
	ui_observers.start(ui_inventory.observer);
};
ui_inventory._createCraftButtons = function() {
	var invContent = document.querySelector('#inventory .block_content');
	invContent.insertAdjacentHTML('beforeend', '<span class="craft_button span">' + worker.GUIp_i18n.craft_verb + ':</span>');
	invContent.insertBefore(ui_inventory._createCraftButton(worker.GUIp_i18n.b_b, 'b_b', worker.GUIp_i18n.b_b_hint), null);
	invContent.insertBefore(ui_inventory._createCraftButton(worker.GUIp_i18n.b_r, 'b_r', worker.GUIp_i18n.b_r_hint), null);
	invContent.insertBefore(ui_inventory._createCraftButton(worker.GUIp_i18n.r_r, 'r_r', worker.GUIp_i18n.r_r_hint), null);
};
ui_inventory._createInspectButton = function(item_name) {
	var a = document.createElement('a');
	a.className = 'inspect_button';
	a.title = worker.GUIp_i18n.ask1 + ui_data.char_sex[0] + worker.GUIp_i18n.inspect + item_name;
	a.textContent = '?';
	a.onclick = ui_inventory._inspectButtonClick.bind(null, item_name);
	return a;
};
ui_inventory._inspectButtonClick = function(item_name) {
	ui_utils.setVoice(ui_words.inspectPhrase(worker.GUIp_i18n.trophy + item_name));
	return false;
};
ui_inventory._createCraftButton = function(combo, combo_list, hint) {
	var a = document.createElement('a');
	a.className = 'craft_button ' + combo_list;
	a.title = worker.GUIp_i18n.ask2 + ui_data.char_sex[0] + worker.GUIp_i18n.craft1 + hint + worker.GUIp_i18n.craft2;
	a.innerHTML = combo;
	a.onclick = ui_inventory._craftButtonClick.bind(null, combo_list);
	return a;
};
ui_inventory._craftButtonClick = function(combo_list) {
	var rand = Math.floor(Math.random()*ui_inventory[combo_list].length),
		items = ui_inventory[combo_list][rand];
	ui_utils.setVoice(ui_words.craftPhrase(items));
	return false;
};
ui_inventory._update = function() {
	var i, len, item, flags = [],
		bold_items = 0,
		trophy_boldness = {},
		forbidden_craft = ui_storage.get('Option:forbiddenCraft') || '';

	for (i = 0, len = ui_words.base.usable_items.types.length; i < len; i++) {
		flags[i] = false;
	}

	// Parse items
	for (var item_name in worker.so.state.inventory) {
		item = worker.so.state.inventory[item_name];
		// color items and add buttons
		if (item.description) { // usable item
			var sect = ui_words.usableItemType(item.description);
			bold_items++;
			if (sect !== -1) {
				flags[sect] = true;
			} else if (!ui_utils.hasShownInfoMessage) {
				ui_utils.hasShownInfoMessage = true;
				ui_utils.showMessage('info', {
					title: worker.GUIp_i18n.unknown_item_type_title,
					content: '<div>' + worker.GUIp_i18n.unknown_item_type_content + '<b>"' + item.description + '</b>"</div>'
				});
			}
			if (!(forbidden_craft.match('usable') || (forbidden_craft.match('b_b') && forbidden_craft.match('b_r')))) {
				trophy_boldness[item_name] = true;
			}
		} else if (item.type === 'heal_potion') { // healing item
			if (!item.isImproved) {
				item.li[0].classList.add('heal_item');
			}
			if (!(forbidden_craft.match('heal') || (forbidden_craft.match('b_r') && forbidden_craft.match('r_r')))) {
				trophy_boldness[item_name] = false;
			}
		} else {
			if (item.price === 101) { // bold item
				bold_items++;
				if (!(forbidden_craft.match('b_b') && forbidden_craft.match('b_r')) &&
					!item_name.match('золотой кирпич') && !item_name.match(' босса ')) {
					trophy_boldness[item_name] = true;
				}
			} else {
				if (!(forbidden_craft.match('b_r') && forbidden_craft.match('r_r')) &&
					!item_name.match('пушистого триббла')) {
					trophy_boldness[item_name] = false;
				}
			}
			if (!item.isImproved) {
				item.li[0].insertBefore(ui_inventory._createInspectButton(item_name), null);
			}
		}
		item.isImproved = true;
	}

	for (i = 0, len = flags.length; i < len; i++) {
		ui_informer.update(ui_words.base.usable_items.types[i], flags[i]);
	}
	ui_informer.update('transform!', flags[ui_words.base.usable_items.types.indexOf('transformer')] && bold_items >= 2);
	ui_informer.update('smelt!', flags[ui_words.base.usable_items.types.indexOf('smelter')] && ui_storage.get('Stats:Gold') >= 3000);

	ui_inventory._updateCraftCombos(trophy_boldness);
};
ui_inventory._updateCraftCombos = function(trophy_boldness) {
	// Склейка трофеев, формирование списков
	ui_inventory.b_b = [];
	ui_inventory.b_r = [];
	ui_inventory.r_r = [];
	var item_names = worker.Object.keys(trophy_boldness).sort(),
		forbidden_craft = ui_storage.get('Option:forbiddenCraft') || '';
	if (item_names.length) {
		for (var i = 0, len = item_names.length - 1; i < len; i++) {
			for (var j = i + 1; j < len + 1; j++) {
				if (item_names[i][0] === item_names[j][0]) {
					if (trophy_boldness[item_names[i]] && trophy_boldness[item_names[j]]) {
						if (!forbidden_craft.match('b_b')) {
							ui_inventory._pushItemCombo('b_b', item_names[i], item_names[j]);
						}
					} else if (!trophy_boldness[item_names[i]] && !trophy_boldness[item_names[j]]) {
						if (!forbidden_craft.match('r_r')) {
							ui_inventory._pushItemCombo('r_r', item_names[i], item_names[j]);
						}
					} else {
						if (!forbidden_craft.match('b_r')) {
							ui_inventory._pushItemCombo('b_r', item_names[i], item_names[j]);
						}
					}
				} else {
					break;
				}
			}
		}
	}
	ui_improver.calculateButtonsVisibility();
};
ui_inventory._pushItemCombo = function(combo, first, second) {
	ui_inventory[combo].push(first + worker.GUIp_i18n.and + second);
	ui_inventory[combo].push(second + worker.GUIp_i18n.and + first);
};