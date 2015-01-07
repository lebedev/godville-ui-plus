(function() {
	'use strict';

	function updateButton() {
		var i;
		if (!isNaN(localStorage[godname_prefix + log + 'sentToLEM4']) && Date.now() - localStorage[godname_prefix + log + 'sentToLEM4'] < time_frame_seconds*1000) {
			var time = time_frame_seconds - (Date.now() - localStorage[godname_prefix + log + 'sentToLEM4'])/1000,
				minutes = Math.floor(time/60),
				seconds = Math.floor(time%60);
			seconds = seconds < 10 ? '0' + seconds : seconds;
			button.value = 'Отправить лог в скрипт ЛЕМа\nДо следующей попытки: ' + minutes + ':' + seconds;
			button.setAttribute('disabled', 'disabled');
		} else {
			var tries = 0;
			for (i = 0; i < (localStorage[godname_prefix + 'LEMRestrictions:RequestLimit'] || 4); i++) {
				if (isNaN(localStorage[godname_prefix + log + 'sentToLEM' + i]) || Date.now() - localStorage[godname_prefix + log + 'sentToLEM' + i] > time_frame_seconds*1000) {
					tries++;
				}
			}
			button.value = 'Отправить лог в скрипт ЛЕМа\nОсталось попыток: ' + tries;
			button.removeAttribute('disabled');
		}
		// old entries deletion
		var len, lines = [];
		for (i = 0, len = localStorage.length; i < len; i++) {
			if (localStorage.key(i).match(godname_prefix + 'Log:')) {
				lines.push(localStorage.key(i));
			}
		}
		for (i = 0, len = lines.length; i < len; i++) {
			if (Date.now() - localStorage[lines[i]] > time_frame_seconds*1000) {
				localStorage.removeItem(lines[i]);
			}
		}
	}

	if (location.href.match('boss') || !document.getElementById('fight_log_capt').textContent.match('Хроника подземелья')) {
		return;
	}
	var $box = document.querySelector('#hero2 fieldset') || document.getElementById('right_block');
	if (location.href.match('sort')) {
		$box.insertAdjacentHTML('beforeend', '<span>Кнопка работает только при другом порядке записей.</span>');
		return;
	}
	var steps = +document.getElementById('fight_log_capt').textContent.match(/Хроника подземелья \(шаг (\d+)\)/)[1],
		steps_min = localStorage[godname_prefix + 'LEMRestrictions:FirstRequest'] || 12;
	if (steps < steps_min) {
		$box.insertAdjacentHTML('beforeend', '<span>Кнопка появится на ' + steps_min + '+ шаге.</span>');
		return;
	}
	$box.insertAdjacentHTML('beforeend',
		'<form target="_blank" method="post" enctype="multipart/form-data" action="http://www.godalert.info/Dungeons/index.cgi" id="send_to_LEM_form" style="padding-top: calc(2em + 3px);">' +
			'<input type="hidden" id="fight_text" name="fight_text">' +
			'<input type="hidden" name="map_type" value="map_graphic">' +
			'<input type="hidden" name="min" value="X">' +
			'<input type="hidden" name="partial" value="X">' +
			'<input type="hidden" name="room_x" value="">' +
			'<input type="hidden" name="room_y" value="">' +
			'<input type="hidden" name="Submit" value="Получить карту">' +
			'<input type="hidden" name="guip" value="1">' +
			'<input type="checkbox" id="match" name="match" value="1"><label for="match">Искать в базе данных.</label>' +
			'<div id="search_mode" style="display: none;">' +
				'<input type="checkbox" id="match_partial" name="match_partial" value="1"><label for="match_partial">Нестрогий поиск.</label>' +
				'<div><input type="radio" id="exact" name="search_mode" value="exact"><label for="exact">Абсолютный поиск.</label></div>' +
				'<div><input type="radio" id="high" name="search_mode" value="high"><label for="high">Высокоточный поиск.</label></div>' +
				'<div><input type="radio" id="medium" name="search_mode" value="medium" checked=""><label for="medium">Нормальный поиск.</label></div>' +
				'<div><input type="radio" id="low" name="search_mode" value="low"><label for="low">Первичный поиск.</label></div>' +
			'</div>' +
			'<table style="box-shadow: none; width: 100%;"><tr>' +
				'<td style="border: none; padding: 0;"><label for="stoneeater">Корректировки:</label></td>' +
				'<td style="border: none; padding: 0 1.5px 0 0; width: 100%;"><input type="text" id="stoneeater" name="stoneeater" value="" style=" width: 100%; padding: 0;"></td>' +
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
	var godname_prefix = 'GUIp_' + localStorage.GUIp_CurrentUser + ':',
		log = 'Log:' + location.href.match(/duels\/log\/([^\?]+)/)[1] + ':',
		button = document.getElementById('send_to_LEM'),
		match = document.getElementById('match'),
		search_mode = document.getElementById('search_mode'),
		time_frame_seconds = (localStorage[godname_prefix + 'LEMRestrictions:TimeFrame'] || 6)*60;
	button.onclick = function(e) {
		e.preventDefault();
		if (isNaN(localStorage[godname_prefix + log + 'sentToLEM4']) || Date.now() - localStorage[godname_prefix + log + 'sentToLEM4'] > time_frame_seconds*1000) {
			for (var i = (localStorage[godname_prefix + 'LEMRestrictions:RequestLimit'] || 4); i > 1; i--) {
				localStorage[godname_prefix + log + 'sentToLEM' + i] = localStorage[godname_prefix + log + 'sentToLEM' + (i - 1)];
			}
			localStorage[godname_prefix + log + 'sentToLEM1'] = Date.now();
			updateButton();
			this.form.submit();
			document.getElementById('match').checked = false;
			document.getElementById('match_partial').checked = false;
			document.getElementById('medium').click();
			document.getElementById('search_mode').style.display = "none";
		} else {
			return false;
		}
	};

	updateButton();
	setInterval(updateButton, 1000);
	match.onchange = function() {
		search_mode.style.display = search_mode.style.display === 'none' ? 'block' : 'none';
	};
})();