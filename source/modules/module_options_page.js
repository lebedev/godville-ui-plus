// options_page
window.GUIp = window.GUIp || {};

GUIp.options_page = {};

GUIp.options_page.init = function() {};

GUIp.options_page.get = function() {
var isEN = GUIp.locale === 'en',
    isOpera = GUIp.browser === 'opera';
return '<p>\n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=settings\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + GUIp.i18n.profile_menu_settings + '</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=informers\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + GUIp.i18n.profile_menu_informers + '</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=gadgets\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + GUIp.i18n.profile_menu_gadgets + '</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=invites\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + GUIp.i18n.profile_menu_invites + '</a> | \n' +
'<a href="/user/profile/plogs">' + GUIp.i18n.profile_menu_plogs + '</a> | ' + GUIp.i18n.guip_settings + '</p>\n' +
'<div id="pant_spn">\n' +
'    <img align="middle" alt="Spinner" border="0" id="spinner_prof" src="/images/spinner.gif" style="vertical-align: bottom; display: none; ">\n' +
'</div>\n' +
'<div id="central_block_my_page" style="width: 36%;">\n' +
'    <div id="general_settings">\n' +
'        <div class="bl_cell">\n' +
'            <div class="bl_capt">' + GUIp.i18n.guip_settings_capt + '</div>\n' +
'            <div id="add_general" class="bl_content">\n' +
'                <div class="new_line" style="margin-bottom: 0.8em;">\n' +
'                    <label class="l_capt" for="disable_voice_generators">' + GUIp.i18n.disable_voice_generators + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_voice_generators" name="disable_voice_generators" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div style="clear: left; text-align: center;" id="voice_menu">\n' +
'                    <div class="new_line">\n' +
'                        <label class="l_capt" for="use_hero_name">' + GUIp.i18n.use_hero_name + '</label>\n' +
'                        <div class="field_content">\n' +
'                            <input id="use_hero_name" name="use_hero_name" class="option-checkbox" type="checkbox">\n' +
'                        </div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <div class="g_desc">' + GUIp.i18n.use_hero_name_desc + '</div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <label class="l_capt" for="use_exclamations">' + GUIp.i18n.use_exclamatios + '</label>\n' +
'                        <div class="field_content">\n' +
'                            <input id="use_exclamations" name="use_exclamations" class="option-checkbox" type="checkbox">\n' +
'                        </div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <div class="g_desc">' + GUIp.i18n.use_exclamatios_desc + '</div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <label class="l_capt" for="use_short_phrases">' + GUIp.i18n.use_short_phrases + '</label>\n' +
'                        <div class="field_content">\n' +
'                            <input id="use_short_phrases" name="use_short_phrases" class="option-checkbox" type="checkbox">\n' +
'                        </div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <div class="g_desc">' + GUIp.i18n.use_short_phrases_desc + '</div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <label class="l_capt" for="disable_die_button">' + GUIp.i18n.disable_die_button + '</label>\n' +
'                        <div class="field_content">\n' +
'                            <input id="disable_die_button" name="disable_die_button" class="option-checkbox" type="checkbox">\n' +
'                        </div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <div class="g_desc">' + GUIp.i18n.disable_die_button_desc + '</div>\n' +
'                    </div>\n' +
'                    <div class="new_line"><label class="l_capt" for="forbidden_craft">' + GUIp.i18n.forbidden_craft + '</label>\n' +
'                        <div class="field_content">\n' +
'                            <input id="forbidden_craft" name="forbidden_craft" type="checkbox" class="menu-checkbox">\n' +
'                        </div>\n' +
'                    </div>\n' +
'                    <div class="new_line">\n' +
'                        <div class="g_desc">' + GUIp.i18n.forbidden_craft_desc + '</div>\n' +
'                        <div class="g_desc" id="craft_categories">\n' +
'                            <input class="craft-checkbox" id="b_b" name="b_b" type="checkbox"><label for="b_b">' + GUIp.i18n.forbidden_craft_b_b + '</label><br>\n' +
'                            <input class="craft-checkbox" id="b_r" name="b_r" type="checkbox"><label for="b_r">' + GUIp.i18n.forbidden_craft_b_r + '</label><br>\n' +
'                            <input class="craft-checkbox" id="r_r" name="r_r" type="checkbox"><label for="r_r">' + GUIp.i18n.forbidden_craft_r_r + '</label><br>\n' +
'                            <input class="craft-checkbox" id="usable" name="usable" type="checkbox"><label for="usable">' + GUIp.i18n.forbidden_craft_usable + '</label><br>\n' +
'                            <input class="craft-checkbox" id="heal" name="heal" type="checkbox"><label for="heal">' + GUIp.i18n.forbidden_craft_heal + '</label><br>\n' +
'                        </div>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_logger">' + GUIp.i18n.disable_logger + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_logger" name="disable_logger" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_logger_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="sum_allies_hp_h">\n' +
'                    <label class="l_capt" for="sum_allies_hp">' + GUIp.i18n.sum_allies_hp + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="sum_allies_hp" name="sum_allies_hp" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="sum_allies_hp_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.sum_allies_hp_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="relocate_duel_buttons">' + GUIp.i18n.relocate_duel_buttons + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="relocate_duel_buttons" name="relocate_duel_buttons" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="relocate_duel_buttons_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.relocate_duel_buttons_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="relocate_duel_buttons_choice">\n' +
'                    <div class="g_desc">' + GUIp.i18n.relocate_duel_buttons_hint + '<br>\n' +
'                        <input type="checkbox" id="relocate_arena" name="relocate_arena">\n' +
'                        <label for="relocate_arena">' + GUIp.i18n.relocate_duel_buttons_arena + '</label><br>\n' +
'                        <input type="checkbox" id="relocate_chf" name="relocate_chf">\n' +
'                        <label for="relocate_chf">' + GUIp.i18n.relocate_duel_buttons_challenge + '</label><br>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="forbidden_title_notices">' + GUIp.i18n.forbidden_title_notices + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="forbidden_title_notices" name="forbidden_title_notices" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="forbidden_title_notices_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.forbidden_title_notices_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="forbidden_title_notices_choice">\n' +
'                    <div class="g_desc">' + GUIp.i18n.forbidden_title_notices_hint + '<br>\n' +
'                        <input type="checkbox" id="title_notice_pm" name="title_notice_pm" checked="checked">\n' +
'                        <label for="title_notice_pm"><b>[1]</b> ' + GUIp.i18n.forbidden_title_notices_pm + '</label><br>\n' +
'                        <input type="checkbox" id="title_notice_gm" name="title_notice_gm" checked="checked">\n' +
'                        <label for="title_notice_gm"><b>[g]</b> ' + GUIp.i18n.forbidden_title_notices_gm + '</label><br>\n' +
'                        <input type="checkbox" id="title_notice_fi" name="title_notice_fi" checked="checked">\n' +
'                        <label for="title_notice_fi"><b>[f]</b> ' + GUIp.i18n.forbidden_title_notices_fi + '</label>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line"><label class="l_capt" for="use_background">' + GUIp.i18n.use_background + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="use_background" name="use_background" class="menu-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="background_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.use_background_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="background_choice">\n' +
'                    <div class="g_desc">\n' +
'                        ' + GUIp.i18n.use_background_hint + '<br>\n' +
'                        <input type="radio" name="background" id="cloud_background" value="cloud" checked="checked">\n' +
'                        <label for="cloud_background">' + GUIp.i18n.use_background_cloud + '</label><br>\n' +
'                        <input type="radio" name="background" id="custom_background" value="custom">\n' +
'                        <label for="custom_background">' + GUIp.i18n.use_background_file + '</label>\n' +
'                        <input type="file" id="custom_file" style="width: 212px;"/><br>\n' +
'                        <label for="custom_background" style="margin: 0 0.3em 0 2.4em">' + GUIp.i18n.use_background_link + ' </label>\n' +
'                        <input type="text" id="custom_link" style="width: 136px;"/>\n' +
'                        <span id="cb_status" style="margin-left: 0.5em; display: none;" />\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line"><label class="l_capt" for="voice_timeout">' + GUIp.i18n.voice_timeout + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="voice_timeout" name="voice_timeout" class="menu-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="voice_timeout_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.voice_timeout_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="voice_timeout_choice">\n' +
'                    <div class="g_desc">\n' +
'                        <label for="voice_timeout_value">' + GUIp.i18n.voice_timeout_hint + '</label>\n' +
'                        <input type="number" id="voice_timeout_value" style="width: 136px;"/>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="hide_charge_button">' + GUIp.i18n.hide_charge_button + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="hide_charge_button" name="hide_charge_button" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.hide_charge_button_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="freeze_voice_button">' + GUIp.i18n.freeze_voice_button + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="freeze_voice_button" name="freeze_voice_button" class="menu-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc" id="freeze_voice_button_desc">' + GUIp.i18n.freeze_voice_button_desc + '</div>\n' +
'                    <div class="g_desc" id="freeze_voice_button_choice">\n' +
'                        <input type="checkbox" name="freeze_after_voice" id="freeze_after_voice">\n' +
'                        <label for="freeze_after_voice">' + GUIp.i18n.freeze_voice_button_after_voice + '</label><br>\n' +
'                        <input type="checkbox" name="freeze_when_empty" id="freeze_when_empty">\n' +
'                        <label for="freeze_when_empty">' + GUIp.i18n.freeze_voice_button_when_empty + '</label>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_page_refresh">' + GUIp.i18n.disable_page_refresh + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_page_refresh" name="disable_page_refresh" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_page_refresh_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_laying_timer">' + GUIp.i18n.disable_laying_timer + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_laying_timer" name="disable_laying_timer" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_laying_timer_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line"><label class="l_capt" for="forbidden_informers">' + GUIp.i18n.forbidden_informers + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="forbidden_informers" name="forbidden_informers" type="checkbox" class="menu-checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.forbidden_informers_desc + '</div>\n' +
'                    <div class="g_desc" id="informers">\n' +
'                        <input class="informer-checkbox" id="full_godpower" name="full_godpower" type="checkbox"><label for="full_godpower">' + GUIp.i18n.forbidden_informers_full_godpower + '</label><br>\n' +
'                        <input class="informer-checkbox" id="much_gold" name="much_gold" type="checkbox"><label for="much_gold">' + GUIp.i18n.forbidden_informers_much_gold + '</label><br>\n' +
'                        <input class="informer-checkbox" id="dead" name="dead" type="checkbox"><label for="dead">' + GUIp.i18n.forbidden_informers_dead + '</label><br>\n' +
'                        <input class="informer-checkbox" id="low_health" name="low_health" type="checkbox"><label for="low_health">' + GUIp.i18n.forbidden_informers_low_health + '</label><br>\n' +
'                        <input class="informer-checkbox" id="fight" name="fight" type="checkbox"><label for="fight">' + GUIp.i18n.forbidden_informers_fight + '</label><br>\n' +
'                        <input class="informer-checkbox" id="arena_available" name="arena_available" type="checkbox"><label for="arena_available">' + GUIp.i18n.forbidden_informers_arena_available + '</label><br>\n' +
'                        <input class="informer-checkbox" id="dungeon_available" name="dungeon_available" type="checkbox"><label for="dungeon_available">' + GUIp.i18n.forbidden_informers_dungeon_available + '</label><br>\n' +
'                        <input class="informer-checkbox" id="wanted_monster" name="wanted_monster" type="checkbox"><label for="wanted_monster">' + GUIp.i18n.forbidden_informers_wanted_monster + '</label><br>\n' +
'                        <input class="informer-checkbox" id="special_monster" name="special_monster" type="checkbox"><label for="special_monster">' + GUIp.i18n.forbidden_informers_special_monster + '</label><br>\n' +
'                        <input class="informer-checkbox" id="tamable_monster" name="tamable_monster" type="checkbox"><label for="tamable_monster">' + GUIp.i18n.forbidden_informers_tamable_monster + '</label><br>\n' +
'                        <input class="informer-checkbox" id="chosen_monster" name="chosen_monster" type="checkbox"><label for="chosen_monster">' + GUIp.i18n.forbidden_informers_chosen_monster + '</label><br>\n' +
'                        <input class="informer-checkbox" id="pet_knocked_out" name="pet_knocked_out" type="checkbox"><label for="pet_knocked_out">' + GUIp.i18n.forbidden_informers_pet_knocked_out + '</label><br>\n' +
'                        <input class="informer-checkbox" id="close_to_boss" name="close_to_boss" type="checkbox"><label for="close_to_boss">' + GUIp.i18n.forbidden_informers_close_to_boss + '</label><br>\n' +
'                        <input class="informer-checkbox" id="guild_quest" name="guild_quest" type="checkbox"><label for="guild_quest">' + GUIp.i18n.forbidden_informers_guild_quest + '</label><br>\n' +
'                        <input class="informer-checkbox" id="mini_quest" name="mini_quest" type="checkbox"><label for="mini_quest">' + GUIp.i18n.forbidden_informers_mini_quest + '</label><br>\n' +
'                        <b>' + GUIp.i18n.forbidden_informers_usable_items + '</b> (' + GUIp.i18n.forbidden_informers_check + ' <a id="check_all" style="cursor: pointer;">' + GUIp.i18n.forbidden_informers_check_all + '</a> ' + GUIp.i18n.forbidden_informers_or + ' <a id="uncheck_all" style="cursor: pointer;">' + GUIp.i18n.forbidden_informers_check_none + '</a>):<br>\n' +
                        (function() {
                            var types = GUIp.getPhrases().usableItemTypes;
                            return types.map(function(aType) {
                                var name = aType.name.replace(/ /g, '_');
                                return '<input class="item-informer informer-checkbox" id="' + name + '" name="' + name + '" type="checkbox"><label for="' + name + '">' + GUIp.i18n['forbidden_informers_' + name] + '</label><br>\n';
                            }).join('');
                        })() +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="l_capt">' + GUIp.i18n.enable_desktop_alerts + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">\n' +
'                        <input id="enable_informer_alerts" name="enable_informer_alerts" class="option-checkbox ksmall" type="checkbox">\n' +
'                        <label for="enable_informer_alerts">' + GUIp.i18n.enable_informer_alerts + '</label>\n' +
'                    </div>\n' +
'                    <div class="g_desc">\n' +
'                        <input id="enable_pm_alerts" name="enable_pm_alerts" class="option-checkbox ksmall" type="checkbox">\n' +
'                        <label for="enable_pm_alerts">' + GUIp.i18n.enable_pm_alerts + '</label>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="informer_alerts_timeout_h"><label class="l_capt" for="informer_alerts_timeout">' + GUIp.i18n.informer_alerts_timeout + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="informer_alerts_timeout" name="informer_alerts_timeout" class="menu-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="informer_alerts_timeout_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.informer_alerts_timeout_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="informer_alerts_timeout_choice">\n' +
'                    <div class="g_desc">\n' +
'                        <label for="informer_alerts_timeout_value">' + GUIp.i18n.informer_alerts_timeout_hint + '</label>\n' +
'                        <input type="number" id="informer_alerts_timeout_value" min="0" max="600" style="width: 136px;"/>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_pm_sound">' + GUIp.i18n.disable_pm_sound + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_pm_sound" name="disable_pm_sound" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_pm_sound_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_arena_sound">' + GUIp.i18n.disable_arena_sound + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_arena_sound" name="disable_arena_sound" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_arena_sound_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_links_autoreplace">' + GUIp.i18n.disable_links_autoreplace + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_links_autoreplace" name="disable_links_autoreplace" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_links_autoreplace_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line"><label class="l_capt" for="custom_dungeon_chronicler">' + GUIp.i18n.custom_dungeon_chronicler + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="custom_dungeon_chronicler" name="custom_dungeon_chronicler" class="menu-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="custom_dungeon_chronicler_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.custom_dungeon_chronicler_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="custom_dungeon_chronicler_choice">\n' +
'                    <div class="g_desc">\n' +
'                        <label for="custom_dungeon_chronicler_value">' + GUIp.i18n.custom_dungeon_chronicler_hint + '</label>\n' +
'                        <input type="text" id="custom_dungeon_chronicler_value" style="width: 136px;"/>\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="disable_godville_clock">' + GUIp.i18n.disable_godville_clock + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="disable_godville_clock" name="disable_godville_clock" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.disable_godville_clock_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line" id="localtime_godville_clock_h">\n' +
'                    <label class="l_capt" for="localtime_godville_clock">' + GUIp.i18n.localtime_godville_clock + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="localtime_godville_clock" name="localtime_godville_clock" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line" id="localtime_godville_clock_desc">\n' +
'                    <div class="g_desc">' + GUIp.i18n.localtime_godville_clock_desc + '</div>\n' +
'                </div>\n' +
(isOpera ? '' :
    '            <div class="new_line">\n' +
    '                <label class="l_capt" for="disable_favicon_flashing">' + GUIp.i18n.disable_favicon_flashing + '</label>\n' +
    '                <div class="field_content">\n' +
    '                    <input id="disable_favicon_flashing" name="disable_favicon_flashing" class="option-checkbox" type="checkbox">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="new_line">\n' +
    '                <div class="g_desc">' + GUIp.i18n.disable_favicon_flashing_desc + '</div>\n' +
    '            </div>\n' +
    '            <div class="new_line">\n' +
    '                <label class="l_capt" for="use_beta_channel">' + GUIp.i18n.use_beta_channel + '</label>\n' +
    '                <div class="field_content">\n' +
    '                    <input id="use_beta_channel" name="use_beta_channel" class="menu-checkbox" type="checkbox">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="new_line">\n' +
    '                <div class="g_desc">' + GUIp.i18n.use_beta_channel_desc + '</div>\n' +
    '            </div>\n'
) +
'                <div class="new_line">\n' +
'                    <label class="l_capt" for="enable_debug_mode">' + GUIp.i18n.enable_debug_mode + '</label>\n' +
'                    <div class="field_content">\n' +
'                        <input id="enable_debug_mode" name="enable_debug_mode" class="option-checkbox" type="checkbox">\n' +
'                    </div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <div class="g_desc">' + GUIp.i18n.enable_debug_mode_desc + '</div>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <input id="save_options" class="input_btn" type="submit" value="' + GUIp.i18n.apply + '">\n' +
'                    <img align="middle" alt="Spinner" border="0" id="general_settings_spinner"\n' +
'                         src="/images/spinner.gif" style="vertical-align:middle; display: none;">\n' +
'                </div>\n' +
'            </div>\n' +
'        </div>\n' +
'    </div>\n' +
'    <div id="words" style="margin-top: 2em;">\n' +
'        <div class="bl_cell">\n' +
'            <div class="bl_capt">' + GUIp.i18n.voices_capt + '</div>\n' +
'            <div class="bl_content">\n' +
'                <a id="l_heal">' + GUIp.i18n.voices_heal + '</a>\n' +
'                <a id="l_heal_field">' + GUIp.i18n.voices_heal_field + '</a>\n' +
'                <a id="l_pray">' + GUIp.i18n.voices_pray + '</a>\n' +
'                <a id="l_pray_field">' + GUIp.i18n.voices_pray_field + '</a>\n' +
'                <a id="l_sacrifice">' + GUIp.i18n.voices_sacrifice + '</a>\n' +
'                <a id="l_exp" href="#">' + GUIp.i18n.voices_exp + '</a>\n' +
'                <a id="l_dig" href="#">' + GUIp.i18n.voices_dig + '</a>\n' +
'                <a id="l_hit" href="#">' + GUIp.i18n.voices_hit + '</a>\n' +
'                <a id="l_hit_field" href="#">' + GUIp.i18n.voices_hit_field + '</a>\n' +
'                <a id="l_do_task">' + GUIp.i18n.voices_do_task + '</a>\n' +
'                <a id="l_cancel_task">' + GUIp.i18n.voices_cancel_task + '</a>\n' +
'                <a id="l_die" href="#">' + GUIp.i18n.voices_die + '</a>\n' +
'                <a id="l_town" href="#">' + GUIp.i18n.voices_town + '</a>\n' +
'                <a id="l_defend" href="#">' + GUIp.i18n.voices_defend + '</a>\n' +
'                <a id="l_exclamation" href="#">' + GUIp.i18n.voices_exclamation + '</a>\n' +
'                <a id="l_inspect_prefix" href="#">' + GUIp.i18n.voices_inspect_prefix + '</a>\n' +
'                <a id="l_craft_prefix" href="#">' + GUIp.i18n.voices_craft_prefix + '</a>\n' +
'                <a id="l_go_north" href="#">' + GUIp.i18n.voices_north + '</a>\n' +
'                <a id="l_go_south" href="#">' + GUIp.i18n.voices_south + '</a>\n' +
'                <a id="l_go_west" href="#">' + GUIp.i18n.voices_west + '</a>\n' +
'                <a id="l_go_east" href="#">' + GUIp.i18n.voices_east + '</a>\n' +
'                <div class="new_line">\n' +
'                    <textarea id="ta_edit" class="rounded_field" style="width: 98%; resize: none;" disabled></textarea>\n' +
'                </div>\n' +
'                <div class="new_line">\n' +
'                    <input id="save_words" class="input_btn" type="submit" value="' + GUIp.i18n.voices_save + '" disabled>\n' +
'                    <input id="set_default" class="input_btn" type="button" value="' + GUIp.i18n.voices_defaults + '" disabled>\n' +
'                </div>\n' +
'            </div>\n' +
'        </div>\n' +
'    </div>\n' +
'    <div style="margin: 2em 0;">\n' +
'        <div class="bl_cell">\n' +
'            <div class="bl_capt">' + GUIp.i18n.user_css + '</div>\n' +
'            <div class="bl_content" style="text-align: center; padding-top: 0.9em;">\n' +
'                <div class="new_line">\n' +
'                    <textarea id="user_css" class="rounded_field" style="width: 98%; resize: none; font: 100% monospace;"></textarea>\n' +
'                </div>\n' +
'                <input id="save_user_css" class="input_btn" type="submit" value="' + GUIp.i18n.apply + '" disabled>\n' +
'            </div>\n' +
'        </div>\n' +
'    </div>\n' +
'    <div style="margin: 2em 0;">\n' +
'        <div class="bl_cell">\n' +
'            <div class="bl_capt">' + GUIp.i18n.import_export_capt + '</div>\n' +
'            <div class="bl_content" style="text-align: center; padding-top: 0.9em;">\n' +
'                <div class="new_line">\n' +
'                    <textarea id="guip_settings" class="rounded_field" style="width: 98%; resize: none;"></textarea>\n' +
'                </div>\n' +
'                <input id="settings_import" class="input_btn" type="submit" value="' + GUIp.i18n.import + '">\n' +
'                <input id="settings_export" class="input_btn" type="submit" value="' + GUIp.i18n.export + '">\n' +
'            </div>\n' +
'        </div>\n' +
'    </div>\n' +
'</div>';
};

GUIp.options_page.loaded = true;
