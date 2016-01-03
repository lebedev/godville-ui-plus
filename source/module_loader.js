(function() {
'use strict';

window.GUIp = window.GUIp || {};

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
        'common',
        'i18n_' + GUIp.locale
    ];

    var modules = {
        superhero: [
            'data',
            'storage',
            'stats',
            'informer',
            'subs',
            'help',
            'words',
            'inventory',
            'logger',
            'observers',
            'overrider',
            'timeout',
            'timers',
            'utils',
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
            'map_log'
        ]
    };

    return common.concat(modules[GUIp.loader.section]);
})();

GUIp.loader.waiter = (function(){
    var waiters = {
        superhero: function() {
            return window.$ &&
                  (document.getElementById('m_info') || document.getElementById('stats')) &&
                   window.so &&
                   window.so.state;
        },
        options: function() {
            return document.getElementById('profile_main');
        },
        forum: function() {
            return true;
        },
        log: function() {
            return true;
        }
    };

    return waiters[GUIp.loader.section];
})();

GUIp.loader.start = function() {
    window.console.log('GUIp: initializing modules...');
    window.console.time('GUIp: modules initialized in');

    for (var i = 0, len = GUIp.loader.modules.length; i < len; i++) {
        GUIp[GUIp.loader.modules[i]].init();
    }

    if (GUIp.stats.isField()) {
        window.onmousemove = window.onscroll = window.ontouchmove = GUIp.improver.activity;
    }

    if (GUIp.browser === 'firefox') {
        // svg for #logger fade-out in FF
        var is5c = document.getElementsByClassName('page_wrapper_5c').length;
        document.getElementById('guip').insertAdjacentHTML('beforeend',
            '<svg id="fader">' +
                '<defs>' +
                    '<linearGradient id="gradient" x1="0" y1="0" x2 ="100%" y2="0">' +
                        '<stop stop-color="black" offset="0"></stop>' +
                        '<stop stop-color="white" offset="0.0' + (is5c ? '2' : '3') + '"></stop>' +
                    '</linearGradient>' +
                    '<mask id="fader_masking" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">' +
                        '<rect x="0.0' + (is5c ? '2' : '3') + '" width="0.9' + (is5c ? '8' : '7') + '" height="1" fill="url(#gradient)" />' +
                    '</mask>' +
                '</defs>' +
            '</svg>'
        );
    }

    window.console.timeEnd('GUIp: modules initialized in');
    window.console.info('GUIp: started. Enjoy! :3');
};

GUIp.loader.waitFor = function(aTargetCheckFunc) {
    return new window.Promise(function (aResolve, aReject) {
        var ticker = 0;
        function checkIfTargetLoaded() {
            if (aTargetCheckFunc()) {
                clearInterval(int);
                aResolve();
            }
            if (ticker++ > 6000) {
                aReject();
            }
        }
        var int = setInterval(checkIfTargetLoaded, 50);
        checkIfTargetLoaded();
    });
};

GUIp.loader.waitFor(function() {
    window.console.log('GUIp: v' + GUIp.version + ' is about to start.');
    window.console.log('GUIp: loading modules: ' + GUIp.loader.modules.join(', ') + '.');
    window.console.log('GUIp: waiting for modules <script>-tags to be created...');

    window.console.time('GUIp: created modules <script>-tags in');
    var container = document.getElementById('guip'),
        getUrl = window.localStorage.getItem('GUIp:beta') === 'true' || GUIp.browser === 'Opera' ? 'getGithubSourceURL' : 'getResourceURL',
        script;
    for (var i = 0, len = GUIp.loader.modules.length; i < len; i++) {
        script = document.createElement('script');
        script.src = GUIp.common[getUrl]('modules/' + GUIp.loader.modules[i] + '.js');
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
    GUIp.loader.start();
});

})();