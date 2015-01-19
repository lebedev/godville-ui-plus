(function() {
'use strict';

var worker = window.wrappedJSObject || window;
worker.getOptionsPage = function() {
return '<p>\n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=settings\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + worker.GUIp_i18n.profile_menu_settings + '</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=informers\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + worker.GUIp_i18n.profile_menu_informers + '</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=gadgets\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + worker.GUIp_i18n.profile_menu_gadgets + '</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=invites\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}});">' + worker.GUIp_i18n.profile_menu_invites + '</a> | \n' +
'<a href="/user/profile/plogs">' + worker.GUIp_i18n.profile_menu_plogs + '</a> | ' + worker.GUIp_i18n.ui_options + '</p>\n' +
'<div id="pant_spn">\n' +
'	<img align="middle" alt="Spinner" border="0" id="spinner_prof" src="/images/spinner.gif" style="vertical-align: bottom; display: none; ">\n' +
'</div>\n' +
'<div id="central_block_my_page" style="width: 36%;">\n' +
'	<div>\n' +
'		<form id="GUIp_options">\n' +
'			<div class="bl_cell">\n' +
'				<div class="bl_capt">' + worker.GUIp_i18n.ui_settings_capt + '</div>\n' +
'				<div id="add_general" class="bl_content">\n' +
'					<div class="new_line" style="margin-bottom: 0.8em;">\n' +
'						<label class="l_capt" for="disable_voice_generators">' + worker.GUIp_i18n.disable_voice_generators + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_voice_generators" name="disable_voice_generators" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div style="clear: left; text-align: center;" id="voice_menu">\n' +
'						<div class="new_line">\n' +
'							<label class="l_capt" for="use_hero_name">' + worker.GUIp_i18n.use_hero_name + '</label>\n' +
'							<div class="field_content">\n' +
'								<input id="use_hero_name" name="use_hero_name" class="option-checkbox" type="checkbox">\n' +
'							</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<div class="g_desc">' + worker.GUIp_i18n.use_hero_name_desc + '</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<label class="l_capt" for="use_exclamations">' + worker.GUIp_i18n.use_exclamatios + '</label>\n' +
'							<div class="field_content">\n' +
'								<input id="use_exclamations" name="use_exclamations" class="option-checkbox" type="checkbox">\n' +
'							</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<div class="g_desc">' + worker.GUIp_i18n.use_exclamatios_desc + '</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<label class="l_capt" for="use_short_phrases">' + worker.GUIp_i18n.use_short_phrases + '</label>\n' +
'							<div class="field_content">\n' +
'								<input id="use_short_phrases" name="use_short_phrases" class="option-checkbox" type="checkbox">\n' +
'							</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<div class="g_desc">' + worker.GUIp_i18n.use_short_phrases_desc + '</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<label class="l_capt" for="disable_die_button">' + worker.GUIp_i18n.disable_die_button + '</label>\n' +
'							<div class="field_content">\n' +
'								<input id="disable_die_button" name="disable_die_button" class="option-checkbox" type="checkbox">\n' +
'							</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<div class="g_desc">' + worker.GUIp_i18n.disable_die_button_desc + '</div>\n' +
'						</div>\n' +
'						<div class="new_line"><label class="l_capt" for="forbidden_craft">' + worker.GUIp_i18n.forbidden_craft + '</label>\n' +
'							<div class="field_content">\n' +
'								<input id="forbidden_craft" name="forbidden_craft" type="checkbox" class="menu-checkbox">\n' +
'							</div>\n' +
'						</div>\n' +
'						<div class="new_line">\n' +
'							<div class="g_desc">' + worker.GUIp_i18n.forbidden_craft_desc + '</div>\n' +
'							<div class="g_desc" id="craft_categories">\n' +
'								<input class="craft-checkbox" id="b_b" name="b_b" type="checkbox"><label for="b_b">' + worker.GUIp_i18n.forbidden_craft_b_b + '</label><br>\n' +
'								<input class="craft-checkbox" id="b_r" name="b_r" type="checkbox"><label for="b_r">' + worker.GUIp_i18n.forbidden_craft_b_r + '</label><br>\n' +
'								<input class="craft-checkbox" id="r_r" name="r_r" type="checkbox"><label for="r_r">' + worker.GUIp_i18n.forbidden_craft_r_r + '</label><br>\n' +
'								<input class="craft-checkbox" id="usable" name="usable" type="checkbox"><label for="usable">' + worker.GUIp_i18n.forbidden_craft_usable + '</label><br>\n' +
'								<input class="craft-checkbox" id="heal" name="heal" type="checkbox"><label for="heal">' + worker.GUIp_i18n.forbidden_craft_heal + '</label><br>\n' +
'							</div>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="disable_logger">' + worker.GUIp_i18n.disable_logger + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_logger" name="disable_logger" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.disable_logger_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="relocate_duel_buttons">' + worker.GUIp_i18n.relocate_duel_buttons + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="relocate_duel_buttons" name="relocate_duel_buttons" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="relocate_duel_buttons_desc">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.relocate_duel_buttons_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="relocate_duel_buttons_choice">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.relocate_duel_buttons_hint + '<br>\n' +
'							<input type="checkbox" id="relocate_arena" name="relocate_arena">\n' +
'							<label for="relocate_arena">' + worker.GUIp_i18n.relocate_duel_buttons_arena + '</label><br>\n' +
'							<input type="checkbox" id="relocate_chf" name="relocate_chf">\n' +
'							<label for="relocate_chf">' + worker.GUIp_i18n.relocate_duel_buttons_challenge + '</label><br>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="forbidden_title_notices">' + worker.GUIp_i18n.forbidden_title_notices + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="forbidden_title_notices" name="forbidden_title_notices" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="forbidden_title_notices_desc">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.forbidden_title_notices_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="forbidden_title_notices_choice">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.forbidden_title_notices_hint + '<br>\n' +
'							<input type="checkbox" id="title_notice_pm" name="title_notice_pm" checked="checked">\n' +
'							<label for="title_notice_pm"><b>[1]</b> ' + worker.GUIp_i18n.forbidden_title_notices_pm + '</label><br>\n' +
'							<input type="checkbox" id="title_notice_gm" name="title_notice_gm" checked="checked">\n' +
'							<label for="title_notice_gm"><b>[g]</b> ' + worker.GUIp_i18n.forbidden_title_notices_gm + '</label><br>\n' +
'							<input type="checkbox" id="title_notice_fi" name="title_notice_fi" checked="checked">\n' +
'							<label for="title_notice_fi"><b>[f]</b> ' + worker.GUIp_i18n.forbidden_title_notices_fi + '</label>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line"><label class="l_capt" for="use_background">' + worker.GUIp_i18n.use_background + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="use_background" name="use_background" class="menu-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="background_desc">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.use_background_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="background_choice">\n' +
'						<div class="g_desc">\n' +
'							' + worker.GUIp_i18n.use_background_hint + '<br>\n' +
'							<input type="radio" name="background" id="cloud_background" value="cloud" checked="checked">\n' +
'							<label for="cloud_background">' + worker.GUIp_i18n.use_background_cloud + '</label><br>\n' +
'							<input type="radio" name="background" id="custom_background" value="custom">\n' +
'							<label for="custom_background">' + worker.GUIp_i18n.use_background_file + '</label>\n' +
'							<input type="file" id="custom_file" style="width: 212px;"/><br>\n' +
'							<label for="custom_background" style="margin: 0 0.3em 0 2.4em">' + worker.GUIp_i18n.use_background_link + ' </label>\n' +
'							<input type="text" id="custom_link" style="width: 136px;"/>\n' +
'							<span id="cb_status" style="margin-left: 0.5em; display: none;" />\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line"><label class="l_capt" for="voice_timeout">' + worker.GUIp_i18n.voice_timeout + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="voice_timeout" name="voice_timeout" class="menu-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="voice_timeout_desc">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.voice_timeout_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line" id="voice_timeout_choice">\n' +
'						<div class="g_desc">\n' +
'							<label for="voice_timeout">' + worker.GUIp_i18n.voice_timeout_hint + '</label>\n' +
'							<input type="number" id="voice_timeout_value" style="width: 136px;"/>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="hide_charge_button">' + worker.GUIp_i18n.hide_charge_button + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="hide_charge_button" name="hide_charge_button" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.hide_charge_button_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="relocate_map">' + worker.GUIp_i18n.relocate_map + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="relocate_map" name="relocate_map" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.relocate_map_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="freeze_voice_button">' + worker.GUIp_i18n.freeze_voice_button + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="freeze_voice_button" name="freeze_voice_button" class="menu-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc" id="freeze_voice_button_desc">' + worker.GUIp_i18n.freeze_voice_button_desc + '</div>\n' +
'						<div class="g_desc" id="freeze_voice_button_choice">\n' +
'							<input type="checkbox" name="freeze_after_voice" id="freeze_after_voice">\n' +
'							<label for="freeze_after_voice">' + worker.GUIp_i18n.freeze_voice_button_after_voice + '</label><br>\n' +
'							<input type="checkbox" name="freeze_when_empty" id="freeze_when_empty">\n' +
'							<label for="freeze_when_empty">' + worker.GUIp_i18n.freeze_voice_button_when_empty + '</label>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="disable_page_refresh">' + worker.GUIp_i18n.disable_page_refresh + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_page_refresh" name="disable_page_refresh" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.disable_page_refresh_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="disable_laying_timer">' + worker.GUIp_i18n.disable_laying_timer + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_laying_timer" name="disable_laying_timer" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.disable_laying_timer_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line"><label class="l_capt" for="forbidden_informers">' + worker.GUIp_i18n.forbidden_informers + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="forbidden_informers" name="forbidden_informers" type="checkbox" class="menu-checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.forbidden_informers_desc + '</div>\n' +
'						<div class="g_desc" id="informers">\n' +
'							<input class="informer-checkbox" id="full_godpower" name="full_godpower" type="checkbox"><label for="full_godpower">' + worker.GUIp_i18n.forbidden_informers_full_godpower + '</label><br>\n' +
'							<input class="informer-checkbox" id="much_gold" name="much_gold" type="checkbox"><label for="much_gold">' + worker.GUIp_i18n.forbidden_informers_much_gold + '</label><br>\n' +
'							<input class="informer-checkbox" id="dead" name="dead" type="checkbox"><label for="dead">' + worker.GUIp_i18n.forbidden_informers_dead + '</label><br>\n' +
'							<input class="informer-checkbox" id="pvp" name="pvp" type="checkbox"><label for="pvp">' + worker.GUIp_i18n.forbidden_informers_pvp + '</label><br>\n' +
'							<input class="informer-checkbox" id="arena_available" name="arena_available" type="checkbox"><label for="arena_available">' + worker.GUIp_i18n.forbidden_informers_arena_available + '</label><br>\n' +
'							<input class="informer-checkbox" id="dungeon_available" name="dungeon_available" type="checkbox"><label for="dungeon_available">' + worker.GUIp_i18n.forbidden_informers_dungeon_available + '</label><br>\n' +
'							<input class="informer-checkbox" id="wanted_monster" name="wanted_monster" type="checkbox"><label for="wanted_monster">' + worker.GUIp_i18n.forbidden_informers_wanted_monster + '</label><br>\n' +
'							<input class="informer-checkbox" id="special_monster" name="special_monster" type="checkbox"><label for="special_monster">' + worker.GUIp_i18n.forbidden_informers_special_monster + '</label><br>\n' +
'							<input class="informer-checkbox" id="tamable_monster" name="tamable_monster" type="checkbox"><label for="tamable_monster">' + worker.GUIp_i18n.forbidden_informers_tamable_monster + '</label><br>\n' +
'							<input class="informer-checkbox" id="pet_knocked_out" name="pet_knocked_out" type="checkbox"><label for="pet_knocked_out">' + worker.GUIp_i18n.forbidden_informers_pet_knocked_out + '</label><br>\n' +
'							<input class="informer-checkbox" id="close_to_boss" name="close_to_boss" type="checkbox"><label for="close_to_boss">' + worker.GUIp_i18n.forbidden_informers_close_to_boss + '</label><br>\n' +
'							<input class="informer-checkbox" id="guild_quest" name="guild_quest" type="checkbox"><label for="guild_quest">' + worker.GUIp_i18n.forbidden_informers_guild_quest + '</label><br>\n' +
'							<input class="informer-checkbox" id="mini_quest" name="mini_quest" type="checkbox"><label for="mini_quest">' + worker.GUIp_i18n.forbidden_informers_mini_quest + '</label><br>\n' +
'							<b>' + worker.GUIp_i18n.forbidden_informers_usable_items + '</b> (' + worker.GUIp_i18n.forbidden_informers_check + ' <a id="check_all" style="cursor: pointer;">' + worker.GUIp_i18n.forbidden_informers_check_all + '</a> ' + worker.GUIp_i18n.forbidden_informers_or + ' <a id="uncheck_all" style="cursor: pointer;">' + worker.GUIp_i18n.forbidden_informers_check_none + '</a>):<br>\n' +
'							<input class="item-informer informer-checkbox" id="arena_box" name="arena_box" type="checkbox"><label for="arena_box">' + worker.GUIp_i18n.forbidden_informers_arena_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="aura_box" name="aura_box" type="checkbox"><label for="aura_box">' + worker.GUIp_i18n.forbidden_informers_aura_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="black_box" name="black_box" type="checkbox"><label for="black_box">' + worker.GUIp_i18n.forbidden_informers_black_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="boss_box" name="boss_box" type="checkbox"><label for="boss_box">' + worker.GUIp_i18n.forbidden_informers_boss_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="charge_box" name="charge_box" type="checkbox"><label for="charge_box">' + worker.GUIp_i18n.forbidden_informers_charge_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="coolstory_box" name="coolstory_box" type="checkbox"><label for="coolstory_box">' + worker.GUIp_i18n.forbidden_informers_coolstory_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="friend_box" name="friend_box" type="checkbox"><label for="friend_box">' + worker.GUIp_i18n.forbidden_informers_friend_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="gift_box" name="gift_box" type="checkbox"><label for="gift_box">' + worker.GUIp_i18n.forbidden_informers_gift_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="good_box" name="good_box" type="checkbox"><label for="good_box">' + worker.GUIp_i18n.forbidden_informers_good_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="heal_box" name="heal_box" type="checkbox"><label for="heal_box">' + worker.GUIp_i18n.forbidden_informers_heal_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="invite" name="invite" type="checkbox"><label for="invite">' + worker.GUIp_i18n.forbidden_informers_invite + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="raidboss_box" name="raidboss_box" type="checkbox"><label for="raidboss_box">' + worker.GUIp_i18n.forbidden_informers_raidboss_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="quest_box" name="quest_box" type="checkbox"><label for="quest_box">' + worker.GUIp_i18n.forbidden_informers_quest_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="smelter" name="smelter" type="checkbox"><input class="item-informer informer-checkbox" id="smelt!" name="smelt!" type="checkbox" style="display: none;"><label for="smelter">' + worker.GUIp_i18n.forbidden_informers_smelter + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="teleporter" name="teleporter" type="checkbox"><label for="teleporter">' + worker.GUIp_i18n.forbidden_informers_teleporter + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="to_arena_box" name="to_arena_box" type="checkbox"><label for="to_arena_box">' + worker.GUIp_i18n.forbidden_informers_to_arena_box + '</label><br>\n' +
'							<input class="item-informer informer-checkbox" id="transformer" name="transformer" type="checkbox"><input class="item-informer informer-checkbox" id="transform!" name="transform!" type="checkbox" style="display: none;"><label for="transformer">' + worker.GUIp_i18n.forbidden_informers_transformer + '</label><br>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="disable_pm_sound">' + worker.GUIp_i18n.disable_pm_sound + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_pm_sound" name="disable_pm_sound" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.disable_pm_sound_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="disable_arena_sound">' + worker.GUIp_i18n.disable_arena_sound + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_arena_sound" name="disable_arena_sound" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.disable_arena_sound_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="disable_links_autoreplace">' + worker.GUIp_i18n.disable_links_autoreplace + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="disable_links_autoreplace" name="disable_links_autoreplace" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.disable_links_autoreplace_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<label class="l_capt" for="enable_debug_mode">' + worker.GUIp_i18n.enable_debug_mode + '</label>\n' +
'						<div class="field_content">\n' +
'							<input id="enable_debug_mode" name="enable_debug_mode" class="option-checkbox" type="checkbox">\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div class="g_desc">' + worker.GUIp_i18n.enable_debug_mode_desc + '</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<div id="options_GodvilleUI_general">\n' +
'							<input class="input_btn" type="submit" value="' + worker.GUIp_i18n.apply + '">\n' +
'							<img align="middle" alt="Spinner" border="0" id="gui_options_progress"\n' +
'								 src="/images/spinner.gif" style="vertical-align:bottom; display: none;">\n' +
'						</div>\n' +
'					</div>\n' +
'				</div>\n' +
'			</div>\n' +
'		</form>\n' +
'	</div>\n' +
'	<div id="GUIp_words" style="margin-top: 2em;">\n' +
'		<form id="words">\n' +
'			<div class="bl_cell">\n' +
'				<div class="bl_capt">' + worker.GUIp_i18n.voices_capt + '</div>\n' +
'				<div class="bl_content">\n' +
'					<a id="l_heal">' + worker.GUIp_i18n.voices_heal + '</a>\n' +
'					<a id="l_pray">' + worker.GUIp_i18n.voices_pray + '</a>\n' +
'					<a id="l_sacrifice">' + worker.GUIp_i18n.voices_sacrifice + '</a>\n' +
'					<a id="l_exp" href="#">' + worker.GUIp_i18n.voices_exp + '</a>\n' +
'					<a id="l_dig" href="#">' + worker.GUIp_i18n.voices_dig + '</a>\n' +
'					<a id="l_hit" href="#">' + worker.GUIp_i18n.voices_hit + '</a>\n' +
'					<a id="l_do_task">' + worker.GUIp_i18n.voices_do_task + '</a>\n' +
'					<a id="l_cancel_task">' + worker.GUIp_i18n.voices_cancel_task + '</a>\n' +
'					<a id="l_die" href="#">' + worker.GUIp_i18n.voices_die + '</a>\n' +
'					<a id="l_town" href="#">' + worker.GUIp_i18n.voices_town + '</a>\n' +
'					<a id="l_defend" href="#">' + worker.GUIp_i18n.voices_defend + '</a>\n' +
'					<a id="l_exclamation" href="#">' + worker.GUIp_i18n.voices_exclamation + '</a>\n' +
'					<a id="l_inspect_prefix" href="#">' + worker.GUIp_i18n.voices_inspect_prefix + '</a>\n' +
'					<a id="l_craft_prefix" href="#">' + worker.GUIp_i18n.voices_craft_prefix + '</a>\n' +
'					<a id="l_go_north" href="#">' + worker.GUIp_i18n.voices_north + '</a>\n' +
'					<a id="l_go_south" href="#">' + worker.GUIp_i18n.voices_south + '</a>\n' +
'					<a id="l_go_west" href="#">' + worker.GUIp_i18n.voices_west + '</a>\n' +
'					<a id="l_go_east" href="#">' + worker.GUIp_i18n.voices_east + '</a>\n' +
'					<div id="opt_change_words">\n' +
'						<div class="new_line">\n' +
'							<textarea id="ta_edit" class="rounded_field" rows="4" wrap="virtual;" style="width: 98%; resize: none;" disabled></textarea>\n' +
'						</div>\n' +
'					</div>\n' +
'					<div class="new_line">\n' +
'						<input id="save_words" class="input_btn" type="submit" value="' + worker.GUIp_i18n.voices_save + '" disabled>\n' +
'						<input id="set_default" class="input_btn" type="button" value="' + worker.GUIp_i18n.voices_defaults + '" disabled>\n' +
'						<img align="middle" alt="Spinner" border="0" id="gui_word_progress" src="/images/spinner.gif" style="vertical-align:bottom; display: none;">\n' +
'					</div>\n' +
'				</div>\n' +
'			</div>\n' +
'		</form>\n' +
'	</div>\n' +
'	<div style="margin: 2em 0;">\n' +
'		<div class="bl_cell">\n' +
'			<div class="bl_capt">' + worker.GUIp_i18n.user_css + '</div>\n' +
'			<div class="bl_content" style="text-align: center; padding-top: 0.9em;">\n' +
'				<div class="new_line">\n' +
'					<textarea id="user_css" class="rounded_field" rows="1" wrap="virtual;" style="width: 98%; resize: none;"></textarea>\n' +
'				</div>\n' +
'				<input class="input_btn" type="submit" id="set_user_css" value="' + worker.GUIp_i18n.apply + '">\n' +
'				<img align="middle" alt="Spinner" border="0" id="gui_css_progress" src="/images/spinner.gif" style="vertical-align:bottom; display: none;">\n' +
'			</div>\n' +
'		</div>\n' +
'	</div>\n' +
'	<div style="margin: 2em 0;">\n' +
'		<div class="bl_cell">\n' +
'			<div class="bl_capt">' + worker.GUIp_i18n.import_export_capt + '</div>\n' +
'			<div class="bl_content" style="text-align: center; padding-top: 0.9em;">\n' +
'				<div class="new_line">\n' +
'					<textarea id="guip_settings" class="rounded_field" rows="1" wrap="virtual;" style="width: 98%; resize: none;"></textarea>\n' +
'				</div>\n' +
'				<input class="input_btn" type="submit" id="GUIp_import" value="' + worker.GUIp_i18n.import + '">\n' +
'				<input class="input_btn" type="submit" id="GUIp_export" value="' + worker.GUIp_i18n.export + '">\n' +
'			</div>\n' +
'		</div>\n' +
'	</div>\n' +
'</div>';
};

})();