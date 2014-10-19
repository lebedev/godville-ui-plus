function getOptionsPage() {
return '<p>\n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=settings\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}}); return false;">Настройки</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=informers\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}}); return false;">Информеры</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=gadgets\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}}); return false;">Клиенты и плагины</a> | \n' +
'<a href="#" onclick="Element.show(\'spinner_prof\'); new Ajax.Request(\'/user/update_data?type=invites\', {asynchronous:true, evalScripts:true, onComplete:function(request) {Element.hide(\'spinner_prof\')}}); return false;">Приглашения</a> | \n' +
'<a href="/user/profile/plogs">Подзарядки</a> | Настройки UI</p>\n' +
'<div id="pant_spn">\n' +
'	<img align="middle" alt="Spinner" border="0" id="spinner_prof" src="/images/spinner.gif?1277083719" style="vertical-align: bottom; display: none; ">\n' +
'</div>\n' +
'<div>\n' +
'	<div id="central_block_my_page" style="width: 36%;">\n' +
'		<div id="profile_forms">\n' +
'			<div id="godvilleUI_options">\n' +
'				<form id="add_options">\n' +
'					<div class="bl_cell">\n' +
'						<div class="bl_capt">Godville UI+ настройки</div>\n' +
'						<div id="add_general" class="bl_content">\n' +
'							<div class="new_line" style="margin-bottom: 0.8em;">\n' +
'								<label class="l_capt" for="disable_voice_generators">Выключить генераторы гласов</label>\n' +
'								<div class="field_content">\n' +
'									<input id="disable_voice_generators" name="disable_voice_generators" class="option-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div style="clear: left; text-align: center;" id="voice_menu">\n' +
'								<div class="new_line">\n' +
'									<label class="l_capt" for="use_hero_name">Имя героя в гласе</label>\n' +
'									<div class="field_content">\n' +
'										<input id="use_hero_name" name="use_hero_name" class="option-checkbox" type="checkbox">\n' +
'									</div>\n' +
'								</div>\n' +
'								<div class="new_line">\n' +
'									<div class="g_desc">добавляет в начало гласа обращение к герою</div>\n' +
'								</div>\n' +
'								<div class="new_line">\n' +
'									<label class="l_capt" for="use_heil">Восклицания в гласе</label>\n' +
'									<div class="field_content">\n' +
'										<input id="use_heil" name="use_heil" class="option-checkbox" type="checkbox">\n' +
'									</div>\n' +
'								</div>\n' +
'								<div class="new_line">\n' +
'									<div class="g_desc">добавляет в глас восклицания</div>\n' +
'								</div>\n' +
'								<div class="new_line">\n' +
'									<label class="l_capt" for="use_short_phrases">Короткие фразы для гласов</label>\n' +
'									<div class="field_content">\n' +
'										<input id="use_short_phrases" name="use_short_phrases" class="option-checkbox" type="checkbox">\n' +
'									</div>\n' +
'								</div>\n' +
'								<div class="new_line">\n' +
'									<div class="g_desc">использует одну фразу вместо нескольких</div>\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<label class="l_capt" for="relocate_duel_buttons">Переместить дуэльные кнопки</label>\n' +
'								<div class="field_content">\n' +
'									<input id="relocate_duel_buttons" name="relocate_duel_buttons" class="option-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line" id="relocate_duel_buttons_desc">\n' +
'								<div class="g_desc">позволяет переместить дуэльные кнопки в пантеоны</div>\n' +
'							</div>\n' +
'							<div class="new_line" id="relocate_duel_buttons_choice">\n' +
'								<div class="g_desc">какие из них?<br>\n' +
'									<input type="checkbox" id="relocate_arena" name="relocate_arena">\n' +
'									<label for="relocate_arena">аренную</label><br>\n' +
'									<input type="checkbox" id="relocate_chf" name="relocate_chf">\n' +
'									<label for="relocate_chf">тренировочного боя</label><br>\n' +
'									<!--<input type="checkbox" id="relocate_cvs" name="relocate_cvs">\n' +
'									<label for="relocate_cvs">подземелья(для храмовиков)</label>-->\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line"><label class="l_capt" for="use_background">Включить фон</label>\n' +
'								<div class="field_content">\n' +
'									<input id="use_background" name="use_background" class="menu-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line" id="background_desc">\n' +
'								<div class="g_desc">включает облачный или другой фон</div>\n' +
'							</div>\n' +
'							<div class="new_line" id="background_choice">\n' +
'								<div class="g_desc">\n' +
'									какой из них?<br>\n' +
'									<input type="radio" name="background" id="cloud_background" value="cloud" checked="checked">\n' +
'									<label for="cloud_background">тот самый облачный</label><br>\n' +
'									<input type="radio" name="background" id="custom_background" value="custom">\n' +
'									<label for="custom_background">свой файлом</label>\n' +
'									<input type="file" id="custom_file" style="width: 212px;"/><br>\n' +
'									<label for="custom_background" style="margin: 0 0.3em 0 2.4em">или ссылкой </label>\n' +
'									<input type="text" id="custom_link">\n' +
'									<span id="cb_status" style="margin-left: 0.5em; display: none;" />\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<label class="l_capt" for="hide_charge_button">Убрать кнопку Зарядить</label>\n' +
'								<div class="field_content">\n' +
'									<input id="hide_charge_button" name="hide_charge_button" class="option-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<div class="g_desc">для тех кто не тратит деньги</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<label class="l_capt" for="relocate_map">Поменять местами пульт и карту</label>\n' +
'								<div class="field_content">\n' +
'									<input id="relocate_map" name="relocate_map" class="option-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<div class="g_desc">для подземелья</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<label class="l_capt" for="freeze_voice_button">Замораживать кнопку гласа</label>\n' +
'								<div class="field_content">\n' +
'									<input id="freeze_voice_button" name="freeze_voice_button" class="menu-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<div class="g_desc" id="freeze_voice_button_desc">замораживает кнопку гласа в некоторых случаях</div>\n' +
'								<div class="g_desc" id="freeze_voice_button_choice">\n' +
'										<input type="checkbox" name="freeze_after_voice" id="freeze_after_voice">\n' +
'										<label for="freeze_after_voice">после отправки гласа на 20 секунд</label><br>\n' +
'										<input type="checkbox" name="freeze_when_empty" id="freeze_when_empty">\n' +
'										<label for="freeze_when_empty">при пустом гласе</label>\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<label class="l_capt" for="force_page_refresh">Принудительно обновлять страницу</label>\n' +
'								<div class="field_content">\n' +
'									<input id="force_page_refresh" name="force_page_refresh" class="option-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<div class="g_desc">при зависании страницы героя принудительно обновляет ее</div>\n' +
'							</div>\n' +
'							<!--<div class="new_line"><label class="l_capt">Широкое окно</label>\n' +
'								<div class="field_content">\n' +
'									<input id="use_wide_screen" name="use_wide_screen" class="option-checkbox" type="checkbox">\n' +
'								</div>\n' +
'							</div>-->\n' +
'							<div class="new_line"><label class="l_capt" for="forbidden_informers">Выбрать информеры вручную</label>\n' +
'								<div class="field_content">\n' +
'									<input id="forbidden_informers" name="forbidden_informers" type="checkbox" class="menu-checkbox">\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<div class="g_desc">позволяет выбрать отображаемые информеры</div>\n' +
'								<div class="g_desc" id="informers">\n' +
'								<input class="informer-checkbox" id="full_prana" name="full_prana" type="checkbox"><label for="full_prana">полная прана</label><br>\n' +
'								<input class="informer-checkbox" id="much_gold" name="much_gold" type="checkbox"><label for="much_gold">много золота</label><br>\n' +
'								<input class="informer-checkbox" id="dead" name="dead" type="checkbox"><label for="dead">смерть</label><br>\n' +
'								<input class="informer-checkbox" id="pvp" name="pvp" type="checkbox"><label for="pvp">бой</label><br>\n' +
'								<input class="informer-checkbox" id="monster_of_the_day" name="monster_of_the_day" type="checkbox"><label for="monster_of_the_day">монстр дня</label><br>\n' +
'								<input class="informer-checkbox" id="monster_with_capabilities" name="monster_with_capabilities" type="checkbox"><label for="monster_with_capabilities">монстр со способностями</label><br>\n' +
'								<input class="informer-checkbox" id="SMELT_TIME" name="SMELT_TIME" type="checkbox"><label for="SMELT_TIME">ВРЕМЯ ПЛАВКИ КИРПИЧЕЙ (с назойливым звуковым оповещением)</label><br>\n' +
'								<b>Активируемые предметы</b> (отметить <a id="check_all" style="cursor: pointer;">все</a> или <a id="uncheck_all" style="cursor: pointer;">ни один</a>):<br>\n' +
'								<input class="item-informer informer-checkbox" id="bylina_box" name="bylina_box" type="checkbox"><label for="bylina_box">сочиняющие былину</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="invite" name="invite" type="checkbox"><label for="invite">инвайт на Годвилль</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="arena_box" name="arena_box" type="checkbox"><label for="arena_box">используемые на арене</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="aura_box" name="aura_box" type="checkbox"><label for="aura_box">наделяющие случайной аурой</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="black_box" name="black_box" type="checkbox"><label for="black_box">оказывающие случайный эффект</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="boss_box" name="boss_box" type="checkbox"><label for="boss_box">вызывающие сильного монстра</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="brick_box" name="brick_box" type="checkbox"><label for="brick_box">дарующие кирпич</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="friend_box" name="friend_box" type="checkbox"><label for="friend_box">заводяшие случайные знакомства</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="good_box" name="good_box" type="checkbox"><label for="good_box">делающие что-то хорошее</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="heal_box" name="heal_box" type="checkbox"><label for="heal_box">восстанавливающие здоровье</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="raidboss_box" name="raidboss_box" type="checkbox"><label for="raidboss_box">откапывающие рейд-босса</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="prana_box" name="prana_box" type="checkbox"><label for="prana_box">пакующие прану за полцены</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="quest_box" name="quest_box" type="checkbox"><label for="quest_box">выдающие мини-квест</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="smelter" name="smelter" type="checkbox"><input class="item-informer informer-checkbox" id="smelt!" name="smelt!" type="checkbox" style="display: none;"><label for="smelter">плавящие золото в кирпич</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="teleporter" name="teleporter" type="checkbox"><label for="teleporter">телепортирующие в город</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="to_arena_box" name="to_arena_box" type="checkbox"><label for="to_arena_box">отправляющие на арену</label><br>\n' +
'								<input class="item-informer informer-checkbox" id="transformer" name="transformer" type="checkbox"><input class="item-informer informer-checkbox" id="transform!" name="transform!" type="checkbox" style="display: none;"><label for="transformer">меняющие <b>предметы</b> на кирпичи</label><br>\n' +
'								</div>\n' +
'							</div>\n' +
'							<div class="new_line">\n' +
'								<div id="options_GodvilleUI_general">\n' +
'									<input class="input_btn" type="submit"\n' +
'											 id="GodvilleUI_general"\n' +
'											 name="GodvilleUI_general" value="Применить">\n' +
'									<img align="middle" alt="Spinner" border="0" id="gui_options_progress"\n' +
'										 src="/images/spinner.gif" style="vertical-align:bottom; display: none;">\n' +
'								</div>\n' +
'							</div>\n' +
'						</div>\n' +
'					</div>\n' +
'				</form>\n' +
'			</div>\n' +
'			<div id="godvilleUI_words" style="padding-top: 2em;">\n' +
'				<form id="words">\n' +
'					<div class="bl_cell">\n' +
'						<div class="bl_capt">Гласы</div>\n' +
'						<div class="bl_content">\n' +
'								<a id="l_heal">Лечись</a>\n' +
'								<a id="l_pray">Молись</a>\n' +
'								<a id="l_sacrifice">Жертвуй</a>\n' +
'								<a id="l_exp" href="#">Опыт</a>\n' +
'								<a id="l_dig" href="#">Клад</a>\n' +
'								<a id="l_hit" href="#">Бей</a>\n' +
'								<a id="l_do_task">Задание</a>\n' +
'								<a id="l_cancel_task">Отменить задание</a>\n' +
'								<!-- <a	id="l_die" href="#">Умри</a>-->\n' +
'								<a id="l_town" href="#">В город</a>\n' +
'								<a id="l_heil" href="#">Восклицание</a>\n' +
'								<a id="l_inspect_prefix" href="#">Вопросики</a>\n' +
'								<a id="l_merge_prefix" href="#">Крафт</a>\n' +
'								<a id="l_walk_n" href="#">Север</a>\n' +
'								<a id="l_walk_s" href="#">Юг</a>\n' +
'								<a id="l_walk_w" href="#">Запад</a>\n' +
'								<a id="l_walk_e" href="#">Восток</a>\n' +
'								<div id="opt_change_words">\n' +
'									<div class="new_line">\n' +
'										<!--<label id="ta_name" class="l_capt" /></label>-->\n' +
'										<textarea id="ta_edit" class="rounded_field" rows="4" wrap="virtual;" style="width: 98%; resize: none;" disabled></textarea>\n' +
'									</div>\n' +
'								</div>\n' +
'								<div class="new_line">\n' +
'									<input id="submit2" class="input_btn" name="commit" type="submit" value="Сохранить" disabled>\n' +
'									<input id="cancel2" class="input_btn" name="cancel" type="button" value="Восстановить по умолчанию" disabled>\n' +
'									<img align="middle" alt="Spinner" border="0" id="gui_word_progress" src="/images/spinner.gif" style="vertical-align:bottom; display: none;">\n' +
'								</div>\n' +
'							</div>\n' +
'						</div>\n' +
'					</div>\n' +
'				</form>\n' +
'			</div>\n' +
'		</div>\n' +
'	</div>\n' +
'</div>';
}