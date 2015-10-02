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
		'<div class="hint_bar_capt"><b>Godville UI+ (v' + ui_data.currentVersion + ')</b>, ' + worker.GUIp_i18n.help_dialog_capt + '</div>' +
		'<div class="hint_bar_content" style="padding: 0.5em 0.8em;">'+
			'<div style="text-align: left;">' +
				'<div>' + worker.GUIp_i18n.how_to_update + '</div>' +
				'<ol>' +
					worker.GUIp_i18n['help_update_' + worker.GUIp_browser] +
				'</ol>' +
				'<div>' + worker.GUIp_i18n.help_useful_links + '</div>' +
			'</div>' +
		'</div>' +
		'<div class="hint_bar_close"></div></div>'
	);

	if (ui_storage.get('helpDialogVisible')) { worker.$('#ui_help').show(); }
};
ui_help._createButtons = function() {
	var menu_bar = document.querySelector('#menu_bar ul');
	menu_bar.insertAdjacentHTML('beforeend', '| <li><a href="user/profile#ui_settings">' + worker.GUIp_i18n.ui_settings_top_menu + '</a></li> | <li></li>');
	ui_help._addToggleButton(menu_bar.lastElementChild, '<strong>' + worker.GUIp_i18n.ui_help + '</strong>');
	if (ui_storage.get('Option:enableDebugMode')) {
		ui_help._addDumpButton('<span>dump: </span>', 'all');
		ui_help._addDumpButton('<span>, </span>', 'options', 'Option');
		ui_help._addDumpButton('<span>, </span>', 'logger', 'Logger');
		ui_help._addDumpButton('<span>, </span>', 'forum', 'Forum');
		ui_help._addDumpButton('<span>, </span>', 'log', 'Log:');

		document.getElementsByClassName('hint_bar_content')[0].insertAdjacentHTML('beforeend', '<div><a class="devel_link" id="force_forum_check">force forum check</a></div>');
		document.getElementById('force_forum_check').onclick = ui_forum._check;
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
// gets dump button with a given label and selector
ui_help._addDumpButton = function(text, label, selector) {
	var hint_bar_content = document.getElementsByClassName('hint_bar_content')[0];
	hint_bar_content.insertAdjacentHTML('beforeend', text + '<a class="devel_link" id="dump_' + label + '">' + label + '</a>');
	document.getElementById('dump_' + label).onclick = function() {
		ui_storage.dump(selector);
	};
};
ui_help.toggleDialog = function(visible) {
	ui_storage.set('helpDialogVisible', !ui_storage.get('helpDialogVisible'));
	worker.$('#ui_help').slideToggle('slow');
};
