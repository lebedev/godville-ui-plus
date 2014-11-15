var GUIp_browser = 'Chrome';
GUIp_getResource = function(res) {
	return localStorage.getItem('GUIp_prefix') + res;
};
GUIp_addGlobalStyleURL = function(url, id) {
	var sel = document.createElement('link');
	sel.setAttribute('type', 'text/css');
	sel.setAttribute('href', url);
	sel.setAttribute('media', 'screen');
	sel.setAttribute('rel', 'stylesheet');
	sel.setAttribute('id', id);
	document.head.appendChild(sel);
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