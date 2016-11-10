var express = require('express')
var app = express.Router()

var Users = require('../../../models/usuarios')
var Cursos = require('../../../models/cursos')
var Comunidad_publish = require('../../../models/comunidad_publish')
var Comunidad_publish_muro_friend = require('../../../models/publish_muro_to_friend')
var Progress_simulator = require('../../../models/progress_simulator')
var Notificaciones = require('../../../models/notificaciones')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

// Funcion para buscar usuario en la DB
function ProcessFindEvent (element_notifi, callback) {
	Users.findById({'_id': element_notifi.datos_user.user_id}, function (err, friend_fined) {
		if(err) {
			return callback(err)
		}

		//console.log('Datos del amigo solicitado')
		//console.log(friend_fined)

		if(friend_fined) {
			callback(err, friend_fined, element_notifi)
		
		}

	})
}

// Ruta: /plataforma/notificaiones
app.get('/', isLoggedIn, function (req, res) {
	if(req.user) {
		var user_id = JSON.stringify(req.user._id)
		user_id = JSON.parse(user_id)

		// Obteniendo y Filtrando articulos para de comunidnad
		Comunidad_publish.find(function (err, articles) {
			if(err) {
				return console.log('Error al encontrar articulos en comunidad: ' + err)
			}

			var ArticlesContent = []
			var MyArticles = []

			// Filtrando articulos publicados por user_id
			for(var r = 0; r <= articles.length - 1; r++) {
				var article = articles[r]
				//console.log(' buscando articulos ciclo ' + r)

				// Filtrando por user_id
				if(article.user_id === user_id) {
					//console.log('articulo de conincidencia: ' + r)

					MyArticles.push(article)

				}

			}

			// Organizando y Filtrando articulos de amigos en mi muro
			Comunidad_publish_muro_friend.find(function (err, publicaciones_from_friends) {
				if(err) {
					return console.log('Error al encontrar articulo de amigos en la comunidad: ' + err)
				}

				for(var w = 0; w <= publicaciones_from_friends.length - 1; w++) {
					var item_friend = publicaciones_from_friends[w]
					//console.log('buscando publicaciones from friend para mi muro:' + w)
					
					// Filtrando usuario pertenecientes para vista de este usuario
					if(item_friend.user_onwer_id === user_id) {
						item_friend.publish_etiqueta = {
							id: '',
							title: ''
						}

						MyArticles.push(item_friend)

					}
				}

				// Buscanado notificaciones pertenecientes al usuario
				Notificaciones.find(function (err, notificaciones) {
					if(err) {
						return console.log('Error al encontrar notificaciones en el sistema: ' + err)
					}

					console.log('Notificaciones')
					console.log(notificaciones)

					if(notificaciones.length > 0 ) {

						var NotificacionesCollection = []
						
						// Filtrando notificaciones por dueño de publicacion
						for(var t = 0; t <= notificaciones.length - 1; t++) {
							var noti_element = notificaciones[t]
							
							console.log('Notificaciones arr: ' + t)
							for(var d = 0; d <= MyArticles.length - 1; d++) {
								var article_element = MyArticles[d]

								console.log('Articles, busqueda: ' + d)
								var element_ar = JSON.stringify(article_element._id)
								element_ar = JSON.parse(element_ar)

								// Filtrando coincidencia
								if(element_ar === noti_element.article_id) {
									console.log('Se encontraro noificaion en posicon:' + t)
									NotificacionesCollection.push(noti_element)
								}
							}
						}

						if(NotificacionesCollection.length > 0) {
							var New_NotificationCollection = []
							
							// Metiendo datos del usuario que genero la notificacion
							for(var m = 0; m <= NotificacionesCollection.length - 1; m++) {
								var element_notificacion = NotificacionesCollection[m]

								// Buscando datos de amigo 
								ProcessFindEvent(element_notificacion , function (err, usuario, element_notifi) {
									if(err) {
										return console.log('Error al encontrar usuario en la base de datos' + err)
									}

									if(usuario) {
										console.log(usuario)

										var new_notification_data = {
											_id:          element_notifi._id,
											article_id:   element_notifi.article_id,
											article_type: element_notifi.article_type,
											datos_user: {
												user_id: usuario._id,
												name: usuario.name,
												photo: usuario.photo,
											},
											fecha_creacion: element_notifi.fecha_creacion
										}

										New_NotificationCollection.push(new_notification_data)

										if(New_NotificationCollection.length === NotificacionesCollection.length) {
											// Notificaciones del usuario
											console.log('El usuario tiene: ' + New_NotificationCollection.length + ' notificacones')
											//console.log('Datos de Notificaciones ------')
											//console.log(New_NotificationCollection)

										
											// Ordenando cronologicamente
											var Articles_dates = []

											for(var q = 0; q <= New_NotificationCollection.length - 1; q++) {
												var element = {
													data: New_NotificationCollection[q],
													date_number: 0
												}

												// convirtiendo dato a numbero comparable
												var new_data = new Date(element.data.fecha_creacion).getTime()

												element.date_number = Number(new_data)
												New_NotificationCollection[q] = element

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
												for(var s = 0; s <= New_NotificationCollection.length - 1; s++) {
													var el_article = New_NotificationCollection[s]

													if(Articles_dates[c] === el_article.date_number) {
														console.log('Elemento date encontrado para este articulo')
														//New_NotificationCollection[c] = el_article.data
														Article_collections[c] = New_NotificationCollection[s].data
														
														break
													}
												
												}
											}

											//console.log('Articles COllecetons')
											//console.log(Article_collections)

											// Fecha Amigable
											var new_notis_collection = []

											for(var y = 0; y <= Article_collections.length - 1; y++) {
												var element_2 = Article_collections[y]
												console.log('Position: ' + y)
												console.log(element_2)

												var RTime = new Date(element_2.fecha_creacion)
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

												var new_noti_flash = { 
												  _id: element_2._id,
												  article_id:   element_2.article_id,
												  article_type: element_2.article_type,
												  datos_user: {
												  	user_id: element_2.datos_user.user_id,
												  	name: element_2.datos_user.name,
												  	photo: element_2.datos_user.photo,
												  },
												  fecha_creacion: date_template
												} 

												new_notis_collection.push(new_noti_flash)

											}
											
											//res.render('./plataforma/notificaciones/index.jade', {
											//	status: 'ok',
											//	message: 'Las notificaciones fueron encontradas',
											//	user: req.user,
											//	notificaciones: new_notis_collection
											//})

											// Buscando datos de usuario por cada elemento
											res.status(200).json({
												status: 'ok',
												message: 'Las notificaciones fueron encontradas',
												user: req.user,
												notificaciones: new_notis_collection
											})

									    }
								    }
								})
							
							}
						} else {
							console.log('No hay notificaiones para ti')
							console.log(NotificacionesCollection)

							var new_notis_collection = []

							//res.render('./plataforma/notificaciones/index.jade', {
							//	status: 'ok',
							//	message: 'No tienes notificaciones aun',
							//	user: req.user,
							//	notificaciones: new_notis_collection
							//})

							// Buscando datos de usuario por cada elemento
							res.status(200).json({
								status: 'ok',
								message: 'No tienes notificaciones aun',
								user: req.user,
								notificaciones: new_notis_collection
							})
						}

						

					} else {
						var new_notis_collection = []

						//res.render('./plataforma/notificaciones/index.jade', {
						//	status: 'ok',
						//	message: 'No tienes notificaciones aun',
						//	user: req.user,
						//	notificaciones: new_notis_collection
						//})

						// Buscando datos de usuario por cada elemento
						res.status(200).json({
							status: 'ok',
							message: 'No tienes notificaciones aun',
							user: req.user,
							notificaciones: new_notis_collection
						})
					}


				})

			})

		})


	} else {
		res.redirect('/login')
	}
})

module.exports = app
