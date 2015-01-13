window.GUIp_browser = 'Chrome';
window.GUIp_getResource = function(res) {
	return localStorage.GUIp_prefix + res;
};
window.GUIp_addCSSFromURL = function(href, id) {
	document.head.insertAdjacentHTML('beforeend', '<link id="' + id + '" type="text/css" href="' + href + '" rel="stylesheet" media="screen">');
};
window.GUIp_addCSSFromString = function(text) {
	if (!document.getElementById('guip_user_css')) {
		document.head.insertAdjacentHTML('beforeend', '<style id="guip_user_css" />');
	}
	document.getElementById('guip_user_css').innerHTML = text;
};

// object.watch polyfill
// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function(prop, handler) {
			var oldval = this[prop];
			var getter = function () {
				return oldval;
			};
			var setter = function(newval) {
				handler.call(this, prop, oldval, newval);
				oldval = newval;
			};

			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			}
		}
	});
}
// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}