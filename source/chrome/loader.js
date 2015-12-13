(function() {
    var prefix = chrome.extension.getURL('');
    localStorage.setItem('GUIp_prefix', prefix);

    function createScripts(aUrls, aLocale) {
        aUrls = ['common.js', 'guip_chrome.js', 'phrases_' + aLocale + '.js'].concat(aUrls);

        document.body.insertAdjacentHTML('beforeend', '<div id="guip_scripts"/>');
        var container = document.getElementById('guip_scripts'),
            script;
        for (var n in aUrls) {
            script = document.createElement('script');
            script.src = prefix + aUrls[n];
            container.appendChild(script);
        }
    }

    function checkPathFor(aLocale) {
        var path = document.location.pathname;
        if (path.match(/^\/superhero/)) {
            createScripts('superhero.js', aLocale);
        } else if (path.match(/^\/user\/(?:profile|rk_success)/)) {
            createScripts(['options_page.js', 'options.js'], aLocale);
        } else if (path.match(/^\/forums\/show(?:\_topic)?\/\d+/)) {
            createScripts('forum.js', aLocale);
        } else if (path.match(/^\/duels\/log\//)) {
            createScripts('log.js', aLocale);
        }
    }

    var site = document.location.href;
    if (site.match(/^https?:\/\/(godville\.net|gdvl\.tk|gv\.erinome\.net)/)) {
        checkPathFor('ru');
    } else if (site.match(/^https?:\/\/godvillegame\.com/)) {
        checkPathFor('en');
    }
})();