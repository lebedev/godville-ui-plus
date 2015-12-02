var tabs = require('sdk/tabs');

var domainsUrls = 'https?:\/\/(godville\\.net|gdvl\\.tk|gv\\.erinome\\.net|godvillegame\\.com)\/.*';

tabs.on('ready', function(tab) {
    if (tab.url.match(domainsUrls)) {
        tab.attach({
            contentScriptFile: './loader.js'
        });
    }
});

for (var tab of tabs) {
    if (tab.url.match(domainsUrls)) {
        tab.reload();
    }
}
