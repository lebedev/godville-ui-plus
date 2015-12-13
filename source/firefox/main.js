var tabs = require('sdk/tabs');

var domainsUrls = 'https?:\/\/(godville\\.net|gdvl\\.tk|gv\\.erinome\\.net|godvillegame\\.com)\/.*';

function attachGUIpLoaderTo(tab) {
    tab.attach({
        contentScriptFile: './loader.js'
    });
}

tabs.on('ready', function(tab) {
    if (tab.url.match(domainsUrls)) {
        attachGUIpLoaderTo(tab);
    }
});

for (let tab of tabs) {
    if (tab.url.match(domainsUrls)) {
        attachGUIpLoaderTo(tab);
        tab.reload();
    }
}
