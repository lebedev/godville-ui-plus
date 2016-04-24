(function() {
'use strict';

window.GUIp = window.GUIp || {};

// basic variables
GUIp.version = '$VERSION';
GUIp.browser = sessionStorage.getItem('GUIp_browser');
GUIp.locale = document.location.hostname.match(/^(?:godville\.net|gdvl\.tk|gv\.erinome\.net)/) ? 'ru' : 'en';
GUIp.common = {
    getResourceURL: function(aResName) {
        return sessionStorage.getItem('GUIp_prefix') + aResName;
    }
};

// modules_loader
GUIp.loader = {};

GUIp.loader.section = (function() {
    var sections = {
        '^\/superhero'                    : 'superhero',
        '^\/user\/(?:profile|rk_success)' : 'options',
        '^\/forums\/show(?:_topic)?\/\\d+': 'forum',
        '^\/duels\/log\/'                 : 'log'
    };

    for (var pathname in sections) {
        if (window.location.pathname.match(pathname)) {
            return sections[pathname];
        }
    }
})();

GUIp.loader.modules = (function() {
    var common = [
        'trycatcher',
        'common',
        'i18n_' + GUIp.locale
    ];

    var modules = {
        superhero: [
            'stats',
            'storage',
            'utils',
            'data',
            'informer',
            'subs',
            'help',
            'words',
            'inventory',
            'logger',
            'observers',
            'timeout',
            'timers',
            'improver'
        ],
        options: [
            'options_page',
            'options'
        ],
        forum: [
            'forum'
        ],
        log: [
            'stats',
            'map_log'
        ]
    };

    return common.concat(modules[GUIp.loader.section]);
})();

GUIp.loader.waiter = (function(){
    var waiters = {
        superhero: function() {
            return window.$ &&
                  (document.getElementById('m_info') || document.getElementById('stats'));
        },
        options: function() {
            return document.getElementById('profile_main');
        },
        forum: function() {
            return window.Effect &&
                   window.EditForm &&
                   window.ReplyForm;
        },
        log: function() {
            return true;
        }
    };

    return waiters[GUIp.loader.section];
})();

GUIp.loader.waitFor = function(aTargetCheckFunc) {
    return new window.Promise(function (aResolve, aReject) {
        var ticker = 0;
        function checkIfTargetLoaded() {
            if (aTargetCheckFunc()) {
                clearInterval(int);
                aResolve();
            }
            if (ticker++ > 1500) {
                aReject();
            }
        }
        var int = setInterval(checkIfTargetLoaded, 200);
        checkIfTargetLoaded();
    });
};

GUIp.loader.waitFor(function() {
    window.console.log('GUIp: v' + GUIp.version + ' is about to start.');
    window.console.log('GUIp: loading modules: ' + GUIp.loader.modules.join(', ') + '.');
    window.console.log('GUIp: waiting for modules <script>-tags to be created...');

    window.console.time('GUIp: created modules <script>-tags in');
    var container = document.getElementById('guip'),
        getUrl = window.localStorage.getItem('GUIp:beta') === 'true' || GUIp.browser === 'opera' ? 'getGithubSourceURL' : 'getResourceURL',
        script;
    for (var i = 0, len = GUIp.loader.modules.length; i < len; i++) {
        script = document.createElement('script');
        script.src = GUIp.common[getUrl]('modules/module_' + GUIp.loader.modules[i] + '.js');
        container.appendChild(script);
    }
    window.console.timeEnd('GUIp: created modules <script>-tags in');

    window.console.log('GUIp: waiting for modules to be loaded...');

    window.console.time('GUIp: modules loaded in');

    return true;
}).then(GUIp.loader.waitFor.bind(null, function() {
    var modules = GUIp.loader.modules;
    for (var i = 0, len = modules.length; i < len; i++) {
        if (!GUIp[modules[i]] || !GUIp[modules[i]].loaded) {
            return false;
        }
    }
    return true;
})).then(function() {
    window.console.timeEnd('GUIp: modules loaded in');
    window.console.log('GUIp: waiting for Godville to start...');
    window.console.time('GUIp: Godville started in');
}).then(GUIp.loader.waitFor.bind(null, GUIp.loader.waiter)).then(function() {
    window.console.timeEnd('GUIp: Godville started in');

    window.console.log('GUIp: initializing modules...');
    window.console.time('GUIp: modules initialized in');

    for (var i = 0, len = GUIp.loader.modules.length; i < len; i++) {
        GUIp[GUIp.loader.modules[i]].init();
    }

    window.console.timeEnd('GUIp: modules initialized in');

    window.console.info('GUIp: started. Enjoy! :3');
})
.catch(function() {
    window.console.timeEnd('GUIp: couldn\'t get initialized in 5 minutes.');
});

})();
