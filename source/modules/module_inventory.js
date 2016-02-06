// inventory
window.GUIp = window.GUIp || {};

GUIp.inventory = {};

GUIp.inventory.observer = {
    config: {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ['style']
    },
    func: function(mutations) {
        GUIp.observers.mutationChecker(mutations, function(mutation) {
            return mutation.target.tagName.toLowerCase() === 'li' && mutation.type === "attributes" &&
                   mutation.target.style.display === 'none' && mutation.target.parentNode ||
                   mutation.target.tagName.toLowerCase() === 'ul' && mutation.addedNodes.length;
        }, GUIp.inventory._update);
    },
    target: ['#inventory ul']
};
GUIp.inventory.init = function() {
    if (!GUIp.stats.isField()) {
        return;
    }
    GUIp.inventory._createCraftButtons();
    GUIp.inventory._update();
    GUIp.observers.start(GUIp.inventory.observer);
};
GUIp.inventory._createCraftButtons = function() {
    var invContent = document.querySelector('#inventory .block_content');
    invContent.insertAdjacentHTML('beforeend', '<span class="craft_button span">' + GUIp.i18n.craft_verb + ':</span>');
    invContent.insertBefore(GUIp.inventory._createCraftButton(GUIp.i18n.b_b, 'b_b', GUIp.i18n.b_b_hint), null);
    invContent.insertBefore(GUIp.inventory._createCraftButton(GUIp.i18n.b_r, 'b_r', GUIp.i18n.b_r_hint), null);
    invContent.insertBefore(GUIp.inventory._createCraftButton(GUIp.i18n.r_r, 'r_r', GUIp.i18n.r_r_hint), null);
};
GUIp.inventory._createInspectButton = function(item_name) {
    var a = document.createElement('a');
    a.className = 'inspect_button';
    a.title = GUIp.i18n.ask1 + GUIp.data.char_sex[0] + GUIp.i18n.inspect + item_name;
    a.textContent = '?';
    a.onclick = GUIp.inventory._inspectButtonClick.bind(null, item_name);
    return a;
};
GUIp.inventory._inspectButtonClick = function(item_name) {
    GUIp.utils.setVoice(GUIp.words.inspectPhrase(GUIp.i18n.trophy + item_name));
    return false;
};
GUIp.inventory._createCraftButton = function(combo, combo_list, hint) {
    var a = document.createElement('a');
    a.className = 'craft_button ' + combo_list;
    a.title = GUIp.i18n.ask2 + GUIp.data.char_sex[0] + GUIp.i18n.craft1 + hint + GUIp.i18n.craft2;
    a.innerHTML = combo;
    a.onclick = GUIp.inventory._craftButtonClick.bind(null, combo_list);
    return a;
};
GUIp.inventory._craftButtonClick = function(combo_list) {
    var rand = Math.floor(Math.random()*GUIp.inventory[combo_list].length),
        items = GUIp.inventory[combo_list][rand];
    GUIp.utils.setVoice(GUIp.words.craftPhrase(items));
    return false;
};
GUIp.inventory._update = function() {
    var i, len, item, flags = [],
        bold_items = 0,
        trophy_boldness = {},
        forbidden_craft = GUIp.storage.get('Option:forbiddenCraft') || '';

    for (i = 0, len = GUIp.words.base.usableItemTypes.length; i < len; i++) {
        flags[i] = false;
    }

    // Parse items
    for (var item_name in window.so.state.inventory) {
        item = window.so.state.inventory[item_name];
        // color items and add buttons
        if (item.description) { // usable item
            var typeIndex = GUIp.words.getUsableItemTypeOf(item);
            bold_items++;
            if (typeIndex !== -1) {
                flags[typeIndex] = true;
            } else if (!~GUIp.utils.messagesShown.indexOf('info')) {
                GUIp.utils.showMessage('info', {
                    title: GUIp.i18n.unknown_item_type_title,
                    content: '<div>' + GUIp.i18n.unknown_item_type_content + '<b>"' + item.description + '</b>"</div>'
                });
            }
            if (!(forbidden_craft.match('usable') || (forbidden_craft.match('b_b') && forbidden_craft.match('b_r')))) {
                trophy_boldness[item_name] = true;
            }
        } else if (item.type === 'heal_potion') { // healing item
            // if item quantity has increased, it seems that class needs to be re-added again
            item.li[0].classList.add('heal_item');

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
                item.li[0].insertBefore(GUIp.inventory._createInspectButton(item_name), null);
            }
        }
        item.isImproved = true;
    }

    for (i = 0, len = flags.length; i < len; i++) {
        GUIp.informer.update(GUIp.words.base.usableItemTypes[i].name, flags[i]);
    }
    var typeNames = GUIp.words.base.usableItemTypes.map(function(aType) { return aType.name; });
    GUIp.informer.update('transform!', flags[typeNames.indexOf('transformer')] && bold_items >= 2);
    GUIp.informer.update('smelt!', flags[typeNames.indexOf('smelter')] && GUIp.stats.Gold() >= 3000);

    GUIp.inventory._updateCraftCombos(trophy_boldness);
};
GUIp.inventory._updateCraftCombos = function(trophy_boldness) {
    // Склейка трофеев, формирование списков
    GUIp.inventory.b_b = [];
    GUIp.inventory.b_r = [];
    GUIp.inventory.r_r = [];
    var item_names = Object.keys(trophy_boldness).sort(),
        forbidden_craft = GUIp.storage.get('Option:forbiddenCraft') || '';
    if (item_names.length) {
        for (var i = 0, len = item_names.length - 1; i < len; i++) {
            for (var j = i + 1; j < len + 1; j++) {
                if (item_names[i][0] === item_names[j][0]) {
                    if (trophy_boldness[item_names[i]] && trophy_boldness[item_names[j]]) {
                        if (!forbidden_craft.match('b_b')) {
                            GUIp.inventory._pushItemCombo('b_b', item_names[i], item_names[j]);
                        }
                    } else if (!trophy_boldness[item_names[i]] && !trophy_boldness[item_names[j]]) {
                        if (!forbidden_craft.match('r_r')) {
                            GUIp.inventory._pushItemCombo('r_r', item_names[i], item_names[j]);
                        }
                    } else {
                        if (!forbidden_craft.match('b_r')) {
                            GUIp.inventory._pushItemCombo('b_r', item_names[i], item_names[j]);
                        }
                    }
                } else {
                    break;
                }
            }
        }
    }
    GUIp.improver.calculateButtonsVisibility();
};
GUIp.inventory._pushItemCombo = function(combo, first, second) {
    GUIp.inventory[combo].push(first + GUIp.i18n.and + second);
    GUIp.inventory[combo].push(second + GUIp.i18n.and + first);
};

GUIp.inventory.loaded = true;
