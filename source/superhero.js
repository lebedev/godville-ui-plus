// starter
window.GUIp = window.GUIp || {};

GUIp.superhero = {};

GUIp.superhero.modules = [
    'data',
    'forum',
    'help',
    'improver',
    'informer',
    'inventory',
    'logger',
    'observers',
    'stats',
    'storage',
    'timeout',
    'timers',
    'trycatcher',
    'utils',
    'words'
];

GUIp.superhero._init = function() {
    GUIp.data.init();
    GUIp.storage.migrate();
    GUIp.utils.addCSS();
    GUIp.utils.inform();
    GUIp.words.init();
    GUIp.logger.create();
    GUIp.timeout.create();
    GUIp.help.init();
    GUIp.informer.init();
    GUIp.forum.init();
    GUIp.inventory.init();
    GUIp.improver.improve();
    GUIp.timers.init();
    GUIp.observers.init();
    GUIp.improver.initOverrides();
};
GUIp.superhero.start = function() {
    if (window.$ &&
        (document.getElementById('m_info') || document.getElementById('stats')) &&
        GUIp.browser &&
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
        GUIp.words &&
        window.so &&
        window.so.state
    ) {
        clearInterval(starterInt);
        window.console.time('Godville UI+ initialized in');

        GUIp.trycatcher.process(GUIp);

        GUIp.superhero._init();

        if (!GUIp.data.isFight) {
            window.onmousemove = window.onscroll = window.ontouchmove = GUIp.improver.activity;
        }

        // svg for #logger fade-out in FF
        var is5c = document.getElementsByClassName('page_wrapper_5c').length;
        document.body.insertAdjacentHTML('beforeend',
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

        window.console.timeEnd('Godville UI+ initialized in');
    }
};

var container = document.getElementById('guip_scripts'),
    tagName = 'script',
    script;
for (var i in GUIp.superhero.modules) {
    script = document.createElement(tagName);
    script.src = GUIp.common.getResourceURL('modules/' + GUIp.superhero.modules[i] + '.js');
    container.appendChild(script);
}

var starterInt = setInterval(function() { GUIp.superhero.start(); }, 200);
