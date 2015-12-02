// main code
var i, len, topic, isTopic, forum_no, topics;
var setInitVariables = function() {
    isTopic = location.pathname.match(/topic/) !== null;
    forum_no = 'Forum' + (isTopic ? $q('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
                                      : location.pathname.match(/forums\/show\/(\d+)/)[1]);
    var greetings = $id('menu_top').textContent;
    storage.god_name = greetings.match(localStorage.getItem('GUIp:lastGodname'))[0] ||
                       greetings.match(localStorage.getItem('GUIp:godnames'))[0];
    topics = JSON.parse(storage.get(forum_no));
};
var GUIp_forum = function() {
    try {
        if (!GUIp.i18n || !GUIp.browser || !GUIp.addCSSFromURL) { return; }
        clearInterval(starter);

        setInitVariables();

        if (!isTopic) {
            addSmallElements();
        }

        addLinks();

        if (isTopic) {
            GUIp.addCSSFromURL(GUIp.getResource('forum.css'), 'forum_css');
            addFormattingButtonsAndCtrlEnter();
            fixGodnamePaste();
            improveTopic();
        }
    } catch(e) {
        console.error(e);
    }
};
var starter = setInterval(function() { GUIp_forum(); }, 100);
