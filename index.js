const express = require('express')
const app = express()

var posts = {
	"u1" : ["post 1", "post 2"],
	"u2" : ["post 3"]
}

var events = {
	"event1" : {
		"date" : "2018-07-20",
		"name" : "Event 1"
	}, 
	"event2" : {
		"date" : "2018-07-23",
		"name" : "Event 2"
	}
}

function showIndexPage(req, res) {
	res.send("Index Page")
}
app.get('/', showIndexPage)


function showAboutPage(req, res) {
	// res.sendFile('html/about.html')
	res.send('About')
}
app.get('/about', showAboutPage)


function retrievePosts(req, res) {
	var data = req.params
	var who = data.who

	//ToDo retrieve posts from db
	var response;
	if(!who) {
		response = {
			data : posts,
			message : "Retrieving all posts"	
		} 
	} else {
		if(!posts[who]) {
			response = {
				data : posts,
				message : "Didn't find. Retrieving all posts"
			}
		} else {
			response = {
				data : posts[who],
				who : who,
				message : "Retrieving posts of " + who
			}
		}
	}
	res.send(response)
} 

app.get('/posts/:who?', retrievePosts)


function retrieveEvents(req, res) {
	var data = req.params
	var which = data.which

	//ToDo retrieve events from db
	var response;
	if(!which) {
		response = {
			data : events,
			message : "Retrieving all events"	
		} 
	} else {
		if(!events[which]) {
			response = {
				data : events,
				message : "Didn't find. Retrieving all events"
			}
		} else {
			response = {
				data : events[which],
				which : which,
				message : "Retrieving " + which
			}
		}
	}
	res.send(response)

}

app.get('/events/:which?', retrieveEvents)

app.listen(3000, listening)

function listening() {
	console.log('listening...')
}