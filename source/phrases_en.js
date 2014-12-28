function GUIp_getWords() {
	return {
	// Этот параметр показывает текущую версию файла
	// Меняется только при _структурных_ изменениях.
	// Например: добавление, удаление, переименование секций.
	// Добавление фраз — НЕ структурное изменение
	version: 13,

	// Фразы
	phrases: {
		// Ключевые корни: лечис, зелёнка
		heal: [
			"Do something about your wounds!", "Heal yourself, my hero.", "You look like you need a drink.", "Take a moment to rest!",
			"Try to stay alive!"
		],

		// Ключевые корни: молись,
		pray: [
			"Pray to me, mortal!", "I demand worship!", "Praise me, for I am your god!", "I will show you the light."
		],

		// Ключевые корни: жертва
		sacrifice: [
			"Sacrifice something!", "I demand a sacrifice!"
		],

		// Ключевые корни: опыт
		exp: [
			"Do you ever learn?", "Learn something!", "You need to learn about levelling up!"
		],

		// Ключевые корни: золото клад
		dig: [
			"Dig a hole!", "Look for some treasure!", "Dig up something of value!", "I hear there is treasure underground!",
			"Search for gold!"
		],

		// Работает: бей, ударь, ударов
		// Не работает: бить, удар
		hit: [
    		"Hit the monster harder!", "Smite your foe!", "Destroy your rival!", "Use your special attack!", "Knock your rival out!",
    		"Kick them where it hurts!"
		],

		// Ключевые корни: отби, щит
		// Ключевое слово: защищайся
		defend: [
			"Duck and cover!", "Use your shield!", "Try to block incoming damage!", "Defend yourself!", "Resistance is futile!"
		],

		do_task: [
			"Complete your quest!", "Surely you can quest faster than that!", "Hurry up with your quest!"
		],

		cancel_task: [
			"Cancel your quest!", "This quest is pointless! Abandon it!", "I do not like this quest. Stop what you are doing at once!",
			"Drop what you’re holding, and cease questing!"
		],

		die: [
    		"Curl up and die!", "You die too often!", "I want you dead in the next five minutes!", "Play dead!"
		],

		town: [
    		"Go to town!", "Turn back!", "Return to town!"
		],

		// Ключевые корни: Север
		walk_n: [
			"Go north!"
		],

		// Ключевые корни: Юг
		walk_s: [
			"Go south!"
		],

		// Ключевые корни: Запад
		walk_w: [
			"Go west!"
		],

		// Ключевые корни: Восток
		walk_e: [
			"Go east!"
		],

		// Начало для фраз-вопросиков
		inspect_prefix: [
			"Examine", "Study", "Look at", "Disassemble"
		],

		// Ключевые слова для крафта
		craft_prefix: [
			"Combine", "Assemble"
		],

		// Префиксы во имя
		heil: [
			"For my pleasure", "For science", "Please", "For the Godville", "I command you", "Hey", "Quick",
			"I need you to do something for me"
		]
	},

	usable_items: {
		types: [
			//'aura box',
			//'arena box',
			'black box',
			//'boss box',
			//'coolstory box',
			'friend box',
			'gift box',
			'good box',
			'invite',
			'heal box',
			'prana box',
			'raidboss box',
			'smelter',
			'teleporter',
			'to arena box',
			'transformer',
			//'quest box'
		],
		descriptions: [
			//'Этот предмет наделяет героя случайной аурой',
			//'Данный предмет можно активировать только во время дуэли',
			'This item can affect the hero in a good or bad way',
			//'Этот предмет ищет для героя босса',
			//'Этот предмет сочиняет о герое былину',
			'This item helps your hero find a new friend',
			'This spooky item can turn into something',
			'This item may give your hero a pleasant surprise',
			'Activating this item will increase the number of available invitations',
			'This item can completely restore the hero\'s health',
			'This item adds one accumulator charge when activated',
			'This item makes the hero search for allies against an underground boss',
			'This item kills the monster or tries to melt a golden brick out of gold coins',
			'This item can teleport the hero into a random town',
			'This item teleports the hero to the arena when activated',
			'This item can transform one or several bold items in inventory into golden bricks',
			//'Этот предмет отправляет героя в мини-квест'
		]
	},

	pets: [
	]
	};
}

var GUIp_locale = 'en';

var GUIp_i10n = {
	hero: ['hero', 'hero'],
	heroine: ['heroine', 'heroine'],
	ask1: 'Ask ',
	get inspect() { return ' to ' + ['examine', 'study', 'look at', 'disassemble'][Math.floor(Math.random()*4)] + ' '; },
	ask2: 'Ask ',
	get craft1() {
		return ' to ' + ['combine', 'assemble'][Math.floor(Math.random()*2)] + ' random combination of ';
	},
	b_b: '<b>b</b>+<b>b</b>',
	b_b_hint: 'two bold',
	b_r: '<b>b</b>+r',
	b_r_hint: 'bold and regular',
	r_r: 'r+r',
	r_r_hint: 'two regular',
	craft2: ' items from the inventory.',
	get craft_verb() { return ['Combine', 'Assemble'][Math.floor(Math.random()*2)]; },
	close: 'close',
	if_something_wrong_capt: 'if something goes wrong',
	if_something_wrong: 'If something does not work the way it should:',
	help_refresh: 'Refresh the page. If this does not help — move on to the next step.',
	help_check_version: 'Click here to check if you have the latest version.',
	help_update_chrome_1: 'Open Chrome settings (2). ' +
		'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/chrome_manual_update_1.png" ' +
		'target="_blank" title="Opens in a new tab">Picture</a>.',
	help_update_chrome_2: 'Choose "Extensions" (3), check "Developer mode" (4), click "Update extensions" button (5), ' +
		'which will appear, wait until the browser will refresh the extension,  uncheck the box (6). ' +
		'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/chrome_manual_update_2.png" ' +
		'target="_blank" title="Opens in a new tab">Picture</a>.',
	help_update_firefox_1: 'Open Firefox add-ons page (2 or <b>Ctrl+Shift+A</b>). ' +
		'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/firefox_manual_update_1.png" ' +
		'target="_blank" title="Opens in a new tab">Picture</a>.',
	help_update_firefox_2: 'Click the "gear" (3), then "Check for updates" (4), wait a few seconds and allow to restart the browser. ' +
		'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/firefox_manual_update_2.png" ' +
		'target="_blank" title="Opens in a new tab">Picture</a>.',
	help_back_to_step_1: 'Back to step 1.',
	help_console_1: 'If the bug persists — check, if your bug is already reported at the link below.',
	help_console_2: 'If it is not in the list and there was no error message — open the console ' +
		'(through the menu, or by presing <b>Ctrl+Shift+' + (GUIp_browser === 'Firefox' ? 'K' : 'J') + '</b>). ' +
		'<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/' +
		(GUIp_browser === 'Firefox' ? 'firefox' : 'chrome') + '_console.png" target="_blank" title="Opens in a new tab">Picture</a>.',
	help_console_3: 'Try to find something that looks like an error message in the console ' +
		'(<a href="https://raw.githubusercontent.com/zeird/godville-ui-plus/master/help_guide/' +
		(GUIp_browser === 'Firefox' ? 'firefox' : 'chrome') + '_console_error.png" target="_blank" title="Opens in a new tab">picture</a>). ' +
		'Provide this information to <b>Bad Luck</b> or post it in the forum as per links below.',
	help_useful_links: 'Useful links: ' +
		'<a href="/gods/Bad Luck" title="Opens in a new tab" target="about:blank">Bad Luck</a>, ' +
		'his <a href="skype:angly_cat">skype</a>, ' +
		'<a href="https://github.com/zeird/godville-ui-plus/wiki/TODO-list-en" title="Opens in a new tab" ' +
			'target="_blank">bugs and ideas list</a>, ' +
		'<a href="/forums/show_topic/2800" title="Opens in a new tab" target="_blank">forum thread</a>.',
		//'<a href="http://wiki.godville.net/Godville_UI+" title="Откроется в новой вкладке" target="about:blank">статья в богии</a>, ' +
		//'<a href="/gods/Спандарамет" title="Откроется в новой вкладке" target="about:blank">фразы из подземелья</a>.',
	ui_settings_top_menu: '<strong>ui+</strong> settings',
	getting_version_no: 'Getting the latest addon version number...',
	is_last_version: 'You have the latest version.',
	is_not_last_version_1: 'Last version — <b>',
	is_not_last_version_2: '</b>. Manual update is required.',
	proceed_to_next_step: ' Continue to the next step.',
	getting_version_failed: 'Unable to determine the latest version number. If you have not updated manually, continue to step 3, otherwise to step 6.',
	hero_health: 'Hero\'s health',
	inventory: 'Inventory',
	gold: 'Gold',
	charges: 'Charges',
	allies_health: 'Allie\'s health' ,
	enemy_health: 'Enemy\'s health',
	exp: 'Experience (percents)',
	level: 'Level',
	health: 'Health',
	godpower: 'Godpower (percents)',
	task: 'Quest (percents)',
	monsters: 'Monsters',
	bricks: 'Bricks',
	logs: 'Logs',
	savings: 'Savings (thousands)',
	weapon: 'Weapon',
	shield: 'Shield',
	head: 'Head',
	body: 'Body',
	arms: 'Arms',
	legs: 'Legs',
	talisman: 'Talisman',
	death_count: 'Deaths',
	pet_level: 'Pet level',
	unknown_item_type_title: 'Unknow trophy type in Godville UI+!',
	unknown_item_type_content: 'We have detected an unrecognized trophy type. Please report the following to the developer: ',
	godpower_label: 'Godpower',
	north: 'North',
	go_north: ' to go north',
	east: 'East',
	go_east: ' to go east',
	south: 'South',
	go_south: ' to go south',
	west: 'West',
	go_west: ' to go west',
	ask3: 'Ask ',
	defend: 'defend',
	ask4: 'Ask ',
	to_defend: ' to defend',
	pray: 'pray',
	ask5: 'Ask ',
	to_pray: ' to pray',
	heal: 'heal',
	ask6: 'Ask ',
	to_heal: ' to heal',
	hit: 'hit',
	ask7: 'Ask ',
	to_hit: ' to hit',
	sacrifice: 'sacrifice',
	ask8: 'Ask ',
	to_sacrifice: ' to sacrifice',
	enemy_label: 'Enemy',
	boss_warning_hint: 'boss warning',
	boss_slay_hint: 'boss',
	small_prayer_hint: 'small prayer',
	small_healing_hint: 'small healing',
	trophy_loss_trap_hint: 'trap: gold or trophy loss',
	low_damage_trap_hint: 'trap: low damage',
	mid_damage_trap_hint: 'trap: moderate damage',
	move_loss_trap_hint: 'trap: move loss',
	boss_warning_and_trap_hint: 'boss warning and trap',
	boss_slay_and_trap_hint: 'boss and trap',
	health_label: 'Health',
	gold_label: 'Gold',
	inventory_label: 'Inventory',
	level_label: 'Level',
	task_label: 'Quest',
	death_label: 'Death Count',
	study: 'study',
	dig: 'dig',
	cancel_task: 'cancel',
	do_task: 'do',
	die: 'die',
	ask9: 'Ask ',
	to_study: ' to study',
	ask10: 'Ask ',
	to_dig: ' to dig',
	ask11: 'Ask ',
	to_cancel_task: ' to cancel current quest',
	ask12: 'Ask ',
	to_do_task: ' to do current quest quicker',
	ask13: 'Ask ',
	to_die: ' to die',
	milestones_label: 'Milestones Passed',
	return: 'return',
	ask14: 'Ask ',
	to_return: ' to go to the nearest town',
	monsters_label: 'Monsters Killed',
	bricks_label: 'Bricks for Temple',
	logs_label: 'Wood for Ark',
	savings_label: 'Savings',
	pet_status_label: 'Status',
	pet_level_label: 'Level',
	gte_no_penalty: 'Gold can be converted to experience without penalty',
	gte_minor_penalty: 'Gold van be converted to experience with 1/3 penalty',
	gte_major_penalty: 'Gold can be converted to experience with 2/3 penalty',
	gte_unknown_penalty: 'Not enough data to determine the gold to experience conversion penalty. Will resolve after any conversion or in ',
	error_message_title: 'Godville UI+ error!',
	error_message_subtitle: 'We have encountered an error. Please copy the following information, and proceed as per the instrucions from the help window:',
	error_message_text: 'Text of the error:',
	error_message_object: 'Location of the error: object',
	error_message_method: 'method',
	and: ' and ',
	ui_help: 'ui+ help',
};