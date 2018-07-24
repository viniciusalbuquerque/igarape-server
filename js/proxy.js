const cache = require('./cache')
const db = require('./db')

//TODO change for id
function filterPostsByAuthor(posts, author) {
	var _posts = []
	posts.forEach(post => {
		if(post['author'] == author) {
			_posts.push(post)
		}
	})
	return _posts
}

//TODO Change for id
function filterEventByName(events, name) {
	var _events = []
	events.forEach(event => {
		if(event['name'] == name) {
			_events.push(event)
		}
	})
	return _events
}

function callPostsCallback(callback, res, posts, author) {
	if(author)
			posts = filterPostsByAuthor(posts, author)
	callback(res, posts, null)
}

function callEventsCallback(callback, res, events, name) {
	if(name)
		events = filterEventByName(events, name)
			
	callback(res, events, null)
}

module.exports.getPosts = function(res, author, callback) {
	cache.getFromCache(cache.KEYS.POSTS, (posts) => {
		if(posts) {
			console.log('cache')
			callPostsCallback(callback, res, posts, author)
			return;
			
		}
		db.getPosts((posts, err) => {
			console.log('db')
			if(err) {
				callback(res, null, err)
				return
			}
			cache.saveInCache(cache.KEYS.POSTS, posts)
			callPostsCallback(callback, res, posts, author)
		})
	})
}

module.exports.getEvents = function(res, event, callback) {
	var events = cache.getFromCache(cache.KEYS.EVENTS, (events) => {
		if(events) {
			console.log('cache')
			callEventsCallback(callback, res, events, event)
			return;
		}

		db.getEvents(event, (events, err) => {
			console.log('db')
			if(err) {
				callback(res, null, err)
				return
			}
			cache.saveInCache(cache.KEYS.EVENTS, events)
			callEventsCallback(callback, res, events, event)
		})
	})
}