var express = require('express')
var app = express.Router()

var Cursos = require('../../../models/cursos')
var Comunidad_publish = require('../../../models/comunidad_publish')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

// Validación de evento like
function GoStatusLike(nivel_bloque, req, callback) {
	// Almacenando a los usuarios liked en un array
	var arr_user_liked = []
	arr_user_liked = nivel_bloque.users_liked
	
	var new_nivel_bloque = nivel_bloque

	// Asignando color gray por defecto
	new_nivel_bloque.status_color = 'gray'

	// Onteniendo totos los comentarios por articulo

	// Buscando like de usuario por id, en el articulo
	for(var i = 0; i <= arr_user_liked.length - 1; i++) {
		//console.log('Usuario numero: ' + i)
		var user_element =  arr_user_liked[i]

		// Volviend string al objeto de id para comparar el req.user._id && el id actual procesado de liked users
		var req_user_id = JSON.stringify(req.user._id)
		var req_user_id2 = JSON.parse(req_user_id)

		// Compararando el id de req.user._id && el id actual proceso de liked users
		if(user_element.user_id === req_user_id2) {
			//console.log('Se encontro al usaurio en el : ' + i)
			new_nivel_bloque.status_color = 'blue'
			break
		}		
	}

	//console.log('---------------------------------')
	//console.log('NIvel de bloque')
	//console.log(new_nivel_bloque)
	//console.log('---------------------------------')

	callback(new_nivel_bloque)
}

// /comunidad: Obteniendo y procesando todas las publiciones
app.get('/', isLoggedIn, function (req, res) {
	var user = req.user
	if(user) {
		var new_Articles = []

		// Publicaciones 
		// Obteniendo cursos de la base de datos
		Cursos.find(function (err, cursos) {
			if(err) {
				return console.log('Error al obtener los cursos: ' + err)
			}

			// Almacenando titutos de los cursos como tag de busqueda filtrada a futuro, como #tags
			var tags = []
			for(var h = 0; h <= cursos.length - 1; h++) {
				var element = cursos[h]
				tags[h] = { 
					id: element._id,
					title: element.title
				}
			}
			
			// Obteniendo los articulos almacenados
			Comunidad_publish.find(function (err, articles) {
				if(err) {
					return console.log('Error al obtener los articulos: ' + articles)
				}

				// Ordenando el arreglo
				articles.reverse()
				
				// Validar, efecto visual de like por cada articulo
				for(var j = 0; j <= articles.length - 1; j++) {
					//console.log('PUblicacion: ' + j)
					var article = articles[j]

					GoStatusLike(article, req, function (new_article) {

						if(new_article.status_color !== '') {
							
							// Agregando al nuevo articulo
							new_Articles[j] = new_article

							// Validar, efecto de like para cada comentario
							for(var h = 0; h <= new_article.users_comments.length - 1; h++) {
								var comment = new_article.users_comments[h]

								GoStatusLike(comment, req, function (new_comment) {

									if(new_comment.status_color !== '') {

										// Agregando al nuevo comentario
										new_Articles[j].users_comments[h] = new_comment

										// Validar, efecto visual de like por cada respuesta
										for(var k = 0; k <= new_comment.answers.length - 1; k++) {
											var answer = new_comment.answers[k]

											// Validar, efecto de like para cada comentario
											GoStatusLike(answer, req, function (new_answer) {

												if(new_answer.status_color !== '') {
													// Agregando al nuevo answer
													new_Articles[j].users_comments[h].answers[k] = new_answer
													
												}

											})
										}

									}

								})
								
							}

						}

					})


				}

				// Ordenando cronologicamente 
				if(new_Articles.length === articles.length) {

					var Articles_dates = []

					// Ordenando por fecha
					for(var q = 0; q <= new_Articles.length - 1; q++) {
						var element = {
							data: new_Articles[q],
							date_number: 0
						}

						// convirtiendo dato a numbero comparable
						var new_data = new Date(element.data.fecha_creacion).getTime()

						element.date_number = Number(new_data)
						new_Articles[q] = element

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
						for(var s = 0; s <= new_Articles.length - 1; s++) {
							var el_article = new_Articles[s]

							if(Articles_dates[c] === el_article.date_number) {
								console.log('Elemento date encontrado para este articulo')
								//new_Articles[c] = el_article.data
								Article_collections[c] = new_Articles[s].data
								
								break
							}
						
						}
					}

					// Filtrando fecha agredable
					
					// Componiendo fecha para publicaicones
					var new_publish_collection = []
					for(var d = 0; d <= Article_collections.length - 1; d++) {
						
						var element_here = Article_collections[d]
						console.log('Position: ' + d)
						console.log(element_here)

						var RTime = new Date(element_here.fecha_creacion)
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
							
							console.log(' Es de hoy ')

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

						var new_publish = { 
							_id:   	             element_here._id,
							form_publish_type:   element_here.form_publish_type,
							user_id: 			 element_here.user_id,
							user_name: 		     element_here.user_name, 
							user_nick: 		     element_here.user_nick, 
							user_grado: 		 element_here.user_grado, 
							user_photo: 		 element_here.user_photo, 
							publish_type: 	     element_here.publish_type, 
							publish_title: 	     element_here.publish_title, 
							publish_content: 	 element_here.publish_content, 
							publish_multimedia:  element_here.publish_multimedia, 
							publish_etiqueta:    element_here.publish_etiqueta, 
							number_likes: 	     element_here.number_likes, 
							number_comments: 	 element_here.number_comments, 
							users_liked: 		 element_here.users_liked, 
							users_comments:      [],
							status_color:        element_here.status_color,
							fecha_creacion: 	 date_template  
						}

						// element_here.users_comments // <------  COmentarios

						// Colecionar comentarios por fecha
						var new_comment_collection = []

						for(var e = 0; e <= element_here.users_comments.length - 1; e++) {
							
							var element_here_commment = element_here.users_comments[e]
							console.log('Position: ' + e)
							console.log(element_here_commment)

							var RTime = new Date(element_here_commment.fecha_creacion)
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
								
								console.log(' Es de hoy ')

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

							var new_comment = { 
								_id:   	         element_here_commment._id,
								article_id:      element_here_commment.article_id, 
								comment_id:      element_here_commment.comment_id,
								user_id: 	     element_here_commment.user_id,
								user_name: 	     element_here_commment.user_name,
								user_nick:   	 element_here_commment.user_nick,
								user_photo:      element_here_commment.user_photo,
								user_grado:      element_here_commment.user_grado,
								comment: 	     element_here_commment.comment,
								answers: 	     [],
								status_color:    element_here_commment.status_color,
								users_liked:     element_here_commment.users_liked,
								counter_likes:   element_here_commment.counter_likes,
								counter_answers: element_here_commment.counter_answers,
								fecha_creacion:  date_template
							}

							// Agregando respuestas
							var new_answer_collection = []

							
							for(var q = 0; q <= element_here_commment.answers.length - 1; q++) {
								
								var element_here_answer = element_here_commment.answers[q]
								console.log('Position: ' + q)
								console.log(element_here_answer)

								var RTime = new Date(element_here_answer.fecha_creacion)
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
									
									console.log(' Es de hoy ')

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

								var new_answers_item = { 
									_id:   	         element_here_answer._id,
									article_id:      element_here_answer.article_id,
									comment_id:      element_here_answer.comment_id,
									answer_id:       element_here_answer.answer_id,
									user_id:         element_here_answer.user_id,
									user_name:       element_here_answer.user_name,
									user_nick:       element_here_answer.user_nick,
									user_photo:      element_here_answer.user_photo,
									user_grado:      element_here_answer.user_grado,
									answer:          element_here_answer.answer,
									users_liked:     element_here_answer.users_liked,
									status_color:    element_here_answer.status_color,
									counter_likes:   element_here_answer.counter_likes,
									fecha_creacion:  date_template
								}

								// ---------------- Comentarios
								new_answer_collection[q] = new_answers_item

							}
							
							new_comment.answers = new_answer_collection	

							// ---------------- Comentarios
							new_comment_collection[e] = new_comment

						}

						// ------------------- Comentarios
						new_publish.users_comments = new_comment_collection

						// ------------------- Almacenando Publicidad uno a unp
						new_publish_collection[d] = new_publish

					}

					//render de vista para usuario
					/*res.render('./plataforma/comunidad/index', {
						user: req.user,
						tags: tags,
						articles: new_publish_collection
					})*/

					// Respuesta en JSON
					res.status(200).json({
						user: req.user,
						tags: tags,
						articles: new_publish_collection
					})

				}
			})
			
		})
		
	} else {
		res.redirect('/login')
	}
})

// Obteniendo publicion por id
app.get('/:article_id', isLoggedIn, function (req, res) {
	if(req.user) {
		var article_id = req.params.article_id

		Comunidad_publish.findById({'_id': article_id}, function (err, article) {
			if(err) {
				return console.log('Error al encontrar articulo en la base de datos: ' +  err)
			}

			console.log('Publicones por id:')
			console.log(article)

			//res.render('./plataforma/comunidad/publicacion_item/index.jade', {
			//	status: 'ok',
			//	user: req.user,
			//	article: article
			//})

			res.status(200).json({
				status: 'ok',
				user: req.user,
				article: article
			})
			
		})

	} else {
		res.redirect('/login')
	}
})

module.exports = app

