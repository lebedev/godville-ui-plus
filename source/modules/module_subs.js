// subs
window.GUIp = window.GUIp || {};

GUIp.subs = {};

GUIp.subs.init = function() {
    if (!JSON.parse(GUIp.storage.get('Subs'))) {
        GUIp.storage.set('Subs', '{}');
    }
    if (!JSON.parse(GUIp.storage.get('SubsNotifications'))) {
        GUIp.storage.set('SubsNotifications', '{}');
    }

    document.body.insertAdjacentHTML('afterbegin', '<div id="forum_informer_bar" />');
    setInterval(function() { GUIp.subs._check(); }, (3*60 + 5)*1000);
};
GUIp.subs._check = function() {
    var MAX_TOPICS = 20,
        subs = JSON.parse(GUIp.storage.get('Subs')),
        last = +GUIp.storage.get('Subs:lastChecked'),
        topics = Object.keys(subs).sort(function(a, b) { return +a > +b; }),
        topicsToBeChecked = [],
        startIndex = 0;
    if (topics.length < MAX_TOPICS) {
        topicsToBeChecked = topics;
    } else {
        for (var i = 0, len = topics.length; i < len; i++) {
            if (topics[i] > last) {
                topicsToBeChecked = topics.slice(i, i + MAX_TOPICS);
                break;
            }
        }
        if (topicsToBeChecked.length < MAX_TOPICS) {
            topicsToBeChecked = topicsToBeChecked.concat(topics.slice(0, MAX_TOPICS - topicsToBeChecked.length));
        }
        GUIp.storage.set('Subs:lastChecked', topicsToBeChecked[MAX_TOPICS - 1]);
    }
    GUIp.utils.postXHR({
        url: '/forums/last_in_topics',
        postData: topicsToBeChecked.map(function(topic) { return 'topic_ids[]=' + topic; }).join('&'),
        onSuccess: GUIp.subs._parse
    });
};
GUIp.subs._process = function() {
    var informers = JSON.parse(GUIp.storage.get('SubsNotifications')),
        subs = JSON.parse(GUIp.storage.get('Subs'));
    for (var topic_no in subs) {
        if (informers[topic_no]) {
            GUIp.subs._setInformer(topic_no, informers[topic_no], subs[topic_no].posts);
        }
    }
    GUIp.informer.clearTitle();
};
GUIp.subs._setInformer = function(topic_no, topic_data, posts_count) {
    var informer = document.getElementById('topic' + topic_no);
    if (!informer) {
        document.getElementById('forum_informer_bar').insertAdjacentHTML('beforeend',
            '<a id="topic' + topic_no + '" target="_blank"><span></span><div class="fr_new_badge"></div></a>'
        );
        informer = document.getElementById('topic' + topic_no);
        informer.onclick = function(e) {
            if (e.which === 1) {
                e.preventDefault();
            }
        };
        informer.onmouseup = function(e) {
            if (e.which === 1 || e.which === 2) {
                var informers = JSON.parse(GUIp.storage.get('SubsNotifications'));
                delete informers[this.id.match(/\d+/)[0]];
                GUIp.storage.set('SubsNotifications', JSON.stringify(informers));
                window.$(this).slideToggle("fast", function() {
                    if (this.parentElement) {
                        this.parentElement.removeChild(this);
                        GUIp.informer.clearTitle();
                    }
                });
            }
        };
    }
    var page = Math.floor((posts_count - topic_data.diff)/25) + 1;
    informer.href = '/forums/show_topic/' + topic_no + '?page=' + page + '#guip_' + (posts_count - topic_data.diff + 25 - page*25);
    informer.style.paddingRight = (16 + String(topic_data.diff).length*6) + 'px';
    informer.getElementsByTagName('span')[0].textContent = topic_data.name;
    informer.getElementsByTagName('div')[0].textContent = topic_data.diff;
};
GUIp.subs._parse = function(xhr) {
    var responseJSON = JSON.parse(xhr.responseText);
    if (responseJSON.status !== 'success' || !responseJSON.topics) {
        return;
    }

    var subs = JSON.parse(GUIp.storage.get('Subs')),
        informers = JSON.parse(GUIp.storage.get('SubsNotifications')),
        topics = responseJSON.topics,
        diff, topic;
    for (var topic_no in topics) {
        if (!subs[topic_no]) {
            continue;
        }
        topic = topics[topic_no];
        diff = topic.cnt - subs[topic_no].posts;

        if (diff <= 0 && subs[topic_no].date && (Date(subs[topic_no].date) < Date(topic.last_post_at))) {
            diff = 1;
        }

        subs[topic_no].posts = topic.cnt;
        subs[topic_no].date = topic.last_post_at;

        if (diff > 0) {
            if (topic.last_post_by !== GUIp.stats.godName()) {
                informers[topic_no] = {
                    diff: diff + (informers[topic_no] ? informers[topic_no].diff : 0),
                    name: topic.title
                };
            } else {
                delete informers[topic_no];
            }
        }
    }
    GUIp.storage.set('SubsNotifications', JSON.stringify(informers));
    GUIp.storage.set('Subs', JSON.stringify(subs));
    GUIp.subs._process();
};

GUIp.subs.loaded = true;

document.currentScript.remove();
