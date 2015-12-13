// topic other improvements
var pw, pw_pb_int;
var checkHash = function() {
    // scroll to a certain post #
    var guip_hash = document.location.hash.match(/#guip_(\d+)/);
    if (guip_hash) {
        var post = GUIp.$C('spacer')[+guip_hash[1]];
        document.location.hash = post ? post.id : '';
    }
};
var highlightCurrentPost = function() {
    var highlighted = GUIp.$C('highlighted');
    if (highlighted.length) {
        highlighted[0].classList.remove('highlighted');
    }

    var post_hash = document.location.hash.match(/#(post_\d+)/),
        post = post_hash ? GUIp.$id(post_hash[1] + '-row') : null;
    if (post) {
        post.classList.add('highlighted');
    }
};
var setPageWrapperPaddingBottom = function(el) {
    var form = document.getElementById(el) || el,
        old_height = parseFloat(window.getComputedStyle(form).height) || 0,
        step = 0;
    clearInterval(pw_pb_int);
    pw_pb_int = setInterval(function() {
        if (step++ >= 100) {
            clearInterval(pw_pb_int);
        } else {
            var diff = (parseFloat(window.getComputedStyle(form).height) || 0) - old_height;
            old_height += diff;
            pw.style.paddingBottom = ((parseFloat(pw.style.paddingBottom) || 0) + diff) + 'px';
            window.scrollTo(0, window.scrollY + diff);
        }
    }, 10);
};
var fixPageWrapperPadding = function() {
    pw = document.getElementById('page_wrapper');
    window.Effect.old_toggle = window.Effect.toggle;
    window.Effect.toggle = function(a, b) { setPageWrapperPaddingBottom(a); window.Effect.old_toggle(a, b); };
    window.Effect.old_BlindDown = window.Effect.BlindDown;
    window.Effect.BlindDown = function(a, b) { setPageWrapperPaddingBottom(a); window.Effect.old_BlindDown(a, b); };
    window.EditForm.old_hide = window.EditForm.hide;
    window.EditForm.hide = function() { pw.style.paddingBottom = '0px'; window.EditForm.old_hide(); };
    window.EditForm.old_setReplyId = window.EditForm.setReplyId;
    window.EditForm.setReplyId = function(a) { if (document.getElementById('reply').style.display !== 'none') { pw.style.paddingBottom = '0px'; } window.EditForm.old_setReplyId(a); };
    window.ReplyForm.old_init = window.ReplyForm.init;
    window.ReplyForm.init = function() { window.ReplyForm.old_init(); if (window.getSelection().isCollapsed) { setTimeout(function() { document.getElementById('post_body').focus(); }, 50); } };
};

var findPost = function(el) {
    do {
        el = el.parentNode;
    } while (!el.classList.contains('post'));
    return el;
};
var picturesAutoreplace = function() {
    if (!GUIp.storage.get('Option:disableLinksAutoreplace')) {
        var links = document.querySelectorAll('.post .body a'),
            imgs = [],
            onerror = function(i) {
                links[i].removeChild(links[i].getElementsByTagName('img')[0]);
                imgs[i] = null;
            },
            onload = function(i) {
                var oldBottom, hash = document.location.hash.match(/\d+/),
                    post = findPost(links[i]),
                    linkBeforeCurrentPost = hash ? +post.id.match(/\d+/)[0] < +hash[0] : false;
                if (linkBeforeCurrentPost) {
                    oldBottom = post.getBoundingClientRect().bottom;
                }
                links[i].removeChild(links[i].getElementsByTagName('img')[0]);
                var hint = links[i].innerHTML;
                links[i].outerHTML = '<div class="img_container"><a id="link' + i + '" href="' + links[i].href + '" target="_blank" alt="' + GUIp.i18n.open_in_a_new_tab + '"></a><div class="hint">' + hint + '</div></div>';
                imgs[i].alt = hint;
                var new_link = document.getElementById('link' + i),
                    width = Math.min(imgs[i].width, 456),
                    height = imgs[i].height*(imgs[i].width <= 456 ? 1 : 456/imgs[i].width);
                if (height < 1500) {
                    new_link.insertAdjacentHTML('beforeend', '<div style="width: ' + width + 'px; height: ' + height + 'px; background-image: url(' + imgs[i].src + '); background-size: ' + width + 'px;"></div>');
                } else {
                    new_link.insertAdjacentHTML('beforeend', '<div style="width: ' + width + 'px; height: 750px; background-image: url(' + imgs[i].src + '); background-size: ' + width + 'px;"></div>' +
                                                             '<div style="width: ' + width + 'px; height: ' + (342*width/456) + 'px; background-image: url(' + GUIp.common.getResourceURL('images/crop.png') + '); background-size: ' + width + 'px; position: absolute; top: ' + (750 - 171*width/456) + 'px;"></div>' +
                                                             '<div style="width: ' + width + 'px; height: 750px; background-image: url(' + imgs[i].src + '); background-size: ' + width + 'px; background-position: 100% 100%;"></div>');
                }
                if (linkBeforeCurrentPost) {
                    var diff = post.getBoundingClientRect().bottom - oldBottom;
                    window.scrollTo(0, window.scrollY + diff);
                }
            };
        for (var i = 0, len = links.length; i < len; i++) {
            if (links[i].href.match(/jpe?g|png|gif/i)) {
                links[i].insertAdjacentHTML('beforeend', '<img class="img_spinner" src="http://godville.net/images/spinner.gif">');
                imgs[i] = document.createElement('img');
                imgs[i].onerror = onerror.bind(null, i);
                imgs[i].onload = onload.bind(null, i);
                imgs[i].src = links[i].href;
            }
        }
    }
};
var updatePostsNumber = function() {
    var topics = JSON.parse(GUIp.storage.get(GUIp.subforumId));
    if (topics[GUIp.topicId]) {
        var page = document.location.search.match(/page=(\d+)/);
        page = page ? +page[1] - 1 : 0;
        var posts = page*25 + document.getElementsByClassName('post').length;
        if (topics[GUIp.topicId].posts < posts) {
            topics[GUIp.topicId].posts = posts;
            var dates = document.getElementsByTagName('abbr');
            topics[GUIp.topicId].date = dates[dates.length - 1].title;
            GUIp.storage.set(GUIp.subforumId, JSON.stringify(topics));
        }
    }
};

GUIp.initOtherTopicFeatures = function() {
    checkHash();
    highlightCurrentPost();
    window.onhashchange = highlightCurrentPost;
    fixPageWrapperPadding();
    picturesAutoreplace();
    updatePostsNumber();
};
