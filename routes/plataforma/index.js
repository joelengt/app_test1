var express = require('express')
var app = express.Router()

var Users = require('../../models/usuarios')
var Cursos = require('../../models/cursos')

var config = require('../../config')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

// Ruta /plataforma/  | Inicial de la app Cursos | Diplomados
app.get('/',isLoggedIn , function (req, res) {
	if(req.user) {
		var id = req.user._id
		var user = req.user

		Users.findById({'_id': id}, function (err, usuario) {

			if(err) {
				return console.log('Error al encontrar al usuario: ' + err)
			} else {

				if(usuario.grado == '') {
					// redirección al form interactivo inicial
					res.redirect('/plataforma/start')

				} else {
					Cursos.find(function (err, cursos) {
						if(err) {
							return res.send(500,{status:'Error al encontrar los cursos en la base de datos', error: err})
						}
						
						// Ordenando Cronologicamente
						var Articles_dates = []

						// Ordenando por fecha
						for(var q = 0; q <= cursos.length - 1; q++) {
							var element = {
								data: cursos[q],
								date_number: 0
							}

							// convirtiendo dato a numbero comparable
							var new_data = new Date(element.data.createdAt).getTime()

							element.date_number = Number(new_data)
							cursos[q] = element

							// Llenando datos con fechas
							Articles_dates[q] = new_data
						}

						// Ordenando cronologicamente reciente a más antiguo
						Articles_dates.sort(deMayorAMenor)

						function deMayorAMenor (elem1, elem2) { 
							return elem2 - elem1 
						}

						// Array con fechas de publicado ordenadas
						var Article_collections = []

						// Buscando coincidencia en el array por fecha
						for(var c = 0; c <= Articles_dates.length - 1; c++) {
							
							// Asignando elemento de lista dentro del array por filtro de fecha
							for(var s = 0; s <= cursos.length - 1; s++) {
								var el_article = cursos[s]

								if(Articles_dates[c] === el_article.date_number) {
									console.log('Elemento date encontrado para este articulo')
									//cursos[c] = el_article.data
									Article_collections[c] = cursos[s].data
									
									break
								}
							
							}
						}

						console.log('Cursos')
						console.log(Article_collections)
						
						Article_collections.reverse()

						//render de vista usuario
						/*res.render('./plataforma/cursos_diplomados/cursos', {
							user: user,
							cursos: Article_collections
						})*/
						
						// Respuesta en JSON
						res.status(200).json({
							user: user,
							cursos: Article_collections
						})
					
					})				
					
				}

			}

		})

	} else {
		res.redirect('/login')
	}

})

// Ruta de Bienvenida, al inicio de registro
app.get('/bienvenida', isLoggedIn, function (req, res) {
	var user = req.user
	if(user) {
		
		// Render de vista para usuario
		/*res.render('./plataforma/bienvenida',{
		 	user: user
		})*/

		// Respuesta en JSON
		res.status(200).json({
			user: user
		})

	} else {
		res.redirect('/login')
	}
})

module.exports = app
