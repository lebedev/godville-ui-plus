// /duels/log starter
window.GUIp = window.GUIp || {};

GUIp.duels_log = {};

GUIp.duels_log.modules = [
    'log',
    'map_log',
];

GUIp.duels_log.start = function() {
    window.console.log('GUIp: initializing modules...');
    window.console.time('GUIp: modules initialized in');

    for (var i = 0, len = GUIp.duels_log.modules.length; i < len; i++) {
        GUIp[GUIp.duels_log.modules[i]].init();
    }

    window.console.timeEnd('GUIp: modules initialized in');
    window.console.info('GUIp: started. Enjoy! :3');
};

var waitFor = function(aTargetCheckFunc) {
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

waitFor(function() {
    return GUIp.common && GUIp.common.loaded_specific && GUIp.common.loaded_common;
}).then(function() {
    window.console.log('GUIp: v' + GUIp.version + ' is about to start.');
    window.console.log('GUIp: loading modules: ' + GUIp.duels_log.modules.join(', ') + '.');
    window.console.log('GUIp: waiting for modules <script>-tags to be created...');
    window.console.time('GUIp: created modules <script>-tags in');
    var container = document.getElementById('guip'),
        getUrl = window.localStorage.getItem('GUIp_beta') === 'true' || GUIp.browser === 'Opera' ? 'getGithubSourceURL' : 'getResourceURL',
        script;
    for (var i = 0, len = GUIp.duels_log.modules.length; i < len; i++) {
        script = document.createElement('script');
        script.src = GUIp.common[getUrl]('modules/' + GUIp.duels_log.modules[i] + '.js');
        container.appendChild(script);
    }
    window.console.timeEnd('GUIp: created modules <script>-tags in');
    window.console.log('GUIp: waiting for modules to be loaded...');
    window.console.time('GUIp: modules loaded in');
}).then(waitFor.bind(null, function() {
    var modules = GUIp.duels_log.modules.concat('i18n');
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
}).then(waitFor.bind(null, function() {
    return GUIp.locale && GUIp.i18n;
})).then(function() {
    window.console.timeEnd('GUIp: Godville started in');
    GUIp.duels_log.start();
});
