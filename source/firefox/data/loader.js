/* global self:false */

var specificScripts = {
    'superhero.*':                     'superhero.js',
    'user\/(?:profile|rk_success).*': ['options_page.js', 'options.js'],
    'forums\/show(?:_topic)?\/\\d+.*': 'forum.js',
    'duels\/log\/.*':                  'log.js'
};

var attachScripts = function(aSpecificScripts) {
    var ruUrlRegExp = 'godville\\.net|gdvl\\.tk|gv\\.erinome\\.net',
        locale = document.location.hostname.match(ruUrlRegExp) ? 'ru' : 'en',
        commonScriptNames = ['common.js', 'guip_firefox.js', 'phrases_' + locale + '.js'],
        scriptNames = commonScriptNames.concat(aSpecificScripts);

    // At this point I need to load add-on's scripts as unprivileged <script>-tags instead of Content Scripts.
    // It seems like this is the only way to pass automatic signing/validation with creating unprivileged scripts.
    // Regular <script>-tags aren't passing autovalidation. Services.scriptloader.loadSubScript isn't working
    // because this Content Script doesn't have access to 'require', which is needed to get Services.
    //
    // So, AFAICS, this method is the only one to go.
    document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
    var container = document.getElementById('guip'),
        tagName = 'script',
        script;
    for (var n in scriptNames) {
        script = document.createElement(tagName);
        script.src = 'resource://godville-ui-plus-at-badluck-dot-dicey/data/' + scriptNames[n];
        container.appendChild(script);
    }
    script = document.createElement(tagName);
    script.textContent = 'window.GUIp = window.GUIp || {};\n\nGUIp.version = "' + self.options.version + '";';
    container.appendChild(script);
};

for (var pathname in specificScripts) {
    if (document.location.pathname.match(pathname)) {
        attachScripts(specificScripts[pathname]);
        break;
    }
}
