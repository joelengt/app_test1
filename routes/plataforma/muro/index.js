var express = require('express')
var app = express.Router()

var Users = require('../../../models/usuarios')
var Cursos = require('../../../models/cursos')
var Comunidad_publish = require('../../../models/comunidad_publish')
var Comunidad_publish_muro_friend = require('../../../models/publish_muro_to_friend')
var Progress_simulator = require('../../../models/progress_simulator')

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

// Obteniendo publicaciones para el muro de este usuario
app.get('/:user_id', isLoggedIn, function (req, res) {
	if(req.user) {

		var user_id = req.params.user_id
		var new_Articles = []

		Users.findById(user_id, function (err, usuario) {
			if(err) {
				return res.send(404, 'Error al encontrar usuario: ' + err)
			}

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
				
				// Obteniendo los articulos de autoria del usuario
				Comunidad_publish.find(function (err, articles) {
					if(err) {
						return console.log('Error al encontrar los articulos en la DB: ' + err)
					}

					// Ordenando el arreglo
					articles.reverse()

					var ArticlesContent = []
					var MyArticles = []

					// Filtrando articulos publicados por user_id
					for(var r = 0; r <= articles.length - 1; r++) {
						var article = articles[r]
						console.log(' buscando articulos ciclo ' + r)

						// Filtrando por user_id
						if(article.user_id === user_id) {
							console.log('----------------------------')
							console.log('articulo de conincidencia: ' + r)
							console.log(article)
							console.log('----------------------------')

							MyArticles.push(article)

						}

					}

					// Generando fechas amigables para comunidad
					// Componiendo fecha para publicaicones

					var new_publish_collection = []
					for(var d = 0; d <= MyArticles.length - 1; d++) {
						
						var element_here = MyArticles[d]
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
							fecha_creacion: 	 date_template,
							fecha_creacion_order: element_here.fecha_creacion
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
								fecha_creacion:  date_template,
								fecha_creacion_order:   element_here_commment.fecha_creacion
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
									fecha_creacion:  date_template,
									fecha_creacion_order:   element_here_answer.fecha_creacion
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

						// ------------------->>>> Almacenando Publicidad uno a unp
						new_publish_collection[d] = new_publish

					}

					ArticlesContent = new_publish_collection

					// Obteniendo Publicaciones para el muro de este usuario actuall visitado
					Comunidad_publish_muro_friend.find(function (err, publicaciones_from_friends) {
						if(err) {
							return console.log('Error al obtener las publicaciones desde los amigos: ' + err)
						}

						publicaciones_from_friends.reverse()
						
						var MuroPublishMuroFriend = []

						for(var w = 0; w <= publicaciones_from_friends.length - 1; w++) {
							var item_friend = publicaciones_from_friends[w]
							console.log('buscando publicaciones from friend para mi muro:' + w)
							
							// Filtrando usuario pertenecientes para vista de este usuario
							if(item_friend.user_onwer_id === user_id) {
								item_friend.publish_etiqueta = {
									id: '',
									title: ''
								}

								MuroPublishMuroFriend.push(item_friend)

							}
						}

						// Generando fechas amigables para comunidad
						// Componiendo fecha para publicaicones

						for(var z = 0; z <= MuroPublishMuroFriend.length - 1; z++) {
							
							var element_here = MuroPublishMuroFriend[z]
							console.log('Position: ' + z)
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
								_id:   	              element_here._id,
								form_publish_type:    element_here.form_publish_type,
								user_author_id:       element_here.user_author_id,
								user_onwer_id:        element_here.user_onwer_id,
								user_name: 		      element_here.user_name,
								user_nick: 		      element_here.user_nick,
								user_grado: 	      element_here.user_grado,
								user_photo: 	      element_here.user_photo,
								publish_content: 	  element_here.publish_content,
								publish_multimedia:   element_here.publish_multimedia,
								publish_etiqueta: 	  element_here.publish_etiqueta,
								number_likes:         element_here.number_likes,
								number_comments:      element_here.number_comments,
								users_liked: 		  element_here.users_liked, // Info de Usuarios que le dieron like al articulo
								users_comments:       [],
								status_color:         element_here.status_color,
								fecha_creacion: 	  date_template,
								fecha_creacion_order: element_here.fecha_creacion
							}

							// element_here.users_comments // <------  COmentarios

							// Colecionar comentarios por fecha
							var new_comment_collection = []

							for(var b = 0; b <= element_here.users_comments.length - 1; b++) {
								
								var element_here_commment = element_here.users_comments[b]
								console.log('Position: ' + b)
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
									_id:   	               element_here_commment._id,
									article_id:            element_here_commment.article_id, 
									comment_id:            element_here_commment.comment_id,
									user_id: 	           element_here_commment.user_id,
									user_name: 	           element_here_commment.user_name,
									user_nick:   	       element_here_commment.user_nick,
									user_photo:            element_here_commment.user_photo,
									user_grado:            element_here_commment.user_grado,
									comment: 	           element_here_commment.comment,
									answers: 	           [],
									status_color:          element_here_commment.status_color,
									users_liked:           element_here_commment.users_liked,
									counter_likes:         element_here_commment.counter_likes,
									counter_answers:       element_here_commment.counter_answers,
									fecha_creacion:        date_template,
									fecha_creacion_order:  element_here_commment.fecha_creacion
								}

								// Agregando respuestas
								var new_answer_collection = []
								
								for(var j = 0; j <= element_here_commment.answers.length - 1; j++) {
									
									var element_here_answer = element_here_commment.answers[j]
									console.log('Position: ' + j)
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
										_id:   	                 element_here_answer._id,
										article_id:              element_here_answer.article_id,
										comment_id:              element_here_answer.comment_id,
										answer_id:               element_here_answer.answer_id,
										user_id:                 element_here_answer.user_id,
										user_name:               element_here_answer.user_name,
										user_nick:               element_here_answer.user_nick,
										user_photo:              element_here_answer.user_photo,
										user_grado:              element_here_answer.user_grado,
										answer:                  element_here_answer.answer,
										users_liked:             element_here_answer.users_liked,
										status_color:            element_here_answer.status_color,
										counter_likes:           element_here_answer.counter_likes,
										fecha_creacion:          date_template,
										fecha_creacion_order:    element_here_answer.fecha_creacion
									}

									// ---------------- Comentarios
									new_answer_collection[j] = new_answers_item

								}
								
								new_comment.answers = new_answer_collection	

								// ---------------- Comentarios
								new_comment_collection[b] = new_comment

							}

							// ------------------- Comentarios
							new_publish.users_comments = new_comment_collection

							// ------------------->>>> Almacenando Publicidad uno a unp
							ArticlesContent.push(new_publish)

						}

						// Obteniendo publicaciones para el muro de su progreso en el simulador
						Progress_simulator.find(function (err, publicaciones_from_progress) {
							if(err) {
								return console.log('Error al obtener las publicaicones por progreso en lecciones: ' + err)
							}

							var MyProgressSimulator = []

							publicaciones_from_progress.reverse()

							for(var v = 0; v <= publicaciones_from_progress.length - 1; v++) {
								var item_progress = publicaciones_from_progress[v]
								console.log('BUscando publicaciones de progreso en : ' + v)
								
								// Filtrando usuario perteneciente para vista de este usuario
								if(item_progress.user_id === user_id) {
									item_progress.publish_etiqueta = {
										id: '',
										title: ''
									}

									//MyArticles.push(item_progress)
									  MyProgressSimulator.push(item_progress)

								}
							}

							// Generando fechas amigables para comunidad
							// Componiendo fecha para publicaicones

							for(var z = 0; z <= MyProgressSimulator.length - 1; z++) {
								
								var element_here = MyProgressSimulator[z]
								console.log('Position: ' + z)
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
									_id:   	                 element_here._id,
									form_publish_type:       element_here.form_publish_type,
									user_id:                 element_here.user_id,
									user_name: 		         element_here.user_name,
									user_nick: 		         element_here.user_nick,
									user_grado: 	         element_here.user_grado,
									user_photo: 	         element_here.user_photo,
									publish_detalles: 	     element_here.publish_detalles,
									publish_icon_topic:      element_here.publish_icon_topic,
									publish_etiqueta: 	     element_here.publish_etiqueta,
									number_likes:            element_here.number_likes,
									number_comments:         element_here.number_comments,
									users_liked: 		     element_here.users_liked, // Info de Usuarios que le dieron like al articulo
									users_comments:          [],
									status_color:            element_here.status_color,
									fecha_creacion:          date_template,
									fecha_creacion_order:    element_here.fecha_creacion
								}

								// element_here.users_comments // <------  COmentarios

								// Colecionar comentarios por fecha
								var new_comment_collection = []

								for(var b = 0; b <= element_here.users_comments.length - 1; b++) {
									
									var element_here_commment = element_here.users_comments[b]
									console.log('Position: ' + b)
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
										_id:   	                element_here_commment._id,
										article_id:             element_here_commment.article_id, 
										comment_id:             element_here_commment.comment_id,
										user_id: 	            element_here_commment.user_id,
										user_name: 	            element_here_commment.user_name,
										user_nick:   	        element_here_commment.user_nick,
										user_photo:             element_here_commment.user_photo,
										user_grado:             element_here_commment.user_grado,
										comment: 	            element_here_commment.comment,
										answers: 	            [],
										status_color:           element_here_commment.status_color,
										users_liked:            element_here_commment.users_liked,
										counter_likes:          element_here_commment.counter_likes,
										counter_answers:        element_here_commment.counter_answers,
										fecha_creacion:         date_template,
										fecha_creacion_order:   element_here_commment.fecha_creacion
									}

									// Agregando respuestas
									var new_answer_collection = []
									
									for(var j = 0; j <= element_here_commment.answers.length - 1; j++) {
										
										var element_here_answer = element_here_commment.answers[j]
										console.log('Position: ' + j)
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
											fecha_creacion:  date_template,
											fecha_creacion_order:    element_here_answer.fecha_creacion
										}

										// ---------------- Comentarios
										new_answer_collection[j] = new_answers_item

									}
									
									new_comment.answers = new_answer_collection	

									// ---------------- Comentarios
									new_comment_collection[b] = new_comment

								}

								// ------------------- Comentarios
								new_publish.users_comments = new_comment_collection

								// ------------------->>>> Almacenando Publicidad uno a unp
								ArticlesContent.push(new_publish)

							}

							console.log('TODAS LAS COSA DEL MURO')
							console.log(ArticlesContent)
							console.log('-------------------')

							// Validando existencia de lista de articulos generada
							if(ArticlesContent.length > 0) {
								console.log('El usuario tiene: ' + ArticlesContent.length + ' publicaciones')
								
								// Validar, efecto visual de like por cada articulo
								for(var j = 0; j <= ArticlesContent.length - 1; j++) {
									console.log('PUblicacion: ' + j)
									var article = ArticlesContent[j]

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
								

								if(new_Articles.length === ArticlesContent.length) {
									console.log('El nuevo array termino de rellenarse!!')

									// Ordenando cronologicamente
									
									var Articles_dates = []

									for(var q = 0; q <= new_Articles.length - 1; q++) {
										var element = {
											data: new_Articles[q],
											date_number: 0
										}

										// convirtiendo dato a numbero comparable
										var new_data = new Date(element.data.fecha_creacion_order).getTime()

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

									// Render vista para usuario
									/*res.render('./plataforma/muro', {
										user: usuario,
										user_edit: req.user,
										tags: tags,
										articles: Article_collections
									})*/

									// Respuesta en JSON
									res.status(200).json({
										user: usuario,
										user_edit: req.user,
										tags: tags,
										articles: Article_collections
									})

								}


							} else {
								console.log('El usuario no tiene ninguna publicacioón aun')
								ArticlesContent = []

								// Render vista para usuario
								/*res.render('./plataforma/muro', {
									user: usuario,
									user_edit: req.user,
									articles: ArticlesContent,
									tags: tags,
									message: 'El usuario no tiene ninguna publicacion aun'
								})*/
								
								// Respuesta en JSON
								res.status(200).json({
									user: usuario,
									user_edit: req.user,
									articles: ArticlesContent,
									tags: tags,
									message: 'El usuario no tiene ninguna publicacion aun'
								})
							}

						})

					})
					
				})

			})
		})

	} else {
		res.redirect('/login')
	}

})

// Obteniendo publiciones de un amigo, desde el muro del usuario
app.get('/:user_id/item/:type_event/:article_id', function (req, res) {
	if(req.user) {
		var user_id = req.params.user_id
		var article_id = req.params.article_id
		var type_event = req.params.type_event

		if(type_event === 'like' ||
		   type_event === 'comment') {

			Comunidad_publish.findById({'_id': article_id}, function (err, article) {
				if(err) {
					return console.log('Error al encontrar articulo en la base de datos: ' +  err)
				}

				console.log('Publicones por id:')
				console.log(article)

				if(article !== null) {
					Users.findById({'_id': user_id}, function (err, user) {
						if(err) {
							return console.log('Error al encontrar un usuario por id: ' + err)
						}
						
						// res.render('./plataforma/comunidad/publicacion_item/index.jade', {
						// 	status: 'ok',
						// 	user: user,
						// 	user_edit: req.user,
						// 	article: article
						// })

						res.status(200).json({
							status: 'ok',
							user: user,
							user_edit: req.user,
							article: article
						})

					})

				} else {
					Users.findById({'_id': user_id}, function (err, user) {
						if(err) {
							return console.log('Error al encontrar un usuario por id: ' + err)
						}
						
						// res.render('./plataforma/comunidad/publicacion_item/index.jade', {
						// 	status: 'ok',
						// 	user: user,
						// 	user_edit: req.user
						// })

						res.status(200).json({
							status: 'ok',
							user: user,
							user_edit: req.user
						})

					})
				}
				
			})

		} else if (type_event === 'muro_friend') {

			Comunidad_publish_muro_friend.findById({'_id': article_id}, function (err, article) {
				if(err) {
					return console.log('Error al encontrar articulo en la base de datos: ' +  err)
				}

				console.log('Publicones por id:')
				console.log(article)

				if(article !== null) {
					Users.findById({'_id': user_id}, function (err, user) {
						if(err) {
							return console.log('Error al encontrar un usuario por id: ' + err)
						}

						// res.render('./plataforma/muro/muro_item/index.jade', {
						// 	status: 'ok',
						// 	user: user,
						// 	user_edit: req.user,
						// 	article: article
						// })

						res.status(200).json({
							status: 'ok',
							user: user,
							user_edit: req.user,
							article: article
						})

					})
				} else {

					Users.findById({'_id': user_id}, function (err, user) {
						if(err) {
							return console.log('Error al encontrar un usuario por id: ' + err)
						}

						// res.render('./plataforma/muro/muro_item/index.jade', {
						// 	status: 'ok',
						// 	user: user,
						// 	user_edit: req.user
						// })

						res.status(200).json({
							status: 'ok',
							user: user,
							user_edit: req.user
						})

					})
				}

			})

		} else {

			Users.findById({'_id': user_id}, function (err, user) {
				if(err) {
					return console.log('Error al encontrar un usuario por id: ' + err)
				}

				// res.render('./plataforma/muro/muro_item/index.jade', {
				// 	status: 'ok',
				//  message: 'El tipo de evento consultado no pertenece al campo solicitado',
				// 	user: user,
				// 	user_edit: req.user
				// })

				res.status(200).json({
					status: 'ok',
					message: 'El tipo de evento consultado no pertenece al campo solicitado',
					user: user,
					user_edit: req.user
				})
				
			})

		}

	} else {
		res.redirect('/login')
	}
})


// Obteniendo publicaciones de progreso en mi muro
app.get('/user_id/progress/:article_id', isLoggedIn, function (req, res) {
	if(req.user) {

		var user_id = req.params.user_id
		var article_id = req.params.article_id

		Progress_simulator.findById({'_id': article_id}, function (err, article) {
			if(err) {
				return console.log('Error al encontrar articulo en la base de datos: ' +  err)
			}

			console.log('Publicones por id:')
			console.log(article)

			Users.findById({'_id': user_id}, function (err, user) {
				if(err) {
					return console.log('Error al encontrar un usuario por id: ' + err)
				}

				//res.render('./plataforma/muro/muro_item/index.jade', {
				//	status: 'ok',
				//	user: user,
				//	user_edit: req.user,
				//	article: article
				//})

				res.status(200).json({
					status: 'ok',
					user: user,
					user_edit: req.user,
					article: article
				})
				
			})

		})

	} else {
		res.redirect('/login')
	}
})

module.exports = app

