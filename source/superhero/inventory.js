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
		}, ui_inventory.update);
	},
	target: ['#inventory ul']
};

ui_inventory.init = function() {
	if (ui_data.isFight) {
		return;
	}
	ui_inventory._createCraftButtons();
	ui_inventory.update();
	ui_observers.start(ui_inventory.observer);
};
ui_inventory._createCraftButtons = function() {
	var inv_content = document.querySelector('#inventory .block_content');
	inv_content.insertAdjacentHTML('beforeend', '<span class="craft_button span">' + worker.GUIp_i18n.craft_verb + ':</span>');
	inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.b_b, 'b_b', worker.GUIp_i18n.b_b_hint), null);
	inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.b_r, 'b_r', worker.GUIp_i18n.b_r_hint), null);
	inv_content.insertBefore(ui_utils.createCraftButton(worker.GUIp_i18n.r_r, 'r_r', worker.GUIp_i18n.r_r_hint), null);
};
ui_inventory.update = function() {
	var i, j, len, item, flags = [],
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
				item.li[0].insertBefore(ui_utils.createInspectButton(item_name), null);
			}
		}
		item.isImproved = true;
	}

	for (i = 0, len = flags.length; i < len; i++) {
		ui_informer.update(ui_words.base.usable_items.types[i], flags[i]);
	}
	ui_informer.update('transform!', flags[ui_words.base.usable_items.types.indexOf('transformer')] && bold_items >= 2);
	ui_informer.update('smelt!', flags[ui_words.base.usable_items.types.indexOf('smelter')] && ui_storage.get('Stats:Gold') >= 3000);

	// Склейка трофеев, формирование списков
	ui_inventory.b_b = [];
	ui_inventory.b_r = [];
	ui_inventory.r_r = [];
	var item_names = worker.Object.keys(trophy_boldness).sort();
	if (item_names.length) {
		for (i = 0, len = item_names.length - 1; i < len; i++) {
			for (j = i + 1; j < len + 1; j++) {
				if (item_names[i][0] === item_names[j][0]) {
					if (trophy_boldness[item_names[i]] && trophy_boldness[item_names[j]]) {
						if (!forbidden_craft.match('b_b')) {
							ui_inventory.b_b.push(item_names[i] + worker.GUIp_i18n.and + item_names[j]);
							ui_inventory.b_b.push(item_names[j] + worker.GUIp_i18n.and + item_names[i]);
						}
					} else if (!trophy_boldness[item_names[i]] && !trophy_boldness[item_names[j]]) {
						if (!forbidden_craft.match('r_r')) {
							ui_inventory.r_r.push(item_names[i] + worker.GUIp_i18n.and + item_names[j]);
							ui_inventory.r_r.push(item_names[j] + worker.GUIp_i18n.and + item_names[i]);
						}
					} else {
						if (!forbidden_craft.match('b_r')) {
							if (trophy_boldness[item_names[i]]) {
								ui_inventory.b_r.push(item_names[i] + worker.GUIp_i18n.and + item_names[j]);
							} else {
								ui_inventory.b_r.push(item_names[j] + worker.GUIp_i18n.and + item_names[i]);
							}
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