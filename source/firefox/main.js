var tabs = require('sdk/tabs');
var version = require('sdk/self').version;

var domainsUrls = 'https?:\/\/(godville\\.net|gdvl\\.tk|gv\\.erinome\\.net|godvillegame\\.com)\/.*';

function attachGUIpLoaderTo(tab) {
    if (tab.url.match(domainsUrls)) {
        tab.attach({
            contentScriptFile: './loader.js',
            contentScriptOptions: {
                version: version
            }
        });
    }
}

// Listen for 'ready' event on new tabs only.
tabs.on('open', function(tab) {
    tab.on('ready', attachGUIpLoaderTo);
});

// Listen for 'ready' event on existing tabs only.
for (let tab of tabs) {
    tab.on('ready', attachGUIpLoaderTo);
    if (tab.url.match(domainsUrls)) {
        tab.reload();
    }
}

// Hero state referefce interceptor.
// Kreon, you're not allowed to steal this by the way, you baka :D.
var pageMod = require('sdk/page-mod');
pageMod.PageMod({
    include: /https?:\/\/godville.net\/superhero.*/,
    contentScriptFile: './interceptor.js',
    contentScriptWhen: 'start'
});
