// Hero state referefce interceptor.
// Kreon, you're not allowed to steal this by the way, you baka :D.

var interceptor = document.createElement('script');
interceptor.textContent = '(function() { var Hs_orig = Hs; window.so = {}; Hs = function() { Hs = Hs_orig; return window.so.state = new Hs; }; document.currentScript.remove(); })();';
var interceptorInject = setInterval(function() {
    if (document.scripts) {
        var starterScript = Array.prototype.find.call(document.scripts, function(script) { return script.textContent.match(/new HS2/); });
        if (!starterScript) {
            return;
        }
        document.head.insertBefore(interceptor, starterScript);
        clearInterval(interceptorInject);
    }
}, 0);
