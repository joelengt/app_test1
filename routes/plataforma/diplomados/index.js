var express = require('express')
var app = express.Router()

var config = require('../../../config')
var Diplomados = require('../../../models/diplomados')

var permiso = config.typeUser

var fs = require('fs')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

//READ: render diplomados
app.get('/', isLoggedIn, function (req, res) {
	if(req.user) {

		if(req.user.access === permiso.free || req.user.access === permiso.admin) {

			Diplomados.find(function (err, diplomados) { 
				if(err) {
					return res.send('Error al encontrar los diplomados')
				}

				// Render de vista para usuario
				/*res.render('./plataforma/cursos_diplomados/diplomados', {
					user: req.user,
					diplomados: diplomados
				})*/

				res.status(200).json({ 
					user: req.user,
					diplomados: diplomados
				})
			})		
		
		} else {
			res.redirect('/plataforma')
		}
	} else {
		res.redirect('/login')
	}
})

// READ: render una sola vista
app.get('/:id', isLoggedIn, function (req, res) {
	if(req.user) {

		if(req.user.access === permiso.free || req.user.access === permiso.admin) {
			var id = req.params.id
			
			Diplomados.findById({'_id': id}, function (err, diplomado) { 
				if(err) {
					return res.send('Error al encontrar el curso')
				}

				// Render de vista para usuario
				/*res.render('./plataforma/cursos_diplomados/diplomados/diplomado-item', {
					user: req.user,
					diplomado: diplomado
				})*/

				res.status(200).json({
					user: req.user,
					diplomado: diplomado
				})

			})

		} else {
			res.redirect('/plataforma')
		}
		
	} else {
		res.redirect('/login')
	}

})

// Contenido/Material de cada curso

// Lista de Textos
app.get('/:id/textos', isLoggedIn, function (req, res) {
	if(req.user) {
		if(req.user.access === permiso.free || req.user.access === permiso.admin) {

			var id = req.params.id
			
			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					return res.send('Error al encontrar los textos, Porfavor contactanos para ayudarte!! :' + err)
				}
				
				// Obteniendo los textos del curso
				var textos = diplomado.materiales.texto

				// Render para textos de cursos
				/*res.render('./plataforma/cursos_diplomados/diplomados/textos', {
					user: req.user,
					diplomado: diplomado,
					textos: textos
				})*/

				res.status(200).json({
					user: req.user,
					diplomado: diplomado,
					textos: textos
				})
					
			})
			
		} else {
			res.redirect('/plataforma')
		}
	} else {
		res.redirect('/login')
	}
})

// Lista de AudiosLibros
app.get('/:id/audio-libros', isLoggedIn, function (req, res) {

	if(req.user) {

		if(req.user.access === permiso.free || req.user.access === permiso.admin) {

			var id = req.params.id
			
			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					return res.send('Error al encontrar Audios, Porfavor contactanos para ayudarte!! :' + err)
				}
				
				var audios = diplomado.materiales.audioLibro
				
				// Obteniendo los audios del curso

				// Render de vista para usuario
				/*res.render('./plataforma/cursos_diplomados/diplomados/audio-libros', {
					user: req.user,
					diplomado: diplomado,
					audios: audios
				})*/

				res.status(200).json({
					user: req.user,
					diplomado: diplomado,
					audios: audios
				})
			
			})
			
		} else {
			res.redirect('/plataforma')
		}
		
	} else {
		res.redirect('/login')
	}

})

// Lista de Simuladores: Niveles
app.get('/:id/simulador', isLoggedIn, function (req, res) {
	res.send('Ahora no Joven :v')
})

module.exports = app
