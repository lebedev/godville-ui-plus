// ui_data
var ui_data = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "data"}) : worker.GUIp.data = {};

// base variables initialization
ui_data.init = function() {
	ui_data._initVariables();
	ui_data._initForumData();
	ui_data._clearOldDungeonData();

	// init mobile cookies
	if (worker.navigator.userAgent.match(/Android/)) {
		worker.document.cookie = 'm_f=1';
		worker.document.cookie = 'm_pp=1';
		worker.document.cookie = 'm_fl=1';
	}
	
	/* [E] desktop notifications - asking user for a permission */
	if ((ui_storage.get('Option:enableInformerAlerts') || ui_storage.get('Option:enablePmAlerts')) && worker.GUIp_browser !== 'Opera' && Notification.permission !== "granted") {
		Notification.requestPermission();
	}

	ui_data._getLEMRestrictions();
	worker.setInterval(ui_data._getLEMRestrictions, 60*60*1000);

	ui_data._getWantedMonster();
	worker.setInterval(ui_data._getWantedMonster, 5*60*1000);
};
ui_data._initVariables = function() {
	this.currentVersion = '$VERSION';
	this.isFight = ui_stats.isFight();
	this.isDungeon = ui_stats.isDungeon();
	document.body.classList.add(this.isDungeon ? 'dungeon' : this.isFight ? 'fight' : 'field');
	this.god_name = ui_stats.godName();
	this.char_name = ui_stats.charName();
	this.char_sex = ui_stats.isMale() ? worker.GUIp_i18n.hero : worker.GUIp_i18n.heroine;
	ui_storage.set('ui_s', '');
	ui_storage.set('charIsMale', ui_stats.isMale());
	localStorage.setItem('GUIp_CurrentUser', this.god_name);
	if (ui_stats.Bricks() === 1000) {
		document.body.classList.add('has_temple');
		this.hasTemple = true;
	}
	ui_utils.voiceInput = document.getElementById('god_phrase');
};
ui_data._initForumData = function() {
	if (!ui_storage.get('Forum1')) {
		ui_storage.set('Forum1', '{}');
		ui_storage.set('Forum2', '{}');
		ui_storage.set('Forum3', '{}');
		ui_storage.set('Forum4', '{}');
		ui_storage.set('ForumInformers', '{}');

		if (worker.GUIp_locale === 'ru') {
			//ui_storage.set('Forum2', '{"2812": {"posts": 0, "date": 0}}');
			ui_storage.set('Forum5', '{}');
			ui_storage.set('Forum6', '{}');
		} else {
			//ui_storage.set('Forum1', '{"2800": {"posts": 0, "date": 0}}');
		}
	}
};
ui_data._clearOldDungeonData = function() {
	if (!this.isFight && !this.isDungeon) {
		for (var key in localStorage) {
			if (key.match(/:Dungeon:/)) {
				localStorage.removeItem(key);
			}
		}
	}
};
ui_data._getLEMRestrictions = function() {
	if (isNaN(ui_storage.get('LEMRestrictions:Date')) || Date.now() - ui_storage.get('LEMRestrictions:Date') > 24*60*60*1000) {
		if (document.location.protocol != 'https:') {
			ui_utils.getXHR('http://www.godalert.info/Dungeons/guip.cgi', ui_data._parseLEMRestrictions); // via https this won't work anyway and just produce an error in the console
		}
	}
};
ui_data._parseLEMRestrictions = function(xhr) {
	var restrictions = JSON.parse(xhr.responseText);
	ui_storage.set('LEMRestrictions:Date', Date.now());
	ui_storage.set('LEMRestrictions:FirstRequest', restrictions.first_request);
	ui_storage.set('LEMRestrictions:TimeFrame', restrictions.time_frame);
	ui_storage.set('LEMRestrictions:RequestLimit', restrictions.request_limit);
};
ui_data._getWantedMonster = function() {
	if (isNaN(ui_storage.get('WantedMonster:Date')) ||
		ui_utils.dateToMoscowTimeZone(+ui_storage.get('WantedMonster:Date')) < ui_utils.dateToMoscowTimeZone(Date.now())) {
		ui_utils.getXHR('/news', ui_data._parseWantedMonster);
	} else {
		ui_improver.wantedMonsters = new worker.RegExp(ui_storage.get('WantedMonster:Value'));
	}
};
ui_data._parseWantedMonster = function(xhr) {
	var temp = xhr.responseText.match(/(?:Разыскиваются|Wanted)[\s\S]+?>([^<]+?)<\/a>[\s\S]+?>([^<]+?)<\/a>/),
		newWantedMonster = temp ? temp[1] + '|' + temp[2] : '';
	if (newWantedMonster && newWantedMonster !== ui_storage.get('WantedMonster:Value')) {
		ui_storage.set('WantedMonster:Date', Date.now());
		ui_storage.set('WantedMonster:Value', newWantedMonster);
		ui_improver.wantedMonsters = new worker.RegExp(newWantedMonster);
	}
};
