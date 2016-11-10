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

app.get('/actions', isLoggedIn, function (req, res) {
	if(req.user) {
		console.log('Encontrar amigos facebook')

		// Render de buscando amigos
		//res.render('./plataforma/comunidad/find_friends/index.jade', {
		//	user: req.user
		//})

		res.status(200).json({
			user: req.user
		})

	} else {
		res.redirect('/login')
	}
})

// Enlace: /by-facebook
app.get('/by-facebook/', isLoggedIn, function (req, res) {
	if(req.user) {

		// Render de buscando amigos
		//res.render('./plataforma/comunidad/find_friends/facebook', {
		//	user: req.user
		//})

		res.status(200).json({
			user: req.user
		})

	} else {
		res.redirect('/login')
	}
})

// Enlace: /agregando amigo por provider_id 
app.post('/by-facebook/add/:friend_facebook_id', isLoggedIn, function (req, res) {
	if(req.user) {	
		var friend_facebook_id = req.params.friend_facebook_id
		var user_id = req.user._id

		// Buscando en la lista de amigos del usuario
		Friends.findOne({'user_id': user_id}, function (err, list_friend_usuario) {
			if(err) {
				console.log('El usuario no se encontro en la lista de los que tienen amigos')
			}

			console.log('El usuario se encontro, Lista de amigos')
			console.log(list_friend_usuario)
			
			// Buscando usuario a agregar en los usuarios de la plataforma
			Users.findOne({'provider_id': friend_facebook_id}, function (err, friend_user) {
				if(err) {
					return console.log('Error al encontrar al usuario por provider_id: ' + err)
				}

				console.log('Usuario a Agregar a lista de amigos, encontrado por provider id: ')
				console.log(friend_user)

				var friend_user_id = JSON.stringify(friend_user._id)
				friend_user_id = JSON.parse(friend_user_id)

				var encontrado
				encontrado = false

				// Buscando si el amigo a agregar ya se encuentra en la lista de amigos actual
				for(var h = 0; h <= list_friend_usuario.amigos.length - 1; h++) {
					var friend = list_friend_usuario.amigos[h]
					
					// FIltrando al usuario por id
					if(friend.user_id === friend_user_id) {
						console.log(' el elemento fue ENCONTRADO')
						encontrado = true
						break
					}
				}

				console.log('fuera del bucle')
				if(encontrado === true) {
					// el usuario a agregar en lista de amigos ya se encuentra
					// NO se agregar
					console.log('Usuario a agregar: ' + friend_user.name + ' YA ES TU AMIGO')

					//res.send('El usuario: ' + friend_user.name + ' ya se encuentra en tu lista de amigos')
					res.status(200).json({
						status: 'ok',
						message: 'El usuario: ' + friend_user.name + ' ya se encuentra en tu lista de amigos'
					})

				} else if(encontrado === false){
					// El usuario a agregar en lista de amigos AUno no se encuentra
					// Agregar en lista de mis amigos
					console.log('Usuario a agregar: ' + friend_user.name + ' NO ES TU AMIGO AUN, AGREGANDO A LISTA DE TUS AMIGOS')
					
					// Datos del usuario a agregar
					var new_friend = {
						user_id: friend_user._id,
						user_provider_id: friend_user.provider_id
					}

					// Agregando usuario a lista de amigos
					list_friend_usuario.amigos.push(new_friend)
					
					// Agregando al usuario obtenido por provider_id a la lista de amigos del usuario solicitante
					list_friend_usuario.save(function (err) {
						if(err) {
							return console.log('Error al guardar al nuevo amigo, error: ' + err)
						}
						console.log('Amigo agregado')
					})
					
					// Render de buscando amigos
					//res.send('AMIGO AGREGADO :D')
					
					res.status(200).json({
						status:'ok',
						message: 'Amigo agregado'
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