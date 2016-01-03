/* global self:false */

var validPathnames = /^\/(?:superhero|user\/(?:profile|rk_success)|forums\/show(?:_topic)?\/\\d+|duels\/log\/)/;
if (document.location.pathname.match(validPathnames)) {
    document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
    var container = document.getElementById('guip'),
        internalLoaderURL = 'resource://godville-ui-plus-at-badluck-dot-dicey/data/module_loader.js',
        externalLoaderURL = 'https://raw.githubusercontent.com/zeird/godville-ui-plus/master/source/module_loader.js',
        script;

    var basicScript = function() {
        window.GUIp = {};

        GUIp.browser = 'firefox';
        GUIp.locale = document.location.hostname.match(/^(?:godville\.net|gdvl\.tk|gv\.erinome\.net)/) ? 'ru' : 'en';
        GUIp.common = {
            getResourceURL: function(aResName) {
                return "chrome://godville-ui-plus/content/" + aResName;
            },
            getGithubSourceURL: function(aPath) {
                return "https://raw.githubusercontent.com/zeird/godville-ui-plus/master/source/" + aPath;
            }
        };
    };

    script = document.createElement('script');
    script.textContent =
        '(' + basicScript.toString() + ')()\n' +
        'GUIp.version = "' + self.options.version + '";';
    container.appendChild(script);

    script = document.createElement('script');
    script.src = window.localStorage.getItem('GUIp:beta') === 'true' ? externalLoaderURL : internalLoaderURL;
    container.appendChild(script);
}
