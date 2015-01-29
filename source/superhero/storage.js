// ui_storage
ui_storage._get_key = function(key) {
	return "GUIp_" + ui_data.god_name + ':' + key;
};
// gets diff with a value
ui_storage._diff = function(id, value) {
	var diff = null;
	var old = this.get(id);
	if (old !== null) {
		diff = value - old;
	}
	return diff;
};
// stores a value
ui_storage.set = function(id, value) {
	worker.localStorage[this._get_key(id)] = value;
	return value;
};
// reads a value
ui_storage.get = function(id) {
	var val = worker.localStorage[this._get_key(id)];
	if (val === 'true') { return true; }
	if (val === 'false') { return false; }
	return val;
};
// stores value and gets diff with old
ui_storage.set_with_diff = function(id, value) {
	var diff = this._diff(id, value);
	this.set(id, value);
	return diff;
};
// dumps all values related to current god_name
ui_storage.dump = function(selector) {
	var lines = [];
	var r = new RegExp('^GUIp_' + (selector === undefined ? '' : (ui_data.god_name + ':' + selector)));
	for (var i = 0; i < worker.localStorage.length; i++) {
		if (worker.localStorage.key(i).match(r)) {
			lines.push(worker.localStorage.key(i) + " = " + worker.localStorage[worker.localStorage.key(i)]);
		}
	}
	lines.sort();
	worker.console.info("Godville UI+ log: Storage:\n" + lines.join("\n"));
};
// resets saved options
ui_storage.clear = function(what) {
	if (!what.match(/^(?:GUIp|Godville|All)$/)) { return; }
	var i, len, key, keys = [];
	for (i = 0, len = worker.localStorage.length; i < len; i++) {
		key = worker.localStorage.key(i);
		if (what === 'GUIp' && key.match(/^GUIp_/) ||
			what === 'Godville' && !key.match(/^GUIp_/) ||
			what === 'All') {
			keys.push(key);
		}
	}
	for (i = 0, len = keys.length; i < len; i++) {
		worker.localStorage.removeItem(keys[i]);
	}
	location.reload();
};
ui_storage.migrate = function() {
	var i, len, lines = [];
	if (!worker.localStorage.GUIp_migrated) {
		for (i = 0, len = worker.localStorage.length; i < len; i++) {
			if (worker.localStorage.key(i).match(/^GM_/)) {
				lines.push(worker.localStorage.key(i));
			}
		}
		for (i = 0, len = lines.length; i < len; i++) {
			worker.localStorage[lines[i].replace(/^GM_/, 'GUIp_')] = worker.localStorage[lines[i]];
			worker.localStorage.removeItem(lines[i]);
		}
		worker.localStorage.GUIp_migrated = '151114';
	}
	if (worker.localStorage.GUIp_migrated === '151114' || worker.localStorage.GUIp_migrated < '150113') {
		if (this.get('phrases_walk_n')) {
			this.set('CustomPhrases:go_north', this.get('phrases_walk_n'));
			worker.localStorage.removeItem(this._get_key('phrases_walk_n'));
		}
		if (this.get('phrases_walk_e')) {
			this.set('CustomPhrases:go_east', this.get('phrases_walk_e'));
			worker.localStorage.removeItem(this._get_key('phrases_walk_e'));
		}
		if (this.get('phrases_walk_s')) {
			this.set('CustomPhrases:go_south', this.get('phrases_walk_s'));
			worker.localStorage.removeItem(this._get_key('phrases_walk_s'));
		}
		if (this.get('phrases_walk_w')) {
			this.set('CustomPhrases:go_west', this.get('phrases_walk_w'));
			worker.localStorage.removeItem(this._get_key('phrases_walk_w'));
		}
		for (i = 0, len = worker.localStorage.length; i < len; i++) {
			if (worker.localStorage.key(i).match(/:phrases_/)) {
				lines.push(worker.localStorage.key(i));
			}
		}
		for (i = 0, len = lines.length; i < len; i++) {
			worker.localStorage[lines[i].replace(/:phrases_/, ':CustomPhrases:')] = worker.localStorage[lines[i]];
			worker.localStorage.removeItem(lines[i]);
		}
		worker.localStorage.GUIp_migrated = '150113';
	}
};
