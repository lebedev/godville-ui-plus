var tabs = require('sdk/tabs'),
    version = require("sdk/self").version;

var domainsUrls = 'https?:\/\/(godville\\.net|gdvl\\.tk|gv\\.erinome\\.net|godvillegame\\.com)\/.*';

function attachGUIpLoaderTo(tab) {
    tab.attach({
        contentScriptFile: './loader.js',
        contentScriptOptions: {
            version: version
        }
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
