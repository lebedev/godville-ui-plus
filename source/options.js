(function() {
'use strict';

var doc = document;

var $id = function(id) {
    return doc.getElementById(id);
};

var $C = function(classname) {
    return doc.getElementsByClassName(classname);
};

var $q = function(selector) {
    return doc.querySelector(selector);
};

var setTextareaResize = function(id, inner_func) {
    var ta = $id(id);
    ta.onchange =
    ta.oncut =
    ta.onfocus =
    ta.oninput =
    ta.onpaste = function() {
        var rows = this.value.match(/\n/g);
        if (rows) {
            this.setAttribute('rows', rows.length + 1);
        }
        if (inner_func) { inner_func(); }
    };
};

var storage = {
    _get_key: function(key) {
        return "GUIp_" + god_name + ':' + key;
    },
    set: function(id, value) {
        localStorage.setItem(this._get_key(id), value);
        return value;
    },
    get: function(id) {
        var val = localStorage.getItem(this._get_key(id));
        if (val === 'true') { return true; }
        else if (val === 'false') { return false; }
        else { return val; }
    },
    remove: function(id) {
        localStorage.removeItem(this._get_key(id));
    },
    importSettings: function(options_string) {
        try {
            var options = JSON.parse(options_string);
            for (var key in options) {
                this.set(key, options[key]);
            }
            window.alert(GUIp.i18n.import_success);
            location.reload();
        } catch(e) {
            window.alert(GUIp.i18n.import_fail);
        }
    },
    exportSettings: function() {
        var options = {};
        for (var key in localStorage) {
            if (key.match(this._get_key('')) && !key.match(/Logger/)) {
                options[key.replace(this._get_key(''), '')] = localStorage.getItem(key);
            }
        }
        return JSON.stringify(options);
    }
};

function addMenu() {
    if (!god_name) { return; }
    if (!$id('guip_settings')) {
        var newNode;
        newNode = doc.createTextNode(' | ');
        $q('#profile_main p').appendChild(newNode);
        newNode = doc.createElement('a');
        newNode.id = 'guip_settings';
        newNode.href = '#guip_settings';
        newNode.textContent = GUIp.i18n.guip_settings;
        $q('#profile_main p').appendChild(newNode);
        $id('guip_settings').onclick = loadOptions;
    }
}

var setAllCheckboxesToState = function(classname, state) {
    var checkboxes = $C(classname);
    for (var i = 0, len = checkboxes.length; i < len; i++) {
        checkboxes[i].checked = state;
    }
};

function loadOptions() {
    if (!$id('profile_main')) {
        setTimeout(function() { loadOptions(); }, 100);
        return;
    }
    $id('profile_main').innerHTML = GUIp.getOptionsPage();
    setForm();
    restore_options();
    $id('forbidden_informers').onclick = function() {
        //jQuery('#informers').slideToggle("slow");
        $id('informers').style.display = $id('informers').style.display === 'none' ? 'block' : 'none';
    };
    $id('forbidden_craft').onclick = function() {
        //jQuery('#craft_categories').slideToggle("slow");
        $id('craft_categories').style.display = $id('craft_categories').style.display === 'none' ? 'block' : 'none';
    };
    $id('relocate_duel_buttons').onclick = function() {
        //jQuery('#relocate_duel_buttons_desc').slideToggle("slow");
        window.console.log($id('relocate_duel_buttons_desc').style.display === 'none' ? 'block' : 'none');
        $id('relocate_duel_buttons_desc').style.display = $id('relocate_duel_buttons_desc').style.display === 'none' ? 'block' : 'none';
        //jQuery('#relocate_duel_buttons_choice').slideToggle("slow");
        $id('relocate_duel_buttons_choice').style.display = $id('relocate_duel_buttons_choice').style.display === 'none' ? 'block' : 'none';
    };
    $id('forbidden_title_notices').onclick = function() {
        //jQuery('#forbidden_title_notices_desc').slideToggle("slow");
        $id('forbidden_title_notices_desc').style.display = $id('forbidden_title_notices_desc').style.display === 'none' ? 'block' : 'none';
        //jQuery('#forbidden_title_notices_choice').slideToggle("slow");
        $id('forbidden_title_notices_choice').style.display = $id('forbidden_title_notices_choice').style.display === 'none' ? 'block' : 'none';
    };
    $id('use_background').onclick = function() {
        //jQuery('#background_choice').slideToggle("slow");
        $id('background_choice').style.display = $id('background_choice').style.display === 'none' ? 'block' : 'none';
        //jQuery('#background_desc').slideToggle("slow");
        $id('background_desc').style.display = $id('background_desc').style.display === 'none' ? 'block' : 'none';
    };
    $id('custom_file').onclick = function() {
        $id('custom_background').click();
        $id('custom_file').value = '';
    };
    $id('custom_link').onclick = function() {
        $id('custom_background').click();
    };
    $id('voice_timeout').onclick = function() {
        //jQuery('#voice_timeout_choice').slideToggle("slow");
        $id('voice_timeout_choice').style.display = $id('voice_timeout_choice').style.display === 'none' ? 'block' : 'none';
        //jQuery('#voice_timeout_desc').slideToggle("slow");
        $id('voice_timeout_desc').style.display = $id('voice_timeout_desc').style.display === 'none' ? 'block' : 'none';
    };
    $id('freeze_voice_button').onclick = function() {
        //jQuery('#freeze_voice_button_choice').slideToggle("slow");
        $id('freeze_voice_button_choice').style.display = $id('freeze_voice_button_choice').style.display === 'none' ? 'block' : 'none';
        //jQuery('#freeze_voice_button_desc').slideToggle("slow");
        $id('freeze_voice_button_desc').style.display = $id('freeze_voice_button_desc').style.display === 'none' ? 'block' : 'none';
    };
    $id('informer_alerts_timeout').onclick = function() {
        $id('informer_alerts_timeout_choice').style.display = $id('informer_alerts_timeout_choice').style.display === 'none' ? 'block' : 'none';
        $id('informer_alerts_timeout_desc').style.display = $id('informer_alerts_timeout_desc').style.display === 'none' ? 'block' : 'none';
    };
    $id('custom_dungeon_chronicler').onclick = function() {
        $id('custom_dungeon_chronicler_choice').style.display = $id('custom_dungeon_chronicler_choice').style.display === 'none' ? 'block' : 'none';
        $id('custom_dungeon_chronicler_desc').style.display = $id('custom_dungeon_chronicler_desc').style.display === 'none' ? 'block' : 'none';
    };
    $id('disable_godville_clock').onclick = function() {
        $id('localtime_godville_clock_h').style.display = $id('disable_godville_clock').checked ? 'none' : 'block';
        $id('localtime_godville_clock_desc').style.display = $id('disable_godville_clock').checked ? 'none' : 'block';
    };
    $id('disable_logger').onclick = function() {
        $id('sum_allies_hp_h').style.display = $id('disable_logger').checked ? 'none' : 'block';
        $id('sum_allies_hp_desc').style.display = $id('disable_logger').checked ? 'none' : 'block';
    };
    $id('check_all').onclick = function() {
        setAllCheckboxesToState('item-informer', true);
        return false;
    };
    $id('uncheck_all').onclick = function() {
        setAllCheckboxesToState('item-informer', false);
        return false;
    };
    $id('disable_voice_generators').onclick = function() {
        //jQuery('#voice_menu').slideToggle("slow");
        $id('voice_menu').style.display = $id('voice_menu').style.display === 'none' ? 'block' : 'none';
        //jQuery('#words').slideToggle("slow");
        $id('words').style.display = $id('words').style.display === 'none' ? 'block' : 'none';
    };
    if (!storage.get('charIsMale')) {
        $q('#voice_menu .l_capt').textContent = $q('#voice_menu .l_capt').textContent.replace('героя', 'героини');
        $q('#voice_menu .g_desc').textContent = $q('#voice_menu .g_desc').textContent.replace('герою', 'героине');
    }

    setTextareaResize('ta_edit', setSaveWordsButtonState);

    setTextareaResize('user_css', setUserCSSSaveButtonState);

    $id('settings_import').onclick = function() {
        storage.importSettings($id('guip_settings').value);
    };
    $id('settings_export').onclick = function() {
        $id('guip_settings').value = storage.exportSettings();
    };
    $id('span_tamable').onclick = createLightbox.bind(null,'pets');
    $id('span_chosen').onclick = createLightbox.bind(null,'chosen_monsters');
    $id('span_special').onclick = createLightbox.bind(null,'special_monsters');
}

function setForm() {
    for (var sect in def.phrases) {
        addOnClick(sect);
    }
    $id('save_words').onclick = function() { saveWords(); return false; };
    $id('save_options').onclick = function() { saveOptions(); return false; };
    $id('set_default').onclick = function() { delete_custom_words(); return false; };
    $id('save_user_css').onclick = function() { saveUserCSS(); return false; };
}

function addOnClick(sect) {
    $id('l_' + sect).onclick = function() {
        setText(sect);
        return false;
    };
}

function delete_custom_words() {
    var ta = $id('ta_edit'),
        text = def.phrases[curr_sect];
    ta.setAttribute('rows', text.length);
    ta.value = text.join('\n');
    storage.remove('CustomPhrases:' + curr_sect);
    storage.set('phrasesChanged', 'true');
    setSaveWordsButtonState();
    setDefaultWordsButtonState(false);
}

function saveWords() {
    var text = $id('ta_edit').value;
    if (text === "") { return; }
    var t_list = text.split("\n"),
        t_out = [];
    for (var i = 0; i < t_list.length; i++) {
        if (t_list[i] !== '') {
            t_out.push(t_list[i]);
        }
    }
    storage.set('CustomPhrases:' + curr_sect, t_out.join('||'));
    storage.set('phrasesChanged', 'true');
    setSaveWordsButtonState();
    setDefaultWordsButtonState(true);
}

function saveOptions() {
    //jQuery('#general_settings_spinner').show();
    $id('general_settings_spinner').style.display = 'inline';

    var i, len, option_checkboxes = $C('option-checkbox');
    for (i = 0, len = option_checkboxes.length; i < len; i++) {
        var id = option_checkboxes[i].id;
        // id = "first_second_third" to option_name = "firstSecondThird"
        var parts = id.split('_');
        for (var k = 1; k < parts.length; k++) {
            parts[k] = parts[k][0].toUpperCase() + parts[k].slice(1);
        }
        var option_name = parts.join('');
        storage.set('Option:' + option_name, option_checkboxes[i].checked);
    }

    if ($id('relocate_duel_buttons').checked) {
        var buttons = [];
        if ($id('relocate_arena').checked) { buttons.push('arena'); }
        if ($id('relocate_chf').checked) { buttons.push('chf'); }
        storage.set('Option:relocateDuelButtons', buttons.join());
    } else {
        storage.set('Option:relocateDuelButtons', '');
    }

    if ($id('forbidden_title_notices').checked) {
        var notices = [];
        if (!$id('title_notice_pm').checked) { notices.push('pm'); }
        if (!$id('title_notice_gm').checked) { notices.push('gm'); }
        if (!$id('title_notice_fi').checked) { notices.push('fi'); }
        storage.set('Option:forbiddenTitleNotices', notices.join());
    } else {
        storage.set('Option:forbiddenTitleNotices', '');
    }

    if ($id('use_background').checked) {
        if ($id('custom_background').checked) {
            var custom_file = $id('custom_file').files[0],
                custom_link = $id('custom_link').value.match(/https?:\/\/.*/),
                cb_status = $id('cb_status');
            if (custom_file && custom_file.type.match(/^image\/(bmp|cis\-cod|gif|ief|jpeg|jpg|pipeg|png|svg\+xml|tiff|x\-cmu\-raster|x\-cmx|x\-icon|x\-portable\-anymap|x\-portable\-bitmap|x\-portable\-graymap|x\-portable\-pixmap|x\-rgb|x\-xbitmap|x\-xpixmap|x\-xwindowdump)$/i)) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    storage.set('Option:useBackground', e.target.result);
                };
                reader.readAsDataURL(custom_file);
                cb_status.textContent = GUIp.i18n.bg_status_file;
                cb_status.style.color = 'green';
            } else if (custom_link) {
                cb_status.textContent = GUIp.i18n.bg_status_link;
                cb_status.style.color = 'green';
                storage.set('Option:useBackground', custom_link);
            } else if (storage.get('Option:useBackground') && storage.get('Option:useBackground') !== 'cloud') {
                cb_status.textContent = GUIp.i18n.bg_status_same;
                cb_status.style.color = 'blue';
            } else {
                cb_status.textContent = GUIp.i18n.bg_status_error;
                cb_status.style.color = 'red';
                setTimeout(function() {
                    $id('cloud_background').click();
                }, 150);
                storage.set('Option:useBackground', 'cloud');
            }
            //jQuery('#cb_status').fadeIn();
            $id('cb_status').style.display = 'block';
            setTimeout(function() {
                //jQuery('#cb_status').fadeOut();
                $id('cb_status').style.display = 'none';
            }, 1000);
        }
        else if ($id('cloud_background').checked) {
            storage.set('Option:useBackground', 'cloud');
        }
    } else {
        storage.set('Option:useBackground', '');
    }

    if ($id('voice_timeout').checked) {
        var voice_timeout = $id('voice_timeout_value').value;
        if (parseInt(voice_timeout) > 0) {
            storage.set('Option:voiceTimeout', voice_timeout);
        } else {
            $id('voice_timeout_value').value = '20';
            $id('voice_timeout').click();
            storage.set('Option:voiceTimeout', '');
        }
    } else {
        storage.set('Option:voiceTimeout', '');
    }

    if ($id('freeze_voice_button').checked) {
        var cases = [];
        if ($id('freeze_after_voice').checked) { cases.push('after_voice'); }
        if ($id('freeze_when_empty').checked) { cases.push('when_empty'); }
        storage.set('Option:freezeVoiceButton', cases.join());
    } else {
        storage.set('Option:freezeVoiceButton', '');
    }

    if ($id('informer_alerts_timeout').checked) {
        var informer_alerts_timeout = $id('informer_alerts_timeout_value').value;
        if (parseInt(informer_alerts_timeout) >= 0) {
            storage.set('Option:informerAlertsTimeout', parseInt(informer_alerts_timeout));
        } else {
            $id('informer_alerts_timeout_value').value = '5';
            $id('informer_alerts_timeout').click();
            storage.set('Option:informerAlertsTimeout', '');
        }
    } else {
        storage.set('Option:informerAlertsTimeout', '');
    }

    if ($id('custom_dungeon_chronicler').checked) {
        var custom_dungeon_chronicler = $id('custom_dungeon_chronicler_value').value;
        if (custom_dungeon_chronicler.length >= 3) {
            storage.set('Option:customDungeonChronicler', custom_dungeon_chronicler);
        } else {
            $id('custom_dungeon_chronicler_value').value = '';
            $id('custom_dungeon_chronicler').click();
            storage.set('Option:customDungeonChronicler', '');
        }
    } else {
        storage.set('Option:customDungeonChronicler', '');
    }

    if (!$id('forbidden_informers').checked) {
        setAllCheckboxesToState('informer-checkbox', true);
    }
    if (!$id('forbidden_craft').checked) {
        setAllCheckboxesToState('craft-checkbox', true);
    }
    $id('smelt!').checked = $id('smelter').checked;
    $id('transform!').checked = $id('transformer').checked;
    var forbiddenInformers = [],
        fiCheckboxes = $C('informer-checkbox');
    for (i = 0, len = fiCheckboxes.length; i < len; i++) {
        if (!fiCheckboxes[i].checked) {
            forbiddenInformers.push(fiCheckboxes[i].id);
        }
    }
    storage.set('Option:forbiddenInformers', forbiddenInformers.join());
    var forbiddenCraft = [],
        fcCheckboxes = $C('craft-checkbox');
    for (i = 0, len = fcCheckboxes.length; i < len; i++) {
        if (!fcCheckboxes[i].checked) {
            forbiddenCraft.push(fcCheckboxes[i].id);
        }
    }
    storage.set('Option:forbiddenCraft', forbiddenCraft.join());

    //jQuery('#general_settings_spinner').fadeOut('slow');
    setTimeout(function() {
        $id('general_settings_spinner').style.display = 'none';
    }, 300);

    set_theme_and_background();

    storage.set('optionsChanged', true);
}

function setSaveWordsButtonState() {
    var save_words = $id('save_words');
    if ($id('ta_edit').value.replace(/\n/g, '||') !== (storage.get('CustomPhrases:' + curr_sect) || def.phrases[curr_sect].join('||'))) {
        save_words.removeAttribute('disabled');
    } else {
        save_words.setAttribute('disabled', 'disabled');
    }
}

function setDefaultWordsButtonState(condition) {
    var set_default = $id('set_default');
    if (condition) {
        set_default.removeAttribute('disabled');
    } else {
        set_default.setAttribute('disabled', 'disabled');
    }
}

function setText(sect) {
    curr_sect = sect;
    if ($q('#words a.selected')) { $q('#words a.selected').classList.remove('selected'); }
    $q('#words a#l_' + curr_sect).classList.add('selected');
    var text_list = storage.get('CustomPhrases:' + curr_sect),
        text = text_list ? text_list.split('||') : def.phrases[curr_sect],
        textarea = $id('ta_edit');
    textarea.removeAttribute('disabled');
    textarea.setAttribute('rows', text.length);
    textarea.value = text.join('\n');
    setSaveWordsButtonState();
    setDefaultWordsButtonState(text_list);
}

function saveUserCSS() {
    storage.set('UserCss', $id('user_css').value);
    storage.set('UserCssChanged', true);
    setUserCSSSaveButtonState();
}

function setUserCSSSaveButtonState() {
    var save_user_css = $id('save_user_css');
    if ($id('user_css').value !== storage.get('UserCss')) {
        save_user_css.removeAttribute('disabled');
    } else {
        save_user_css.setAttribute('disabled', 'disabled');
    }
}

// Restores select box state to saved value from localStorage
function restore_options() {
    var i, len, r = new RegExp('^' + storage._get_key('Option:'));
    for (i = 0, len = localStorage.length; i < len; i++) {
        if (localStorage.key(i).match(r)) {
            var option = localStorage.key(i).replace(r, '');
            if (storage.get(localStorage.key(i).replace(storage._get_key(''), ''))) {
                var pos;
                while ((pos = option.indexOf(option.match('[A-Z]'))) !== -1) {
                    option = option.slice(0, pos) + '_' + option.charAt(pos).toLowerCase() + option.slice(pos + 1);
                }
                if ($id(option)) {
                    $id(option).checked = true;
                }
            }
        }
    }

    if ($id('relocate_duel_buttons').checked) {
        //jQuery('#relocate_duel_buttons_desc').hide();
        $id('relocate_duel_buttons_desc').style.display = 'none';
        var buttons = storage.get('Option:relocateDuelButtons');
        if (buttons.match('arena')) { $id('relocate_arena').checked = true; }
        if (buttons.match('chf')) { $id('relocate_chf').checked = true; }
    } else {
        //jQuery('#relocate_duel_buttons_choice').hide();
        $id('relocate_duel_buttons_choice').style.display = 'none';
    }
    if ($id('forbidden_title_notices').checked) {
        //jQuery('#forbidden_title_notices_desc').hide();
        $id('forbidden_title_notices_desc').style.display = 'none';
        var notices = storage.get('Option:forbiddenTitleNotices');
        if (notices.match('pm')) { $id('title_notice_pm').checked = false; }
        if (notices.match('gm')) { $id('title_notice_gm').checked = false; }
        if (notices.match('fi')) { $id('title_notice_fi').checked = false; }
    } else {
        //jQuery('#forbidden_title_notices_choice').hide();
        $id('forbidden_title_notices_choice').style.display = 'none';
    }
    if ($id('use_background').checked) {
        //jQuery('#background_desc').hide();
        $id('background_desc').style.display = 'none';
        var bg = storage.get('Option:useBackground');
        if (bg !== 'cloud') {
            $id('custom_background').click();
        }
    } else {
        //jQuery('#background_choice').hide();
        $id('background_choice').style.display = 'none';
    }
    if ($id('voice_timeout').checked) {
        //jQuery('#voice_timeout_desc').hide();
        $id('voice_timeout_desc').style.display = 'none';
        $id('voice_timeout_value').value = storage.get('Option:voiceTimeout');
    } else {
        //jQuery('#voice_timeout_choice').hide();
        $id('voice_timeout_choice').style.display = 'none';
        $id('voice_timeout_value').value = '20';
    }
    if ($id('freeze_voice_button').checked) {
        //jQuery('#freeze_voice_button_desc').hide();
        $id('freeze_voice_button_desc').style.display = 'none';
        var cases = storage.get('Option:freezeVoiceButton');
        if (cases.match('after_voice')) { $id('freeze_after_voice').checked = true; }
        if (cases.match('when_empty')) { $id('freeze_when_empty').checked = true; }
    } else {
        //jQuery('#freeze_voice_button_choice').hide();
        $id('freeze_voice_button_choice').style.display = 'none';
    }
    if ($id('informer_alerts_timeout').checked) {
        $id('informer_alerts_timeout_desc').style.display = 'none';
        $id('informer_alerts_timeout_value').value = storage.get('Option:informerAlertsTimeout');
    } else {
        $id('informer_alerts_timeout_choice').style.display = 'none';
        $id('informer_alerts_timeout_value').value = '5';
    }
    if ($id('custom_dungeon_chronicler').checked) {
        $id('custom_dungeon_chronicler_desc').style.display = 'none';
        $id('custom_dungeon_chronicler_value').value = storage.get('Option:customDungeonChronicler');
    } else {
        $id('custom_dungeon_chronicler_choice').style.display = 'none';
        $id('custom_dungeon_chronicler_value').value = '';
    }
    if ($id('disable_godville_clock').checked) {
        $id('localtime_godville_clock_h').style.display = 'none';
        $id('localtime_godville_clock_desc').style.display = 'none';
    } else {
        $id('localtime_godville_clock_h').style.display = 'block';
        $id('localtime_godville_clock_desc').style.display = 'block';
    }
    if ($id('disable_logger').checked) {
        $id('sum_allies_hp_h').style.display = 'none';
        $id('sum_allies_hp_desc').style.display = 'none';
    } else {
        $id('sum_allies_hp_h').style.display = 'block';
        $id('sum_allies_hp_desc').style.display = 'block';
    }
    var forbiddenInformers = storage.get('Option:forbiddenInformers');
    if (forbiddenInformers) {
        var fiArray = forbiddenInformers.split(','),
            fiCheckboxes = $C('informer-checkbox');
        for (i = 0, len = fiCheckboxes.length; i < len; i++) {
            if (fiArray.indexOf(fiCheckboxes[i].id) === -1) {
                fiCheckboxes[i].checked = true;
            }
        }
    } else {
        setAllCheckboxesToState('informer-checkbox', true);
        //jQuery('#informers').hide();
        $id('informers').style.display = 'none';
    }
    var forbiddenCraft = storage.get('Option:forbiddenCraft');
    if (forbiddenCraft) {
        var fcArray = forbiddenCraft.split(','),
            fcCheckboxes = $C('craft-checkbox');
        for (i = 0, len = fcCheckboxes.length; i < len; i++) {
            if (fcArray.indexOf(fcCheckboxes[i].id) === -1) {
                fcCheckboxes[i].checked = true;
            }
        }
    } else {
        setAllCheckboxesToState('craft-checkbox', true);
        //jQuery('#craft_categories').hide();
        $id('craft_categories').style.display = 'none';
    }
    if ($id('disable_voice_generators').checked) {
        //jQuery('#voice_menu').hide();
        $id('voice_menu').style.display = 'none';
        //jQuery('#words').hide();
        $id('words').style.display = 'none';
    }

    $id('user_css').value = storage.get('UserCss') || '';
}

function improve_blocks() {
    var blocks = document.querySelectorAll('.bl_cell:not(.block), #pant_tbl:not(.block)');
    for (var i = 0, len = blocks.length; i < len; i++) {
        blocks[i].classList.add('block');
    }
}

function set_theme_and_background() {
    var guip_s_css = document.getElementById('guip_s_css');
    if (guip_s_css) {
        guip_s_css.parentNode.removeChild(guip_s_css);
    }
    GUIp.addCSSFromURL('/stylesheets/' + storage.get('ui_s') + '.css', 'guip_s_css');
    var background = storage.get('Option:useBackground');
    if (background === 'cloud') {
        document.body.style.backgroundImage = 'url(' + GUIp.getResource('images/background.jpg') + ')';
    } else {
        document.body.style.backgroundImage =  background ? 'url(' + background + ')' : '';
    }
}

var createLightbox = function(lbType) {
    var inheight, lightbox = document.createElement("div"),
        dimmer = document.createElement("div");

    lightbox.id = 'optlightbox';
    dimmer.id = 'optdimmer';

    var lbtitle = 'test lightbox title';

    lightbox.innerHTML = '<div class="bl_cell block">' +
'            <div id="lightbox_title" class="bl_capt"></div>' +
'            <div class="bl_content" style="text-align: center; padding-top: 0.9em;">' +
'                <div id="lightbox_desc" style="text-align: left;" class="new_line"></div>' +
'                <div class="new_line">' +
'                    <textarea id="lightbox_input" class="rounded_field" rows="10" wrap="virtual;" style="width: 98%; resize: none;"></textarea>' +
'                </div>' +
'                <input id="lightbox_save" class="input_btn" type="submit" value="' + GUIp.i18n.lb_save + '" disabled>' +
'                <input id="lightbox_reset" class="input_btn" type="button" value="' + GUIp.i18n.lb_reset + '" disabled>' +
'                <input id="lightbox_close" class="input_btn" type="button" value="' + GUIp.i18n.lb_close + '">' +
'            </div>' +
'        </div>';

    document.body.appendChild(lightbox);
    document.body.appendChild(dimmer);

    var setLightboxTA = function(lbType, lbData) {
        var i, len, lbInput = $id('lightbox_input');
        lbInput.value = '';
        if (lbType !== 'pets') {
            for (i = 0, len = lbData.length; i < len; i++) {
                lbInput.value += lbData[i] + '\n';
            }
        } else {
            for (i = 0, len = lbData.length; i < len; i++) {
                lbInput.value += lbData[i].name + '|' + lbData[i].min_level + '\n';
            }
        }
    };

    var loadLightbox = function(lbType) {
        var lbData = storage.get('CustomWords:' + lbType);
        if (lbData && lbData !== "") {
            try {
                lbData = JSON.parse(lbData);
            } catch (error) {
                lbData = [];
            }
            setLightboxTA(lbType,lbData);
            $id('lightbox_reset').disabled = false;
        } else {
            setLightboxTA(lbType,def[lbType]);
        }
    };

    var saveLightbox = function(lbType) {
        var item, parsed = [],
            values = $id('lightbox_input').value.split('\n');
        storage.remove('CustomWords:' + lbType);
        for (var i = 0, len = values.length; i < len; i++) {
            if (lbType === 'pets') {
                item = values[i].toLowerCase().split('|');
                if (item.length > 1 && item[0].trim().length && !isNaN(parseInt(item[1]))) {
                    parsed.push({name: item[0].trim(), min_level: parseInt(item[1])});
                }
            } else {
                item = values[i].replace('|','').toLowerCase().trim();
                if (item.length > 1) {
                    parsed.push(item);
                }
            }
        }
        if (parsed.length) {
            storage.set('CustomWords:' + lbType, JSON.stringify(parsed));
            setLightboxTA(lbType,parsed);
            $id('lightbox_save').disabled = true;
        } else {
            resetLightbox(lbType); // fixme: show error of some kind instead of silently resetting
        }
    };

    var resetLightbox = function(lbType) {
        setLightboxTA(lbType,def[lbType]);
        storage.remove('CustomWords:' + lbType);
        $id('lightbox_save').disabled = true;
        $id('lightbox_reset').disabled = true;
    };

    var changedLightbox = function(lbType) {
        $id('lightbox_save').disabled = false;
        $id('lightbox_reset').disabled = false;
    };

    $id('lightbox_title').textContent = GUIp.i18n['lb_' + lbType + '_title'];
    $id('lightbox_desc').innerHTML = GUIp.i18n['lb_' + lbType + '_desc'];

    loadLightbox(lbType);

    inheight = lightbox.getElementsByClassName('bl_cell')[0].scrollHeight;

    lightbox.style.width = '400px';
    lightbox.style.height = inheight + 'px';

    lightbox.style.visibility = 'visible';
    lightbox.style.left = window.innerWidth/2 - 200 + 'px';
    lightbox.style.top = window.innerHeight/2 - (inheight / 2) + window.scrollY + 'px';

    var scrollLightbox = function() {
        lightbox.style.left = window.innerWidth/2 - 200 + 'px';
        lightbox.style.top = window.innerHeight/2 - (inheight / 2) + window.scrollY + 'px';
    };
    var destroyLightbox = function() {
        document.body.removeChild(dimmer);
        document.body.removeChild(lightbox);
        document.removeEventListener('scroll', scrollLightbox);
    };

    document.addEventListener('scroll', scrollLightbox);
    $id('lightbox_input').oninput = changedLightbox.bind(null);
    $id('lightbox_save').onclick = saveLightbox.bind(null,lbType);
    $id('lightbox_reset').onclick = resetLightbox.bind(null,lbType);
    $id('lightbox_close').onclick = dimmer.onclick = destroyLightbox.bind(null);

    return false;
};

var def, curr_sect, god_name;

var starterInt = setInterval(function() {
    if (GUIp.browser && GUIp.i18n && GUIp.addCSSFromURL) {
        def = GUIp.getPhrases();
        clearInterval(starterInt);

        var greetings = $id('menu_top').textContent;
        god_name = greetings.match(localStorage.getItem('GUIp:lastGodname'))[0] ||
                   greetings.match(localStorage.getItem('GUIp:godnames'))[0];

        addMenu();
        if (location.hash === "#guip_settings") {
            loadOptions();
        }
        if (GUIp.browser !== 'Opera') {
            GUIp.addCSSFromURL(GUIp.getResource('options.css'), 'guip_options_css');
        }
        set_theme_and_background();
        improve_blocks();
        // Event and Listeners
        document.addEventListener("DOMNodeInserted", function() {
            if (!$q('#profile_main p').textContent.match(GUIp.i18n.guip_settings.replace('+', '\\+'))) {
                setTimeout(function() { addMenu(); }, 0);
            }
            improve_blocks();
        });
    }
}, 100);

})();
