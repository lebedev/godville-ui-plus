var worker = window.wrappedJSObject || window;

var ui_data, ui_utils, ui_timeout, ui_help_dialog, ui_storage, ui_words, ui_stats, ui_logger,
	ui_informer, ui_forum, ui_improver, ui_laying_timer, ui_observers, ui_trycatcher, ui_starter;

if (window.wrappedJSObject) {
	worker.GUIp = createObjectIn(worker);
	ui_data = createObjectIn(worker.GUIp, {defineAs: "data"});
	ui_utils = createObjectIn(worker.GUIp, {defineAs: "utils"});
	ui_timeout = createObjectIn(worker.GUIp, {defineAs: "timeout"});
	ui_help_dialog = createObjectIn(worker.GUIp, {defineAs: "help_dialog"});
	ui_storage = createObjectIn(worker.GUIp, {defineAs: "storage"});
	ui_words = createObjectIn(worker.GUIp, {defineAs: "words"});
	ui_stats = createObjectIn(worker.GUIp, {defineAs: "stats"});
	ui_logger = createObjectIn(worker.GUIp, {defineAs: "logger"});
	ui_informer = createObjectIn(worker.GUIp, {defineAs: "informer"});
	ui_forum = createObjectIn(worker.GUIp, {defineAs: "forum"});
	ui_improver = createObjectIn(worker.GUIp, {defineAs: "improver"});
	ui_laying_timer = createObjectIn(worker.GUIp, {defineAs: "laying_timer"});
	ui_observers = createObjectIn(worker.GUIp, {defineAs: "observers"});
	ui_trycatcher = createObjectIn(worker.GUIp, {defineAs: "trycatcher"});
	ui_starter = createObjectIn(worker.GUIp, {defineAs: "starter"});
} else {
	worker.GUIp = {};
	ui_data = worker.GUIp.data = {};
	ui_utils = worker.GUIp.utils = {};
	ui_timeout = worker.GUIp.timeout = {};
	ui_help_dialog = worker.GUIp.help_dialog = {};
	ui_storage = worker.GUIp.storage = {};
	ui_words = worker.GUIp.words = {};
	ui_stats = worker.GUIp.stats = {};
	ui_logger = worker.GUIp.logger = {};
	ui_informer = worker.GUIp.informer = {};
	ui_forum = worker.GUIp.forum = {};
	ui_improver = worker.GUIp.improver = {};
	ui_laying_timer = worker.GUIp.laying_timer = {};
	ui_observers = worker.GUIp.observers = {};
	ui_trycatcher = worker.GUIp.trycatcher = {};
	ui_starter = worker.GUIp.starter = {};
}
