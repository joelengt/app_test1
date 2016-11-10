var express = require('express')
var app = express.Router()

// archivo config
var config = require('../../config')

// DataBase
var Users = require('../../models/usuarios')

// Dashboard Plataforma Admin
// Permiso de acceso usuario

var config = require('../../config')
var permiso = config.typeUser.admin


// Login access - user admin 
app.get('/login', function (req, res) {
	res.render('./admin/login', {
		msg: 'Necesitas Logearte Primero'
	})

	// res.send({msg: 'Necesitas Logearte Primero'})
})

app.get('/', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {
			
			res.render('./admin/dashboard', {
				user: req.user
			})

			// res.send({
			// 	user: req.user
			// })

		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

module.exports = app