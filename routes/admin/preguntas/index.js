var express = require('express')
var app = express()

//Permiso de acceso para usuarios 
var config = require('../../../config')
var permiso = config.typeUser.admin

var Preguntas = require('../../../models/preguntas')

// render de preguntas en el sistema
app.get('/', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			Preguntas.find(function (err, preguntas) {
				if(err) {
					return console.log('Error al encotrar las preguntas: ' + err)
				}

				res.render('./admin/dashboard/preguntas', {
					user: req.user
				})

				//res.status(200).json({
				//	user: req.user
				//})

			})

		} else {
			res.redirect('/plataforma')
		}
	} else {
		res.redirect('/plataforma/admin/login')
	}
})

module.exports = app
