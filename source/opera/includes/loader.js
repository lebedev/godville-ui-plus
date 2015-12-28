window.addEventListener('DOMContentLoaded', function() {
    if (!document.location.host.match(/godville\.net|godvillegame\.com|gdvl\.tk|gv\.erinome\.net/)) {
        return;
    }

    var attachFiles = function(aSpecificFileNames, aLocale) {
        var createElement = function(aTagName) {
            var el = document.createElement(aTagName);
            el.textContent = this.result;
            container.appendChild(el);
        };

        // Reads version number from config.
        var fr = new FileReader();
        fr.onload = function() {
            var GUIp_version_script = document.createElement('script');
            GUIp_version_script.textContent = 'window.GUIp = window.GUIp || {};\n\nGUIp.version = "' + this.result.match(/widget .+? version="([^"]+)"/)[1] + '";';
            container.appendChild(GUIp_version_script);
        };
        fr.readAsText(opera.extension.getFile('/config.xml'));

        var ruUrlRegExp = 'godville\\.net|gdvl\\.tk|gv\\.erinome\\.net',
            locale = document.location.hostname.match(ruUrlRegExp) ? 'ru' : 'en',
            commonScriptNames = ['common.js', 'guip_opera.js', 'phrases_' + locale + '.js'],
            fileNames = commonScriptNames.concat(aSpecificFileNames);

        document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
        var container = document.getElementById('guip');

        for (var i in fileNames) {
            var fileObj = opera.extension.getFile('/content/' + fileNames[i]);
            if (fileObj) {
                fr = new FileReader();
                fr.onload = createElement.bind(fr, fileNames[i].match(/\.js$/) ? 'script' : 'style');
                fr.readAsText(fileObj);
            }
        }
    };

    var specificFileNames = {
        'superhero.*':                     ['polyfills/Promise.js', 'polyfills/WeakMap.js', 'polyfills/MutationObserver.js', 'superhero.js', 'superhero.css'],
        'user\/(?:profile|rk_success).*':  ['options_page.js', 'options.js', 'options.css'],
        'forums\/show(?:_topic)?\/\\d+.*': ['polyfills/WeakMap.js', 'polyfills/MutationObserver.js', 'forum.js', 'forum.css'],
        'duels\/log\/.*':                  ['polyfills/Promise.js', 'log.js', 'superhero.css']
    };

    for (var pathname in specificFileNames) {
        if (document.location.pathname.match(pathname)) {
            attachFiles(specificFileNames[pathname]);
            break;
        }
    }
}, false);
