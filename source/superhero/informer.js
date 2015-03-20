// ui_informer
var ui_informer = window.wrappedJSObject ? createObjectIn(worker.GUIp, {defineAs: "informer"}) : worker.GUIp.informer = {};

ui_informer.init = function() {
	//title saver
	this.title = document.title;
	// container
	document.getElementById('main_wrapper').insertAdjacentHTML('afterbegin', '<div id="informer_bar" />');
	this.container = document.getElementById('informer_bar');
	// load and draw labels
	ui_informer._load();
	for (var flag in this.flags) {
		if (this.flags[flag]) {
			ui_informer._createLabel(flag);
		}
	}
	// run flicker
	ui_informer._tick();
};
ui_informer._load = function() {
	this.flags = JSON.parse(ui_storage.get('informer_flags') || '{}');
	for (var flag in this.flags) {
		if (this.flags[flag]) {
			delete this.flags[flag];
		}
	}
	ui_informer._save();
};
ui_informer._save = function() {
	ui_storage.set('informer_flags', JSON.stringify(this.flags));
};
ui_informer._createLabel = function(flag) {
	var id = flag.replace(/ /g, '_');
	this.container.insertAdjacentHTML('beforeend', '<div id="' + id + '">' + flag + '</div>');
	document.getElementById(id).onclick = function() {
		ui_informer.hide(flag);
		return false;
	};
};
ui_informer._deleteLabel = function(flag) {
	var label = document.getElementById(flag.replace(/ /g, '_'));
	if (label) {
		this.container.removeChild(label);
	}
};
ui_informer._tick = function() {
	// пройти по всем флагам и выбрать те, которые надо показывать
	var to_show = [];
	for (var flag in this.flags) {
		if (this.flags[flag]) {
			to_show.push(flag);
		}
	}
	to_show.sort();

	// если есть чё, показать или вернуть стандартный заголовок
	if (to_show.length > 0) {
		ui_informer._updateTitle(to_show);
		this.tref = worker.setTimeout(ui_informer._tick.bind(ui_informer), 700);
	} else {
		ui_informer.clearTitle();
		this.tref = undefined;
	}
};
ui_informer.clearTitle = function() {
	document.title = ui_informer._getTitleNotices() + this.title;

	var sc = document.querySelector('link[rel="shortcut icon"]');
	if (sc) {
		document.head.removeChild(sc);
	}
	document.head.insertAdjacentHTML('beforeend', '<link rel="shortcut icon" href="images/favicon.ico" />');
};
ui_informer._getTitleNotices = function() {
	var forbidden_title_notices = ui_storage.get('Option:forbiddenTitleNotices') || '';
	var titleNotices = (!forbidden_title_notices.match('pm') ? ui_informer._getPMTitleNotice() : '') +
					   (!forbidden_title_notices.match('gm') ? ui_informer._getGMTitleNotice() : '') +
					   (!forbidden_title_notices.match('fi') ? ui_informer._getFITitleNotice() : '');
	return titleNotices ? titleNotices + ' ' : '';
};
ui_informer._getPMTitleNotice = function() {
	var pm = 0,
		pm_badge = document.querySelector('.fr_new_badge_pos');
	if (pm_badge && pm_badge.style.display !== 'none') {
		pm = +pm_badge.textContent;
	}
	var stars = document.querySelectorAll('.msgDock .fr_new_msg');
	for (var i = 0, len = stars.length; i < len; i++) {
		if (!stars[i].parentNode.getElementsByClassName('dockfrname')[0].textContent.match(/Гильдсовет|Guild Council/)) {
			pm++;
		}
	}
	return pm ? '[' + pm + ']' : '';
};
ui_informer._getGMTitleNotice = function() {
	var gm = document.getElementsByClassName('gc_new_badge')[0].style.display !== 'none',
		stars = document.querySelectorAll('.msgDock .fr_new_msg');
	for (var i = 0, len = stars.length; i < len; i++) {
		if (stars[i].parentNode.getElementsByClassName('dockfrname')[0].textContent.match(/Гильдсовет|Guild Council/)) {
			gm = true;
			break;
		}
	}
	return gm ? '[g]' : '';
};
ui_informer._getFITitleNotice = function() {
	return document.querySelector('#forum_informer_bar a') ? '[f]' : '';
};
ui_informer._updateTitle = function(arr) {
	this.odd_tick = !this.odd_tick;
	var sep, favicon;
	if (this.odd_tick) {
		sep = '...';
		favicon = 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=';
	} else {
		sep = '!!!';
		favicon = "images/favicon.ico";
	}
	document.title = ui_informer._getTitleNotices() + sep + ' ' + arr.join('! ') + ' ' + sep;
	worker.$('link[rel="shortcut icon"]').remove();
	worker.$('head').append('<link rel="shortcut icon" href=' + favicon + ' />');
};
ui_informer.update = function(flag, value) {
	if (value && (flag === 'fight' || !(ui_data.isFight && !ui_data.isDungeon)) && !(ui_storage.get('Option:forbiddenInformers') &&
		ui_storage.get('Option:forbiddenInformers').match(flag.replace(/ /g, '_')))) {
		if (!(flag in this.flags)) {
			this.flags[flag] = true;
			ui_informer._createLabel(flag);
			ui_informer._save();
		}
	} else if (flag in this.flags) {
		delete this.flags[flag];
		ui_informer._deleteLabel(flag);
		ui_informer._save();
	}
	if (!this.tref) {
		ui_informer._tick();
	}
};
ui_informer.hide = function(flag) {
	this.flags[flag] = false;
	ui_informer._deleteLabel(flag);
	ui_informer._save();
};
