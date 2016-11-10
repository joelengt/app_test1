var express = require('express')
var request = require('client-request')
var app = express.Router()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var config = require('../../../config')
var permiso = config.typeUser

var pregunta_categoria = config.pregunta.categoria
var pregunta_tipo = config.pregunta.tipos
var pregunta_dificultad = config.pregunta.dificultad

var Cursos = require('../../../models/cursos')
var Usuarios = require('../../../models/usuarios')
var Preguntas = require('../../../models/preguntas')
var Resenias = require('../../../models/resenias')
var Progress_simulator = require('../../../models/progress_simulator')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

//redirección a la vista principal de los cursos
app.get('/', isLoggedIn, function (req, res) {
	if(req.user) {

		res.redirect('/plataforma')
		
	} else {
		res.redirect('/login')
	}	
})

// Endponit curso por id
app.get('/:curso_id', isLoggedIn, function (req, res) {
	if(req.user) {
			
		var curso_id = req.params.curso_id
		var user = req.user

		// Buscando curso por id
		Cursos.findById({'_id': curso_id}, function (err, curso) { 
			if(err) {
				return res.send('Error al encontrar el curso')
			}

			// Obteniendo Limite Max. de preguntas por dificultad
			Preguntas.find(function (err, preguntas) {
				if(err) {
					return console.log('Error al obtener preguntas: ' + err)
				}
				
				// Obteniendo filtro de SImulador para un curso por id
				var filter_categority = []
				var filter_topic_id = [] // Luego cambiar a busqueda por id del curso, por titulo puede editarse y cambiar la direccion de la data
				var filter_difficulty = []

				filter_categority = preguntas.filter(function (element) {
					return element.type_categority === pregunta_categoria.curso
				})

				filter_topic_id = filter_categority.filter(function (element) {
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
				filter_preguntas_dificultad.muestra = filter_topic_id.filter(function (element) {
					return element.difficulty === pregunta_dificultad.muestra
				})

				// Filtrando por dificultad: basico
				filter_preguntas_dificultad.basico = filter_topic_id.filter(function (element) {
					return element.difficulty === pregunta_dificultad.basico
				})

				// Filtrando por dificultad: intermedio
				filter_preguntas_dificultad.intermedio = filter_topic_id.filter(function (element) {
					return element.difficulty === pregunta_dificultad.intermedio
				})

				// Filter por dificultad: avanzado
				filter_preguntas_dificultad.avanzado = filter_topic_id.filter(function (element) {
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
						max_questions: max_cant_muestra,
						n_lecciones: curso.materiales.simulador.muestra.n_lecciones,
						n_questions: curso.materiales.simulador.muestra.n_questions
					},
					basico: {
						title: 'Básico',
						icon: 'default_course/icon_course_default.png',
						max_questions: max_cant_basico,
						n_lecciones: curso.materiales.simulador.basico.n_lecciones,
						n_questions: curso.materiales.simulador.basico.n_questions
					},
					intermedio: {
						title: 'Intermedio',
						icon: 'default_course/icon_course_default.png',
						max_questions: max_cant_intermedio,
						n_lecciones: curso.materiales.simulador.intermedio.n_lecciones,
						n_questions: curso.materiales.simulador.intermedio.n_questions
					},
					avanzado: {
						title: 'Avanzado',
						icon: 'default_course/icon_course_default.png',
						max_questions: max_cant_avanzado,
						n_lecciones: curso.materiales.simulador.avanzado.n_lecciones,
						n_questions: curso.materiales.simulador.avanzado.n_questions
					}
				}
				// Buscando reseñas del curso por id
				Resenias.find(function (err, resenias) {
					if(err) {
						return console.log('Resenias del curso: ' + resenias)
					}

					// Filtrando resenias por parametros del curso
					var resenia_model_filter = {
						type_categority: 'curso',
						topic_id: curso_id
					}

					var filter_resenias_categority = ''
					var filter_resenias_topic_id = ''

					// Filtrando resenias por tipo de categoria: curso o diplomado
					filter_resenias_categority = resenias.filter(function (element) {
						return element.type_categority === resenia_model_filter.type_categority
					})

					// Filtrando resenias por tipo de id del tema seleccionado
					filter_resenias_topic_id = filter_resenias_categority.filter(function (element) {
						return element.topic_id === resenia_model_filter.topic_id
					})

					// Filtro de resenias por rate de mayor a menor - y de por fechas de los ultimos x dias
					// Desarrollo pendiente

					// Resenias Promedio Rate
					var promedio_rate = 0
					var suma_rate = 0
					var cant_rate = Number(filter_resenias_topic_id.length)

					for(var i = 0; i <= cant_rate - 1; i++) {
						var element = filter_resenias_topic_id[i]
						suma_rate += Number(element.rate)
					}

					// Calculando Promedio rate de las resenias
					promedio_rate = Number(suma_rate/cant_rate)

					// Obteniendo el decimal a solo 2 numeros
					promedio_rate = promedio_rate.toFixed(2)

					promedio_rate = Number(promedio_rate)


					if(isNaN(promedio_rate) === true) {
						promedio_rate = 5
					}
					
					var data_rate = {
						promedioRate: promedio_rate
					}

					console.log('Promedio Rate')
					console.log(promedio_rate)

					// Guardando el arreglo para leerlo desde ultimo comentario
					filter_resenias_topic_id.reverse()

					// Ordenando Reseñas cronologicamene
					var Articles_dates = []

					// Ordenando por fecha
					for(var q = 0; q <= filter_resenias_topic_id.length - 1; q++) {
						var element = {
							data: filter_resenias_topic_id[q],
							date_number: 0
						}

						// convirtiendo dato a numbero comparable
						var new_data = new Date(element.data.createdAt).getTime()

						element.date_number = Number(new_data)
						filter_resenias_topic_id[q] = element

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
						for(var s = 0; s <= filter_resenias_topic_id.length - 1; s++) {
							var el_article = filter_resenias_topic_id[s]

							if(Articles_dates[c] === el_article.date_number) {
								console.log('Elemento date encontrado para este articulo')
								//filter_resenias_topic_id[c] = el_article.data
								Article_collections[c] = filter_resenias_topic_id[s].data
								
								break
							}
						
						}
					}

					// Filtrando fecha agredable
					console.log(Article_collections)
					
					var new_resenias_collection = []

					for(var d = 0; d <= Article_collections.length - 1; d++) {
						var element = Article_collections[d]
						console.log('Position: ' + d)
						console.log(element)

						var RTime = new Date(element.createdAt)
						var month = RTime.getMonth() + 1   // 0 - 11 *
						var day = RTime.getDate()          // 1- 31  *
						var year = RTime.getFullYear()     // año   *
						var hour = RTime.getHours()		   // 0 - 23  *
						var min  = RTime.getMinutes()      // 0 - 59
						var sec =  RTime.getSeconds()      // 0 - 59

						// Validando el mes 
						var month_string = ''
						if(month === 1) {
							month_string = 'enero'

						} else if (month === 2) {
							month_string = 'febrero'

						} else if (month === 3) {
							month_string = 'marzo'

						} else if (month === 4) {
							month_string = 'abril'

						} else if (month === 5) {
							month_string = 'mayo'

						} else if (month === 6) {
							month_string = 'junio'

						} else if (month === 7) {
							month_string = 'julio'

						} else if (month === 8) {
							month_string = 'agosto'

						} else if (month === 9) {
							month_string = 'septiembre'

						} else if (month === 10) {
							month_string = 'octubre'

						} else if (month === 11) {
							month_string = 'noviembre'

						} else if (month === 12) {
							month_string = 'diciembre'

						} else {
							month_string = String(month)
						}

						// Lectura de fecha por dia, y 24h
						var date_template = ''

						var today = new Date()

						var today_day = today.getDate()
						var today_month = today.getMonth() + 1
						var today_year = today.getFullYear() 
						var today_hour = today.getHours()
						var today_min = today.getMinutes()
						var today_sec = today.getSeconds()

						// Validando si es hoy y en menos de 24h
						if( Number(day) === Number(today_day) && 
						    Number(month) === Number(today_month)  &&
						    Number(year) === Number(today_year) ) {				   
							
							console.log(' es de hoy ')

							// Filtrando por hora
							if(hour < today_hour) {
								
								// mostrando horas
								hour = today_hour - hour
								date_template = ' hace ' + hour + 'h' 

							} else if ( hour === today_hour && min < today_min ) {
								
								// mostrar minutos
								min = today_min - min
								date_template = ' hace ' + min + 'min'


							} else if ( hour === today_hour && min === today_min ) {

								// mostrar segundos
								sec =  today_sec - sec
								date_template = ' hace ' + sec + 'sec'

							} else {
								// mostrando fechas por defecto
								date_template = ' hace ' + hour + 'h' + min + ':' + sec

							}

						} else {
							console.log('No es de hoy')
							date_template = day + ' de ' + month_string + ' a las ' + hour + ':' + min + ':' + sec

						} 

						var new_resenia = { 
						  _id: element._id,
						  type_categority: element.type_categority,
						  topic_id: element.topic_id,
						  topic_title: element.topic_title,
						  user_full_name: element.user_full_name,
						  user_avatar: element.user_avatar,
						  user_grado: element.user_grado,
						  rate: element.rate,
						  comment: element.comment,
						  createdAt: date_template 
						} 

						new_resenias_collection[d] = new_resenia

					}

					// Guardando Promedio Rate en el curso
					Cursos.update({'_id': curso_id}, data_rate, function (err, curso) {
						if(err) {
							return console.log('Error al actualiar el curso en la base de datos: ' + err)
						}
						console.log('El promedio rate del curso fue actualizado: ' + data_rate.promedioRate)
					
						// Buscando curso por id
						Cursos.findById({'_id': curso_id}, function (err, curso_updated) {
							if(err) {
								return console.log('Error al encontrar el curso por id:' + err)
							}

							/*// Render de vista para usuario
							res.render('./plataforma/cursos_diplomados/cursos/curso-item', {
								user: req.user,
								curso: curso_updated,
								simulador: simulador,
								resenias: {
									cantidad: cant_rate,
									contenido: new_resenias_collection,
									promedio_rate: promedio_rate
								}
							})*/

							// Respuesta en JSON
								res.status(200).json({
									user: req.user,
									curso: curso_updated,
									simulador: simulador,
									resenias: {
										cantidad: cant_rate,
										contenido: new_resenias_collection,
										promedio_rate: promedio_rate
								}
							})

						})
					})

				})

			})	
		})
		
	} else {
		res.redirect('/login')
	}

})

// Contenido/Material de cada curso

// Lista de Textos
app.get('/:id/textos', isLoggedIn, function (req, res) {
	if(req.user) {

		var id = req.params.id
		var user = req.user

		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return res.send('Error al encontrar los textos, Porfavor contactanos para ayudarte!! :' + err)
			}
			
			// Obteniendo los textos del curso
			var Textos_curso = curso.materiales.texto
			var textos = []

			for(var i= 0; i <= Textos_curso.length - 1; i++) {

				var texto = Textos_curso[i]

				var textos_curso = {
					position: i,
					originalname: texto.originalname
				}

				textos[i] = textos_curso
			}

			// Render para textos de cursos
			/*res.render('./plataforma/cursos_diplomados/cursos/textos', {
				user: user,
				curso: curso,
				textos: textos
			})*/

			// Respuesta en JSON
			res.status(200).json({
				user: user,
				curso: curso,
				textos: textos
			})
				
		})
			
	} else {

		res.redirect('/login')
	
	}
})

// Textos Item
app.get('/:curso_id/textos/:texto_item', isLoggedIn, function (req, res) {
	var user = req.user
	
	if(user) {

		var curso_id = req.params.curso_id
		var texto_item = Number(req.params.texto_item)

		Cursos.findById({'_id': curso_id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			/*
			if( req.user.access === permiso.acceso_libros ||
				req.user.access === permiso.acceso_audiolibros ||
				req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin ) {

				var textos = curso.materiales.texto
				var texto_select = textos[texto_item]

				//res.render('./plataforma/cursos_diplomados/cursos/textos/texto-item', {
				// 	user: req.user,
				// 	curso: curso,
				// 	texto: texto_select
				//})

				res.status(200).json({ 
					user: req.user,
				 	curso: curso,
				 	texto: texto_select
				})

			} else {

				// Render de vista para usuario
				//res.render('./plataforma/cursos_diplomados/cursos/payment/social_interaction', {
				//	user: req.user,
				//	curso: curso,
				//	servicio: 'textos',
				//	access: false
				//})
				
				// Render de vista JSON
				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'textos',
					access: false
				})

			}*/ 

			var textos = curso.materiales.texto
			var texto_select = textos[texto_item]

			// res.render('./plataforma/cursos_diplomados/cursos/textos/texto-item', {
			// 	user: req.user,
			// 	curso: curso,
			// 	texto: texto_select
			// })

			res.status(200).json({ 
				user: req.user,
				curso: curso,
				texto: texto_select
			})

		})

	} else {

		res.redirect('/login')
	
	}
})

// Lista de AudiosLibros
app.get('/:id/audio-libros', isLoggedIn, function (req, res) {

	if(req.user) {

		var id = req.params.id
		
		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return res.send('Error al encontrar Audios, Porfavor contactanos para ayudarte!! :' + err)
			}
			
			var AudiosLibros = curso.materiales.audioLibro
			var audios = []

			// Obteniendo los audios del curso
			var max_audios = AudiosLibros.length - 1
			for(var i = 0 ; i <= max_audios; i++) {
				
				var audio = AudiosLibros[max_audios - i]

				var audiolibro = {
					position: i,
					originalname: audio.originalname
				}

				audios[i] = audiolibro
				
			}

			// console.log(audios)

			// Render de vista para usuario
			/*res.render('./plataforma/cursos_diplomados/cursos/audio-libros', {
				user: req.user,
				curso: curso,
				audios: audios
			})*/

			res.status(200).json({
				user: req.user,
				curso: curso,
				audios: audios
			})
		
		})
		
	} else {

		res.redirect('/login')
	
	}

})

// AudioLibros por position and service path
app.get('/:curso_id/audio-libros/:audio_position', isLoggedIn, function (req, res) {
	if(req.user) {
		
		var curso_id = req.params.curso_id
		var audio_position = Number(req.params.audio_position)

		Cursos.findById({'_id': curso_id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			if(audio_position === 0) {

				// Sirviendo la ruta de los audioLibros
				var audios = curso.materiales.audioLibro
				var audio_select = audios[audio_position]

				// Render de vista para usuario
				/*res.render('./plataforma/cursos_diplomados/cursos/audio-libros/reproductor', {
					user: req.user,
					curso: curso,
					audio: audio_select
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					audio: audio_select
				})

			} else {

				if( req.user.access === permiso.acceso_audiolibros ||
					req.user.access === permiso.premium ||
					req.user.access === permiso.admin ) {


					// Sirviendo la ruta de los audioLibros
					var audios = curso.materiales.audioLibro
					var audio_select = audios[audio_position]

					// Render de vista para usuario
					/*res.render('./plataforma/cursos_diplomados/cursos/audio-libros/reproductor', {
						user: req.user,
						curso: curso,
						audio: audio_select
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						audio: audio_select
					})

				} else {

					// Render de vista para usuario
					/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
						user: req.user,
						curso: curso,
						servicio: 'audiolibros',
						access: false
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						servicio: 'audiolibros',
						access: false
					})

				}

			}

		})

	} else {

		res.redirect('/login')
	
	}

})

// Simulador: Niveles
app.get('/:id/simulador', isLoggedIn, function (req, res) {
	if(req.user) {

		var id = req.params.id

		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			/*res.render('./plataforma/cursos_diplomados/cursos/simulador', {
				user: req.user,
				curso: curso
			})*/

			res.status(200).json({
				user: req.user,
				curso: curso
			})

		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Generate: Muestra
app.get('/:id/simulador/muestra', isLoggedIn, function (req, res) {
	if(req.user) {

		var id = req.params.id

		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			var simulador_muestra = curso.materiales.simulador.muestra
			
			// Generar lecciones para cada nivel según los limites
			var limite_lecciones = Number(simulador_muestra.n_lecciones)
			var limite_preguntas = Number(simulador_muestra.n_questions)
			var limite_max_nivel = limite_lecciones * limite_preguntas

			var preguntas_limite_disponibles = []
			var lecciones_nivel = []
			
			// Obteniendo Limite Max. de preguntas por dificultad
			Preguntas.find(function (err, preguntas) {
				if(err) {
					return console.log('Error al obtener preguntas: ' + err)
				}

				// Obteniendo filtro de Simulador para un curso por id
				var filter_categority = []
				var filter_topic_id = []

				filter_categority = preguntas.filter(function (element) {
					return element.type_categority === pregunta_categoria.curso
				})

				filter_topic_id = filter_categority.filter(function (element) {
					return element.topic_id === String(curso._id)
				})

				// Obteniendo filtros de Simulador por dificultad
				var filter_preguntas_dificultad = { muestra: [] }

				// Filtrando por dificutad: muestra
				filter_preguntas_dificultad.muestra = filter_topic_id.filter(function (element) {
					return element.difficulty === pregunta_dificultad.muestra
				})

				// Maximo de preguntas en la base de datos
				var max_preguntas_nivel = filter_preguntas_dificultad.muestra
				
				// Filtrando para 
				var filter_preguntas_alternativas = max_preguntas_nivel.filter(function (element) {
					return element.type_question === 'escribir'
				})

				//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
				for(var i = 0; i <= limite_max_nivel - 1; i++) {
					preguntas_limite_disponibles[i]	= filter_preguntas_alternativas[i]				
				}
				console.log('FIltro de preguntas de escribir disponibles: ' + preguntas_limite_disponibles.length)
				
				// Arreglo de lecciones por Nivel
				var k = 0

				for(var i = 0; i <= limite_lecciones - 1; i++) {

					var preguntas_nivel = []
					var description = ''
					var arr_description = []

					var limite_find = parseInt(preguntas_limite_disponibles.length/limite_lecciones) 

					if(limite_find >= 5) {
						limite_find = 5
					}

					// Obteniendo Description, de las preguntas por lecciones	
					for(var j = 1; j <= limite_find; j++) {
						var el = preguntas_limite_disponibles[k]

						if(el !== undefined) {
							description += el.answer.string + ', '
						}

						k++
					}

					arr_description = description.split(',')
					arr_description.pop()
					

					description = arr_description.toString()

					// Guardando Lecciones del curso
					preguntas_nivel[0] = {title: i + 1, description: description}

					lecciones_nivel[i] = preguntas_nivel
					
				}

				// Render de datos en la url
				/*res.render('./plataforma/cursos_diplomados/cursos/simulador/muestra', {
					user: req.user,
					curso: curso,
					nivel: lecciones_nivel
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					nivel: lecciones_nivel
				})

			})
		
		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Nivel: Muestra - Lecciones
app.get('/:curso_id/simulador/muestra/:leccion', isLoggedIn, function (req, res) {
	if(req.user) {

		// Obteniendo leccion_position de url y acondicionandolo al arreglo guardado
		var curso_id = req.params.curso_id
		var leccion_position = req.params.leccion - 1
		
		Cursos.findById({'_id': curso_id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			var simulador_muestra = curso.materiales.simulador.muestra
			
			// Generar lecciones para cada nivel según los limites
			var limite_lecciones = Number(simulador_muestra.n_lecciones)
			var limite_preguntas = Number(simulador_muestra.n_questions)
			var limite_max_nivel = limite_lecciones * limite_preguntas

			var preguntas_limite_disponibles = []
			var lecciones_nivel = []
			
			// Obteniendo Limite Max. de preguntas por dificultad
			Preguntas.find(function (err, preguntas) {
				if(err) {
					return console.log('Error al obtener preguntas: ' + err)
				}

				// Obteniendo filtro de Simulador para un curso por id
				var filter_categority = []
				var filter_topic_id = []

				filter_categority = preguntas.filter(function (element) {
					return element.type_categority === pregunta_categoria.curso
				})

				filter_topic_id = filter_categority.filter(function (element) {
					return element.topic_id === String(curso._id)
				})

				// Obteniendo filtros de Simulador por dificultad
				var filter_preguntas_dificultad = { muestra: [] }

				// Filtrando por dificutad: muestra
				filter_preguntas_dificultad.muestra = filter_topic_id.filter(function (element) {
					return element.difficulty === pregunta_dificultad.muestra
				})

				// Maximo de preguntas en la base de datos
				var max_preguntas_nivel = filter_preguntas_dificultad.muestra

				//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
				for(var i = 0; i <= limite_max_nivel - 1; i++) {
					preguntas_limite_disponibles[i]	= max_preguntas_nivel[i]				
				}
							
				var k = 0

				// Arreglo de lecciones por Nivel
				for(var i = 0; i <= limite_lecciones - 1; i++) {
					var preguntas_nivel = []
					
					preguntas_nivel[0] = {title: i + 1, description: 'Description'}

					// Metiendo lecciones y preguntas dentro del arreglo
					for(var j = 1; j <= limite_preguntas; j++) {
						var el = preguntas_limite_disponibles[k]
						preguntas_nivel[j] = el
						k++
					}

					// Reordeando posicion Random de las preguntas por lección
					var pregunas_nivel_random = []
					pregunas_nivel_random[0] = {title: i + 1, description: 'Description'}


					for (var l = 1; l <= preguntas_nivel.length - 1; l++) {
						
						// Llenando preguntas a lección con nuevo orden
						var max = preguntas_nivel.length - 1
						var min = 1

						var random = Math.round(Math.random() * (max - min) + min)
						
						// Buscando si la pregunta en la posición random, se encuentra repetida
						for (var m =  1; m <= pregunas_nivel_random.length - 1; m++) {
							
							// Validando igualdad entre arreglos
							while(preguntas_nivel[random] === pregunas_nivel_random[m]) {

								// Buscar otra posición random
								random = Math.round(Math.random() * (max - min) + min)
								// Resetiar el ciclo
								m = 1
							}

						}

						// Metodo random para las alternativas de cada pregunta

						// Añadiendo la respuesta al campo de alternativas 
						var pregunta_seleccionada = preguntas_nivel[random]
						var respuesta = {answer: pregunta_seleccionada.answer.string}
						
						var alternativas = []
						alternativas = pregunta_seleccionada.other_answers
						alternativas.push(respuesta)
						
						// Proceso random para las alternativas
						
						// Buscando si la pregunta en la posición random, se encuentra repetida
						var new_alternativas = []

						var max_alternativas = alternativas.length - 1
						var min_alternativas = 0
						
						// Proceso de reordenamiento de Alternativas
						for(var r = 0; r <= alternativas.length - 1; r++) {

							var random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
							
							for (var q =  0; q <= new_alternativas.length - 1; q++) {
								
								// Validando igualdad entre arreglos
								while(alternativas[random_al] === new_alternativas[q]) {

									// Buscar otra posición random
									random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
									
									// Resetiar el ciclo
									q = 0

								}
							
							}

							new_alternativas[r] = alternativas[random_al]
							
						}

						// Asignanado todas las alternativas dentro del campo de preguntas
						pregunta_seleccionada.other_answers = new_alternativas

						// Guardando las preguntas NO repetidas
						pregunas_nivel_random[l] = pregunta_seleccionada

					}

					lecciones_nivel[i] = pregunas_nivel_random	
				
				}

				var leccion_select = lecciones_nivel[leccion_position]

				// Render de datos en la url
				/*res.render('./plataforma/cursos_diplomados/cursos/simulador/muestra/lecciones', {
					user: req.user,
					curso: curso,
					leccion: leccion_select
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					leccion: leccion_select
				})

			})
		
		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Generate: Básico
app.get('/:id/simulador/basico', isLoggedIn, function (req, res) {
	if(req.user) {

		var id = req.params.id
		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			// Validando permiso del usuario
			if( req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin) {

				console.log('Ud. es un usuario con permiso: ' + req.user.access)

				var simulador_basico = curso.materiales.simulador.basico
				
				// Generar lecciones para cada nivel según los limites
				var limite_lecciones = Number(simulador_basico.n_lecciones)
				var limite_preguntas = Number(simulador_basico.n_questions)
				var limite_max_nivel = limite_lecciones * limite_preguntas

				var preguntas_limite_disponibles = []
				var lecciones_nivel = []
				
				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}

					// Obteniendo filtro de Simulador para un curso por id
					var filter_categority = []
					var filter_topic_id = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_topic_id = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = { basico: [] }

					// Filtrando por dificutad: basico
					filter_preguntas_dificultad.basico = filter_topic_id.filter(function (element) {
						return element.difficulty === pregunta_dificultad.basico
					})

					// Maximo de preguntas en la base de datos
					var max_preguntas_nivel = filter_preguntas_dificultad.basico

					// Filtrando para 
					var filter_preguntas_alternativas = max_preguntas_nivel.filter(function (element) {
						return element.type_question === 'escribir'
					})

					//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
					for(var i = 0; i <= limite_max_nivel - 1; i++) {
						preguntas_limite_disponibles[i]	= filter_preguntas_alternativas[i]				
					}
					
					// Arreglo de lecciones por Nivel
					var k = 0

					for(var i = 0; i <= limite_lecciones - 1; i++) {

						var preguntas_nivel = []
						var description = ''
						var arr_description = []

						var limite_find = parseInt(preguntas_limite_disponibles.length/limite_lecciones) 

						if(limite_find >= 5) {
							limite_find = 5
						}
						
						// Obteniendo Description, de las preguntas por lecciones	
						for(var j = 1; j <= limite_find; j++) {
							var el = preguntas_limite_disponibles[k]

							if(el !== undefined) {
								description += el.answer.string + ', '
							}

							k++
						}

						arr_description = description.split(',')
						arr_description.pop()
						

						description = arr_description.toString()

						// Guardando Lecciones del curso
						preguntas_nivel[0] = {title: i + 1, description: description}

						lecciones_nivel[i] = preguntas_nivel
						
					}

					// Render de datos en la url
					/*res.render('./plataforma/cursos_diplomados/cursos/simulador/basico', {
						user: req.user,
						curso: curso,
						nivel: lecciones_nivel
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						nivel: lecciones_nivel
					})

				})
				

			} else {
				// Render: Visto proceso para pagar
				/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})
			}
		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Nivel: Básico - Lecciones
app.get('/:curso_id/simulador/basico/:leccion', isLoggedIn, function (req, res) {
	if(req.user) {

		// Obteniendo leccion_position de url y acondicionandolo al arreglo guardado
		var curso_id = req.params.curso_id
		var leccion_position = req.params.leccion - 1
		
		Cursos.findById({'_id': curso_id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}
			// Validando permiso del usuario
			if( req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin) {


				var simulador_basico = curso.materiales.simulador.basico
				
				// Generar lecciones para cada nivel según los limites
				var limite_lecciones = Number(simulador_basico.n_lecciones)
				var limite_preguntas = Number(simulador_basico.n_questions)
				var limite_max_nivel = limite_lecciones * limite_preguntas

				var preguntas_limite_disponibles = []
				var lecciones_nivel = []
				
				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}

					// Obteniendo filtro de Simulador para un curso por id
					var filter_categority = []
					var filter_topic_id = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_topic_id = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = { basico: [] }

					// Filtrando por dificutad: basico
					filter_preguntas_dificultad.basico = filter_topic_id.filter(function (element) {
						return element.difficulty === pregunta_dificultad.basico
					})

					// Maximo de preguntas en la base de datos
					var max_preguntas_nivel = filter_preguntas_dificultad.basico

					//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
					for(var i = 0; i <= limite_max_nivel - 1; i++) {
						preguntas_limite_disponibles[i]	= max_preguntas_nivel[i]				
					}
								
					var k = 0

					// Arreglo de lecciones por Nivel
					for(var i = 0; i <= limite_lecciones - 1; i++) {
						var preguntas_nivel = []
						
						preguntas_nivel[0] = {title: i + 1, description: 'Description'}

						// Metiendo lecciones y preguntas dentro del arreglo
						for(var j = 1; j <= limite_preguntas; j++) {
							var el = preguntas_limite_disponibles[k]
							preguntas_nivel[j] = el
							k++
						}

						// Reordeando posicion Random de las preguntas por lección
						var pregunas_nivel_random = []
						pregunas_nivel_random[0] = {title: i + 1, description: 'Description'}

						for (var l = 1; l <= preguntas_nivel.length - 1; l++) {
							
							// Llenando preguntas a lección con nuevo orden
							var max = preguntas_nivel.length - 1
							var min = 1

							var random = Math.round(Math.random() * (max - min) + min)
							
							// Buscando si la pregunta en la posición random, se encuentra repetida
							for (var m =  1; m <= pregunas_nivel_random.length - 1; m++) {
								
								// Validando igualdad entre arreglos
								while(preguntas_nivel[random] === pregunas_nivel_random[m]) {

									// Buscar otra posición random
									random = Math.round(Math.random() * (max - min) + min)
									// Resetiar el ciclo
									m = 1
								}

							}

							// Metodo random para las alternativas de cada pregunta

							// Añadiendo la respuesta al campo de alternativas 
							var pregunta_seleccionada = preguntas_nivel[random]
							var respuesta = {answer: pregunta_seleccionada.answer.string}
							
							var alternativas = []
							alternativas = pregunta_seleccionada.other_answers
							alternativas.push(respuesta)
							
							// Proceso random para las alternativas
							
							// Buscando si la pregunta en la posición random, se encuentra repetida
							var new_alternativas = []

							var max_alternativas = alternativas.length - 1
							var min_alternativas = 0
							
							// Proceso de reordenamiento de Alternativas
							for(var r = 0; r <= alternativas.length - 1; r++) {

								var random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
								
								for (var q =  0; q <= new_alternativas.length - 1; q++) {
									
									// Validando igualdad entre arreglos
									while(alternativas[random_al] === new_alternativas[q]) {

										// Buscar otra posición random
										random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
										
										// Resetiar el ciclo
										q = 0

									}
								
								}

								new_alternativas[r] = alternativas[random_al]
								
							}

							// Asignanado todas las alternativas dentro del campo de preguntas
							pregunta_seleccionada.other_answers = new_alternativas

							// Guardando las preguntas NO repetidas
							pregunas_nivel_random[l] = pregunta_seleccionada

						}

						lecciones_nivel[i] = pregunas_nivel_random	
					
					}

					var leccion_select = lecciones_nivel[leccion_position]

					// Render de datos en la url
					/*res.render('./plataforma/cursos_diplomados/cursos/simulador/basico/lecciones', {
						user: req.user,
						curso: curso,
						leccion: leccion_select
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						leccion: leccion_select
					})

				})
			
			} else {
				// Render: Visto proceso para pagar
				/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})
			}
		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Generate: Intermedio
app.get('/:id/simulador/intermedio', isLoggedIn, function (req, res) {
	if(req.user) {

		var id = req.params.id

		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			// Validando permiso del usuario
			if( req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin) {

				var simulador_intermedio = curso.materiales.simulador.intermedio
				
				// Generar lecciones para cada nivel según los limites
				var limite_lecciones = Number(simulador_intermedio.n_lecciones)
				var limite_preguntas = Number(simulador_intermedio.n_questions)
				var limite_max_nivel = limite_lecciones * limite_preguntas

				var preguntas_limite_disponibles = []
				var lecciones_nivel = []
				
				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}

					// Obteniendo filtro de Simulador para un curso por id
					var filter_categority = []
					var filter_topic_id = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_topic_id = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = { intermedio: [] }

					// Filtrando por dificutad: intermedio
					filter_preguntas_dificultad.intermedio = filter_topic_id.filter(function (element) {
						return element.difficulty === pregunta_dificultad.intermedio
					})

					// Maximo de preguntas en la base de datos
					var max_preguntas_nivel = filter_preguntas_dificultad.intermedio

					// Filtrando para 
					var filter_preguntas_alternativas = max_preguntas_nivel.filter(function (element) {
						return element.type_question === 'escribir'
					})

					//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
					for(var i = 0; i <= limite_max_nivel - 1; i++) {
						preguntas_limite_disponibles[i]	= filter_preguntas_alternativas[i]				
					}
					
					// Arreglo de lecciones por Nivel
					var k = 0

					for(var i = 0; i <= limite_lecciones - 1; i++) {

						var preguntas_nivel = []
						var description = ''
						var arr_description = []

						var limite_find = parseInt(preguntas_limite_disponibles.length/limite_lecciones) 

						if(limite_find >= 5) {
							limite_find = 5
						}

						// Obteniendo Description, de las preguntas por lecciones	
						for(var j = 1; j <= limite_find; j++) {
							var el = preguntas_limite_disponibles[k]

							if(el !== undefined) {
								description += el.answer.string + ', '
							}

							k++
						}

						arr_description = description.split(',')
						arr_description.pop()
						

						description = arr_description.toString()

						// Guardando Lecciones del curso
						preguntas_nivel[0] = {title: i + 1, description: description}

						lecciones_nivel[i] = preguntas_nivel
						
					}

					// Render de datos en la url
					/*res.render('./plataforma/cursos_diplomados/cursos/simulador/intermedio', {
						user: req.user,
						curso: curso,
						nivel: lecciones_nivel
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						nivel: lecciones_nivel
					})

				})

			} else {
				// Render: Visto proceso para pagar
				/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})
			}

		})
	} else {
		res.redirect('/login')
	}

})

// Simulador - Nivel: Básico - Lecciones
app.get('/:curso_id/simulador/intermedio/:leccion', isLoggedIn, function (req, res) {
	if(req.user) {

		// Obteniendo leccion_position de url y acondicionandolo al arreglo guardado
		var curso_id = req.params.curso_id
		var leccion_position = req.params.leccion - 1
		
		Cursos.findById({'_id': curso_id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			// Validando permiso del usuario
			if( req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin) {

				var simulador_intermedio = curso.materiales.simulador.intermedio
				
				// Generar lecciones para cada nivel según los limites
				var limite_lecciones = Number(simulador_intermedio.n_lecciones)
				var limite_preguntas = Number(simulador_intermedio.n_questions)
				var limite_max_nivel = limite_lecciones * limite_preguntas

				var preguntas_limite_disponibles = []
				var lecciones_nivel = []
				
				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}

					// Obteniendo filtro de Simulador para un curso por id
					var filter_categority = []
					var filter_topic_id = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_topic_id = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = { intermedio: [] }

					// Filtrando por dificutad: intermedio
					filter_preguntas_dificultad.intermedio = filter_topic_id.filter(function (element) {
						return element.difficulty === pregunta_dificultad.intermedio
					})

					// Maximo de preguntas en la base de datos
					var max_preguntas_nivel = filter_preguntas_dificultad.intermedio

					//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
					for(var i = 0; i <= limite_max_nivel - 1; i++) {
						preguntas_limite_disponibles[i]	= max_preguntas_nivel[i]				
					}
								
					var k = 0

					// Arreglo de lecciones por Nivel
					for(var i = 0; i <= limite_lecciones - 1; i++) {
						var preguntas_nivel = []
						
						preguntas_nivel[0] = {title: i + 1, description: 'Description'}

						// Metiendo lecciones y preguntas dentro del arreglo
						for(var j = 1; j <= limite_preguntas; j++) {
							var el = preguntas_limite_disponibles[k]
							preguntas_nivel[j] = el
							k++
						}

						// Reordeando posicion Random de las preguntas por lección
						var pregunas_nivel_random = []
						pregunas_nivel_random[0] = {title: i + 1, description: 'Description'}

						for (var l = 1; l <= preguntas_nivel.length - 1; l++) {
							
							// Llenando preguntas a lección con nuevo orden
							var max = preguntas_nivel.length - 1
							var min = 1

							var random = Math.round(Math.random() * (max - min) + min)
							
							// Buscando si la pregunta en la posición random, se encuentra repetida
							for (var m =  1; m <= pregunas_nivel_random.length - 1; m++) {
								
								// Validando igualdad entre arreglos
								while(preguntas_nivel[random] === pregunas_nivel_random[m]) {

									// Buscar otra posición random
									random = Math.round(Math.random() * (max - min) + min)
									// Resetiar el ciclo
									m = 1
								}

							}

							// Metodo random para las alternativas de cada pregunta

							// Añadiendo la respuesta al campo de alternativas 
							var pregunta_seleccionada = preguntas_nivel[random]
							var respuesta = {answer: pregunta_seleccionada.answer.string}
							
							var alternativas = []
							alternativas = pregunta_seleccionada.other_answers
							alternativas.push(respuesta)
							
							// Proceso random para las alternativas
							
							// Buscando si la pregunta en la posición random, se encuentra repetida
							var new_alternativas = []

							var max_alternativas = alternativas.length - 1
							var min_alternativas = 0
							
							// Proceso de reordenamiento de Alternativas
							for(var r = 0; r <= alternativas.length - 1; r++) {

								var random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
								
								for (var q =  0; q <= new_alternativas.length - 1; q++) {
									
									// Validando igualdad entre arreglos
									while(alternativas[random_al] === new_alternativas[q]) {

										// Buscar otra posición random
										random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
										
										// Resetiar el ciclo
										q = 0

									}
								
								}

								new_alternativas[r] = alternativas[random_al]
								
							}

							// Asignanado todas las alternativas dentro del campo de preguntas
							pregunta_seleccionada.other_answers = new_alternativas

							// Guardando las preguntas NO repetidas
							pregunas_nivel_random[l] = pregunta_seleccionada

						}

						lecciones_nivel[i] = pregunas_nivel_random	
					
					}

					var leccion_select = lecciones_nivel[leccion_position]

					// Render de datos en la url
					/*res.render('./plataforma/cursos_diplomados/cursos/simulador/intermedio/lecciones', {
						user: req.user,
						curso: curso,
						leccion: leccion_select
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						leccion: leccion_select
					})

				})
			
			} else {
				// Render: Visto proceso para pagar
				/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})
			}

		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Generate: Avanzado
app.get('/:id/simulador/avanzado', isLoggedIn, function (req, res) {
	if(req.user) {
		
		var id = req.params.id

		Cursos.findById({'_id': id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			// Validando permiso del usuario
			if( req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin) {

				var simulador_avanzado = curso.materiales.simulador.avanzado
				
				// Generar lecciones para cada nivel según los limites
				var limite_lecciones = Number(simulador_avanzado.n_lecciones)
				var limite_preguntas = Number(simulador_avanzado.n_questions)
				var limite_max_nivel = limite_lecciones * limite_preguntas

				var preguntas_limite_disponibles = []
				var lecciones_nivel = []
				
				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}

					// Obteniendo filtro de Simulador para un curso por id
					var filter_categority = []
					var filter_topic_id = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_topic_id = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = { avanzado: [] }

					// Filtrando por dificutad: avanzado
					filter_preguntas_dificultad.avanzado = filter_topic_id.filter(function (element) {
						return element.difficulty === pregunta_dificultad.avanzado
					})

					// Maximo de preguntas en la base de datos
					var max_preguntas_nivel = filter_preguntas_dificultad.avanzado

					// Filtrando para 
					var filter_preguntas_alternativas = max_preguntas_nivel.filter(function (element) {
						return element.type_question === 'escribir'
					})

					//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
					for(var i = 0; i <= limite_max_nivel - 1; i++) {
						preguntas_limite_disponibles[i]	= filter_preguntas_alternativas[i]				
					}
					
					// Arreglo de lecciones por Nivel
					var k = 0

					for(var i = 0; i <= limite_lecciones - 1; i++) {

						var preguntas_nivel = []
						var description = ''
						var arr_description = []

						var limite_find = parseInt(preguntas_limite_disponibles.length/limite_lecciones) 

						if(limite_find >= 5) {
							limite_find = 5
						}

						// Obteniendo Description, de las preguntas por lecciones	
						for(var j = 1; j <= limite_find; j++) {
							var el = preguntas_limite_disponibles[k]

							if(el !== undefined) {
								description += el.answer.string + ', '
							}

							k++
						}

						arr_description = description.split(',')
						arr_description.pop()
						

						description = arr_description.toString()

						// Guardando Lecciones del curso
						preguntas_nivel[0] = {title: i + 1, description: description}

						lecciones_nivel[i] = preguntas_nivel
						
					}

					// Render de datos en la url
					/*res.render('./plataforma/cursos_diplomados/cursos/simulador/avanzado', {
						user: req.user,
						curso: curso,
						nivel: lecciones_nivel
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						nivel: lecciones_nivel
					})

				})

			} else {
				// Render: Visto proceso para pagar
				/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})
			}

		})

	} else {
		res.redirect('/login')
	}

})

// Simulador - Nivel: Avanzado - Lecciones
app.get('/:curso_id/simulador/avanzado/:leccion', isLoggedIn, function (req, res) {
	if(req.user) {
		
		// Obteniendo leccion_position de url y acondicionandolo al arreglo guardado
		var curso_id = req.params.curso_id
		var leccion_position = req.params.leccion - 1
		
		Cursos.findById({'_id': curso_id}, function (err, curso) {
			if(err) {
				return console.log('Error al encontrar el curso')
			}

			// Validando permiso del usuario
			if( req.user.access === permiso.acceso_simulador ||
				req.user.access === permiso.premium ||
				req.user.access === permiso.admin) {

				var simulador_avanzado = curso.materiales.simulador.avanzado
				
				// Generar lecciones para cada nivel según los limites
				var limite_lecciones = Number(simulador_avanzado.n_lecciones)
				var limite_preguntas = Number(simulador_avanzado.n_questions)
				var limite_max_nivel = limite_lecciones * limite_preguntas

				var preguntas_limite_disponibles = []
				var lecciones_nivel = []
				
				// Obteniendo Limite Max. de preguntas por dificultad
				Preguntas.find(function (err, preguntas) {
					if(err) {
						return console.log('Error al obtener preguntas: ' + err)
					}

					// Obteniendo filtro de Simulador para un curso por id
					var filter_categority = []
					var filter_topic_id = []

					filter_categority = preguntas.filter(function (element) {
						return element.type_categority === pregunta_categoria.curso
					})

					filter_topic_id = filter_categority.filter(function (element) {
						return element.topic_id === String(curso._id)
					})

					// Obteniendo filtros de Simulador por dificultad
					var filter_preguntas_dificultad = { avanzado: [] }

					// Filtrando por dificutad: avanzado
					filter_preguntas_dificultad.avanzado = filter_topic_id.filter(function (element) {
						return element.difficulty === pregunta_dificultad.avanzado
					})

					// Maximo de preguntas en la base de datos
					var max_preguntas_nivel = filter_preguntas_dificultad.avanzado

					//	Nuevo arreglo de pregunas disponibles segun el limite indicado de nivel
					for(var i = 0; i <= limite_max_nivel - 1; i++) {
						preguntas_limite_disponibles[i]	= max_preguntas_nivel[i]				
					}
								
					var k = 0

					// Arreglo de lecciones por Nivel
					for(var i = 0; i <= limite_lecciones - 1; i++) {
						var preguntas_nivel = []
						
						preguntas_nivel[0] = {title: i + 1, description: 'Description'}

						// Metiendo lecciones y preguntas dentro del arreglo
						for(var j = 1; j <= limite_preguntas; j++) {
							var el = preguntas_limite_disponibles[k]
							preguntas_nivel[j] = el
							k++
						}

						// Reordeando posicion Random de las preguntas por lección
						var pregunas_nivel_random = []
						pregunas_nivel_random[0] = {title: i + 1, description: 'Description'}

						for (var l = 1; l <= preguntas_nivel.length - 1; l++) {
							
							// Llenando preguntas a lección con nuevo orden
							var max = preguntas_nivel.length - 1
							var min = 1

							var random = Math.round(Math.random() * (max - min) + min)
							
							// Buscando si la pregunta en la posición random, se encuentra repetida
							for (var m =  1; m <= pregunas_nivel_random.length - 1; m++) {
								
								// Validando igualdad entre arreglos
								while(preguntas_nivel[random] === pregunas_nivel_random[m]) {

									// Buscar otra posición random
									random = Math.round(Math.random() * (max - min) + min)
									// Resetiar el ciclo
									m = 1
								}

							}

							// Metodo random para las alternativas de cada pregunta

							// Añadiendo la respuesta al campo de alternativas 
							var pregunta_seleccionada = preguntas_nivel[random]
							var respuesta = {answer: pregunta_seleccionada.answer.string}
							
							var alternativas = []
							alternativas = pregunta_seleccionada.other_answers
							alternativas.push(respuesta)
							
							// Proceso random para las alternativas
							
							// Buscando si la pregunta en la posición random, se encuentra repetida
							var new_alternativas = []

							var max_alternativas = alternativas.length - 1
							var min_alternativas = 0
							
							// Proceso de reordenamiento de Alternativas
							for(var r = 0; r <= alternativas.length - 1; r++) {

								var random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
								
								for (var q =  0; q <= new_alternativas.length - 1; q++) {
									
									// Validando igualdad entre arreglos
									while(alternativas[random_al] === new_alternativas[q]) {

										// Buscar otra posición random
										random_al = Math.round(Math.random() * (max_alternativas - min_alternativas) + min_alternativas)
										
										// Resetiar el ciclo
										q = 0

									}
								
								}

								new_alternativas[r] = alternativas[random_al]
								
							}

							// Asignanado todas las alternativas dentro del campo de preguntas
							pregunta_seleccionada.other_answers = new_alternativas

							// Guardando las preguntas NO repetidas
							pregunas_nivel_random[l] = pregunta_seleccionada
							
						}

						lecciones_nivel[i] = pregunas_nivel_random	
					
					}

					var leccion_select = lecciones_nivel[leccion_position]

					// Render de datos en la url
					/*res.render('./plataforma/cursos_diplomados/cursos/simulador/avanzado/lecciones', {
						user: req.user,
						curso: curso,
						leccion: leccion_select
					})*/

					res.status(200).json({
						user: req.user,
						curso: curso,
						leccion: leccion_select
					})

				})
			
			} else {
				// Render: Visto proceso para pagar
				/*res.render('./plataforma/cursos_diplomados/cursos/payment', {
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})*/

				res.status(200).json({
					user: req.user,
					curso: curso,
					servicio: 'simuladores',
					access: false
				})
			}

		})

	} else {
		res.redirect('/login')
	}

})


// API: Actualizando data del usuario acorde a su progreso
app.put('/progress/lecciones', isLoggedIn, function (req, res) {
	if(req.user) {
		if(req.user.access === permiso.acceso_simulador ||
		   req.user.access === permiso.premium ||
		   req.user.access === permiso.admin) {

			var user_id = req.user._id
			user_id = JSON.stringify(user_id)
			user_id = JSON.parse(user_id)

			console.log(user_id)

			// Obteniendo
			var new_progress = {
				type_categority: req.body.type_categority || '',
				curso_id: 		 req.body.curso_id || '',
				curso_name:      '',
				nivel: 			 req.body.nivel || '',
				leccion:  		 req.body.leccion || '',
				resultados: 	 req.body.resultados || '',
			}

			console.log(new_progress)

			// Busqueda detos del curso por id
			Cursos.findById({'_id': new_progress.curso_id}, function (err, curso) {
				if(err) {
					return console.log('Error al encontrar el curso en la base de datos: ' + err)
				}

				// Actualizar datos en el perfil del usuario sobre su progreso con las lecciones
				
				// Bucando al usuario por id en la base de datos
				Usuarios.findById({'_id': user_id}, function (err, user) {
					if(err) {
						return console.log('Error al encontrar usuario en la base de datos: ' + err)
					}

					console.log('Usuario a actualizar')
					console.log(user)

					var encontrado
					encontrado = false

					var position 
					position = 0 

					// Recorriendo las lecciones completadas y buscando coincidencia
					for(var g = 0; g <= user.notas_lecciones.cursos.length - 1; g++) {
						var leccion_element = user.notas_lecciones.cursos[g]
						
						// Filtrando coincidencia
						if( String(new_progress.curso_id) === String(leccion_element.curso_id) &&
						    String(new_progress.nivel) ===  String(leccion_element.nivel) &&
						    Number(new_progress.leccion) === Number(leccion_element.leccion) ) {
							  console.log('La leccion fue ENCONTRADA!!')
							  encontrado = true
							  position = g
							  console.log('position: ' + g)
							
							  break
						}
					}
					
					new_progress.curso_name = curso.title

					// Filtrando si la leccion ya fue completada
					if(encontrado === true){
						console.log('Ya tienes esta leccion, reemplazando')
						// si existe, reemplazarla con la nueva data
						user.notas_lecciones.cursos[position] = new_progress

					} else if(encontrado === false){
						// Sino No exite aun, meterla al final
						console.log('Leccion nueva, agregando')
						
						user.notas_lecciones.cursos.push(new_progress)

					} else {
						console.log('Ocurrio un error con la busqueda. Progreso no guardado')
					}

					user.save(function (err) {
						if(err) {
							return console.log('Error al guardar progreso del usuario en su perfil')
						}
						console.log('Exito al guardar progreso en la base de datos y perfil del usuario')
						console.log(user)
				     
						// Publicando progreso en su muro

						//Connetion de todos los sockets
						if(new_progress.resultados !== '') {

							// Guardando publicacion en la base de datos
							var new_published = new Progress_simulator({
								form_publish_type: 'progress',
								user_id:   		   user_id,
								user_name: 		   user.name,
								user_nick: 		   user.nickname,
								user_grado: 	   user.grado,
								user_photo: 	   user.photo.path,
								publish_detalles:  new_progress,
								number_likes: 	   0,
								number_comments:   0,
								status_color:      'gray'
							})
							
							new_published.save(function (err) {
								if(err) {
									return console.log('Error al guardar publicacion de progreso de usuario: ' + err)
								}
								console.log('Publicacion de progreso se ha guardado en la base de datos')
							
							})
						
							// Enviando data de confirmacion de guardado
							/*res.status(200).json({
								status: 'ok',
								message: 'Leccion guardada, en perfil de usuario',
								progress_leccion: new_progress
							})*/

							res.status(200).json({
								status: 'ok',
								message: 'Leccion guardada, en perfil de usuario',
								progress_leccion: new_progress
							})

						} else {
							// Enviando data de confirmacion de guardado
							/*res.status(404).json({
								status: 'Error de envio',
								message: 'Leccion No guardada, en perfil de usuario: Faltan campos de resultados final de esta leccion',
								progress_leccion: new_progress
							})*/

							res.status(200).json({
								status: 'Error de envio',
								message: 'Leccion No guardada, en perfil de usuario: Faltan campos de resultados final de esta leccion',
								progress_leccion: new_progress
							})
						}


					})

				})

			})

			// Publicar automaticamente en el muro del usuario luego de guardar su progreso
		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/login')
	}
})

module.exports = app

