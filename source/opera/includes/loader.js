window.addEventListener('DOMContentLoaded', function() {
    if (!document.location.host.match(/godville\.net|godvillegame\.com|gdvl\.tk|gv\.erinome\.net/)) {
        return;
    }

    document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
    var container = document.getElementById('guip'),
        loaderURL = 'https://rawgit.com/zeird/godville-ui-plus/master/source/module_loader.js',
        script;

    var polyfills = ['polyfills/Promise.js', 'polyfills/WeakMap.js', 'polyfills/MutationObserver.js'];
    var onloadCallback = function() {
        script = document.createElement('script');
        script.textContent = this.result;
        container.appendChild(script);
    };
    for (var i = 0, polyfill; (polyfill = polyfills[i]); i++) {
        var fileObj = opera.extension.getFile('/content/' + polyfill);
        if (fileObj) {
            fr = new FileReader();
            fr.onload = onloadCallback;
            fr.readAsText(fileObj);
        }
    }

    // Reads version number from config.
    var fr = new FileReader();
    fr.onload = function() {
        var version = this.result.match(/widget .+? version="([^"]+)"/)[1];

        var prefix = 'https://rawgit.com/zeird/godville-ui-plus/master/source/';

        var basicScript = function() {
            window.GUIp = {};

            GUIp.version = '$VERSION';
            GUIp.browser = 'Opera';
            GUIp.locale = document.location.hostname.match(/^(?:godville\.net|gdvl\.tk|gv\.erinome\.net)/) ? 'ru' : 'en';
            GUIp.common = {
                getResourceURL: function(aResName) {
                    return 'https://rawgit.com/zeird/godville-ui-plus/master/source/' + aResName;
                },
                getGithubSourceURL: function(aPath) {
                    return 'https://rawgit.com/zeird/godville-ui-plus/master/source/' + aPath;
                }
            };
        };

        script = document.createElement('script');
        script.textContent = '(' + basicScript.toString().replace('$VERSION', version) + ')();';
        container.appendChild(script);

        script = document.createElement('script');
        script.src = loaderURL;
        container.appendChild(script);
    };
    fr.readAsText(opera.extension.getFile('/config.xml'));

}, false);
