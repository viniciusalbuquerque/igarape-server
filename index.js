const db = require('./js/db')
const express = require('express')
const app = express()

function showIndexPage(req, res) {
	res.send("Index Page")
}
app.get('/', showIndexPage)


function showAboutPage(req, res) {
	// res.sendFile('html/about.html')
	res.send('About')
}
app.get('/about', showAboutPage)


function responseAssembler(status, message, data) {
	return response = {
		status : status,
		message : message,
		data : data
	};
}

var retrieveCallback = function (res, data, err) {
	var response;
	if(err) {
		response = responseAssembler(false, "I'm sorry, something happened and we were not able to finish your request", err)
	} else {
		response = responseAssembler(true, "Data retrieved succesfully.", data)
	}
	res.send(response)
}

function retrievePosts(req, res) {
	var data = req.params
	var who = data.who
	db.getPosts(who, res, retrieveCallback)
} 

app.get('/posts/:who?', retrievePosts)


function retrieveEvents(req, res) {
	var data = req.params
	var which = data.which
	db.getEvents(which, res, retrieveCallback)
}

app.get('/events/:which?', retrieveEvents)

app.listen(3000, listening)

function listening() {
	console.log('listening...')
}