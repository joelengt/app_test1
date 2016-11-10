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

// Funcion para buscar usuario en la DB
function ProcessFindEvent (friend_to_data, callback) {
	Users.findById({'_id': friend_to_data}, function (err, friend_fined) {
		if(err) {
			return callback(err)
		}
		//console.log('Datos del amigo solicitado')
		//console.log(friend_fined)

		if(friend_fined) {
			callback(err, friend_fined)
		
		}

	})
}

// Obteniendo amigos para vista publica
app.get('/:user_id', isLoggedIn, function (req, res) {
	if(req.user) {
		var user_id = req.params.user_id
		var friends_this_user = []

		Users.findById(user_id, function (err, usuario) {
			if(err) {
				return res.send(404, 'Error al encontrar usuario: ' + err)
			}

			// Buscando amigos de este usuario
			Friends.findOne({'user_id': user_id }, function (err, friend_this_user) {
				if(err) {
					return console.log('Error al encontrar lista de amigos: ' + err)
				}

				// Validando si el usuario tiene amigos
				if(friend_this_user.amigos.length > 0) {
					console.log('El usuario tiene amigos')

					// Asignando amigos con datos actuales
					for(var s = 0; s <= friend_this_user.amigos.length - 1; s++) {
						var friend = friend_this_user.amigos[s]
						
						ProcessFindEvent(friend.user_id, function (err, friend_fined) {
							if(err) {
								return console.log('Error al encontrar amigo: ' + err)
							}

							if(friend_fined) {
								var update_friend_data = {
									_id:         friend_fined._id,
									provider_id: friend_fined.provider_id,
									photo:       friend_fined.photo,
									name:        friend_fined.name
								}

								friends_this_user.push(update_friend_data)
								
								if(friends_this_user.length === friend_this_user.amigos.length) {
									
									console.log('Lista de amigos!!!')
									console.log(friends_this_user)

									// Render vista para usuario
									/*res.render('./plataforma/friends', {
										user: usuario,
										user_edit: req.user,
										friends: friends_this_user
									})*/
									
									res.status(200).json({
										user: usuario,
										user_edit: req.user,
										friends: friends_this_user
									})

								}
							}

						})
					}

				} else {

					friends_this_user = []

					// Render vista para usuario
					/*res.render('./plataforma/friends', {
						user: usuario,
						user_edit: req.user,
						friends: friends_this_user,
						message: 'El usuario aun no tiene amigos'
					})*/
					
					res.status(200).json({
						user: usuario,
						user_edit: req.user,
						friends: friends_this_user,
						message: 'El usuario aun no tiene amigos'
					})


				}
				
			})
		
		})

	} else {
		res.redirect('/login')
	}
	
})

// Añadir nuevo amigo a lista de amigos del usuario solicitante
app.post('/add/:friend_user_id', isLoggedIn, function (req, res) {
	if(req.user) {
		var user_id = req.user._id
		var friend_user_id = req.params.friend_user_id

		// Buscando en la lista de amigos del usuario
		Friends.findOne({'user_id': user_id}, function (err, list_friend_usuario) {
			if(err) {
				console.log('El usuario no se encontro en la lista de los que tienen amigos')
			}

			console.log('El usuario se encontro, Lista de amigos')
			console.log(list_friend_usuario)

			// Buscar usuario a agregar en lista
			Users.findById({'_id': friend_user_id}, function (err, friend_fined) {
				if(err) {
					return console.log('Error al encontrar amigo: ' + err)
				}

				var friend_fined_user_id = JSON.stringify(friend_fined._id)
				friend_fined_user_id = JSON.parse(friend_fined_user_id)

				console.log('Id parseado:')
				console.log(friend_fined_user_id)

				var encontrado
				encontrado = false

				console.log('BUSCANDO AMIGO SI COINCIDE!!')
				// Buscando si el amigo a agregar ya se encuentra en la lista de amigos actual
				for(var t = 0; t <= list_friend_usuario.amigos.length - 1; t++) {
					var friend = list_friend_usuario.amigos[t]
					// FIltrando al usuario por id
					
					if(friend.user_id === friend_fined_user_id) {
						console.log('El elemento fue ENCONTRADO!!!')
						encontrado = true
						break
					}
				}

				console.log('fuera del bucle')

				if(encontrado === true) {
					// el usuario a agregar en lista de amigos ya se encuentra
					// NO se agregar
					console.log('Usuario a agregar: ' + friend_fined.name + ' YA ES TU AMIGO')

					//res.send('El usuario: ' + friend_fined.name + ' ya se encuentra en tu lista de amigos')
					res.status(200).json({
						status: 'ok',
						encontrado: true,
						message: 'El usuario: ' + friend_fined.name + ' ya se encuentra en tu lista de amigos'
					})

				} else if(encontrado === false) {
					// El usuario a agregar en lista de amigos AUno no se encuentra
					// Agregar en lista de mis amigos
					console.log('Usuario a agregar: ' + friend_fined.name + ' NO ES TU AMIGO AUN, AGREGANDO A LISTA DE TUS AMIGOS')
					
					// Datos del usuario a agregar
					var new_friend = {
						user_id: friend_fined._id,
						user_provider_id: friend_fined.provider_id
					}

					// Agregando usuario a lista de amigos
					list_friend_usuario.amigos.push(new_friend)
					
					// Agregando al usuario obtenido por provider_id a la lista de amigos del usuario solicitante
					list_friend_usuario.save(function (err) {
						if(err) {
							return console.log('Error al guardar al nuevo amigo, error: ' + err)
						}
						console.log('Amigo agregado')
						
						// Render de buscando amigos
						//res.send('AMIGO AGREGADO :D')
						
						res.status(200).json({
							status:'ok',
							encontrado: false,
							message: 'El usuario: ' + friend_fined.name + ' Ahora es tu amigo'
						})

					})

				} else {
					console.log('Error al encotrar al usuario: ')
				}
				
			})

		})

	} else {
		res.redirect('/login')
	}

})

module.exports = app