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
	localStorage[ui_storage._get_key(id)] = value;
	return value;
};
// reads a value
ui_storage.get = function(id) {
	var val = localStorage[ui_storage._get_key(id)];
	if (val === 'true') { return true; }
	if (val === 'false') { return false; }
	return val;
};
// stores value and gets diff with old
ui_storage.set_with_diff = function(id, value) {
	var diff = ui_storage._diff(id, value);
	ui_storage.set(id, value);
	return diff;
};
// dumps all values related to current god_name
ui_storage.dump = function(selector) {
	var lines = [];
	var r = new worker.RegExp('^GUIp_' + (selector === undefined ? '' : (ui_data.god_name + ':' + selector)));
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).match(r)) {
			lines.push(localStorage.key(i) + ' = ' + localStorage[localStorage.key(i)]);
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
			worker.console.log('Godville UI+: storage.clean usage:\n' +
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
			localStorage[key.replace(from, to)] = localStorage[key];
			localStorage.removeItem(key);
		}
	}
};
ui_storage._rename_nesw = function(from, to) {
	if (ui_storage.get('phrases_walk_' + from)) {
		ui_storage.set('CustomPhrases:go_' + to, ui_storage.get('phrases_walk_' + from));
		localStorage.removeItem(ui_storage._get_key('phrases_walk_' + from));
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
	if (!localStorage.GUIp_migrated) {
		ui_storage._rename(/^GM/, 'GUIp_');
		localStorage.GUIp_migrated = '141115';
	}
	if (localStorage.GUIp_migrated < '150113') {
		ui_storage._rename_nesw('n', 'north');
		ui_storage._rename_nesw('e', 'east');
		ui_storage._rename_nesw('s', 'south');
		ui_storage._rename_nesw('w', 'west');
		ui_storage._rename(/:phrases_/, ':CustomPhrases:');
		localStorage.GUIp_migrated = '150113';
	}
	if (localStorage.GUIp_migrated < '150228') {
		ui_storage._rename(/:thirdEye(.+)Entry/, ':ThirdEye:$1');
		localStorage.GUIp_migrated = '150228';
	}
	if (localStorage.GUIp_migrated < '150419') {
		var forum;
		for (var i = 1; i <= (worker.GUIp_locale === 'ru' ? 6 : 4); i++) {
			forum = JSON.parse(ui_storage.get('Forum' + i));
			for (var topic in forum) {
				if (!isNaN(forum[topic])) {
					forum[topic] = { posts: forum[topic], date: 0 };
				}
			}
			ui_storage.set('Forum' + i, JSON.stringify(forum));
		}
		localStorage.GUIp_migrated = '150419';
	}
	if (localStorage.GUIp_migrated < '150419_2') {
		var forum2;
		for (var key in localStorage) {
			if (key.match('Forum\\d')) {
				forum2 = JSON.parse(localStorage[key]);
				for (var topic2 in forum2) {
					if (!isNaN(forum2[topic2])) {
						forum2[topic2] = { posts: forum2[topic2], date: 0 };
					}
				}
				localStorage[key] = JSON.stringify(forum2);
			}
		}
		localStorage.GUIp_migrated = '150419_2';
	}
	if (localStorage.GUIp_migrated < '150510') {
		ui_storage._delete(':Stats:');
		localStorage.GUIp_migrated = '150510';
	}
};
