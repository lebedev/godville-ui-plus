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
        externalLoaderURL = 'https://rawgit.com/zeird/godville-ui-plus/master/source/module_loader.js',
        script;

    var basicScript = function() {
        window.GUIp = {};

        GUIp.version = '$VERSION';
        GUIp.browser = 'firefox';
        GUIp.locale = document.location.hostname.match(/^(?:godville\.net|gdvl\.tk|gv\.erinome\.net)/) ? 'ru' : 'en';
        GUIp.common = {
            getResourceURL: function(aResName) {
                return sessionStorage.getItem('GUIp_prefix') + aResName;
            },
            getGithubSourceURL: function(aPath) {
                return 'https://rawgit.com/zeird/godville-ui-plus/master/source/' + aPath;
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
    script.textContent = '(' + basicScript.toString().replace('$VERSION', version) + ')();';
    container.appendChild(script);

    if (window.localStorage.getItem('GUIp:beta') === 'true') {
        script = document.createElement('script');
        script.textContent = '(' + disableBetaScript.toString() + ')();';
        container.appendChild(script);
    }

    script = document.createElement('script');
    script.src = window.localStorage.getItem('GUIp:beta') === 'true' ? externalLoaderURL : internalLoaderURL;
    container.appendChild(script);
}

})();