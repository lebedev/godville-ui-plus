// ui_words
var ui_words = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "words"}) : worker.GUIp.words = {};

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
	return ui_data.char_name + ', ' + ui_words._changeFirstLetter(text);
};
ui_words._addExclamation = function(text) {
	if (!ui_storage.get('Option:useExclamations')) { return text; }
	return ui_utils.getRandomItem(this.base.phrases.exclamation) + ', ' + ui_words._changeFirstLetter(text);
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
			return [next].concat(ui_words._longPhrase_recursion(source, remainder));
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
	if (!ui_data.isFight && ['heal', 'pray', 'hit'].indexOf(sect) >= 0) {
		sect += '_field';
	}
	var prefix = ui_words._addHeroName(ui_words._addExclamation(''));
	var phrases;
	if (item_name) {
		phrases = [ui_words._randomPhrase(sect) + ' ' + item_name + '!'];
	} else if (ui_storage.get('Option:useShortPhrases') || sect.match(/go_/)) {
		phrases = [ui_words._randomPhrase(sect)];
	} else {
		phrases = ui_words._longPhrase_recursion(this.base.phrases[sect].slice(), (len || 100) - prefix.length);
	}
	this.currentPhrase = prefix ? prefix + ui_words._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
	return this.currentPhrase;
};
// inspect button phrase gen
ui_words.inspectPhrase = function(item_name) {
	return ui_words.longPhrase('inspect_prefix', item_name);
};
// craft button phrase gen
ui_words.craftPhrase = function(items) {
	return ui_words.longPhrase('craft_prefix', items);
};
// Checkers
ui_words.usableItemType = function(desc) {
	return this.base.usable_items.descriptions.indexOf(desc);
};
