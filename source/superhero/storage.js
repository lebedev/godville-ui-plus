// storage
window.GUIp = window.GUIp || {};

GUIp.storage = {};

GUIp.storage._get_key = function(key) {
	return 'GUIp_' + GUIp.data.god_name + ':' + key;
};
// gets diff with a value
GUIp.storage._diff = function(id, value) {
	var diff = null;
	var old = GUIp.storage.get(id);
	if (old !== null) {
		diff = value - old;
	}
	return diff;
};
// stores a value
GUIp.storage.set = function(id, value) {
	localStorage.setItem(GUIp.storage._get_key(id), value);
	return value;
};
// reads a value
GUIp.storage.get = function(id) {
	var val = localStorage.getItem(GUIp.storage._get_key(id));
	if (val === 'true') { return true; }
	if (val === 'false') { return false; }
	return val;
};
// deletes single item from storage
GUIp.storage.remove = function(id) {
	return localStorage.removeItem(GUIp.storage._get_key(id));
};
// stores value and gets diff with old
GUIp.storage.set_with_diff = function(id, value) {
	var diff = GUIp.storage._diff(id, value);
	GUIp.storage.set(id, value);
	return diff;
};
// dumps all values related to current god_name
GUIp.storage.dump = function(selector) {
	var lines = [],
		regexp = '^GUIp[_:]' + (selector ? (GUIp.data.god_name + ':' + selector) : '');
	for (var key in localStorage) {
		if (key.match(regexp)) {
			lines.push(key + ' = ' + localStorage.getItem(key));
		}
	}
	lines.sort();
	console.info('Godville UI+ log: Storage:\n' + lines.join('\n'));
};
// resets saved options
GUIp.storage.clear = function(what) {
	if (!what || !what.match(/^(?:GUIp|Godville|All)$/)) {
		if (GUIp.locale === 'ru') {
			console.log('Godville UI+: использование storage.clear:\n' +
							   'storage.clear("GUIp") для удаление только настроек Godville UI+\n' +
							   'storage.clear("Godville") для удаления настроек Годвилля, сохранив настройки Godville UI+\n' +
							   'storage.clear("All") для удаления всех настроек');
		} else {
			console.log('Godville UI+: storage.clear usage:\n' +
							   'storage.clear("GUIp") to remove Godville UI+ setting only\n' +
							   'storage.clear("Godville") to remove Godville setting and keep Godville UI+ settings\n' +
							   'storage.clear("All") to remove all setting');
		}
		return;
	}
	for (var key in localStorage) {
		if (what === 'GUIp' && key.match(/^GUIp_/) ||
			what === 'Godville' && !key.match(/^GUIp_/) ||
			what === 'All') {
			localStorage.removeItem(key);
		}
	}
	location.reload();
};
GUIp.storage._rename = function(from, to) {
	for (var key in localStorage) {
		if (key.match(from)) {
			localStorage.setItem(key.replace(from, to), localStorage.getItem(key));
			localStorage.removeItem(key);
		}
	}
};
GUIp.storage._delete = function(regexp) {
	for (var key in localStorage) {
		if (key.match(/^GUIp/) && key.match(regexp)) {
			localStorage.removeItem(key);
		}
	}
};
GUIp.storage.migrate = function() {
	if (!GUIp.storage._migratedAt('151009')) {
		localStorage.removeItem('GUIp_migrated');
		localStorage.removeItem('GUIp_CurrentUser');

		var godnames = [],
		    godname;
		for(var key in localStorage) {
			if (key.match(/^GUIp_([^:]+)/)) {
				godname = key.match(/^GUIp_([^:]+)/)[1];
				if (godname && !~godnames.indexOf(godname)) {
					godnames.push(godname);
				}
			}
		}
		localStorage.setItem('GUIp:godnames', godnames.join('|'));
	}
};
GUIp.storage._migratedAt = function(date) {
	var lastMigratedAt = localStorage.getItem('GUIp:lastMigratedAt');
	if (lastMigratedAt && lastMigratedAt < date) {
		localStorage.setItem('GUIp:lastMigratedAt', date);
		return true;
	} else {
		return false;
	}
};
GUIp.storage.isNewProfile = function(godname) {
	return !~(localStorage.getItem('GUIp:godnames') || '').split('|').indexOf(godname);
};
GUIp.storage.addToNames = function(godname) {
	var godnames = localStorage.getItem('GUIp:godnames');
	localStorage.setItem('GUIp:godnames', (godnames ? godnames + '|' : '') + godname);
};