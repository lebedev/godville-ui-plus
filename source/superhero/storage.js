// ui_storage
var ui_storage = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "storage"}) : worker.GUIp.storage = {};

ui_storage._get_key = function(key) {
	return 'GUIp_' + ui_data.god_name + ':' + key;
};
// gets diff with a value
ui_storage._diff = function(id, value) {
	var diff = null;
	var old = ui_storage.get(id);
	if (old !== null) {
		diff = value - old;
	}
	return diff;
};
// stores a value
ui_storage.set = function(id, value) {
	localStorage.setItem(ui_storage._get_key(id), value);
	return value;
};
// reads a value
ui_storage.get = function(id) {
	var val = localStorage.getItem(ui_storage._get_key(id));
	if (val === 'true') { return true; }
	if (val === 'false') { return false; }
	return val;
};
// deletes single item from storage
ui_storage.remove = function(id) {
	return localStorage.removeItem(ui_storage._get_key(id));
};
// stores value and gets diff with old
ui_storage.set_with_diff = function(id, value) {
	var diff = ui_storage._diff(id, value);
	ui_storage.set(id, value);
	return diff;
};
// dumps all values related to current god_name
ui_storage.dump = function(selector) {
	var lines = [],
		regexp = '^GUIp_' + (selector ? (ui_data.god_name + ':' + selector) : '');
	for (var key in localStorage) {
		if (key.match(regexp)) {
			lines.push(key + ' = ' + localStorage.getItem(key));
		}
	}
	lines.sort();
	worker.console.info('Godville UI+ log: Storage:\n' + lines.join('\n'));
};
// resets saved options
ui_storage.clear = function(what) {
	if (!what || !what.match(/^(?:GUIp|Godville|All)$/)) {
		if (worker.GUIp_locale === 'ru') {
			worker.console.log('Godville UI+: использование storage.clear:\n' +
							   'storage.clear("GUIp") для удаление только настроек Godville UI+\n' +
							   'storage.clear("Godville") для удаления настроек Годвилля, сохранив настройки Godville UI+\n' +
							   'storage.clear("All") для удаления всех настроек');
		} else {
			worker.console.log('Godville UI+: storage.clear usage:\n' +
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
ui_storage._rename = function(from, to) {
	for (var key in localStorage) {
		if (key.match(from)) {
			localStorage.setItem(key.replace(from, to), localStorage.getItem(key));
			localStorage.removeItem(key);
		}
	}
};
ui_storage._delete = function(regexp) {
	for (var key in localStorage) {
		if (key.match(/^GUIp_/) && key.match(regexp)) {
			localStorage.removeItem(key);
		}
	}
};
ui_storage.migrate = function() {
};
ui_storage._migratedAt = function(date) {
	var lastMigrationDate = localStorage.getItem('GUIp:migrated');
	if (lastMigrationDate && lastMigrationDate < date) {
		localStorage.setItem('GUIp:migrated', date);
		return true;
	} else {
		return false;
	}
};
