// links initialization
var addSmallElements = function() {
    var temp = GUIp.$Q('.c2');
    for (var i = 0, len = temp.length; i < len; i++) {
        if (!temp[i].querySelector('small')) {
            temp[i].insertAdjacentHTML('beforeend', '<small />');
        }
    }
};
var followOnclick = function(e) {
    try {
        e.preventDefault();
        var topicId = GUIp.isTopic ? location.pathname.match(/\d+/)[0]
                                   : this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
            posts = GUIp.isTopic ? +GUIp.$c('subtitle').textContent.match(/\d+/)[0]
                                 : +this.parentElement.parentElement.nextElementSibling.textContent,
            dates = GUIp.isTopic ? document.getElementsByTagName('abbr')
                                 : null,
            date =  GUIp.isTopic ? document.getElementsByClassName('disabled next_page').length ? dates[dates.length - 1].title : 0
                                 : this.parentElement.parentElement.parentElement.getElementsByTagName('abbr')[0].title,
            topics = JSON.parse(GUIp.storage.get(GUIp.subforumId));
        topics[topicId] = { posts: posts, date: date };
        GUIp.storage.set(GUIp.subforumId, JSON.stringify(topics));
        this.style.display = 'none';
        this.parentElement.querySelector('.unfollow').style.display = 'inline';
    } catch(error) {
        window.console.error(error);
    }
};
var addOnclickToFollow = function() {
    var follow_links = GUIp.$Q('.follow');
    for (var i = 0, len = follow_links.length; i < len; i++) {
        follow_links[i].onclick = followOnclick;
    }
};
var unfollowOnclick = function(e) {
    try {
        e.preventDefault();
        var topicId = GUIp.isTopic ? location.pathname.match(/\d+/)[0]
                                   : this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
            topics = JSON.parse(GUIp.storage.get(GUIp.subforumId)),
            informers = JSON.parse(GUIp.storage.get('ForumInformers'));
        delete topics[topicId];
        GUIp.storage.set(GUIp.subforumId, JSON.stringify(topics));
        delete informers[topicId];
        GUIp.storage.set('ForumInformers', JSON.stringify(informers));
        this.style.display = 'none';
        this.parentElement.querySelector('.follow').style.display = 'inline';
    } catch(error) {
        window.console.error(error);
    }
};
var addOnclickToUnfollow = function() {
    var unfollow_links = GUIp.$Q('.unfollow');
    for (var i = 0, len = unfollow_links.length; i < len; i++) {
        unfollow_links[i].onclick = unfollowOnclick;
    }
};
var addLinks = function() {
    var links_containers = GUIp.$Q(GUIp.isTopic ? '#topic_mod' : '.c2 small'),
        topics = JSON.parse(GUIp.storage.get(GUIp.subforumId)),
        isFollowed;
    for (var i = 0, len = links_containers.length; i < len; i++) {
        GUIp.topicId = GUIp.isTopic ? location.pathname.match(/\d+/)[0]
                                    : links_containers[i].parentElement.getElementsByTagName('a')[0].href.match(/\d+/)[0];
        isFollowed = topics[GUIp.topicId];
        links_containers[i].insertAdjacentHTML('beforeend',
            (GUIp.isTopic ? '(' : '\n') + '<a class="follow" href="#" style="display: ' + (isFollowed ? 'none' : 'inline') + '">' + (GUIp.isTopic ? GUIp.i18n.Subscribe : GUIp.i18n.subscribe) + '</a>' +
                                        '<a class="unfollow" href="#" style="display: ' + (isFollowed ? 'inline' : 'none') + '">' + (GUIp.isTopic ? GUIp.i18n.Unsubscribe : GUIp.i18n.unsubscribe) + '</a>' + (GUIp.isTopic ? ')' : '')
        );
    }
    addOnclickToFollow();
    addOnclickToUnfollow();
};

GUIp.initLinks = function() {
    if (!GUIp.isTopic) {
        addSmallElements();
    }

    addLinks();
};
