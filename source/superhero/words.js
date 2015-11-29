// words
window.GUIp = window.GUIp || {};

GUIp.words = {};

GUIp.words.currentPhrase = '';
// gets words from phrases.js file and splits them into sections
GUIp.words.init = function() {
	var sect, text, customSects = ['pets','chosen_monsters','special_monsters'];
	this.base = GUIp.getPhrases();
	for (sect in this.base.phrases) {
		text = GUIp.storage.get('CustomPhrases:' + sect);
		if (text && text !== "") {
			this.base.phrases[sect] = text.split("||");
		}
	}
	for (sect in customSects) {
		text = GUIp.storage.get('CustomWords:' + customSects[sect]);
		if (text && text !== "") {
			try {
				this.base[customSects[sect]] = JSON.parse(text);
			} catch (error) {
				console.log('Error while parsing custom words section "'+customSects[sect]+'", resetting...');
				GUIp.storage.remove('CustomWords:' + customSects[sect]);
			}
		}
	}
};
GUIp.words._changeFirstLetter = function(text) {
	return text.charAt(0).toLowerCase() + text.slice(1);
};
GUIp.words._addHeroName = function(text) {
	if (!GUIp.storage.get('Option:useHeroName')) { return text; }
	return GUIp.data.char_name + ', ' + GUIp.words._changeFirstLetter(text);
};
GUIp.words._addExclamation = function(text) {
	if (!GUIp.storage.get('Option:useExclamations')) { return text; }
	return GUIp.utils.getRandomItem(this.base.phrases.exclamation) + ', ' + GUIp.words._changeFirstLetter(text);
};
// single phrase gen
GUIp.words._randomPhrase = function(sect) {
	return GUIp.utils.getRandomItem(this.base.phrases[sect]);
};
GUIp.words._longPhrase_recursion = function(source, len) {
	while (source.length) {
		var next = GUIp.utils.popRandomItem(source);
		var remainder = len - next.length - 2; // 2 for ', '
		if (remainder > 0) {
			return [next].concat(GUIp.words._longPhrase_recursion(source, remainder));
		}
	}
	return [];
};
// main phrase constructor
GUIp.words.longPhrase = function(sect, item_name, len) {
	if (GUIp.storage.get('phrasesChanged')) {
		GUIp.words.init();
		GUIp.storage.set('phrasesChanged', 'false');
	}
	if (!GUIp.data.isFight && ['heal', 'pray', 'hit'].indexOf(sect) >= 0) {
		sect += '_field';
	}
	var prefix = GUIp.words._addHeroName(GUIp.words._addExclamation(''));
	var phrases;
	if (item_name) {
		phrases = [GUIp.words._randomPhrase(sect) + ' ' + item_name + '!'];
	} else if (GUIp.storage.get('Option:useShortPhrases') || sect.match(/go_/)) {
		phrases = [GUIp.words._randomPhrase(sect)];
	} else {
		phrases = GUIp.words._longPhrase_recursion(this.base.phrases[sect].slice(), (len || 100) - prefix.length);
	}
	this.currentPhrase = prefix ? prefix + GUIp.words._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
	return this.currentPhrase;
};
// inspect button phrase gen
GUIp.words.inspectPhrase = function(item_name) {
	return GUIp.words.longPhrase('inspect_prefix', item_name);
};
// craft button phrase gen
GUIp.words.craftPhrase = function(items) {
	return GUIp.words.longPhrase('craft_prefix', items);
};
// Checkers
GUIp.words.usableItemType = function(desc) {
	return this.base.usable_items.descriptions.indexOf(desc);
};
