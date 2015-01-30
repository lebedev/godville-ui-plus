// ui_help_dialog
var ui_help_dialog;

if (window.wrappedJSObject) {
	ui_help_dialog = createObjectIn(worker.GUIp, {defineAs: "help_dialog"});
} else {
	ui_help_dialog = worker.GUIp.help_dialog = {};
}

// creates ui dialog
ui_help_dialog.create = function() {
	var menu_bar = document.querySelector('#menu_bar ul');
	menu_bar.insertAdjacentHTML('beforeend', '<li> | </li><a href="user/profile#ui_options">' + worker.GUIp_i18n.ui_settings_top_menu + '</a><li> | </li>');
	this.addToggleButton(menu_bar, '<strong>' + worker.GUIp_i18n.ui_help + '</strong>');
	document.getElementById('menu_bar').insertAdjacentHTML('afterend',
		'<div id="ui_help_dialog" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' +
		'<div class="hint_bar_capt"><b>Godville UI+ (v' + ui_data.currentVersion + ')</b>, ' + worker.GUIp_i18n.if_something_wrong_capt + '...</div>' +
		'<div class="hint_bar_content" style="padding: 0.5em 0.8em;">'+
			'<div style="text-align: left;">' +
				'<div>' + worker.GUIp_i18n.if_something_wrong + '</div>' +
				'<ol>' +
					'<li>' + worker.GUIp_i18n.help_refresh + '</li>' +
					'<li><div id="check_version" class="div_link" style="display: inline;">' + worker.GUIp_i18n.help_check_version + '</div></li>' +
					'<li class="update_required Chrome hidden">' + worker.GUIp_i18n.help_update_chrome_1 + '</li>' +
					'<li class="update_required Chrome hidden">' + worker.GUIp_i18n.help_update_chrome_2 + '</li>' +
					'<li class="update_required Firefox hidden">' + worker.GUIp_i18n.help_update_firefox_1 + '</li>' +
					'<li class="update_required Firefox hidden">' + worker.GUIp_i18n.help_update_firefox_2 + '</li>' +
					'<li class="update_required Chrome Firefox hidden">' + worker.GUIp_i18n.help_back_to_step_1 + '</li>' +
					'<li class="console Chrome Firefox hidden">' + worker.GUIp_i18n.help_console_1 + '</li>' +
					'<li class="console Chrome Firefox hidden">' + worker.GUIp_i18n.help_console_2 + '</li>' +
					'<li class="console Chrome Firefox hidden">' + worker.GUIp_i18n.help_console_3 + '</li>' +
				'</ol>' +
				'<div>' + worker.GUIp_i18n.help_useful_links + '</div>' +
			'</div>' +
		'</div>' +
		'<div class="hint_bar_close"></div></div>'
	);

	if (ui_storage.get('Option:enableDebugMode')) {
		this.addDumpButton('<span>dump: </span>', 'all');
		this.addDumpButton('<span>, </span>', 'options', 'Option');
		this.addDumpButton('<span>, </span>', 'stats', 'Stats');
		this.addDumpButton('<span>, </span>', 'logger', 'Logger');
		this.addDumpButton('<span>, </span>', 'forum', 'Forum');
		this.addDumpButton('<span>, </span>', 'log', 'Log:');
	}
	this.addToggleButton(document.getElementsByClassName('hint_bar_close')[0], worker.GUIp_i18n.close);
	if (ui_storage.get('helpDialogVisible')) { worker.$('#ui_help_dialog').show(); }
	document.getElementById('check_version').onclick = function() {
		this.textContent = worker.GUIp_i18n.getting_version_no;
		this.classList.remove('div_link');
		ui_utils.getXHR('/forums/show/' + (worker.GUIp_locale === 'ru' ? '2' : '1'), ui_help_dialog.onXHRSuccess, ui_help_dialog.onXHRFail);
		return false;
	};
};
ui_help_dialog.toggle = function(visible) {
	ui_storage.set('helpDialogVisible', !ui_storage.get('helpDialogVisible'));
	worker.$('#ui_help_dialog').slideToggle("slow");
};
ui_help_dialog.onXHRSuccess = function(xhr) {
	var match;
	if ((match = xhr.responseText.match(/Godville UI\+ (\d+\.\d+\.\d+\.\d+)/))) {
		var temp_cur = ui_data.currentVersion.split('.'),
			last_version = match[1],
			temp_last = last_version.split('.'),
			isNewest = +temp_cur[0] < +temp_last[0] ? false :
					   +temp_cur[0] > +temp_last[0] ? true :
					   +temp_cur[1] < +temp_last[1] ? false :
					   +temp_cur[1] > +temp_last[1] ? true :
					   +temp_cur[2] < +temp_last[2] ? false :
					   +temp_cur[2] > +temp_last[2] ? true :
					   +temp_cur[3] < +temp_last[3] ? false : true;
		worker.$('#check_version')[0].innerHTML = (isNewest ? worker.GUIp_i18n.is_last_version : worker.GUIp_i18n.is_not_last_version_1 + last_version + worker.GUIp_i18n.is_not_last_version_2) + worker.GUIp_i18n.proceed_to_next_step;
		if (!isNewest) {
			worker.$('#ui_help_dialog ol li.update_required.' + worker.GUIp_browser).removeClass('hidden');
		} else {
			worker.$('#ui_help_dialog ol li.console.' + worker.GUIp_browser).removeClass('hidden');
		}
	} else {
		ui_help_dialog.onXHRFail();
	}
};
ui_help_dialog.onXHRFail = function() {
	worker.$('#check_version')[0].textContent = worker.GUIp_i18n.getting_version_failed;
	worker.$('#ui_help_dialog ol li.' + worker.GUIp_browser).removeClass('hidden');
};
// gets toggle button
ui_help_dialog.addToggleButton = function(elem, text) {
	elem.insertAdjacentHTML('beforeend', '<a class="close_button">' + text + '</a>');
	elem.getElementsByClassName('close_button')[0].onclick = function() {
		ui_help_dialog.toggle();
		return false;
	};
};
// gets fump button with a given label and selector
ui_help_dialog.addDumpButton = function(text, label, selector) {
	var hint_bar_content = document.getElementsByClassName('hint_bar_content')[0];
	hint_bar_content.insertAdjacentHTML('beforeend', text + '<a class="devel_link" id="dump_' + label + '">' + label + '</a>');
	document.getElementById('dump_' + label).onclick = function() {
		ui_storage.dump(selector);
	};
};
