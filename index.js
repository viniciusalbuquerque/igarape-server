// const db = require('./js/db')
const fs = require('fs')
const express = require('express')
const app = express()
// const cache = require('./js/cache')

const proxy = require('./js/proxy')
const port = 3000;

function showHTML(res, filepath) {
	fs.readFile(filepath, (err, html) => {
		if(err) throw err;
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/html')
		res.write(html)
		res.end();
	})
}

function showIndexPage(req, res) {
	showHTML(res, 'html/index.html')
}
app.get('/', showIndexPage)


function showAboutPage(req, res) {
	showHTML(res, 'html/about.html')
}
app.get('/about', showAboutPage)

function responseAssembler(status, message, data) {
	return response = {
		status : status,
		message : message,
		data : data
	};
}

var retrieveDataCallback = function (res, data, err) {
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
	proxy.getPosts(res, who, retrieveDataCallback)
} 

app.get('/posts/:who?', retrievePosts)

function retrieveEvents(req, res) {
	var data = req.params
	var which = data.which
	proxy.getEvents(res, which, retrieveDataCallback)
}

app.get('/events/:which?', retrieveEvents)

app.listen(port, listening)

function listening() {
	console.log('listening...')
}