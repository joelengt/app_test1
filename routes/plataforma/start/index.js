var express = require('express')
var app = express.Router()
var Users = require('../../../models/usuarios')
var Friends = require('../../../models/usuarios/amigos')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

// Route /plataforma/start | form registro basico de datos
app.get('/', isLoggedIn, function (req, res) {
	var user = req.user
	if(user) {
		// Render de vista para usuario
		/*res.render('./plataforma/form_start/', {
			user: user
		})*/
		
		// Respuesta en JSON
		res.status(200).json({
			user: user
		})

		//res.send({user:user})
	
	} else {
		res.redirect('/login')
	}

})

// API: PUT | Actualizar datos del usuario
app.put('/save/:id', isLoggedIn, function (req, res) {
	var id = req.params.id

	if(req.user) {

		// Campo para actualizar desde el formulario
		var data = {
			genero: req.body.genero || '',
			categoria: req.body.categoria || '',
			grado: req.body.grado || ''
		}

		// Grados por Categorias para el usuario
		var subOficiales = ['Sub Oficial de Tercera','Sub Oficial de Segunda','Sub Oficial de Primera','Técnico de Tercera','Técnico de Segunda','Técnico de Primera','Brigadier','Superior']
		var oficiales = ['Alferes', 'Teniente','Capitán','Mayor','Comandante','Coronel','General']
								
		// Grado siguiente del usuario
		var userNext

	    // Selección de Categorias
		if(data.categoria === 'oficial') {
			console.log('Eres Oficial')
									
			for (var i = oficiales.length - 1; i >= 0; i--) {
				var elemento = oficiales[i]
										
				if(data.grado === elemento) {
					userNext = oficiales[i + 1]
					break

				}

			}

		} else if (data.categoria === 'sub-oficial') {
			console.log('Eres sub-oficial')

			for (var j = subOficiales.length - 1; j >= 0; j--) {
				var el = subOficiales[j]

				if(data.grado === el) {
					userNext = subOficiales[j + 1]
					break

				}

			}

		} else {
			console.log('Error en la busqueda de categoria')
								
		}

		// Agregando grado siguiente en la data de usuario
		data.grado_next = userNext
						
		// Actualizando los datos de usuarios con parametos del Objeto data
		Users.update({'_id': id}, data, function (err) {
			if(err) {
				return	res.send('Error al actualizar, porfavor contactanos para ayudarte!! ' + err)
			}

			// Buscando al usuario en la base de datos
			Users.findById(id, function (err, user) {		
				if(err) {
					return res.send('Error al encontrar usuario: ' + err)
				}

				// creando contenedor de lista de amigos para este usuario
				var list = new Friends({
					user_id: user._id,
					user_provider_id: user.provider_id
				})
				
				console.log('Usuario Pendiente para tener lista de amigos')
				console.log('usuario: ' + user.name)
				console.log('usuario: ' + list.user_id)
				console.log(list)

				list.save(function (err) {
					if(err) {
						return console.log('Error al guardar la lista de amigos para este usuario: ' + err)
					}	
					console.log('Lista de amigos aniadida para este amigo')
				})

				// Relogin session passport
				req.login(user, function (err) {
					if(err) {
						return res.send('Error al encontrar relogear')
							
					}		
				})

				// Render de vista usuario
				/*res.render('./plataforma/bienvenida',{	
					user: req.user,
					user_next: data.grado_next
				})*/

				// Resputa en JSON
				res.status(200).json({
					user: req.user,
					user_next: data.grado_next
				})

			})
							
		})

	} else {
	
		res.redirect('/login')
	
	}

})

module.exports = app
