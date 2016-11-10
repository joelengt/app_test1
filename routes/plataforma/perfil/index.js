var express = require('express')
var app = express.Router()
var cloudinary = require('cloudinary')

var Users = require('../../../models/usuarios')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

// Mostrando el perfil Publico de usuario
app.get('/:user_id', isLoggedIn, function (req, res) {
	var user_id = req.params.user_id

	if(req.user) {

		Users.findById(user_id, function (err, usuario) {
			if(err) {
				return res.send(404, 'Error al encontrar usuario: ' + err)
			}
			
			// Render vista para usuario
			/*res.render('./plataforma/perfil/index', {
				user: usuario,
				user_edit: req.user
			})*/
			
			res.status(200).json({
				user: usuario,
				user_edit: req.user
			})

		})		
		
	} else {
		res.redirect('/login')
	}
})

// Vista para editar el perfil personal
app.post('/edit/:id', isLoggedIn, function (req, res) {
	if(req.user) {

		var id = req.params.id

		var user_edit = JSON.stringify(req.user._id)
		user_edit = JSON.parse(user_edit)

		if(user_edit === id) {
			console.log('LOs usuarios coinciden')
			Users.findById(user_edit, function (err, usuario) {
				console.log('Datos el user')
				console.log(usuario)
				
				// Render de vista para usuario
				/*res.render('./plataforma/perfil/edit', {
					user_edit: usuario
				})*/

				res.status(200).json({
					user_edit: usuario
				})
				
			})

		}

	} else {
		res.redirect('/login')
	}
})

// PUT: Editando al usuario
app.put('/edit/:id', isLoggedIn, function (req, res) {
	if(req.user) {
		
		var id = req.params.id

		var user_edit = JSON.stringify(req.user._id)
		user_edit = JSON.parse(user_edit)

		if(user_edit === id) {
			
			var data = {
				first_name: req.body.first_name || '',
				last_name: req.body.last_name  || '',
				name:  req.body.first_name + ' ' + req.body.last_name,
				email: req.body.email || '',
				nickname: req.body.nickname || req.body.first_name || '',
				age: req.body.age || '',
				genero: req.body.genero || '',
				categoria: req.body.categoria,
				grado: req.body.grado,
				lugar: req.body.lugar || '',
				address: req.body.address || '',
				phone: req.body.phone || '',
				social_facebook: req.body.url_facebook || '',
				social_twitter: req.body.url_twitter || '',
				social_instagram: req.body.url_instagram || ''
			}

			var new_nick = ''
			for(var i = 0; i <= data.nickname.length - 1; i++) {
				var caracter = data.nickname[i]
				
				// Filtrando espacios dentro de la palabra
				if(caracter === ' ') {
					new_nick+= '_'
					
				} else {
					new_nick+= caracter
				}

			}

			data.nickname = new_nick

			if(req.body.hasOwnProperty('news')) {
				data.news = req.body.news  || 'si'
			}

			if(req.files.hasOwnProperty('avatar_perfil')) {
				console.log('Resultado desde el perfil de usuario file')
				console.log(req.files)

				// Validando path uploads ----
				var FilesCover = req.files.avatar_perfil

				var path_file = FilesCover.path
	            console.log(path_file)

	            // path uploads iniciales
	            var uploads_1 = 'uploads/'
	            var uploads_2 = 'uploads\\'

	            // Validando reemplazo del inicio del path uploads
	            if (path_file.indexOf(uploads_1) != -1) {
	                FilesCover.path = FilesCover.path.replace('uploads/','/')
	                data.photo = FilesCover

	            } else if (path_file.indexOf(uploads_2) != -1) {
	                FilesCover.path = FilesCover.path.replace('uploads\\','/')
	                data.photo = FilesCover
	            
	            } else {
	                console.log('Ocurrió un error con el path')
	                console.log(path_file)
	            
	            }

	            // Asignando nuevo contenido de imagen de imagen
				data.photo = FilesCover

				console.log('Data de usuario a actualizar')
				console.log(data)

				Users.update({'_id': id}, data, function (err) {
					if(err) {
						return	res.send('Error al actualizar, porfavor contactanos para ayudarte!! ' + err)
					}
					Users.findById(id, function (err, usuario) {
						if(err) {
							return res.send('Error al encontrar usuario: ' + err)
						}
						
						// Relogin session passport
						req.login(usuario, function (err) {
							if(err) {
								return res.send('Error al encontrar relogear')
							}
						})

						// Render page edit
						// res.render('./plataforma/perfil/edit', {
						// 	user_edit: usuario,
						// 	msg: 'Se actualizo con Exito, Avatar Editado!!'	
						// })

						res.status(200).json({
							user_edit: usuario,
							msg: 'Se actualizo con Exito, Avatar Editado!!'
						})

					})
				})

			}  else {

				Users.update({'_id': id}, data, function (err) {
					if(err) {
						return	res.send('Error al actualizar, porfavor contactanos para ayudarte!! ' + err)
					}
					
					Users.findById(id, function (err, usuario) {
						if(err) {
							return res.send('Error al encontrar usuario: ' + err)
						}

						// Relogin session passport
						req.login(usuario, function (err) {
							if(err) {
								return res.send('Error al encontrar relogear')
							}
						})

						// Render page adit

						// res.render('./plataforma/perfil/edit', {
						// 	user_edit: usuario,
						// 	msg: 'Se actualizo con Exito!!'	
						// })

						res.status(200).json({
							user_edit: usuario,
							msg: 'Se actualizo con Exito!!'
						})

					})
				})
			
			}

		} else {
			res.status(200).json({
				status: 'Access NO enalbed',
				message: 'No tienes permisos para esto'
			})
		}


	} else {

		res.redirect('/login')
	
	}

})

module.exports = app
