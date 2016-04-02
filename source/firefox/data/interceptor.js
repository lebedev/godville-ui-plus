// Hero state referefce interceptor.
// Kreon, you're not allowed to steal this by the way, you baka :D.
function randomString() {
    return (Math.random()*1e20).toString(36).replace(/^\d+/, '');
}

var randomStarterProperty = randomString();
var randomInterceptorProperty = randomString();

var beforeInterceptor = function(event) {
    if (event.target.textContent.match(/new HS2/)) {
        if (!event.target.hasOwnProperty(randomStarterProperty)) {
            event.preventDefault();

            var interceptor = document.createElement('script');
            interceptor[randomInterceptorProperty] = randomInterceptorProperty;
            interceptor.textContent = 'var Hs_orig = Hs; window.so = {}; Hs = function() { Hs = Hs_orig; return window.so.state = new Hs; };';
            document.head.appendChild(interceptor);

            var script = document.createElement('script');
            script[randomStarterProperty] = randomStarterProperty;
            script.textContent = event.target.textContent;
            document.head.appendChild(script);

            event.target.remove();
        } else {
            delete event.target[randomStarterProperty];
            document.removeEventListener('beforescriptexecute', beforeInterceptor, true);
        }
    }
};

var afterInterceptor = function(event) {
    if (event.target.hasOwnProperty(randomInterceptorProperty)) {
        event.target.remove();
        document.removeEventListener('afterscriptexecute', afterInterceptor, true);
    }
};

document.addEventListener('beforescriptexecute', beforeInterceptor, true);
document.addEventListener('afterscriptexecute', afterInterceptor, true);