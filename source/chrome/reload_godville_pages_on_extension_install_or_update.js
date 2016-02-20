/* global chrome:false */

chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.query({
        url: [
            "*://godville.net/*",
            "*://godvillegame.com/*",
            "*://gdvl.tk/duels/log/*",
            "*://gv.erinome.net/duels/log/*"
        ]
    }, function(tabs) {
        for (var i in tabs) {
            chrome.tabs.reload(tabs[i].id);
        }
    });
});