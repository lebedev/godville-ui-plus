// ui_words
ui_words.currentPhrase = '';
// gets words from phrases.js file and splits them into sections
ui_words.init = function() {
	this.base = worker.GUIp_words();
	for (var sect in this.base.phrases) {
		var text = ui_storage.get('CustomPhrases:' + sect);
		if (text && text !== "") {
			this.base.phrases[sect] = text.split("||");
		}
	}
};
ui_words._changeFirstLetter = function(text) {
	return text.charAt(0).toLowerCase() + text.slice(1);
};
ui_words._addHeroName = function(text) {
	if (!ui_storage.get('Option:useHeroName')) { return text; }
	return ui_data.char_name + ', ' + this._changeFirstLetter(text);
};
ui_words._addExclamation = function(text) {
	if (!ui_storage.get('Option:useExclamations')) { return text; }
	return ui_utils.getRandomItem(this.base.phrases.exclamation) + ', ' + this._changeFirstLetter(text);
};
// single phrase gen
ui_words._randomPhrase = function(sect) {
	return ui_utils.getRandomItem(this.base.phrases[sect]);
};
ui_words._longPhrase_recursion = function(source, len) {
	while (source.length) {
		var next = ui_utils.popRandomItem(source);
		var remainder = len - next.length - 2; // 2 for ', '
		if (remainder > 0) {
			return [next].concat(this._longPhrase_recursion(source, remainder));
		}
	}
	return [];
};
// main phrase constructor
ui_words.longPhrase = function(sect, item_name, len) {
	if (ui_storage.get('phrasesChanged')) {
		ui_words.init();
		ui_storage.set('phrasesChanged', 'false');
	}
	var prefix = this._addHeroName(this._addExclamation(''));
	var phrases;
	if (item_name) {
		phrases = [this._randomPhrase(sect) + ' ' + item_name + '!'];
	} else if (ui_storage.get('Option:useShortPhrases') || sect.match(/go_/)) {
		phrases = [this._randomPhrase(sect)];
	} else {
		phrases = this._longPhrase_recursion(this.base.phrases[sect].slice(), (len || 100) - prefix.length);
	}
	this.currentPhrase = prefix ? prefix + this._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
	return this.currentPhrase;
};
// inspect button phrase gen
ui_words.inspectPhrase = function(item_name) {
	return this.longPhrase('inspect_prefix', item_name);
};
// craft button phrase gen
ui_words.craftPhrase = function(items) {
	return this.longPhrase('craft_prefix', items);
};
// Checkers
ui_words.usableItemType = function(desc) {
	return this.base.usable_items.descriptions.indexOf(desc);
};
ui_words.isHealItem = function(item) {
	return item.style.fontStyle === "italic";
};
ui_words.isUsableItem = function(item) {
	return item.textContent.match(/\(@\)/);
};
ui_words.isBoldItem = function(item) {
	return item.style.fontWeight === 700 || item.style.fontWeight === "bold";
};
