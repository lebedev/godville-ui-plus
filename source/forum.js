//console.log('Forum script prototype');

var storage = {
	_get_key: function(key) {
		return "GM_" + god_name + ':' + key;
	},
	set: function(id, value) {
		localStorage.setItem(this._get_key(id), value);
		return value;
	},
	get: function(id) {
		return localStorage.getItem(this._get_key(id));
	}
};

var follow_links, isFollowed, links_containers, temp, topic, unfollow_links,
	isTopic = location.pathname.match(/topic/) !== null,
	forum = 'Forum' + (isTopic ? document.querySelector('.crumbs a:nth-child(3)').href.match(/forums\/show\/(\d+)/)[1]
							   : location.pathname.match(/forums\/show\/(\d+)/)[1]),
	god_name = localStorage.getItem('GM_CurrentUser', god_name),
	topics = JSON.parse(storage.get(forum));

if (isTopic) {
	links_containers = document.querySelectorAll('#topic_mod');
} else {
	// add missing <small> elements
	temp = document.querySelectorAll('.c2');
	for (var i = 0, len = temp.length; i < len; i++) {
		if (!temp[i].querySelector('small')) {
			temp[i].insertAdjacentHTML('beforeend', '<small />');
		}
	}

	links_containers = document.querySelectorAll('.c2 small');
}

//console.log(isTopic);
//console.log(forum);
//console.log(god_name);
//console.log(topics);
//console.log(links_containers);

// add links
for (var i = 0, len = links_containers.length; i < len; i++) {
	topic = isTopic ? location.pathname.match(/\d+/)[0]
					: links_containers[i].parentElement.getElementsByTagName('a')[0].href.match(/\d+/)[0];
	isFollowed = topics[topic] !== undefined;
	links_containers[i].insertAdjacentHTML('beforeend', isTopic ? ('(<a class="follow" href="#" style="display: ' + (isFollowed ? 'none' : 'inline') + '">Подписаться</a><a class="unfollow" href="#" style="display: ' + (isFollowed ? 'inline' : 'none') + '">Отписаться</a>)')
													 			: ('\n<a class="follow" href="#" style="display: ' + (isFollowed ? 'none' : 'inline') + '">подписаться</a><a class="unfollow" href="#" style="display: ' + (isFollowed ? 'inline' : 'none') + '">отписаться</a>'));
}

// add click events to follow links
follow_links = document.querySelectorAll('.follow');
function follow(e) {
	e.preventDefault();
	var topic = isTopic ? location.pathname.match(/\d+/)[0]
						: this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
		posts = isTopic ? +document.querySelector('.subtitle').textContent.match(/\d+/)[0]
						: +this.parentElement.parentElement.nextElementSibling.textContent,
		topics = JSON.parse(storage.get(forum));
	//console.log(forum + ' topics was', JSON.stringify(topics));
	topics[topic] = posts;
	storage.set(forum, JSON.stringify(topics));
	//console.log(forum + ' topics is', JSON.stringify(topics));
	this.style.display = 'none';
	this.parentElement.querySelector('.unfollow').style.display = 'inline';
}
for (var i = 0, len = follow_links.length; i < len; i++) {
	follow_links[i].onclick = follow;
}

// add click events to unfollow links
unfollow_links = document.querySelectorAll('.unfollow');
function unfollow(e) {
	e.preventDefault();
	var topic = isTopic ? location.pathname.match(/\d+/)[0]
						: this.parentElement.parentElement.querySelector('a').href.match(/\d+/)[0],
		topics = JSON.parse(storage.get(forum));
	//console.log(forum + ' topics was', JSON.stringify(topics));
	delete topics[topic];
	storage.set(forum, JSON.stringify(topics));
	//console.log(forum + ' topics is', JSON.stringify(topics));
	this.style.display = 'none';
	this.parentElement.querySelector('.follow').style.display = 'inline';
}
for (var i = 0, len = unfollow_links.length; i < len; i++) {
	unfollow_links[i].onclick = unfollow;
}