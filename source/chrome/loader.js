(function() {
    var prefix = chrome.extension.getURL('');
    sessionStorage.setItem('GUIp_prefix', prefix);

    var specificScripts = {
        'superhero.*':                     'superhero.js',
        'user\/(?:profile|rk_success).*': ['options_page.js', 'options.js'],
        'forums\/show(?:_topic)?\/\\d+.*': 'forum.js',
        'duels\/log\/.*':                  'log.js'
    };

    var attachScripts = function(aSpecificScripts) {
        var ruUrlRegExp = 'godville\\.net|gdvl\\.tk|gv\\.erinome\\.net',
            locale = document.location.hostname.match(ruUrlRegExp) ? 'ru' : 'en',
            commonScriptNames = ['common.js', 'guip_chrome.js', 'phrases_' + locale + '.js'],
            scriptNames = commonScriptNames.concat(aSpecificScripts);

        document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
        var container = document.getElementById('guip'),
            script;
        for (var n in scriptNames) {
            script = document.createElement('script');
            script.src = prefix + scriptNames[n];
            container.appendChild(script);
        }
        script = document.createElement('script');
        script.textContent = 'window.GUIp = window.GUIp || {};\n\nGUIp.version = "' + chrome.runtime.getManifest().version_name + '";';
        container.appendChild(script);
    };

    for (var pathname in specificScripts) {
        if (document.location.pathname.match(pathname)) {
            attachScripts(specificScripts[pathname]);
            break;
        }
    }
})();
