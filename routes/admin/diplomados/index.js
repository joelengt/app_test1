var express = require('express')
var app = express.Router()
// var cloudinary = require('cloudinary')

//Permiso de acceso para usuarios 
var config = require('../../../config')
var permiso = config.typeUser.admin

var Diplomados = require('../../../models/diplomados')

// API Diplomados en Admin

// READ: Render de todos los diplomados Guardados
app.get('/', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			Diplomados.find(function (err, diplomados) {
				if(err) {
					return console.log('Error al encontrar los diplomados: ' + err)
				}

				res.render('./admin/dashboard/diplomados', {
					user: req.user,
					diplomados: diplomados
				})

				// res.send({user: req.user, diplomados: diplomados})
				
			})

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}

})	

//READ: Diplomado por id en admin

app.get('/:id', function (req, res) {
	if(req.user) {
		
		if(req.user.access === permiso) {

			var id = req.params.id

			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					res.send('Error al encontrar el diplomados: ' + err)
				}

				res.render('./admin/dashboard/diplomados/detalles', {
					user: req.user,
					diplomado: diplomado
				})

				// res.send({user: req.user, diplomado: diplomado})

			})

		} else {
			res.redirect('/plataforma')
		}
	} else {
		res.redirect('/plataforma/admin/login')
	}
})

app.post('/new_diplomado', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			res.render('./admin/dashboard/diplomados/create', {
				user: req.user
			})

			// res.send({user: req.user})

		} else {
			res.redirect('/plataforma')
		}
	
	} else {
		res.reditect('/plataforma/admin/login')
	}
})

// POST: Crear/Añadir Nuevo Curso

app.post('/add', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			var data = new Diplomados({
				title: req.body.title || 'Sin Titulo',
				slogan: req.body.slogan || '',
				promedioRate: 5,
				tags: req.body.tags || '',
				description: req.body.description || '',
				materiales: { audioLibro: [], texto: []},
				cover: { path: 'default_diplomado/cover_diplomado_default.png' },
				icon: { path: 'default_diplomado/icon_diplomado_default.png' },
				reseñas: ['saludos','muajjaa','que risa','10/10','Khé']
			})

			// Obteniendo archivos multimedia
			if(req.files.hasOwnProperty('diplomado_cover') || req.files.hasOwnProperty('diplomado_icon') || req.files.hasOwnProperty('diplomado_audioLibros') || req.files.hasOwnProperty('diplomado_textos')) {

				// Cover Imagen del curso
				var FilesCover = {}
				FilesCover.path = 'default_diplomado/cover_diplomado_default.png'
				
				if(req.files.hasOwnProperty('diplomado_cover')) {
					FilesCover = req.files.diplomado_cover
					FilesCover.path = FilesCover.path.replace('uploads/','') 
				}

				data.cover = FilesCover

				// Icon Imagen del curso
				var FilesIcon = {}
				FilesIcon.path = 'default_diplomado/icon_diplomado_default.png'

				if(req.files.hasOwnProperty('diplomado_icon')) {
					FilesIcon = req.files.diplomado_icon
					FilesIcon.path = FilesIcon.path.replace('uploads/','') 
				}

				data.icon = FilesIcon

				//Audios del curso
				var FilesAudioLibros = []
				var arrAudioLibros = []
				
				if(req.files.hasOwnProperty('diplomado_audioLibros')) {
					FilesAudioLibros = req.files.diplomado_audioLibros

					for (var i = FilesAudioLibros.length - 1; i >= 0; i--) {
						var el = FilesAudioLibros[i]
						el.path = el.path.replace('uploads/','')
						arrAudioLibros[i] = el
					}
				}
				
				data.materiales.audioLibro = arrAudioLibros

				// Textos
				var FilesTextos = []
				var arrTextos = []

				if(req.files.hasOwnProperty('diplomado_textos')) {
					FilesTextos = req.files.diplomado_textos

					for (var i = FilesTextos.length - 1; i >= 0; i--) {
						var el = FilesTextos[i]
						el.path = el.path.replace('uploads/','')
						arrTextos[i] = el
					}
				}
				
				data.materiales.texto = arrTextos

			} else {

				console.log('No se subio nungun archivo multimedia en el curso')

			}

			//Guardando curso con multimedia
			data.save(function (err) {
				if(err) {
					return console.log('Error al guardar curso')
				}
				var id = data._id

				// Buscando curso por id en la base de datos
				Diplomados.findById({'_id': id}, function (err, diplomado) {
					if(err) {
						return res.send('Error al encontrar elemento')
					}

					// Obteniendo los textos del curso
					var textos = diplomado.materiales.texto
					// Obteniendo los audios del curso
					var audios = diplomado.materiales.audioLibro

					// Datos Entregados al cliente: render vista
					res.render('./admin/dashboard/diplomados/update/', {
						user: req.user,
						diplomado: diplomado,
						textos: textos,
						audios: audios
					})

					// res.send({user: req.user, diplomado: diplomado, textos: textos, audios: audios})
				})

			})
			

		} else {
			res.redirect('/plataforma/')
		}
		
	} else {
		res.reditect('/plataforma/admin/login')
	}
	
})


// DELETE: Vista render, confirmar eliminación de diplomados

app.post('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {
			
			var id = req.params.id

			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					return res.send('Error al encontrar curso')
				}
				
				res.render('./admin/dashboard/diplomados/delete/', {
					user: req.user,
					diplomado: diplomado
				})

				// res.send({user: req.user, diplomado: diplomado})
			})

		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// DELETE: curso en lista
app.delete('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {
			
			var id = req.params.id

			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					return console.log('Error al encontrar un diplomado')
				}

				if(req.body.diplomado_confirmar == diplomado.title) {

					Diplomados.remove({'_id': id}, function (err) {
						if(err) {
							return res.send('Error al eliminar diplomado')
						}

						res.redirect('/plataforma/admin/diplomados')
					
					})

				} else {

					res.render('./admin/dashboard/diplomados/delete', {
						user: req.user,
						diplomados: diplomados,
						msg: 'Los datos no coindicen, No Borrado!!'
					})

					// res.send({user: req.user, diplomados: diplomados, msg: 'Los datos no coindicen, No Borrado!!'})

				}
			})

		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.reditect('/plataforma/admin/login')
	}
})

//UPDATE: render de vista para formulario

app.post('/update/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			// Buscando diplomado por id en la base de datos
			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					return res.send('Error al encontrar elemento')	
				}

				// Obteniendo los textos del diplomado
				var textos = diplomado.materiales.texto
				// Obteniendo los audios del diplomado
				var audios = diplomado.materiales.audioLibro

				// Datos Entregados al cliente: render vista
				res.render('./admin/dashboard/diplomados/update/', {
					user: req.user,
					diplomado: diplomado,
					textos: textos,
					audios: audios
				})

				// res.send({user: req.user, diplomado: diplomado, textos: textos, audios: audios})
			})

		} else {
			res.redirect('/plataforma/')
		}
	} else {
		res.reditect('/plataforma/admin/login')
	}
})

//UPDATE: Actualizar los datos

app.put('/update/:id', function (req, res) {

	if(req.user) {

		if(req.user.access === permiso) {

			var id = req.params.id

			var data = {
				title: req.body.title || '',
				slogan: req.body.slogan || '',
				tags: req.body.tags || '',
				description: req.body.description || ''
			}

			Diplomados.findById({'_id': id}, function (err, diplomado) {
				if(err) {
					return console.log('Error al encontrar el diplomado como elemento: ' + err)
				}
				
			if(req.files.hasOwnProperty('diplomado_cover') || req.files.hasOwnProperty('diplomado_icon') || req.files.hasOwnProperty('diplomado_audioLibros') || req.files.hasOwnProperty('diplomado_textos')) {

				// Cover Imagen del diplomado
				if(req.files.hasOwnProperty('diplomado_cover')) {
					console.log('Se subio cover')
					var FilesCover = {}
		
					FilesCover = req.files.diplomado_cover
					FilesCover.path = FilesCover.path.replace('uploads/','')
					data.cover = FilesCover
				}

				// Icon Imagen del diplomado
				if(req.files.hasOwnProperty('diplomado_icon')) {
					console.log('Se subio icon')
					
					var FilesIcon = {}
		
					FilesIcon = req.files.diplomado_icon
					FilesIcon.path = FilesIcon.path.replace('uploads/','') 
					data.icon = FilesIcon
				}

				//Audios y Textos 
				if(req.files.hasOwnProperty('diplomado_audioLibros') || req.files.hasOwnProperty('diplomado_textos')) {
					console.log('Se actualizara los audios o los textos')
					
					var textos
					var audios

					data.materiales = {}

						// Obteniendo los audios del diplomado
						audios = diplomado.materiales.audioLibro

						// Obteniendo los textos del diplomado
						textos = diplomado.materiales.texto
						
						data.materiales.audioLibro = audios
						data.materiales.texto = textos

						//Audios del diplomado
						if(req.files.hasOwnProperty('diplomado_audioLibros')) {
							console.log('Se modificaron los audios Libros')
							var FilesAudioLibros 	
							var arrAudioLibros = []
				
							FilesAudioLibros = req.files.diplomado_audioLibros	

							if(FilesAudioLibros[1]) { 	
								for (var i = FilesAudioLibros.length - 1; i >= 0; i--) {
									var el = FilesAudioLibros[i]
									el.path = el.path.replace('uploads/','')
									arrAudioLibros[i] = el
								}
							} else {
								var el = FilesAudioLibros
								el.path = el.path.replace('uploads/','')
								arrAudioLibros[0] = el
							}

		                    data.materiales.audioLibro = arrAudioLibros

						}

						// Textos
						if(req.files.hasOwnProperty('diplomado_textos')) {	
							console.log('Textos actualizados')
							var FilesTextos
							var arrTextos = []
						
							FilesTextos = req.files.diplomado_textos

							if(FilesTextos[1]) {
								for (var i = FilesTextos.length - 1; i >= 0; i--) {
									var el = FilesTextos[i]
									el.path = el.path.replace('uploads/','')
									arrTextos[i] = el
								}
							} else {
								var el = FilesTextos
								el.path = el.path.replace('uploads/','')
								arrTextos[0] = el
							}

							data.materiales.texto = arrTextos

						}

						console.log('Datos PARA ENVIAR')
						console.log(data)

				}

			} else {
				console.log('No se subio nungun archivo multimedia en el diplomado')
			}


			// Actualizando los nuevos datos 
			Diplomados.update({'_id': id}, data, function (err) {
				if(err) {
					return res.send('Error al actualizar el diplomado : ' + err)
				}

				// Buscando al usuario
				Diplomados.findById(id, function (err, diplomado) {
					if(err) {
						return res.send('Error al encontrar el diplomado: ' + err)
					}

					// Obteniendo los textos del diplomado
					var textos = diplomado.materiales.texto

					// Obteniendo los audios del curso
					var audios = diplomado.materiales.audioLibro

					// Render datos en viados al cliente 
					res.render('./admin/dashboard/diplomados/update', {
						user: req.user,
						diplomado: diplomado,
						textos: textos,
						audios: audios,
						msg: 'Se actualizo con Exito!!'
					})

					// res.send({user: req.user, diplomado: diplomado, textos: textos, audios: audios, msg: 'Se actualizo con Exito!!'})

				})
			})

		})
		} else {
			res.redirect('/plataforma/')
		}

	} else {
		res.reditect('/plataforma/admin/login')
	}

})

module.exports = app

