function GUIp_log() {
	'use strict';
	if (!worker.GUIp_locale || !worker.GUIp_i18n) { return; }
	worker.clearInterval(starterInt);

	function updateButton() {
		var i;
		if (!isNaN(worker.localStorage[godname_prefix + log + 'sentToLEM' + request_limit]) && Date.now() - worker.localStorage[godname_prefix + log + 'sentToLEM' + request_limit] < time_frame_seconds*1000) {
			var time = time_frame_seconds - (Date.now() - worker.localStorage[godname_prefix + log + 'sentToLEM' + request_limit])/1000,
				minutes = Math.floor(time/60),
				seconds = Math.floor(time%60);
			seconds = seconds < 10 ? '0' + seconds : seconds;
			button.value = worker.GUIp_i18n.send_log_to_LEMs_script + worker.GUIp_i18n.till_next_try + minutes + ':' + seconds;
			button.setAttribute('disabled', 'disabled');
		} else {
			var tries = 0;
			for (i = 0; i < request_limit; i++) {
				if (isNaN(worker.localStorage[godname_prefix + log + 'sentToLEM' + i]) || Date.now() - worker.localStorage[godname_prefix + log + 'sentToLEM' + i] > time_frame_seconds*1000) {
					tries++;
				}
			}
			button.value = worker.GUIp_i18n.send_log_to_LEMs_script + worker.GUIp_i18n.tries_left + tries;
			button.removeAttribute('disabled');
		}
	}

	function deleteOldEntries() {
		// old entries deletion
		var len, lines = [];
		for (i = 0, len = worker.localStorage.length; i < len; i++) {
			if (worker.localStorage.key(i).match(godname_prefix + 'Log:\\w{5}:') && !worker.localStorage.key(i).match(log + '|' + worker.localStorage[godname_prefix + 'Log:current'])) {
				lines.push(worker.localStorage.key(i));
			}
		}
		for (i = 0, len = lines.length; i < len; i++) {
			if (isNaN(worker.localStorage[lines[i]]) || Date.now() - worker.localStorage[lines[i]] > time_frame_seconds*1000) {
				worker.localStorage.removeItem(lines[i]);
			}
		}
	}

	if (location.href.match('boss') || !document.getElementById('fight_log_capt').textContent.match(/Хроника подземелья|Dungeon Journal/)) {
		return;
	}

	try {
		var godname_prefix = 'GUIp_' + worker.localStorage.GUIp_CurrentUser + ':',
			log = 'Log:' + location.href.match(/duels\/log\/([^\?]+)/)[1] + ':',
			steps = +document.getElementById('fight_log_capt').textContent.match(/Хроника подземелья \(шаг (\d+)\)|Dungeon Journal \(step (\d+)\)/)[1];
		if (!document.querySelector('#dmap') && steps === +worker.localStorage[godname_prefix + log + 'steps']) {
			var map = JSON.parse(worker.localStorage[godname_prefix + log + 'map']),
				map_elem = '<div id="hero2"><div class="box"><fieldset style="min-width:0;"><legend>' + worker.GUIp_i18n.map + '</legend><div id="dmap" class="new_line">';
			for (var i = 0, ilen = map.length; i < ilen; i++) {
				map_elem += '<div class="dml" style="width:' + (map[0].length * 21) + 'px;">';
				for (var j = 0, jlen = map[0].length; j < jlen; j++) {
					map_elem += '<div class="dmc">' + map[i][j] + '</div>';
				}
				map_elem += '</div>';
			}
			map_elem += '</div></fieldset></div></div>';
			document.getElementById('right_block').insertAdjacentHTML('beforeend', map_elem);
		}
		var $box = document.querySelector('#hero2 fieldset') || document.getElementById('right_block');
		if (location.href.match('sort')) {
			$box.insertAdjacentHTML('beforeend', '<span>' + worker.GUIp_i18n.wrong_entries_order + '</span>');
			return;
		}
		var steps_min = worker.localStorage[godname_prefix + 'LEMRestrictions:FirstRequest'] || 12;
		if (steps < steps_min) {
			$box.insertAdjacentHTML('beforeend', '<span>' + worker.GUIp_i18n.the_button_will_appear_after + steps_min + worker.GUIp_i18n.step + '</span>');
			return;
		}
		$box.insertAdjacentHTML('beforeend',
			'<form target="_blank" method="post" enctype="multipart/form-data" action="http://www.godalert.info/Dungeons/index' + (worker.GUIp_locale === 'en' ? '-eng' : '') + '.cgi" id="send_to_LEM_form" style="padding-top: calc(2em + 3px);">' +
				'<input type="hidden" id="fight_text" name="fight_text">' +
				'<input type="hidden" name="map_type" value="map_graphic">' +
				'<input type="hidden" name="min" value="X">' +
				'<input type="hidden" name="partial" value="X">' +
				'<input type="hidden" name="room_x" value="">' +
				'<input type="hidden" name="room_y" value="">' +
				'<input type="hidden" name="Submit" value="' + worker.GUIp_i18n.get_your_map + '">' +
				'<input type="hidden" name="guip" value="1">' +
				'<input type="checkbox" id="match" name="match" value="1"><label for="match">' + worker.GUIp_i18n.search_database + '</label>' +
				'<div id="search_mode" style="display: none;">' +
					'<input type="checkbox" id="match_partial" name="match_partial" value="1"><label for="match_partial">' + worker.GUIp_i18n.relaxed_search + '</label>' +
					'<div><input type="radio" id="exact" name="search_mode" value="exact"><label for="exact">' + worker.GUIp_i18n.exact + '</label></div>' +
					'<div><input type="radio" id="high" name="search_mode" value="high"><label for="high">' + worker.GUIp_i18n.high_precision + '</label></div>' +
					'<div><input type="radio" id="medium" name="search_mode" value="medium" checked=""><label for="medium">' + worker.GUIp_i18n.normal + '</label></div>' +
					'<div><input type="radio" id="low" name="search_mode" value="low"><label for="low">' + worker.GUIp_i18n.primary + '</label></div>' +
				'</div>' +
				'<table style="box-shadow: none; width: 100%;"><tr>' +
					'<td style="border: none; padding: 0;"><label for="stoneeater">' + worker.GUIp_i18n.corrections + '</label></td>' +
					'<td style="border: none; padding: 0 1.5px 0 0; width: 100%;"><input type="text" id="stoneeater" name="stoneeater" value="' + worker.localStorage[godname_prefix + log + 'corrections'] + '" style=" width: 100%; padding: 0;"></td>' +
				'</tr></table>' +
				'<input type="submit" id="send_to_LEM" style="font-size: 15px; height: 100px; width: 100%;">' +
			'</form>');
		document.querySelector('#fight_text').value = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' +
															document.getElementsByTagName('html')[0].innerHTML.replace(/<(?:script|style)[\S\s]+?<\/(?:script|style)>/g, '')
																											  .replace(/onclick="[^"]+?"/g, '')
																											  .replace(/"javascript[^"]+"/g, '""')
																											  .replace(/<form[\s\S]+?<\/form>/g, '')
																											  .replace(/<iframe[\s\S]+?<\/iframe>/g, '')
																											  .replace(/\t/g, '')
																											  .replace(/ {2,}/g, ' ')
																											  .replace(/\n{2,}/g, '\n') +
													  '</html>';
		var button = document.getElementById('send_to_LEM'),
			match = document.getElementById('match'),
			search_mode = document.getElementById('search_mode'),
			time_frame_seconds = (worker.localStorage[godname_prefix + 'LEMRestrictions:TimeFrame'] || 15)*60,
			request_limit = worker.localStorage[godname_prefix + 'LEMRestrictions:RequestLimit'] || 5;
		button.onclick = function(e) {
			e.preventDefault();
			for (var i = request_limit; i > 1; i--) {
				worker.localStorage[godname_prefix + log + 'sentToLEM' + i] = worker.localStorage[godname_prefix + log + 'sentToLEM' + (i - 1)];
			}
			worker.localStorage[godname_prefix + log + 'sentToLEM1'] = Date.now();
			updateButton();
			this.form.submit();
			document.getElementById('match').checked = false;
			document.getElementById('match_partial').checked = false;
			document.getElementById('medium').click();
			document.getElementById('search_mode').style.display = "none";
		};

		updateButton();
		worker.setInterval(function() {
			updateButton();
			deleteOldEntries();
		}, 1000);
		match.onchange = function() {
			search_mode.style.display = search_mode.style.display === 'none' ? 'block' : 'none';
		};
	} catch(e) {
		worker.console.log(e);
	}
}

var worker = window.wrappedJSObject || window,
	starterInt = worker.setInterval(GUIp_log, 50);