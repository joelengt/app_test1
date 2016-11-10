var express = require('express')
var app = express.Router()
var cloudinary = require('cloudinary')

var Users = require('../../../models/usuarios')

var config = require('../../../config')

var permiso = config.typeUser.admin

// ruta: /usuarios vista principal de todos los usuarios
app.get('/', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			// Buscando a todos los usuarios
			Users.find(function (err, usuarios) {
				
				if(err) {
					return console.log('Usuarios no encontrados')
				}

				var numero_usuarios = usuarios.length
				
				res.render('./admin/dashboard/usuarios', {
					user: req.user,
					usuarios : usuarios,
					numero_usuarios: numero_usuarios
				})

				//res.status(200).json({
				//	user: req.user,
				//	usuarios : usuarios,
				//	numero_usuarios: numero_usuarios
				//})			

			})
		
		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// Delete de usuario

// Vista para confirmar delete de usuarios
app.post('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			Users.findById({'_id': id}, function (err, usuario) {
				if(err) {
					return res.send('Error al encontrar el usuario: ' + err)
				}
				
				res.render('./admin/dashboard/usuarios/delete/confirmar', {
					user: req.user,
					usuario: usuario
				})

				//res.status(200).json({
				//	user: req.user,
				//	usuario: usuario
				//})
			
			})
			
		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// DELETE: Confirmar para Eliminar
app.delete('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			Users.findById({'_id': id}, function (err, usuario) {
				if(err) {
					return console.log('Error al encontrar un usuario')
				}
							
				if(req.body.confirmar == usuario.name) {
					Users.remove({'_id': id}, function (err) {
						if(err) {
							return res.send('Error al eliminar usuario')
						}
						res.redirect('/plataforma/admin/usuarios')
					})
				} else {
					
					res.render('./admin/dashboard/usuarios/delete/confirmar',{
						user: req.user,
						usuario: usuario,
						msg: 'Los datos no coindicen, No Borrado!!'
					})
					
					//res.status(200).json({
					//	user: req.user,
					//	usuario: usuario,
					//	msg: 'Los datos no coindicen, No Borrado!!'
					//})
				}

			})
		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.reditect('/plataforma/admin/login')
	}

}) 

// Actualizando Data de usuarios
app.post('/update/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			Users.findById({'_id': id}, function (err, usuario) {
				
				if(err) {
					return res.send('Error al buscar usuario: ' + err)
				}

				res.render('./admin/dashboard/usuarios/update/form_edit', {
					user: req.user,
					usuario: usuario
				})

				//res.status(200).json({
				//	user: req.user,
				//	usuario: usuario
				//})

			})

		} else {

			res.redirect('/plataforma/')

		}
	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// UPDATE: Actualizando datos 
app.put('/update/:id', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			var id = req.params.id
			
			Users.findById({'_id': id}, function(err, user_find) {
				if(err) {
					return console.log('Error al encontrar usuario en la base de datos: ' + err)
				}

				var data = {
					first_name: req.body.first_name || user_find.first_name,
					last_name: req.body.last_name  || user_find.last_name,
					email: req.body.email || user_find.email,
					nickname: req.body.nickname || user_find.nickname,
					age: req.body.age || user_find.age,
					genero: req.body.genero || user_find.genero,
					categoria: req.body.categoria || user_find.categoria,
					grado: req.body.grado || user_find.grado,
					lugar: req.body.lugar || user_find.lugar,
					social_facebook: req.body.url_facebook || user_find.url_facebook,
					social_twitter: req.body.url_twitter || user_find.url_twitter
				}

				if(req.body.hasOwnProperty('news')) {
					data.news = req.body.news  || 'si'
				}
				console.log('CAMBIOSSSS PERFIL')
				console.log('Queriendo cambiar a ' + req.body.new_access)
				if(req.body.hasOwnProperty('new_access')) {
					console.log('El usuario admin esta intentando cambiar el permiso del usuario: ' + id )
					if(req.body.confirmar_change === 'gato') {
						console.log('El usuario admin, esta autorizado para cambiar el permiso')
						data.access = req.body.new_access || 'free'

					}
				}

				if(req.files.hasOwnProperty('avatar_perfil')) {
					// cloudinary.uploader.upload(req.files.avatar_perfil.path, function (result) {
					
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
		            
					data.photo = FilesCover

					Users.update({'_id': id}, data, function (err) {
						if(err) {
							return	res.send('Error al actualizar, porfavor contactanos para ayudarte!! ' + err)
						}
						Users.findById(id, function (err, usuario) {
							if(err) {
								return res.send('Error al encontrar usuario: ' + err)
							}

							// Render page edit
							res.render('./admin/dashboard/usuarios/update/form_edit', {
								user: req.user,
								usuario: usuario,
								msg: 'Se Actualizo con exito, Avatar Cambiado'
							})

							//res.status(200).json({
							//	user: req.user,
							//	usuario: usuario,
							//	msg: 'Se Actualizo con exito, Avatar Cambiado'
							//})

						})
					})

					// },
					// { width: 800, height: 600, crop: 'limit' })

				}  else {

					Users.update({'_id': id}, data, function (err) {
						if(err) {
							return	res.send('Error al actualizar, porfavor contactanos para ayudarte!! ' + err)
						}
						Users.findById(id, function (err, usuario) {
							if(err) {
								return res.send('Error al encontrar usuario: ' + err)
							}

							// Render page adit
							res.render('./admin/dashboard/usuarios/update/form_edit', {
								user: req.user,
								usuario: usuario,
								msg: 'Se Actualizo con exito'
							})

							//res.status(200).json({
							//	user: req.user,
							//	usuario: usuario,
							//	msg: 'Se Actualizo con exito'
							//})

						})
					})

				}

			})

		} else {

			res.redirect('/plataforma/')

		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

module.exports = app
