// Main code
var objects = [ui_data, ui_utils, ui_timeout, ui_help_dialog, ui_storage, ui_words, ui_stats, ui_logger,
			   ui_informer, ui_forum, ui_improver, ui_laying_timer, ui_observers, ui_starter];
for (var i = 0, len = objects.length; i < len; i++) {
	ui_trycatcher.process(objects[i]);
}
for (var observer in ui_observers) {
	ui_trycatcher.process(ui_observers[observer]);
}
var starterInt = setInterval(ui_starter.start, 200);