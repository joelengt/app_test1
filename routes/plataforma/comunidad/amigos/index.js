var express = require('express')
var app = express.Router()

var Users = require('../../../../models/usuarios')
var Friends = require('../../../../models/usuarios/amigos')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

app.get('/list', isLoggedIn, function (req, res) {
	if(req.user) {
		console.log('AMIGOSSS!!!')
		//var the_user_id = req.params.user_id
		var the_user_id = JSON.stringify(req.user._id)
		the_user_id = JSON.parse(the_user_id)

		// Buscando lista de amigos para este usuario
		Friends.findOne({'user_id': the_user_id}, function (err, list_friends) {
			if(err) {
				return console.log('Error al encontrar la lista de amigos del usuario: ' + err)
			}
			
			if(list_friends !== null) {
				console.log('Lista de amigos')
				console.log(list_friends)

				// Obteniendo array con lista de usuario del usuario
				var friends_list_user = list_friends.amigos
				var new_friends_list = []

				console.log('LISTA DE AMIGOS: ')
				console.log(friends_list_user)

				if(list_friends.amigos.length === 0) {


					// res.render('./plataforma/comunidad/amigos', {
					// 	user: req.user,
					// 	friends: new_friends_list
					// })

					res.status(200).json({
						user: req.user,
						friends: new_friends_list
					})

				} else {

				  console.log('el array no tiene elementos')
				  
				  for(var i = 0; i <= friends_list_user.length - 1; i++) {
					var friend_element = friends_list_user[i]

					// Obteniendo datos de todos los amigos
					Users.findById({'_id': friend_element.user_id}, function (err, friend) {
						if(err) {
							return console.log('Error al encontrar al amigo : ' + err)
						}

						// Elemento a insertar por amigo
						var insert_friend = {
							_id: 		 friend._id,
							provider_id: friend.provider_id,
							name: 		 friend.name,
							photo: 		 friend.photo,
							nickname: 	 friend.nickname,
							grado: 		 friend.grado
						}

						//console.log('AMigo, pisition: ' + i)
						//console.log(insert_friend)

						// Agregando 
						new_friends_list.push(insert_friend)
						
						//console.log('LISTA DE AMIGOS')
						//console.log(new_friends_list)

						// Enviado si el total de largo del array de amigos y en nuevo tienen el mismo peso
						if(new_friends_list.length === friends_list_user.length) {

							// res.render('./plataforma/comunidad/amigos', {
							// 	user: req.user,
							// 	friends: new_friends_list
							// })

							res.status(200).json({
								user: req.user,
								friends: new_friends_list
							})
						}
					
					})
				  }
				}

			} else {
				var new_friends_list = []

				// res.render('./plataforma/comunidad/amigos', {
				// 	user: req.user,
				// 	status: 'not_found',
				// 	message: 'Aun no tienes amigos, agrega uno',
				// 	friends: new_friends_list
				// })


				res.status(200).json({
					user: req.user,
					status: 'not_found',
					message: 'Aun no tienes amigos, agrega uno',
					friends: new_friends_list
				})

			}
		})

	} else {
		res.redirect('/login')
	}
})

app.delete('/:user_provider_id/', isLoggedIn, function (req, res) {
	if(req.user) {
		var the_user_id = req.user._id
		var user_provider_id = req.params.user_provider_id

		// Buscando al usuario
		Friends.findOne({'user_id': the_user_id}, function (err, list_friends) {
			if(err) {
				return console.log('Error al encontrar la lista de amigos del usuario: ' + err)
			}

			// Obteniendo array con lista de usuario del usuario para eliminarlo
			var friends_list_user = list_friends.amigos
			var new_friends_list = []

			console.log('LISTA DE AMIGOS: ')
			console.log(friends_list_user)

			// Buscando al usuario para eliminar
			for(var n = 0; n <= friends_list_user.length - 1; n++) {
				var friend_element = friends_list_user[n]

				console.log('user provider id elemento en la DB list: ')
				console.log(typeof(friend_element.user_provider_id))

				console.log('user provider id  amigo solicitado a elminar: ')
				console.log(typeof(user_provider_id))					

				if(friend_element.user_provider_id === user_provider_id) {
					console.log('El amigo a eliminar fue encontrado: ' + n)
					// Eliminando al usuario del array
					list_friends.amigos.splice(n,1)
					break
				}
				
			}

			console.log('NUEVA LISTA DE AMIGOS MODIFICADA')
			console.log(list_friends.amigos)

			list_friends.save(function (err) {
				if(err) {
					return console.log('Error al eliminar amigo de la lista: ' + err)
				}
				console.log('Amigo aliminado de la lista')
				
				// Buscando lista de amigos para este usuario
				Friends.findOne({'user_id': the_user_id}, function (err, new_list_friends) {
					if(err) {
						return console.log('Error al encontrar la lista de amigos del usuario: ' + err)
					}

					// Obteniendo array con lista de usuario del usuario
					var friends_list_user = new_list_friends.amigos
					var new_friends_list = []

					console.log('LISTA DE AMIGOS: ')
					console.log(friends_list_user)

					if(new_list_friends.amigos.length === 0) {

						console.log('el array no tiene elementos')
						// res.render('./plataforma/comunidad/amigos', {
						// 	user: req.user,
						// 	friends: new_friends_list
						// })		

						res.status(200).json({
							user: req.user,
							friends: new_friends_list
						})

					} else {
					  	// Existe lista de amigos
						for(var i = 0; i <= friends_list_user.length - 1; i++) {
							var friend_element = friends_list_user[i]

							// Obteniendo datos de todos los amigos
							Users.findById({'_id': friend_element.user_id}, function (err, friend) {
								if(err) {
									return console.log('Error al encontrar al amigo : ' + err)
								}

								// Elemento a insertar por amigo
								var insert_friend = {
									_id: 		 friend._id,
									provider_id: friend.provider_id,
									name: 		 friend.name,
									photo: 		 friend.photo,
									nickname: 	 friend.nickname,
									grado: 		 friend.grado
								}

								//console.log('AMigo, pisition: ' + i)
								//console.log(insert_friend)

								// Agregando 
								new_friends_list.push(insert_friend)
								
								//console.log('LISTA DE AMIGOS')
								//console.log(new_friends_list)

								// Enviado si el total de largo del array de amigos y en nuevo tienen el mismo peso
								if(new_friends_list.length === friends_list_user.length) {
									// res.render('./plataforma/comunidad/amigos', {
									// 	user: req.user,
									// 	friends: new_friends_list
									// })

									res.status(200).json({
										user: req.user,
										friends: new_friends_list
									})	
								}
							
							})
					    }
					}	
				})

			})


		})

	} else {
		res.redirect('/login')
	}
})

module.exports = app

