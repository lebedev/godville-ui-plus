/* global self:false */

(function() {

'use strict';

var prefix = 'chrome://godville-ui-plus/content/';
sessionStorage.setItem('GUIp_prefix', prefix);
sessionStorage.setItem('GUIp_browser', 'firefox');

var validPathnames = /^\/(?:superhero|user\/(?:profile|rk_success)|forums\/show(?:_topic)?\/\d+|duels\/log\/)/;
if (document.location.pathname.match(validPathnames)) {
    document.body.insertAdjacentHTML('beforeend', '<div id="guip" />');
    var container = document.getElementById('guip');
    var script = document.createElement('script');
    script.src = prefix + 'module_loader.js';
    container.appendChild(script);
}

})();