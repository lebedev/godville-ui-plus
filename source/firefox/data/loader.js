var specificScripts = {
    'superhero.*':                     'superhero.js',
    'user\/(?:profile|rk_success).*': ['options_page.js', 'options.js'],
    'forums\/show(?:_topic)?\/\\d+.*': 'forum.js',
    'duels\/log\/.*':                  'log.js'
};

var attachScripts = function(specificScripts) {
    var ruUrlRegExp = 'godville\\.net|gdvl\\.tk|gv\\.erinome\\.net',
        locale = document.location.hostname.match(ruUrlRegExp) ? 'ru' : 'en',
        commonScriptNames = ['common.js', 'guip_firefox.js', 'phrases_' + locale + '.js'],
        scriptNames = commonScriptNames.concat(specificScripts);

    // At this point I need to load add-on's scripts as unprivileged <script>-tags instead of Content Scripts.
    // It seems like this is the only way to pass automatic signing/validation with creating unprivileged scripts.
    // Regular <script>-tags aren't passing autovalidation. Services.scriptloader.loadSubScript isn't working
    // because this Content Script doesn't have access to 'require', which is needed to get Services.
    //
    // So, AFAICS, this method is the only one to go.
    var d=document,c="createElement",h=d.head,a="appendChild",tn="script",s;
    for (var n in scriptNames) {
        s=d[c](tn);s.src='resource://godville-ui-plus-at-badluck-dot-dicey/data/' + scriptNames[n];h[a](s);
    }
};

for (var pathname in specificScripts) {
    if (document.location.pathname.match(pathname)) {
        attachScripts(specificScripts[pathname]);
        break;
    }
}
