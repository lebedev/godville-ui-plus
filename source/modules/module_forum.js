(function() {
'use strict';

GUIp.forum = {};

GUIp.forum.init = function() {
    setInitVariables();

    GUIp.initLinks();

    if (GUIp.isTopic) {
        GUIp.common.addCSSFromURL(GUIp.common.getResourceURL('css/forum.css'), 'forum_css');
        GUIp.common.addCSSFromURL(GUIp.common.getResourceURL('css/common.css'), 'common_css');
        GUIp.initTopicFormattingFeatures();
        GUIp.initOtherTopicFeatures();
    }
};

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
        var topicId  = GUIp.isTopic ? document.location.pathname.match(/\d+/)[0]
                                    : this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
            posts    = GUIp.isTopic ? +GUIp.$c('subtitle').textContent.match(/\d+/)[0]
                                    : +this.parentElement.parentElement.nextElementSibling.textContent,
            dates    = GUIp.isTopic ? document.getElementsByTagName('abbr')
                                    : null,
            date     = GUIp.isTopic ? document.getElementsByClassName('disabled next_page').length ? dates[dates.length - 1].title : 0
                                    : this.parentElement.parentElement.parentElement.getElementsByTagName('abbr')[0].title,
            subforum = GUIp.isTopic ? GUIp.$q('a[href*="forums/show"]').href.match(/\d$/)[0]
                                    : document.location.pathname.match(/\d$/)[0],
            subs = JSON.parse(GUIp.storage.get('Subs'));
        subs[topicId] = { posts: posts, date: date, subforum: subforum };
        GUIp.storage.set('Subs', JSON.stringify(subs));
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
        var topicId = GUIp.isTopic ? document.location.pathname.match(/\d+/)[0]
                                   : this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
            subs = JSON.parse(GUIp.storage.get('Subs')),
            informers = JSON.parse(GUIp.storage.get('SubsNotifications'));
        delete subs[topicId];
        GUIp.storage.set('Subs', JSON.stringify(subs));
        delete informers[topicId];
        GUIp.storage.set('SubsNotifications', JSON.stringify(informers));
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
        subs = JSON.parse(GUIp.storage.get('Subs')),
        isFollowed;
    for (var i = 0, len = links_containers.length; i < len; i++) {
        GUIp.topicId = GUIp.isTopic ? document.location.pathname.match(/\d+/)[0]
                                    : links_containers[i].parentElement.getElementsByTagName('a')[0].href.match(/\d+/)[0];
        isFollowed = subs[GUIp.topicId];
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

// topic formatting
var val, ss, se, nls, nle, selection;
var initEditor = function(editor) {
    val = editor.value;
    ss = editor.selectionStart;
    se = editor.selectionEnd;
    selection = window.getSelection().isCollapsed ? '' : window.getSelection().toString().trim().replace(/\n[\n\s]*/g, '<br>');
};
var putSelectionTo = function(editor, pos, quoting) {
    setTimeout(function() {
        editor.focus();
        editor.selectionStart = editor.selectionEnd = pos + (quoting ? selection.length : 0);
    }, 50);
};
var basicFormatting = function(left_and_right, editor) {
    try {
        initEditor(editor);
        while (ss < se && val[ss].match(/\s/)) {
            ss++;
        }
        while (ss < se && val[se - 1].match(/\s/)) {
            se--;
        }
        editor.value = val.slice(0, ss) + (val && val[ss - 1] && val[ss - 1].match(/[a-zA-Zа-яА-ЯёЁ]/) ? ' ' : '') + left_and_right[0] + val.slice(ss, se) + selection + left_and_right[1] + (val && val [se] && val[se].match(/[a-zA-Zа-яА-ЯёЁ]/) ? ' ' : '') + val.slice(se);
        putSelectionTo(editor, se + left_and_right[0].length, true);
        return false;
    } catch(error) {
        window.console.error(error);
    }
};
var quoteFormatting = function(quotation, editor) {
    try {
        initEditor(editor);
        nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n\n' : (val[ss - 2] && !val[ss - 2].match(/\n/) ? '\n' : '');
        nle = ss !== se && val ? ((val[se] && !val[se].match(/\n/) || !val[se]) ? '\n\n'
                                                                                : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n'
                                                                                                                           : ''))
                               : '' +
              selection ? (!selection[selection.length - 1].match(/\n/) ? '\n\n'
                                                                        : (selection && selection[selection.length - 2] && !selection[selection.length - 2].match(/\n/) ? '\n'
                                                                                                                                                                        : ''))
                        : '';
        editor.value = val.slice(0, ss) + nls + quotation + val.slice(ss, se) + selection + nle + val.slice(se);
        putSelectionTo(editor, se + quotation.length + nls.length + (se > ss || selection ? nle.length : 0), true);
        return false;
    } catch(error) {
        window.console.error(error);
    }
};
var listFormatting = function(list_marker, editor) {
    try {
        initEditor(editor);
        nls = val && val[ss - 1] && !val[ss - 1].match(/\n/) ? '\n' : '';
        nle = val && val[se] && !val[se].match(/\n/) ? '\n\n' : (val[se + 1] && !val[se + 1].match(/\n/) ? '\n' : '');
        var count = val.slice(ss, se).match(/\n/g) ? val.slice(ss, se).match(/\n/g).length + 1 : 1;
        editor.value = val.slice(0, ss) + nls + list_marker + ' ' + val.slice(ss, se).replace(/\n/g, '\n' + list_marker + ' ') + nle + val.slice(se);
        putSelectionTo(editor, se + nls.length + (list_marker.length + 1)*count, true);
        return false;
    } catch(error) {
        window.console.error(error);
    }
};
var pasteBr = function(dummy, editor) {
    try {
        initEditor(editor);
        var pos = editor.selectionDirection === 'backward' ? ss : se;
        editor.value = val.slice(0, pos) + '<br>' + val.slice(pos);
        putSelectionTo(editor, pos + 4, true);
        return false;
    } catch(error) {
        window.console.error(error);
    }
};
var setClickActions = function(id, container) {
    var elem, temp = '#' + id + ' .formatting.',
        buttons = [
            { class: 'bold', func: basicFormatting, params: ['*', '*'] },
            { class: 'underline', func: basicFormatting, params: ['+', '+'] },
            { class: 'strike', func: basicFormatting, params: ['-', '-'] },
            { class: 'italic', func: basicFormatting, params: ['_', '_'] },
            { class: 'godname', func: basicFormatting, params: ['"', '":пс'] },
            { class: 'link', func: basicFormatting, params: ['"', '":'] },
            { class: 'sup', func: basicFormatting, params: ['^', '^'] },
            { class: 'sub', func: basicFormatting, params: ['~', '~'] },
            { class: 'monospace', func: basicFormatting, params: ['@', '@'] },
            { class: 'bq', func: quoteFormatting, params: 'bq. ' },
            { class: 'bc', func: quoteFormatting, params: 'bc. ' },
            { class: 'ul', func: listFormatting, params: '*' },
            { class: 'ol', func: listFormatting, params: '#' },
            { class: 'br', func: pasteBr, params: null }
        ];
    for (var i = 0, len = buttons.length; i < len; i++) {
        if ((elem = GUIp.$q(temp + buttons[i].class))) {
            elem.onclick = buttons[i].func.bind(this, buttons[i].params, container);
        }
    }
};
var setCtrlEnterAction = function(textarea, button) {
    textarea.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode === 13) {
            e.preventDefault();
            button.click();
        }
    };
};
var initSmartQuotation = function() {
    document.body.insertAdjacentHTML('beforeend', '<div id="quote_button"><div id="copy" title="Скопировать цитату"></div><div id="quote" title="' + GUIp.i18n.quote_hint + '"></div><div id="quote_with_author" title="' + GUIp.i18n.quote_with_author_hint + '">+</div></div>');

    var quoteButton = document.getElementById('quote_button');

    GUIp.$q('#copy', quoteButton).style.backgroundImage = 'url(' + GUIp.common.getResourceURL('images/copy.png') + ')';
    GUIp.$q('#quote', quoteButton).style.backgroundImage =
    GUIp.$q('#quote_with_author', quoteButton).style.backgroundImage = 'url(' + GUIp.common.getResourceURL('images/quote.png') + ')';

    document.onmouseup = function() {
        quoteButton.classList.remove('shown');
        setTimeout(function() { setupQuoteDialog(); }, 50);
    };

    var setupQuoteDialog = function() {
        var selection = window.getSelection();

        if (!selection.rangeCount) {
            return;
        }

        var range = selection.getRangeAt(0),
            container = range.commonAncestorContainer;
        if (container.nodeType === 3) {
            container = container.parentElement;
        }
        container.classList.add('current_selection_container');
        if ((document.querySelector('.body.entry-content.current_selection_container') || document.querySelector('.body.entry-content .current_selection_container')) && selection.toString().length > 2) {
            var rect = range.getBoundingClientRect(),
                qbRect = window.qbRect = quoteButton.getBoundingClientRect(),
                leftOffset = (rect.left + rect.right)/2 - (qbRect.right - qbRect.left)/2,
                topOffset = window.pageYOffset + rect.top - (qbRect.bottom - qbRect.top) - 5;
            quoteButton.style.left = leftOffset + 'px';
            quoteButton.style.top = topOffset + 'px';
            quoteButton.classList.add('shown');

            document.getElementById('copy').onclick = function() {
                // TODO: copy to clipboard.
            };
            document.getElementById('quote').onclick = function() {
                var editor;
                if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
                    editor = document.getElementById('edit_body');
                } else {
                    editor = document.getElementById('post_body');
                    if (document.getElementById('reply').style.display === 'none') {
                        window.ReplyForm.init();
                    }
                }
                quoteFormatting('bq. ', editor);
                window.getSelection().collapseToStart();
                return false;
            };
            document.getElementById('quote_with_author').onclick = function() {
                var editor;
                if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
                    editor = document.getElementById('edit_body');
                } else {
                    editor = document.getElementById('post_body');
                    if (document.getElementById('reply').style.display === 'none') {
                        window.ReplyForm.init();
                    }
                }
                quoteFormatting('bq. ', editor);

                var findPost = function(el) {
                    do {
                        el = el.parentNode;
                    } while (!el.classList.contains('post'));
                    return el;
                };

                setTimeout(function() {
                    findPost(container).querySelector('.gravatar a').click();
                }, 75);
                window.getSelection().collapseToStart();
                return false;
            };
        }
        container.classList.remove('current_selection_container');
    };
};
var fixGodnamePaste = function() {
    window.ReplyForm.add_name = function(name) {
        try {
            var editor;
            if (document.getElementById('edit').style.display !== 'none' && document.getElementById('edit_body')) {
                editor = document.getElementById('edit_body');
            } else {
                editor = document.getElementById('post_body');
                if (document.getElementById('reply').style.display === 'none') {
                    window.ReplyForm.init();
                }
            }
            initEditor(editor);
            var pos = editor.selectionDirection === 'backward' ? ss : se;
            editor.value = val.slice(0, pos) + '*' + name + '*, ' + val.slice(pos);
            putSelectionTo(editor, pos + name.length + 4, false);
        } catch(error) {
            window.console.error(error);
        }
    };
};

GUIp.initTopicFormattingFeatures = function() {
    var formatting_buttons =
        '<div>' +
            '<button class="formatting button bold" title="' + GUIp.i18n.bold_hint + '">' + GUIp.i18n.bold + '</button>' +
            '<button class="formatting button underline" title="' + GUIp.i18n.underline_hint + '">' + GUIp.i18n.underline + '</button>' +
            '<button class="formatting button strike" title="' + GUIp.i18n.strike_hint + '">' + GUIp.i18n.strike + '</button>' +
            '<button class="formatting button italic" title="' + GUIp.i18n.italic_hint + '">' + GUIp.i18n.italic + '</button>' +
            '<button class="formatting bq" title="' + GUIp.i18n.quote_hint + '">bq.</button>' +
            '<button class="formatting bc" title="' + GUIp.i18n.code_hint + '">bc.</button>' +
            (GUIp.locale === 'ru' ? '<button class="formatting button godname" title="Вставить ссылку на бога"></button>' : '') +
            '<button class="formatting button link" title="' + GUIp.i18n.link_hint + '">a</button>' +
            '<button class="formatting button ul" title="' + GUIp.i18n.unordered_list_hint + '">•</button>' +
            '<button class="formatting button ol" title="' + GUIp.i18n.ordered_list_hint + '">1.</button>' +
            '<button class="formatting button br" title="' + GUIp.i18n.br_hint + '"></button>' +
            '<button class="formatting button sup" title="' + GUIp.i18n.sup_hint + '">X<sup>2</sup></button>' +
            '<button class="formatting button sub" title="' + GUIp.i18n.sub_hint + '">X<sub>2</sub></button>' +
            '<button class="formatting button monospace" title="' + GUIp.i18n.monospace_hint + '">' + GUIp.i18n.monospace + '</button>' +
        '</div>';
    GUIp.$id('post_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
    setClickActions('post_body_editor', GUIp.$id('post_body'));
    setCtrlEnterAction(GUIp.$id('post_body'), document.querySelector('#reply input[type="submit"]'));

    var editFormObserver = new MutationObserver(function() {
        if (GUIp.$id('edit_body_editor') && !GUIp.$q('#edit_body_editor.improved')) {
            GUIp.$id('edit_body_editor').classList.add('improved');
            GUIp.$id('edit_body_editor').insertAdjacentHTML('afterbegin', formatting_buttons);
            setClickActions('edit_body_editor', GUIp.$id('edit_body'));
            setCtrlEnterAction(GUIp.$id('edit_body'), document.querySelector('#edit input[type="submit"]'));
        }
    });
    editFormObserver.observe(GUIp.$id('content'), { childList: true, subtree: true });
    initSmartQuotation();
    fixGodnamePaste();
};

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
                links[i].insertAdjacentHTML('beforeend', '<img class="img_spinner" src="//godville.net/images/spinner.gif">');
                imgs[i] = document.createElement('img');
                imgs[i].onerror = onerror.bind(null, i);
                imgs[i].onload = onload.bind(null, i);
                imgs[i].src = links[i].href;
            }
        }
    }
};
var updatePostsNumber = function() {
    var subs = JSON.parse(GUIp.storage.get('Subs'));
    if (subs[GUIp.topicId]) {
        var page = document.location.search.match(/page=(\d+)/);
        page = page ? +page[1] - 1 : 0;
        var posts = page*25 + document.getElementsByClassName('post').length;
        if (subs[GUIp.topicId].posts < posts) {
            subs[GUIp.topicId].posts = posts;
            var dates = document.getElementsByTagName('abbr');
            subs[GUIp.topicId].date = dates[dates.length - 1].title;
            GUIp.storage.set('Subs', JSON.stringify(subs));
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

// base functions and variables initialization
window.GUIp = window.GUIp || {};

var setInitVariables = function() {
    GUIp.isTopic = document.location.pathname.match(/topic/) !== null;
    var greetings = GUIp.$id('menu_top').textContent;
    GUIp.storage.god_name = greetings.match(localStorage.getItem('GUIp:lastGodname'))[0] ||
                            greetings.match(localStorage.getItem('GUIp:godnames'))[0];
};

window.addChat = function() {
    GUIp.common.addCSSFromURL('/stylesheets/superhero_ru_packaged.css?' + Date.now(), 'superhero_packaged_css');

    var chatHTML = window.localStorage.getItem('chatHTML');
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    var active = true;

    function chatUpdate() {
        var chatChanges = JSON.parse(window.localStorage.getItem('chatChanges'));

        for (var i = 0, len = chatChanges.length, target, change; i < len; i ++) {
            try {
                target = document.querySelector(chatChanges[i].target);
                change = chatChanges[i];
                switch(change.type) {
                case 'attributes': target.setAttribute(change.attributeName, change.attributeValue); break;
                case 'childList':
                    if (change.removedNumber) {
                        var toRemove = change.removedNumber;
                        while (toRemove--) {
                            target.childNodes[change.removedIndex].remove();
                        }
                    }
                    if (change.addedHTML) {
                        if (change.addedAfter !== null) {
                            target.childNodes[change.addedAfter].insertAdjacentHTML('afterend', change.addedHTML);
                        } else {
                            target.insertAdjacentHTML('afterbegin', change.addedHTML);
                        }
                    }
                }
            } catch(e) {
                active = false;
                window.console.log('Error: ' + e);
                window.console.log('Mutation that caused it: ' + JSON.stringify(change, null, '    '));
                break;
            }
        }
    }
    window.addEventListener('storage', function(e) {
        if (active && e.storageArea === window.localStorage && e.key === 'chatChanges') {
            chatUpdate();
        }
    }, false);
};

GUIp.forum.loaded = true;

})();

document.currentScript.remove();
