/* global self:false */

(function() {

'use strict';

var prefix = 'chrome://godville-ui-plus/content/';
sessionStorage.setItem('GUIp_prefix', prefix);

var version = self.options.version;

var validPathnames = /^\/(?:superhero|user\/(?:profile|rk_success)|forums\/show(?:_topic)?\/\d+|duels\/log\/)/;
if (document.location.pathname.match(validPathnames)) {
    document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
    var container = document.getElementById('guip'),
        internalLoaderURL = prefix + 'module_loader.js',
        script;

    var basicScript = function() {
        window.GUIp = {};

        GUIp.version = '$VERSION';
        GUIp.browser = 'firefox';
        GUIp.locale = document.location.hostname.match(/^(?:godville\.net|gdvl\.tk|gv\.erinome\.net)/) ? 'ru' : 'en';
        GUIp.common = {
            getResourceURL: function(aResName) {
                return sessionStorage.getItem('GUIp_prefix') + aResName;
            }
        };
    };

    script = document.createElement('script');
    script.textContent = '(' + basicScript.toString().replace('$VERSION', version) + ')();';
    container.appendChild(script);

    script = document.createElement('script');
    script.src = internalLoaderURL;
    container.appendChild(script);
}

})();