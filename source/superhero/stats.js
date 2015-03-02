// ui_stats
var ui_stats = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "stats"}) : worker.GUIp.stats = {};

ui_stats.get = function(key) {
	return ui_storage.get('Stats:' + key);
};
ui_stats.set = function(key, value) {
	return ui_storage.set('Stats:' + key, value);
};
ui_stats.setFromLabelCounter = function(id, $container, label, parser) {
	parser = parser || parseInt;
	return ui_stats.set(id, parser(ui_utils.findLabel($container, label).siblings('.l_val').text()));
};