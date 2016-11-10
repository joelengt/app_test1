var express = require('express')
var app = express.Router()
// var cloudinary = require('cloudinary')

//Permiso de acceso para usuarios 
var config = require('../../../config')
var permiso = config.typeUser.admin

var pregunta_categoria = config.pregunta.categoria
var pregunta_tipo = config.pregunta.tipos
var pregunta_dificultad = config.pregunta.dificultad

var Cursos = require('../../../models/cursos')
var Preguntas = require('../../../models/preguntas')

// Courses colours
var colores = ['#087299', '#004a79', '#c7e7ef','#9ecad4',
			  '#52aacf', '#003162', '#001f39', '#003a48', 
			  '#003b50', '#005266', '#021a2c', '#005266', 
			  '#004748', '#12757f', '#117b92', '#3ca3ba', 
			  '#148fa8', '#1a95c9', '#003a67', '#23559d', 
			  '#80bcd8','#6caabc', '#1a7cbc']

// API cursos en Admin

// READ: Render de todos los cursos Guardados
app.get('/', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			Cursos.find(function (err, cursos) {
				if(err) {
					return console.log('Error al encontrar los cursos: ' + err)
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
				
				res.render('./admin/dashboard/cursos', {
					cursos: Article_collections,
					user: req.user
				})

				// res.status(200).json({
				// 	cursos: Article_collections,
				// 	user: req.user
				// })
				
			})

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}

})

//READ: Curso en admin
app.get('/:id', function (req, res) {
	if(req.user) {
		
		if(req.user.access === permiso) {

			var id = req.params.id

			Cursos.findById({'_id': id}, function (err, curso) {
				if(err) {
					res.send('Error al encontrar el curso: ' + err)
				}

				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}
					
					var cant_total_preguntas = 0
					var cant_total_lecciones = 0

					// Obteniendo filtro de SImulador para un curso por id
					var filter_categority = []
					var filter_title = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_title = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = {
						muestra: [],
						basico: [],
						intermedio: [],
						avanzado: []
					}

					// Filtrando por dificutad: muestra
					filter_preguntas_dificultad.muestra = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.muestra
					})

					// Filtrando por dificultad: basico
					filter_preguntas_dificultad.basico = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.basico
					})

					// Filtrando por dificultad: intermedio
					filter_preguntas_dificultad.intermedio = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.intermedio
					})

					// Filter por dificultad: avanzado
					filter_preguntas_dificultad.avanzado = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.avanzado
					})


					// Cantidad de preguntas por curso
					console.log('El curso: ' + curso._id + ' ' + curso._title + ' tiene ' + filter_title.length + '  PREGUNTAS')


					// Dificultad Muestra
					var max_cant_muestra = 0
					for (var i = filter_preguntas_dificultad.muestra.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_muestra += 1
					}

					// Dificultad Basico
					var max_cant_basico = 0
					for (var i = filter_preguntas_dificultad.basico.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_basico += 1
					}

					// Dificultad Intermedio
					var max_cant_intermedio = 0
					for (var i = filter_preguntas_dificultad.intermedio.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_intermedio += 1
					}

					// Dificultad Avanzado
					var max_cant_avanzado = 0
					for (var i = filter_preguntas_dificultad.avanzado.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_avanzado += 1
					}
					

					var cant_total_preguntas = max_cant_muestra + max_cant_basico + max_cant_intermedio + max_cant_avanzado
					var cant_total_lecciones = Number(curso.materiales.simulador.muestra.n_lecciones) + Number(curso.materiales.simulador.basico.n_lecciones) + Number(curso.materiales.simulador.intermedio.n_lecciones) + Number(curso.materiales.simulador.avanzado.n_lecciones)
					
					console.log('Muestra')
					console.log(max_cant_muestra)

					console.log('Basico')
					console.log(max_cant_basico)

					console.log('Intermedio')
					console.log(max_cant_intermedio)

					console.log('Avanzado')
					console.log(max_cant_avanzado)
					
					// Simulador del curso

					var simulador = {	
						info: {
							preguntas: cant_total_preguntas,
							lecciones: cant_total_lecciones
						},
						muestra: {
							title: 'Muestra',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.muestra.description,
							max_questions: max_cant_muestra,
							n_lecciones: curso.materiales.simulador.muestra.n_lecciones,
							n_questions: curso.materiales.simulador.muestra.n_questions
						},
						basico: {
							title: 'Básico',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.muestra.description,
							max_questions: max_cant_basico,
							n_lecciones: curso.materiales.simulador.basico.n_lecciones,
							n_questions: curso.materiales.simulador.basico.n_questions
						},
						intermedio: {
							title: 'Intermedio',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.muestra.description,
							max_questions: max_cant_intermedio,
							n_lecciones: curso.materiales.simulador.intermedio.n_lecciones,
							n_questions: curso.materiales.simulador.intermedio.n_questions
						},
						avanzado: {
							title: 'Avanzado',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.muestra.description,
							max_questions: max_cant_avanzado,
							n_lecciones: curso.materiales.simulador.avanzado.n_lecciones,
							n_questions: curso.materiales.simulador.avanzado.n_questions
						}
					}

					res.render('./admin/dashboard/cursos/detalles', {
						user: req.user,
						curso: curso,
						simulador: simulador
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	curso: curso,
					// 	simulador: simulador
					// })
				})
			})

		} else {
			res.redirect('/plataforma')
		}
	} else {
		res.redirect('/plataforma/admin/login')
	}
})

app.post('/new_course', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {

			res.render('./admin/dashboard/cursos/create', {
				user: req.user
			})
			
			// res.status(200).json({
			// 	user: req.user
			// })

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

			var data = new Cursos({
				title: req.body.title || 'Sin Titulo',
				slogan: req.body.slogan || '',
				promedioRate: 5,
				tags: req.body.tags || '',
				description: req.body.description || '',
				materiales: { 
					audioLibro: [],
					texto: [],
					simulador: {
						info: {
							preguntas: 0,
							lecciones: 0
						},
						muestra: {
							title: 'Muestra',
							icon: 'default_course/icon_course_default.png',
							description: '',
							max_questions: 0,
							n_lecciones: 0,
							n_questions: 0
						},
						basico: {
							title: 'Básico',
							icon: 'default_course/icon_course_default.png',
							description: '',
							max_questions: 0,
							n_lecciones: 0,
							n_questions: 0
						},
						intermedio: {
							title: 'Intermedio',
							icon: 'default_course/icon_course_default.png',
							description: '',
							max_questions: 0,
							n_lecciones: 0,
							n_questions: 0
						},
						avanzado: {
							title: 'Avanzado',
							icon: 'default_course/icon_course_default.png',
							description: '',
							max_questions: 0,
							n_lecciones: 0,
							n_questions: 0
						}
					}
				},
				colour: req.body.colour || '#087299',
				cover: { path: 'default_course/cover_course_default.png' },
				icon: { path: 'default_course/icon_course_default.png' },
				reseñas: ['saludos','muajjaa','que risa','10/10','Khé']
			})

			// Obteniendo archivos multimedia
			if(req.files.hasOwnProperty('curso_cover') || req.files.hasOwnProperty('curso_icon') || req.files.hasOwnProperty('curso_audioLibros') || req.files.hasOwnProperty('curso_textos')) {

				// Cover Imagen del curso
				var FilesCover = {}
				FilesCover.path = 'default_course/cover_diplomado_default.png'
				
				if(req.files.hasOwnProperty('curso_cover')) {
					// Validando path uploads ----
					FilesCover = req.files.curso_cover

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
				} 

				data.cover = FilesCover

				// Icon Imagen del curso
				var FilesIcon = {}
				FilesIcon.path = 'default_course/icon_course_default.png'

				if(req.files.hasOwnProperty('curso_icon')) {
					FilesIcon = req.files.curso_icon

					var path_file = FilesIcon.path
		            console.log(path_file)

		            // path uploads iniciales
		            var uploads_1 = 'uploads/'
		            var uploads_2 = 'uploads\\'

		            // Validando reemplazo del inicio del path uploads
		            if (path_file.indexOf(uploads_1) != -1) {
		                FilesIcon.path = FilesIcon.path.replace('uploads/','/')
		                data.photo = FilesIcon

		            } else if (path_file.indexOf(uploads_2) != -1) {
		                FilesIcon.path = FilesIcon.path.replace('uploads\\','/')
		                data.photo = FilesIcon
		            
		            } else {
		                console.log('Ocurrió un error con el path')
		                console.log(path_file)
		            
		            }
				}

				data.icon = FilesIcon

				//Audios del curso
				var FilesAudioLibros = []
				var arrAudioLibros = []
				
				if(req.files.hasOwnProperty('curso_audioLibros')) {
					FilesAudioLibros = req.files.curso_audioLibros

					for (var i = FilesAudioLibros.length - 1; i >= 0; i--) {
						var el = FilesAudioLibros[i]

						var path_file = el.path
			            console.log(path_file)

			            // path uploads iniciales
			            var uploads_1 = 'uploads/'
			            var uploads_2 = 'uploads\\'

			            // Validando reemplazo del inicio del path uploads
			            if (path_file.indexOf(uploads_1) != -1) {
			                el.path = el.path.replace('uploads/','/')
			                data.photo = el

			            } else if (path_file.indexOf(uploads_2) != -1) {
			                el.path = el.path.replace('uploads\\','/')
			                data.photo = el
			            
			            } else {
			                console.log('Ocurrió un error con el path')
			                console.log(path_file)
			            
			            }

						arrAudioLibros[i] = el
					}
				}
				
				data.materiales.audioLibro = arrAudioLibros

				// Textos
				var FilesTextos = []
				var arrTextos = []

				if(req.files.hasOwnProperty('curso_textos')) {
					FilesTextos = req.files.curso_textos

					for (var i = FilesTextos.length - 1; i >= 0; i--) {
						var el = FilesTextos[i]

						var path_file = el.path
			            console.log(path_file)

			            // path uploads iniciales
			            var uploads_1 = 'uploads/'
			            var uploads_2 = 'uploads\\'

			            // Validando reemplazo del inicio del path uploads
			            if (path_file.indexOf(uploads_1) != -1) {
			                el.path = el.path.replace('uploads/','/')
			                data.photo = el

			            } else if (path_file.indexOf(uploads_2) != -1) {
			                el.path = el.path.replace('uploads\\','/')
			                data.photo = el
			            
			            } else {
			                console.log('Ocurrió un error con el path')
			                console.log(path_file)
			            
			            }

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
				Cursos.findById({'_id': id}, function (err, curso) {
					if(err) {
						return res.send('Error al encontrar elemento')
					}

					// Obteniendo los textos del curso
					var textos = curso.materiales.texto

					// Obteniendo los audios del curso
					var audios = curso.materiales.audioLibro

					// Obteniendo el simulador del curso
					var simulador = curso.materiales.simulador

					// Datos Entregados al cliente: render vista
					
					res.render('./admin/dashboard/cursos/update/', {
						user: req.user,
						curso: curso,
						textos: textos,
						audios: audios,
						simulador: simulador
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	curso: curso,
					// 	textos: textos,
					// 	audios: audios,
					// 	simulador: simulador
					// })

					console.log('Datos del curso CREADO: ')
					console.log(curso)

				})

			})

		} else {
			res.redirect('/plataforma')
		}
		
	} else {
		res.reditect('/plataforma/admin/login')
	}
	
})


// DELETE: Vista render, confirmar eliminación de curso

app.post('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {
			
			var id = req.params.id

			Cursos.findById({'_id': id}, function (err, curso) {
				if(err) {
					return res.send('Error al encontrar curso')
				}		

				res.render('./admin/dashboard/cursos/delete/', {
					user: req.user,
					curso: curso
				})

				// res.status(200).json({
				// 	user: req.user,
				// 	curso: curso
				// })
			})

		} else {
			res.redirect('/plataforma')
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

			Cursos.findById({'_id': id}, function (err, curso) {
				if(err) {
					return console.log('Error al encontrar un usuario')
				}

				if(req.body.curso_confirmar == curso.title) {

					Cursos.remove({'_id': id}, function (err) {
						if(err) {
							return res.send('Error al eliminar curso')
						}

						res.redirect('/plataforma/admin/cursos')
					
					})

				} else {

					res.render('./admin/dashboard/cursos/delete', {
						user: req.user,
						curso: curso,
						msg: 'Los datos no coindicen, No Borrado!!'
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	curso: curso,
					// 	msg: 'Los datos no coindicen, No Borrado!!'
					// })
				}
			})

		} else {
			res.redirect('/plataforma')
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

			// Buscando curso por id en la base de datos
			Cursos.findById({'_id': id}, function (err, curso) {
				if(err) {
					return res.send('Error al encontrar elemento')
				}

				var cant_total_preguntas = 0
				var cant_total_lecciones = 0

				// Obteniendo los textos del curso
				var textos = curso.materiales.texto
				
				// Obteniendo los audios del curso
				var audios = curso.materiales.audioLibro

				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}
					
					// Obteniendo filtro de SImulador para un curso por id
					var filter_categority = []
					var filter_title = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_title = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = {
						muestra: [],
						basico: [],
						intermedio: [],
						avanzado: []
					}

					// Filtrando por dificutad: muestra
					filter_preguntas_dificultad.muestra = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.muestra
					})

					// Filtrando por dificultad: basico
					filter_preguntas_dificultad.basico = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.basico
					})

					// Filtrando por dificultad: intermedio
					filter_preguntas_dificultad.intermedio = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.intermedio
					})

					// Filter por dificultad: avanzado
					filter_preguntas_dificultad.avanzado = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.avanzado
					})


					// Dificultad Muestra
					var max_cant_muestra = 0
					for (var i = filter_preguntas_dificultad.muestra.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_muestra += 1
					}

					// Dificultad Basico
					var max_cant_basico = 0
					for (var i = filter_preguntas_dificultad.basico.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_basico += 1
					}

					// Dificultad Intermedio
					var max_cant_intermedio = 0
					for (var i = filter_preguntas_dificultad.intermedio.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_intermedio += 1
					}

					// Dificultad Avanzado
					var max_cant_avanzado = 0
					for (var i = filter_preguntas_dificultad.avanzado.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_avanzado += 1
					}
					
					cant_total_preguntas = max_cant_muestra + max_cant_basico + max_cant_intermedio + max_cant_avanzado
					cant_total_lecciones = Number(curso.materiales.simulador.muestra.n_lecciones) + Number(curso.materiales.simulador.basico.n_lecciones) + Number(curso.materiales.simulador.intermedio.n_lecciones) + Number(curso.materiales.simulador.avanzado.n_lecciones)
					
					// Simulador del curso

					var simulador = {	
						info: {
							preguntas: cant_total_preguntas,
							lecciones: cant_total_lecciones
						},
						muestra: {
							title: 'Muestra',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.muestra.description,
							max_questions: max_cant_muestra,
							n_lecciones: curso.materiales.simulador.muestra.n_lecciones,
							n_questions: curso.materiales.simulador.muestra.n_questions
						},
						basico: {
							title: 'Básico',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.basico.description,
							max_questions: max_cant_basico,
							n_lecciones: curso.materiales.simulador.basico.n_lecciones,
							n_questions: curso.materiales.simulador.basico.n_questions
						},
						intermedio: {
							title: 'Intermedio',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.intermedio.description,
							max_questions: max_cant_intermedio,
							n_lecciones: curso.materiales.simulador.intermedio.n_lecciones,
							n_questions: curso.materiales.simulador.intermedio.n_questions
						},
						avanzado: {
							title: 'Avanzado',
							icon: 'default_course/icon_course_default.png',
							description: curso.materiales.simulador.avanzado.description,
							max_questions: max_cant_avanzado,
							n_lecciones: curso.materiales.simulador.avanzado.n_lecciones,
							n_questions: curso.materiales.simulador.avanzado.n_questions
						}
					}
				
					// Datos Entregados al cliente: render vista
					res.render('./admin/dashboard/cursos/update/', {
						user: req.user,
						curso: curso,
						textos: textos,
						audios: audios,
						simulador: simulador
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	curso: curso,
					// 	textos: textos,
					// 	audios: audios,
					// 	simulador: simulador
					// })
				})
			})

		} else {
			res.redirect('/plataforma')
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
				materiales: {},
				description: req.body.description || '',
				colour: req.body.colour || '#087299'
			}

			Cursos.findById({'_id': id}, function (err, curso) {
				if(err) {
					return console.log('Error al encontrar el curso como elemento: ' + err)
				}

				var cant_total_preguntas = 0
				var cant_total_lecciones = 0

				// Consistencia de Archivos multimedia subidos
				var textos
				var audios

				// Obteniendo los audios del curso
				audios = curso.materiales.audioLibro

				// Obteniendo los textos del curso
				textos = curso.materiales.texto

				data.materiales.audioLibro = audios
				data.materiales.texto = textos

				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}
					
					// Obteniendo filtro de SImulador para un curso por id
					var filter_categority = []
					var filter_title = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_title = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = {
						muestra: [],
						basico: [],
						intermedio: [],
						avanzado: []
					}

					// Filtrando por dificutad: muestra
					filter_preguntas_dificultad.muestra = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.muestra
					})

					// Filtrando por dificultad: basico
					filter_preguntas_dificultad.basico = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.basico
					})

					// Filtrando por dificultad: intermedio
					filter_preguntas_dificultad.intermedio = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.intermedio
					})

					// Filter por dificultad: avanzado
					filter_preguntas_dificultad.avanzado = filter_title.filter(function (element) {
						return element.difficulty === pregunta_dificultad.avanzado
					})

					console.log('Preguntas filtradas por dificultad: ' + pregunta_dificultad.muestra)
					console.log(filter_preguntas_dificultad.muestra)

					// Dificultad Muestra
					var max_cant_muestra = 0
					for (var i = filter_preguntas_dificultad.muestra.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_muestra += 1
					}


					console.log('Preguntas filtradas por dificultad: ' + pregunta_dificultad.basico)
					console.log(filter_preguntas_dificultad.basico)

					// Dificultad Basico
					var max_cant_basico = 0
					for (var i = filter_preguntas_dificultad.basico.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_basico += 1
					}


					console.log('Preguntas filtradas por dificultad: ' + pregunta_dificultad.intermedio)
					console.log(filter_preguntas_dificultad.intermedio)

					// Dificultad Intermedio
					var max_cant_intermedio = 0
					for (var i = filter_preguntas_dificultad.intermedio.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_intermedio += 1
					}


					console.log('Preguntas filtradas por dificultad: ' + pregunta_dificultad.avanzado)
					console.log(filter_preguntas_dificultad.avanzado)

					// Dificultad Avanzado
					var max_cant_avanzado = 0
					for (var i = filter_preguntas_dificultad.avanzado.length - 1; i >= 0; i--) {
						//var el = filter_preguntas_dificultad.muestra[i]
						max_cant_avanzado += 1
					}
					
					cant_total_preguntas = max_cant_muestra + max_cant_basico + max_cant_intermedio + max_cant_avanzado
					cant_total_lecciones = Number(req.body.curso_simulador_muestra_n_lecciones) + Number(req.body.curso_simulador_basico_n_lecciones) + Number(req.body.curso_simulador_intermedio_n_lecciones) + Number(req.body.curso_simulador_avanzado_n_lecciones)

					// Simulador Validar Limite de creación de preguntas
					var curso_simulador_muestra_n_lecciones = Number(req.body.curso_simulador_muestra_n_lecciones || '0')
					var curso_simulador_muestra_n_questions = Number(req.body.curso_simulador_muestra_n_questions || '0')

					var curso_simulador_basico_n_lecciones = Number(req.body.curso_simulador_basico_n_lecciones || '0')
					var curso_simulador_basico_n_questions = Number(req.body.curso_simulador_basico_n_questions || '0')

					var curso_simulador_intermedio_n_lecciones = Number(req.body.curso_simulador_intermedio_n_lecciones || '0')
					var curso_simulador_intermedio_n_questions = Number(req.body.curso_simulador_intermedio_n_questions || '0')

					var curso_simulador_avanzado_n_lecciones = Number(req.body.curso_simulador_avanzado_n_lecciones || '0')
					var curso_simulador_avanzado_n_questions = Number(req.body.curso_simulador_avanzado_n_questions || '0')

					// Limite Seleccionado Preguntas x Lecciones para el curso
					var preguntas_lecciones_muestra = 0
					var preguntas_lecciones_basico = 0
					var preguntas_lecciones_intermedio = 0
					var preguntas_lecciones_avanzado = 0

					preguntas_lecciones_muestra = curso_simulador_muestra_n_lecciones * curso_simulador_muestra_n_questions
					preguntas_lecciones_basico = curso_simulador_basico_n_lecciones * curso_simulador_basico_n_questions
					preguntas_lecciones_intermedio = curso_simulador_intermedio_n_lecciones * curso_simulador_intermedio_n_questions
					preguntas_lecciones_avanzado = curso_simulador_avanzado_n_lecciones * curso_simulador_avanzado_n_questions
					
					var limite_preguntas_muestra
					var limite_lecciones_muestra

					var limite_preguntas_basico
					var limite_lecciones_basico
					
					var limite_preguntas_intermedio
					var limite_lecciones_intermedio
					
					var limite_preguntas_avanzado
					var limite_lecciones_avanzado

					// Valindando Limite preguntas x lecciones: Muestra
					if(  preguntas_lecciones_muestra >= 0 && preguntas_lecciones_muestra <= max_cant_muestra ) {

						// mensaje de limite aceptado
						console.log('Limite preguntas_lecciones_muestra: Valido, cambios guardados')
						// aceptar cambios de limite
						limite_preguntas_muestra = curso_simulador_muestra_n_lecciones
						limite_lecciones_muestra = curso_simulador_muestra_n_questions

					} else {

						// mensaje de limite NO aceptado
						console.log('Superaste el Limite preguntas_lecciones_muestra: No Valido')

						// tomar los campos de la base de datos
						limite_preguntas_muestra = curso.materiales.simulador.muestra.n_lecciones
						limite_lecciones_muestra = curso.materiales.simulador.muestra.n_questions

					}

					// Validando Limite preguntas x lecciones: Basico
					if(  preguntas_lecciones_basico >= 0 && preguntas_lecciones_basico <= max_cant_basico ) {

						// mensaje de limite aceptado
						console.log('Limite preguntas_lecciones_basico: Valido, cambios guardados')
						// aceptar cambios de limite
						limite_preguntas_basico = curso_simulador_basico_n_lecciones
						limite_lecciones_basico = curso_simulador_basico_n_questions

					} else {

						// mensaje de limite NO aceptado
						console.log('Superaste el Limite preguntas_lecciones_basico: No Valido')

						// tomar los campos de la base de datos
						limite_preguntas_basico = curso.materiales.simulador.basico.n_lecciones
						limite_lecciones_basico = curso.materiales.simulador.basico.n_questions
					
					}

					// Validando Limite preguntas x lecciones: Intermedio
					if(  preguntas_lecciones_intermedio >= 0 && preguntas_lecciones_intermedio <= max_cant_intermedio ) {
						
						// mensaje de limite aceptado
						console.log('Limite preguntas_lecciones_intermedio: Valido, cambios guardados')
						// aceptar cambios de limite
						limite_preguntas_intermedio = curso_simulador_intermedio_n_lecciones
						limite_lecciones_intermedio = curso_simulador_intermedio_n_questions

					} else {

						// mensaje de limite NO aceptado
						console.log('Superaste el Limite preguntas_lecciones_intermedio: No Valido')

						// tomar los campos de la base de datos
						limite_preguntas_intermedio = curso.materiales.simulador.intermedio.n_lecciones
						limite_lecciones_intermedio = curso.materiales.simulador.intermedio.n_questions
					
					}

					// Validando Limite preguntas x lecciones: Avanzado
					if(  preguntas_lecciones_avanzado >= 0 && preguntas_lecciones_avanzado <= max_cant_avanzado ) {

						// mensaje de limite aceptado
						console.log('Limite preguntas_lecciones_avanzado: Valido, cambios guardados')
						// aceptar cambios de limite
						limite_preguntas_avanzado = curso_simulador_avanzado_n_lecciones
						limite_lecciones_avanzado = curso_simulador_avanzado_n_questions

					} else {

						// mensaje de limite NO aceptado
						console.log('Superaste el Limite preguntas_lecciones_avanzado: No Valido')

						// tomar los campos de la base de datos
						limite_preguntas_avanzado = curso.materiales.simulador.avanzado.n_lecciones
						limite_lecciones_avanzado = curso.materiales.simulador.avanzado.n_questions
					
					}

					// Simulador del curso
					data.materiales.simulador = {
						info: {
							preguntas: cant_total_preguntas,
							lecciones: cant_total_lecciones
						},
						muestra: {
							title: 'Muestra',
							icon: 'default_course/icon_course_default.png',
							description: req.body.curso_simulador_muestra_description || '',
							max_questions: max_cant_muestra,
							n_lecciones: limite_preguntas_muestra || '',
							n_questions: limite_lecciones_muestra || ''
						},
						basico: {
							title: 'Básico',
							icon: 'default_course/icon_course_default.png',
							description: req.body.curso_simulador_basico_description || '',
							max_questions: max_cant_basico,
							n_lecciones: limite_preguntas_basico || '',
							n_questions: limite_lecciones_basico || ''
						},
						intermedio: {
							title: 'Intermedio',
							icon: 'default_course/icon_course_default.png',
							description: req.body.curso_simulador_intermedio_description || '',
							max_questions: max_cant_intermedio,
							n_lecciones: limite_preguntas_intermedio || '',
							n_questions: limite_lecciones_intermedio || ''
						},
						avanzado: {
							title: 'Avanzado',
							icon: 'default_course/icon_course_default.png',
							description: req.body.curso_simulador_avanzado_description || '',
							max_questions: max_cant_avanzado,
							n_lecciones: limite_preguntas_avanzado || '',
							n_questions: limite_lecciones_avanzado || ''
						}
					}
					
					// Subiendo archivos multimedia
					if(req.files.hasOwnProperty('curso_cover') || req.files.hasOwnProperty('curso_icon') || req.files.hasOwnProperty('curso_audioLibros') || req.files.hasOwnProperty('curso_textos') ) {

						// Cover Imagen del curso
						if(req.files.hasOwnProperty('curso_cover')) {
							console.log('Se subio cover')
							var FilesCover = {}
				
							FilesCover = req.files.curso_cover

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
							data.cover = FilesCover
						}

						// Icon Imagen del curso
						if(req.files.hasOwnProperty('curso_icon')) {
							console.log('Se subio icon')
							
							var FilesIcon = {}
				
							FilesIcon = req.files.curso_icon

							var path_file = FilesIcon.path
				            console.log(path_file)

				            // path uploads iniciales
				            var uploads_1 = 'uploads/'
				            var uploads_2 = 'uploads\\'

				            // Validando reemplazo del inicio del path uploads
				            if (path_file.indexOf(uploads_1) != -1) {
				                FilesIcon.path = FilesIcon.path.replace('uploads/','/')
				                data.photo = FilesIcon

				            } else if (path_file.indexOf(uploads_2) != -1) {
				                FilesIcon.path = FilesIcon.path.replace('uploads\\','/')
				                data.photo = FilesIcon
				            
				            } else {
				                console.log('Ocurrió un error con el path')
				                console.log(path_file)
				            
				            }
							data.icon = FilesIcon
						}

						//Audios y Textos 
						if(req.files.hasOwnProperty('curso_audioLibros') || req.files.hasOwnProperty('curso_textos')) {
							console.log('Se actualizara los audios o los textos')

							//Audios del curso
							if(req.files.hasOwnProperty('curso_audioLibros')) {
								console.log('Se modificaron los audios Libros')
								var FilesAudioLibros 	
								var arrAudioLibros = []
					
								FilesAudioLibros = req.files.curso_audioLibros	
								console.log('Audio Subido-------')
								console.log(FilesAudioLibros)

								if(FilesAudioLibros[1]) { 	
									for (var i = FilesAudioLibros.length - 1; i >= 0; i--) {
										var el = FilesAudioLibros[i]

										var path_file = el.path
							            console.log(path_file)

							            // path uploads iniciales
							            var uploads_1 = 'uploads/'
							            var uploads_2 = 'uploads\\'

							            // Validando reemplazo del inicio del path uploads
							            if (path_file.indexOf(uploads_1) != -1) {
							                el.path = el.path.replace('uploads/','/')
							                data.photo = el

							            } else if (path_file.indexOf(uploads_2) != -1) {
							                el.path = el.path.replace('uploads\\','/')
							                data.photo = el
							            
							            } else {
							                console.log('Ocurrió un error con el path')
							                console.log(path_file)
							            
							            }
										arrAudioLibros[i] = el
									}
								} else {
									var el = FilesAudioLibros

									console.log('Audio Subido-------')
									console.log(FilesAudioLibros)
									
									var path_file = el.path
						            console.log(path_file)

						            // path uploads iniciales
						            var uploads_1 = 'uploads/'
						            var uploads_2 = 'uploads\\'

						            // Validando reemplazo del inicio del path uploads
						            if (path_file.indexOf(uploads_1) != -1) {
						                el.path = el.path.replace('uploads/','/')
						                data.photo = el

						            } else if (path_file.indexOf(uploads_2) != -1) {
						                el.path = el.path.replace('uploads\\','/')
						                data.photo = el
						            
						            } else {
						                console.log('Ocurrió un error con el path')
						                console.log(path_file)
						            
						            }
									arrAudioLibros[0] = el
								}

								data.materiales.audioLibro = arrAudioLibros

							}

							// Textos
							if(req.files.hasOwnProperty('curso_textos')) {	
								console.log('Textos actualizados')
								var FilesTextos
								var arrTextos = []
							
								FilesTextos = req.files.curso_textos

								if(FilesTextos[1]) {
									for (var i = FilesTextos.length - 1; i >= 0; i--) {
										var el = FilesTextos[i]
										
										var path_file = el.path
							            console.log(path_file)

							            // path uploads iniciales
							            var uploads_1 = 'uploads/'
							            var uploads_2 = 'uploads\\'

							            // Validando reemplazo del inicio del path uploads
							            if (path_file.indexOf(uploads_1) != -1) {
							                el.path = el.path.replace('uploads/','/')
							                data.photo = el

							            } else if (path_file.indexOf(uploads_2) != -1) {
							                el.path = el.path.replace('uploads\\','/')
							                data.photo = el
							            
							            } else {
							                console.log('Ocurrió un error con el path')
							                console.log(path_file)
							            
							            }
										arrTextos[i] = el
									}
								} else {
									var el = FilesTextos
									
									var path_file = el.path
						            console.log(path_file)

						            // path uploads iniciales
						            var uploads_1 = 'uploads/'
						            var uploads_2 = 'uploads\\'

						            // Validando reemplazo del inicio del path uploads
						            if (path_file.indexOf(uploads_1) != -1) {
						                el.path = el.path.replace('uploads/','/')
						                data.photo = el

						            } else if (path_file.indexOf(uploads_2) != -1) {
						                el.path = el.path.replace('uploads\\','/')
						                data.photo = el
						            
						            } else {
						                console.log('Ocurrió un error con el path')
						                console.log(path_file)
						            
						            }
						            
									arrTextos[0] = el
								}

								data.materiales.texto = arrTextos

							}

						}

					} else {
						console.log('No se subio nungun archivo multimedia en el curso')
					}

					// Actualizando los nuevos datos 
					Cursos.update({'_id': id}, data, function (err) {
						if(err) {
							return res.send('Error al actualizar el curso : ' + err)
						}

						// Buscando al usuario
						Cursos.findById(id, function (err, curso) {
							if(err) {
								return res.send('Error al encontrar el curso: ' + err)
							}

							// Obteniendo los textos del curso
							var textos = curso.materiales.texto

							// Obteniendo los audios del curso
							var audios = curso.materiales.audioLibro

							var simulador = curso.materiales.simulador

							// Render datos en viados al cliente 
							res.render('./admin/dashboard/cursos/update', {
								user: req.user,
								curso: curso,
								textos: textos,
								audios: audios,
								simulador: simulador,
								msg: 'Se actualizo con Exito!!'
							})

							// res.status(200).json({
							// 	user: req.user,
							// 	curso: curso,
							// 	textos: textos,
							// 	audios: audios,
							// 	simulador: simulador,
							// 	msg: 'Se actualizo con Exito!!'
							// })

						})
					})

				})

			})
			
		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.reditect('/plataforma/admin/login')
	}

})

module.exports = app

