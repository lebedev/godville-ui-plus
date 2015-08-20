(function() {
var worker = window.wrappedJSObject || window;
var starter = worker.setInterval(initPhrases, 100);
function initPhrases() {
if (!worker.GUIp_browser || !worker.GUIp_github_link) { return; }
worker.clearInterval(starter);

worker.GUIp_words = function() {
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
		go_north: [
			"Go north!"
		],

		// Ключевые корни: Юг
		go_south: [
			"Go south!"
		],

		// Ключевые корни: Запад
		go_west: [
			"Go west!"
		],

		// Ключевые корни: Восток
		go_east: [
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
		exclamation: [
			"For my pleasure", "For science", "Please", "For the Godville", "I command you", "Hey", "Quick",
			"I need you to do something for me"
		]
	},

	usable_items: {
		types: [
			'aura box',
			//'arena box',
			'black box',
			'boss box',
			//'coolstory box',
			'friend box',
			'gift box',
			'good box',
			'invite',
			'heal box',
			'charge box',
			'raidboss box',
			'smelter',
			'teleporter',
			'temper box',
			'to arena box',
			'transformer',
			'quest box'
		],
		descriptions: [
			'This item gives a new aura to the hero',
			//'Данный предмет можно активировать только во время дуэли',
			'This item can affect the hero in a good or bad way',
			'This item summons a boss-monster for the hero to fight',
			//'Этот предмет сочиняет о герое былину',
			'This item helps your hero find a new friend',
			'This spooky item can turn into something',
			'This item may give your hero a pleasant surprise',
			'Activating this item will increase the number of available invitations.',
			'This item can completely restore the hero\'s health',
			'This item adds one accumulator charge when activated',
			'This item makes the hero search for allies against an underground boss',
			'This item kills the monster or tries to melt a golden brick out of 3000 gold coins',
			'This item can teleport the hero into a random town',
			'This item makes hero\'s alignment more defined',
			'This item teleports the hero to the arena when activated',
			'This item can transform one or several bold items in inventory into golden bricks',
			'This item sends the hero on a mini-quest when activated'
		]
	},

	pets: [
	]
	};
};

worker.GUIp_locale = 'en';

worker.GUIp_i18n = {
	// superhero
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
	help_dialog_capt: 'help dialog',
	how_to_update: 'How to update <b>Godville UI+</b> manually:',
	help_update_Firefox: '<li>Open Firefox add-ons page (2 or <b>Ctrl+Shift+A</b>). ' +
		worker.GUIp_github_link + 'help_guide/firefox_manual_update_1.png" title="Opens in a new tab">Picture</a>.</li>' +
		'<li>Click the "gear" (3), then "Check for updates" (4) and wait for a few seconds. ' +
		worker.GUIp_github_link + 'help_guide/firefox_manual_update_2.png" title="Opens in a new tab">Picture</a>.</li>',
	help_update_Chrome: '<li>Open Chrome settings (2). ' +
		worker.GUIp_github_link + 'help_guide/chrome_manual_update_1.png" title="Opens in a new tab">Picture</a>.</li>' +
		'<li>Choose "Extensions" (3), check "Developer mode" (4), click "Update extensions" button (5), ' +
		'which will appear, wait until the browser will refresh the extension,  uncheck the box (6). ' +
		worker.GUIp_github_link + 'help_guide/chrome_manual_update_2.png" title="Opens in a new tab">Picture</a>.</li>',
	help_update_Opera: '<li>Open the extensions page (<b>Ctrl+Shift+E</b>) and uninstall old version of the extension. ' +
		worker.GUIp_github_link + 'help_guide/opera_manual_update_1.png" title="Opens in a new tab">Picture</a>.</li>' +
		'<li>Download new version of the extension from the following link and install it. ' +
		worker.GUIp_github_link + 'release/godville-ui-plus@badluck.dicey.oex"  title="Opens in a new tab">Link to the new version.</a></li>',
	help_useful_links: 'Useful links: ' +
		'<a href="/forums/show_topic/2800" title="Opens in a new tab" target="_blank">forum thread</a>, ' +
		//'<a href="http://wiki.godville.net/Godville_UI+" title="Откроется в новой вкладке" target="about:blank">статья в богии</a>, ' +
		'<a href="/gods/God%20Of%20Dungeons" title="Opens in a new tab" target="about:blank">dungeon phrases</a>.',
	ui_settings_top_menu: '<strong>ui+</strong>&nbsp;settings',
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
	north: 'north',
	go_north: ' to go north',
	east: 'east',
	go_east: ' to go east',
	south: 'south',
	go_south: ' to go south',
	west: 'west',
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
	unknown_trap_hint: 'trap blocked by pet',
	trophy_loss_trap_hint: 'trap: gold or trophy loss',
	low_damage_trap_hint: 'trap: low damage',
	moderate_damage_trap_hint: 'trap: moderate damage',
	move_loss_trap_hint: 'trap: move loss',
	boss_warning_and_trap_hint: 'boss warning and trap',
	boss_slay_and_trap_hint: 'boss and trap',
	treasury_hint: '<abbr title="Treasury might be located in this cell according to known hints">possible treasury</abbr>',
	treasury_th_hint: '<abbr title="Treasury might be located in this cell if an unknown wall exists between this cell and the hint">possible treasury</abbr> in Hotness Dungeon',
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
	gte_unknown_penalty: 'Not enough data to determine the gold to experience conversion penalty. Will resolve after any conversion or in ',
	log_unknown_time: 'Not enough data to determine when the guaranteed log will be. Will resolve after receiving a log or in ',
	log_is_guaranteed: 'The log is guaranteed',
	log_isnt_guaranteed: 'The log isn\'t guaranteed',
	error_message_title: 'Godville UI+ error!',
	debug_mode_warning: 'Warning! Error details are shown because debug mode is enabled. Your Godville&nbsp;UI+ version may be outdated. ' +
		'Uncheck "Enable debugging mode" in ui+ settings, if you aren\'t sure whether you need it.',
	possible_actions: 'Possible actions:',
	if_first_time: 'If this error has occured for the first time — ',
	press_here_to_reload: 'press here to reload the page.',
	if_repeats: 'If this error repeats — ',
	press_here_to_show_details: 'press here to show the details of the error.',
	error_message_subtitle: 'No one will help you with this:',
	error_message_text: 'Text of the error:',
	error_message_stack_trace: 'Stack trace',
	error_message_in_old_version: 'An error has occurred. However, your Godville&nbsp;UI+ version is outdated. Update as per the instrucions from the help dialog (it\'s opened now).',
	and: ' and ',
	or: ' or ',
	ui_help: 'ui+&nbsp;help',
	// options
	import_success: 'You setting\'ve been imported successfully',
	import_fail: 'Incorrect settings string',
	ui_settings: 'UI+ Settings',
	import_prompt: 'Settings import\nPaste here your settings string',
	export_prompt: 'Settings export\nCopy your settings string from here',
	bg_status_file: 'file',
	bg_status_link: 'link',
	bg_status_same: 'same',
	bg_status_error: 'error',
	// options-page
	profile_menu_settings: 'Settings',
	profile_menu_informers: 'Informers',
	profile_menu_gadgets: 'Mobile Apps',
	profile_menu_invites: 'Invites',
	profile_menu_plogs: 'Recharges',
	ui_settings_capt: 'Godville UI+ settings',
	disable_voice_generators: 'Disable godvoice generators',
	use_hero_name: 'Hero name in voice',
	use_hero_name_desc: 'adds hero name to the beginning of a voice',
	use_exclamatios: 'Exclamation in voice',
	use_exclamatios_desc: 'adds exclamation to the voice',
	use_short_phrases: 'Short voices',
	use_short_phrases_desc: 'uses only one phrase instead of several',
	disable_die_button: 'Disable "Die" button',
	disable_die_button_desc: 'for those, who are nervous about it',
	disable_logger: 'Disable logger',
	disable_logger_desc: 'Disable the ticker with colorful numbers',
	relocate_duel_buttons: 'Move duel buttons',
	relocate_duel_buttons_desc: 'allows to move duel buttons into the pantheons section',
	relocate_duel_buttons_hint: 'which ones?',
	relocate_duel_buttons_arena: 'arena',
	relocate_duel_buttons_challenge: 'challenge',
	forbidden_title_notices: 'Choose notifications in window title',
	forbidden_title_notices_desc: 'allows to disable certain notifications in the title',
	forbidden_title_notices_hint: 'which ones?',
	forbidden_title_notices_pm: 'private message',
	forbidden_title_notices_gm: 'guild counsel',
	forbidden_title_notices_fi: 'new forum posts',
	use_background: 'Enable background',
	use_background_desc: 'Enable cloudy or another background',
	use_background_hint: 'which one?',
	use_background_cloud: 'cloudy',
	use_background_file: 'from file',
	use_background_link: 'from link',
	voice_timeout: 'Choose timeout length',
	voice_timeout_desc: 'to replace the default 20 seconds',
	voice_timeout_hint: 'enter time (in seconds)',
	hide_charge_button: 'Remove "Charge" button',
	hide_charge_button_desc: 'for those who don\'t buy charges',
	relocate_map: 'Swap remote control with map',
	relocate_map_desc: 'in the dungeons',
	freeze_voice_button: 'Freeze godvoice button',
	freeze_voice_button_desc: 'freezes godvoice button in certain cases',
	freeze_voice_button_after_voice: 'after voice has been heard',
	freeze_voice_button_when_empty: 'when no voice text is entered',
	forbidden_craft: 'Choose crafting modes',
	forbidden_craft_desc: 'allows to disable crafting of certain types and categories of items',
	forbidden_craft_b_b: '<b>bold</b> + <b>bold</b>',
	forbidden_craft_b_r: '<b>bold</b> + regular',
	forbidden_craft_r_r: 'regular + regular',
	forbidden_craft_usable: 'including <b>activatable</b>',
	forbidden_craft_heal: 'including healing',
	disable_page_refresh: 'Disable automatic page refresh',
	disable_page_refresh_desc: 'when the hero page hangs (approved by the devs)',
	disable_laying_timer: 'Remove experience conversion timer',
	disable_laying_timer_desc: 'for those who are tired of it',
	forbidden_informers: 'Choose informers manually',
	forbidden_informers_desc: 'allows to choose which informers to show',
	forbidden_informers_full_godpower: 'full godpower',
	forbidden_informers_much_gold: 'lots of gold',
	forbidden_informers_dead: 'death',
	forbidden_informers_fight: 'fight',
	forbidden_informers_arena_available: 'arena available',
	forbidden_informers_dungeon_available: 'dungeon available',
	forbidden_informers_wanted_monster: 'wanted monster',
	forbidden_informers_special_monster: 'special monster',
	forbidden_informers_tamable_monster: 'tamable monster',
	forbidden_informers_pet_knocked_out: 'pet knocked out',
	forbidden_informers_close_to_boss: 'boss warning (dungeon)',
	forbidden_informers_guild_quest: 'attempt to defect from the guild',
	forbidden_informers_mini_quest: 'beginning of a mini-quest',
	forbidden_informers_usable_items: 'Activatable trophies',
	forbidden_informers_check: 'check',
	forbidden_informers_check_all: 'all',
	forbidden_informers_or: 'or',
	forbidden_informers_check_none: 'none',
	forbidden_informers_arena_box: 'arena trophies',
	forbidden_informers_aura_box: 'trophies giving an aura',
	forbidden_informers_black_box: 'trophies randomly affecting a hero',
	forbidden_informers_boss_box: 'trophies summoning a boss monster',
	forbidden_informers_charge_box: 'trophies giving a godpower charge',
	forbidden_informers_coolstory_box: 'composing a tale',
	forbidden_informers_gift_box: 'free golden brick',
	forbidden_informers_friend_box: 'making random friend',
	forbidden_informers_good_box: 'affecting a hero in a good way',
	forbidden_informers_heal_box: 'restoring health',
	forbidden_informers_invite: 'Godville invite',
	forbidden_informers_raidboss_box: 'summoning an underground boss monster',
	forbidden_informers_quest_box: 'sending hero into a mini-quest',
	forbidden_informers_smelter: 'melting gold into a brick',
	forbidden_informers_teleporter: 'teleporting into a town',
	forbidden_informers_temper_box: 'changing hero\'s alignment',
	forbidden_informers_to_arena_box: 'sending hero to arena',
	forbidden_informers_transformer: 'transforming <b>items</b> into golden bricks',
	disable_pm_sound: 'Disable private message sound',
	disable_pm_sound_desc: 'for those annoyed by a "ding"',
	disable_arena_sound: 'Disable arena sounds',
	disable_arena_sound_desc: 'arena, challenge, boss, dungeon',
	disable_links_autoreplace: 'Disable links autoreplace by images',
	disable_links_autoreplace_desc: 'in forum threads',
	enable_debug_mode: 'Enable debugging mode',
	enable_debug_mode_desc: 'just for developers',
	apply: 'Apply',
	voices_capt: 'Voice phrases',
	voices_heal: 'Heal',
	voices_pray: 'Pray',
	voices_sacrifice: 'Sacrifice',
	voices_exp: 'Study',
	voices_dig: 'Dig',
	voices_hit: 'Hit',
	voices_do_task: 'Do task',
	voices_cancel_task: 'Cancel task',
	voices_die: 'Die',
	voices_town: 'Return',
	voices_defend: 'Defend',
	voices_exclamation: 'Exclamation',
	voices_inspect_prefix: 'Inspect prefixes',
	voices_craft_prefix: 'Craft prefixes',
	voices_north: 'North',
	voices_south: 'South',
	voices_west: 'West',
	voices_east: 'East',
	voices_save: 'Save',
	voices_defaults: 'Reset to default',
	import_export_capt: 'Settings import/export',
	import: 'Import',
	export: 'Export',
	// forum
	Subscribe: 'Subscribe',
	Unsubscribe: 'Unsubscribe',
	subscribe: 'subscribe',
	unsubscribe: 'unsubscribe',
	bold_hint: 'Bold',
	bold: 'B',
	underline_hint: 'Underline',
	underline: 'U',
	strike_hint: 'Strike',
	strike: 'S',
	italic_hint: 'Italic',
	italic: 'I',
	quote_hint: 'Quote',
	code_hint: 'Code',
	link_hint: 'Insert link',
	unordered_list_hint: 'Unordered list',
	ordered_list_hint: 'Ordered list',
	br_hint: 'Insert line breaker',
	sup_hint: 'Superscript',
	sub_hint: 'Subscript',
	monospace_hint: 'Monospace',
	monospace: 'ms',
	broadcast: 'broadcast',
	user_css: 'User CSS',
	open_chat_with: 'Open chat with god/goddess ',
	open_in_a_new_tab: 'Open in a new tab',
	north_east: 'north-east',
	north_west: 'north-west',
	south_east: 'south-east',
	south_west: 'south-west',
	burning: 'very hot (1-2 steps from treasure)',
	hot: 'hot (3-5 steps from treasure)',
	warm: 'warm (6-9 steps from treasure)',
	mild: 'mild (10-13 steps from treasure)',
	cold: 'cold (14-18 steps from treasure)',
	freezing: 'very cold (19 or more steps from treasure)',
	send_log_to_LEMs_script: 'Send the log to LEM\'s script<br>',
	till_next_try: 'Till next try: ',
	tries_left: 'Tries left: ',
	map: 'Map',
	wrong_entries_order: 'The button works on another entries order only.',
	the_button_will_appear_after: 'The button will appear at ',
	step: '+ step.',
	get_your_map: 'Get your map',
	search_database: 'Search Database',
	relaxed_search: 'Relaxed search',
	exact: 'Exact',
	high_precision: 'High Precision',
	normal: 'Normal',
	primary: 'Primary',
	corrections: 'Corrections:',
	browser: 'Browser:',
	version: 'Version:',
	clear_voice_input: 'Clear voice input',
	trophy: 'trophy ',
	high_contrast: 'High contrast mode (for vision impared)',
	coords_error_title: 'Chronicle parsing failed!',
	coords_error_desc: 'Coordinates mismatch',
};

delete worker.GUIp_github_link;

}
})();