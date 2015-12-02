// help
window.GUIp = window.GUIp || {};

GUIp.help = {};

GUIp.help.init = function() {
    GUIp.help._createHelpDialog();
    GUIp.help._createButtons();
};
// creates ui dialog
GUIp.help._createHelpDialog = function() {
    document.getElementById('menu_bar').insertAdjacentHTML('afterend',
        '<div id="guip_help" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' +
        '<div class="hint_bar_capt"><b>Godville UI+ (v' + GUIp.data.currentVersion + ')</b>, ' + GUIp.i18n.help_dialog_capt + '</div>' +
        '<div class="hint_bar_content" style="padding: 0.5em 0.8em;">'+
            '<div style="text-align: left;">' +
                '<div>' + GUIp.i18n.how_to_update + '</div>' +
                '<ol>' +
                    GUIp.i18n['help_update_' + GUIp.browser] +
                '</ol>' +
                '<div>' + GUIp.i18n.help_useful_links + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="hint_bar_close"></div></div>'
    );

    if (GUIp.storage.get('helpDialogVisible')) { document.getElementById('guip_help').style.display = 'block'; }
};
GUIp.help._createButtons = function() {
    var menu_bar = document.querySelector('#menu_bar ul');
    menu_bar.insertAdjacentHTML('beforeend', '| <li><a href="user/profile#guip_settings">' + GUIp.i18n.guip_settings_top_menu + '</a></li> | <li></li>');
    GUIp.help._addToggleButton(menu_bar.lastElementChild, '<strong>' + GUIp.i18n.guip_help + '</strong>');
    if (GUIp.storage.get('Option:enableDebugMode')) {
        GUIp.help._addDumpButton('<span>dump: </span>', 'all');
        GUIp.help._addDumpButton('<span>, </span>', 'options', 'Option');
        GUIp.help._addDumpButton('<span>, </span>', 'logger', 'Logger');
        GUIp.help._addDumpButton('<span>, </span>', 'forum', 'Forum');
        GUIp.help._addDumpButton('<span>, </span>', 'log', 'Log:');

        document.querySelector('#guip_help .hint_bar_content').insertAdjacentHTML('beforeend', '<div><a class="devel_link" id="force_forum_check">force forum check</a></div>');
        document.getElementById('force_forum_check').onclick = GUIp.forum._check;
    }
    GUIp.help._addToggleButton(document.querySelector('#guip_help .hint_bar_close'), GUIp.i18n.close);
};
// gets toggle button
GUIp.help._addToggleButton = function(elem, text) {
    elem.insertAdjacentHTML('beforeend', '<a class="close_button">' + text + '</a>');
    elem.getElementsByClassName('close_button')[0].onclick = function() {
        GUIp.help.toggleDialog();
        return false;
    };
};
// gets dump button with a given label and selector
GUIp.help._addDumpButton = function(text, label, selector) {
    var hint_bar_content = document.querySelector('#guip_help .hint_bar_content');
    hint_bar_content.insertAdjacentHTML('beforeend', text + '<a class="devel_link" id="dump_' + label + '">' + label + '</a>');
    document.getElementById('dump_' + label).onclick = function() {
        GUIp.storage.dump(selector);
    };
};
GUIp.help.toggleDialog = function(visible) {
    GUIp.storage.set('helpDialogVisible', !GUIp.storage.get('helpDialogVisible'));
    window.$('#guip_help').slideToggle('slow');
};
