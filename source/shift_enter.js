var inlineChatImprove = function() {
	var keypresses, handlers,
		$tas = $('.frInputArea textarea:not(.improved)');
	if ($tas.length) {
		var new_keypress = function(handlers) {
			return function(e) {
				if (e.which === 13 && !e.shiftKey) {
					for (var i = 0, len = handlers.length; i < len; i++) {
						handlers[i](e);
					}
				}
			};
		};
		for (var i = 0, len = $tas.length; i < len; i++) {
			keypresses = $._data($tas[i], 'events').keypress;
			handlers = [];
			for (var j = 0, klen = keypresses.length; j < klen; j++) {
				handlers.push(keypresses[j].handler);
			}
			$tas.eq(i).unbind('keypress').keypress(new_keypress(handlers));
		}
		$tas.addClass('improved');
		new_keypress = null;
	}
};
$(document).bind('DOMNodeInserted', inlineChatImprove);