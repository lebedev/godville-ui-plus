/* global self:false */

(function() {

'use strict';

var browser = 'firefox';
var isBeta = localStorage.getItem('GUIp:beta') === 'true';
var prefix = isBeta ? 'https://raw.githubusercontent.com/zeird/godville-ui-plus/beta/source/'
                    : 'chrome://godville-ui-plus/content/';
var version = self.options.version;

var validPathnames = /^\/(?:superhero|user\/(?:profile|rk_success)|forums\/show(?:_topic)?\/\d+|duels\/log\/)/;
if (document.location.pathname.match(validPathnames)) {
    document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
    var guipContainer = document.getElementById('guip');

    var loaderURL = prefix + 'module_loader.js';
    var script;

    var initScript = function() {
        window.GUIp = {};

        GUIp.version = '$VERSION';
        GUIp.browser = '$BROWSER';
        GUIp.locale = document.location.hostname.match(/^(?:godville\.net|gdvl\.tk|gv\.erinome\.net)/) ? 'ru' : 'en';
        GUIp.common = {
            getResourceURL: function(aResName) {
                return '$PREFIX' + aResName;
            }
        };
    };

    var disableBetaScript = function() {
        var ruWarning = 'Включен beta-канал. В случае проблем нажмите <a id="guip_disable_beta" href="#">сюда</a>, чтоб выключить его.';
        var enWarning = 'Beta-channel is enabled. In case of problems press <a id="guip_disable_beta" href="#">here</a> to disable it.';
        document.body.insertAdjacentHTML(
            'afterbegin',
            '<div style="text-align: center;" id="guip_beta_warning">GUIp: ' + (GUIp.locale === 'ru' ? ruWarning : enWarning) + '</div>'
        );
        document.getElementById('guip_disable_beta').onclick = function() {
            localStorage.setItem('GUIp:beta', false);
            document.location.reload();
        };
    };

    script = document.createElement('script');
    script.textContent = '(' + initScript.toString().replace('$VERSION', version).replace('$PREFIX', prefix).replace('$BROWSER', browser) + ')();';
    guipContainer.appendChild(script);

    if (isBeta) {
        script = document.createElement('script');
        script.textContent = '(' + disableBetaScript.toString() + ')();';
        guipContainer.appendChild(script);
    }

    script = document.createElement('script');
    script.src = loaderURL;
    guipContainer.appendChild(script);
}

})();