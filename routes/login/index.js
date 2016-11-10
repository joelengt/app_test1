var express = require('express')
var app = express.Router()

app.get('/login', function (req, res) {
	res.render('./login/index')
	//res.send(req)
})

module.exports = app