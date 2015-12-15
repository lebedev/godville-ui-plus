// starter
window.GUIp = window.GUIp || {};

GUIp.superhero = {};

GUIp.superhero.modules = [
    'trycatcher',
    'data',
    'storage',
    'forum',
    'help',
    'informer',
    'words',
    'inventory',
    'logger',
    'observers',
    'overrider',
    'stats',
    'timeout',
    'timers',
    'utils',
    'improver'
];

GUIp.superhero.start = function() {
    window.console.log('GUIp: initializing modules...');
    window.console.time('GUIp: modules initialized in');

    for (var i in GUIp.superhero.modules) {
        GUIp[GUIp.superhero.modules[i]].init();
    }

    if (!GUIp.data.isFight) {
        window.onmousemove = window.onscroll = window.ontouchmove = GUIp.improver.activity;
    }

    if (GUIp.browser === 'Firefox') {
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

var waitFor = function(aTargetCheckFunc) {
    return new window.Promise(function (aResolve, aReject) {
        var ticker = 0;
        function checkIfTargetLoaded() {
            if (aTargetCheckFunc()) {
                clearInterval(int);
                aResolve();
            }
            if (ticker++ > 10000) {
                aReject();
            }
        }
        var int = setInterval(checkIfTargetLoaded, 50);
        checkIfTargetLoaded();
    });
};

waitFor(function() {
    return GUIp.common;
}).then(function() {
    window.console.log('GUIp: v' + GUIp.version + ' is about to start.');
    window.console.log('GUIp: waiting for modules <script>-tags to be created...');
    window.console.time('GUIp: created modules <script>-tags in');
    var container = document.getElementById('guip'),
        tagName = 'script',
        script;
    for (var i in GUIp.superhero.modules) {
        script = document.createElement(tagName);
        script.src = GUIp.common.getResourceURL('modules/' + GUIp.superhero.modules[i] + '.js');
        container.appendChild(script);
    }
    window.console.timeEnd('GUIp: created modules <script>-tags in');
    window.console.log('GUIp: waiting for modules to be loaded...');
    window.console.time('GUIp: modules loaded in');
}).then(waitFor.bind(null, function() {
    return GUIp.browser &&
           GUIp.i18n &&
           GUIp.addCSSFromURL &&
           GUIp.data &&
           GUIp.forum &&
           GUIp.help &&
           GUIp.improver &&
           GUIp.informer &&
           GUIp.inventory &&
           GUIp.logger &&
           GUIp.observers &&
           GUIp.stats &&
           GUIp.storage &&
           GUIp.timeout &&
           GUIp.timers &&
           GUIp.trycatcher &&
           GUIp.utils &&
           GUIp.words;
})).then(function() {
    window.console.timeEnd('GUIp: modules loaded in');
    window.console.log('GUIp: waiting for Godville to start...');
    window.console.time('GUIp: Godville started in');
}).then(waitFor.bind(null, function() {
    return window.$ &&
          (document.getElementById('m_info') || document.getElementById('stats')) &&
           window.so &&
           window.so.state;
})).then(function() {
    window.console.timeEnd('GUIp: Godville started in');
    GUIp.superhero.start();
});
