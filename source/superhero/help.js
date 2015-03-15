// ui_help
var ui_help = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "help"}) : worker.GUIp.help = {};

ui_help.init = function() {
	ui_help._createHelpDialog();
	ui_help._createButtons();
};
// creates ui dialog
ui_help._createHelpDialog = function() {
	document.getElementById('menu_bar').insertAdjacentHTML('afterend',
		'<div id="ui_help" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' +
		'<div class="hint_bar_capt"><b>Godville UI+ (v' + ui_data.currentVersion + ')</b>, ' + worker.GUIp_i18n.if_something_wrong_capt + '...</div>' +
		'<div class="hint_bar_content" style="padding: 0.5em 0.8em;">'+
			'<div style="text-align: left;">' +
				'<div>' + worker.GUIp_i18n.if_something_wrong + '</div>' +
				'<ol>' +
					'<li>' + worker.GUIp_i18n.help_refresh + '</li>' +
					'<li><div id="check_version" class="div_link" style="display: inline;">' + worker.GUIp_i18n.help_check_version + '</div></li>' +
					'<li class="update_required Firefox hidden">' + worker.GUIp_i18n.help_update_firefox_1 + '</li>' +
					'<li class="update_required Firefox hidden">' + worker.GUIp_i18n.help_update_firefox_2 + '</li>' +
					'<li class="update_required Chrome hidden">' + worker.GUIp_i18n.help_update_chrome_1 + '</li>' +
					'<li class="update_required Chrome hidden">' + worker.GUIp_i18n.help_update_chrome_2 + '</li>' +
					'<li class="update_required Opera hidden">' + worker.GUIp_i18n.help_update_opera_1 + '</li>' +
					'<li class="update_required Opera hidden">' + worker.GUIp_i18n.help_update_opera_2 + '</li>' +
					'<li class="update_required Chrome Firefox Opera hidden">' + worker.GUIp_i18n.help_back_to_step_1 + '</li>' +
					'<li class="console Chrome Firefox Opera hidden">' + worker.GUIp_i18n.help_console_1 + '</li>' +
					'<li class="console Chrome Firefox Opera hidden">' + worker.GUIp_i18n.help_console_2 + '</li>' +
					'<li class="console Chrome Firefox Opera hidden">' + worker.GUIp_i18n.help_console_3 + '</li>' +
				'</ol>' +
				'<div>' + worker.GUIp_i18n.help_useful_links + '</div>' +
			'</div>' +
		'</div>' +
		'<div class="hint_bar_close"></div></div>'
	);

	document.getElementById('check_version').onclick = function() {
		this.textContent = worker.GUIp_i18n.getting_version_no;
		this.classList.remove('div_link');
		ui_utils.checkVersion(ui_help.checkVersionCallback.bind(null, false, true), // failed = false, isNewest = true
							  ui_help.checkVersionCallback.bind(null, false, false),// failed = false, isNewest = false
							  ui_help.checkVersionCallback.bind(null, true));		// failed = true
		return false;
	};

	if (ui_storage.get('helpDialogVisible')) { worker.$('#ui_help').show(); }
};
ui_help._createButtons = function() {
	var menu_bar = document.querySelector('#menu_bar ul');
	menu_bar.insertAdjacentHTML('beforeend', '<li> | </li><a href="user/profile#ui_options">' + worker.GUIp_i18n.ui_settings_top_menu + '</a><li> | </li>');
	ui_help._addToggleButton(menu_bar, '<strong>' + worker.GUIp_i18n.ui_help + '</strong>');
	if (ui_storage.get('Option:enableDebugMode')) {
		ui_help._addDumpButton('<span>dump: </span>', 'all');
		ui_help._addDumpButton('<span>, </span>', 'options', 'Option');
		ui_help._addDumpButton('<span>, </span>', 'stats', 'Stats');
		ui_help._addDumpButton('<span>, </span>', 'logger', 'Logger');
		ui_help._addDumpButton('<span>, </span>', 'forum', 'Forum');
		ui_help._addDumpButton('<span>, </span>', 'log', 'Log:');
	}
	ui_help._addToggleButton(document.getElementsByClassName('hint_bar_close')[0], worker.GUIp_i18n.close);
};
// gets toggle button
ui_help._addToggleButton = function(elem, text) {
	elem.insertAdjacentHTML('beforeend', '<a class="close_button">' + text + '</a>');
	elem.getElementsByClassName('close_button')[0].onclick = function() {
		ui_help.toggleDialog();
		return false;
	};
};
// gets fump button with a given label and selector
ui_help._addDumpButton = function(text, label, selector) {
	var hint_bar_content = document.getElementsByClassName('hint_bar_content')[0];
	hint_bar_content.insertAdjacentHTML('beforeend', text + '<a class="devel_link" id="dump_' + label + '">' + label + '</a>');
	document.getElementById('dump_' + label).onclick = function() {
		ui_storage.dump(selector);
	};
};
ui_help.checkVersionCallback = function(failed, isNewest) {
	document.getElementById('check_version').innerHTML = failed ? worker.GUIp_i18n.getting_version_failed
																: (isNewest ? worker.GUIp_i18n.is_last_version
																			: worker.GUIp_i18n.is_not_last_version_1 + last_version + worker.GUIp_i18n.is_not_last_version_2
																  ) + worker.GUIp_i18n.proceed_to_next_step;
	var selector = '#ui_help ol li.' + failed ? worker.GUIp_browser
											  : isNewest ? 'console'
														 : 'update_required.' + worker.GUIp_browser;
	var steps = document.querySelectorAll(selector);
	for (var i = 0, len = steps.length; i < len; i++) {
		steps[i].classList.remove('hidden');
	}
};
ui_help.toggleDialog = function(visible) {
	ui_storage.set('helpDialogVisible', !ui_storage.get('helpDialogVisible'));
	worker.$('#ui_help').slideToggle("slow");
};
