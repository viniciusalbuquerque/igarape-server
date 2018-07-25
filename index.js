const fs = require('fs')
const express = require('express')
const app = express()
const proxy = require('./js/proxy')
const bodyParser = require('body-parser')
const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function showHTML(res, filepath) {
	fs.readFile(filepath, (err, html) => {
		if(err) throw err;
		res.statusCode = 200
		res.setHeader('Content-Type', 'text/html')
		res.write(html)
		res.end();
	})
}

app.get('/', (req, res) => {
	showHTML(res, 'html/index.html')
})

app.get('/about', (req, res) => {
	showHTML(res, 'html/about.html')
})

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

app.get('/posts/:who?', (req, res) => {
	var data = req.params
	var who = data.who
	proxy.getPosts(res, who, retrieveDataCallback)
})

app.get('/events/:which?', (req, res) => {
	var data = req.params
	var which = data.which
	proxy.getEvents(res, which, retrieveDataCallback)
})


var responseToAdd = function(res, success, data) {
	var response;
	if(!success) {
		response = responseAssembler(false, "I'm sorry, something happened and we were not able to finish your request", data)
	} else {
		response = responseAssembler(true, "Data added successfuly.", data)
	}
	res.send(response)
} 

app.post('/posts/add', (req, res) => {
	//TODO Field validations
	var post_text = req.body.text
	var post_author = req.body.author

	var post = {
		author : post_author,
		text : post_text
	}

	proxy.addPost(res, post, responseToAdd)
})

app.post('/events/add', (req, res) => {
	//TODO Field validations
	var event_name = req.body.name
	//Check if it's going to be timestamp or something else
	var event_date = req.body.date

	var event = {
		name : event_name,
		date : event_date
	}

	proxy.addEvent(res, event, responseToAdd)
})

app.listen(port, listening)

function listening() {
	console.log('listening...')
}