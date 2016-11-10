
var Comunidad_publish_muro_friend = require('../../models/publish_muro_to_friend')
var Notificaciones = require('../../models/notificaciones')
var Users = require('../../models/usuarios')

var path = require('path')
var fs = require('fs')

var incrementVote = require('./increment_vote')
var incrementVoteComment = require('./increment_vote_by_comment')
var incrementVoteAnswer = require('./increment_vote_by_answer')

// Funcion para buscar usuario en la DB
function ProcessFindEvent (element_notifi, callback) {
	Users.findById({'_id': element_notifi.datos_user.user_id}, function (err, friend_fined) {
		if(err) {
			return callback(err)
		}

		//console.log('Datos del amigo solicitado')
		//console.log(friend_fined)

		if(friend_fined) {
			callback(err, friend_fined)
		
		}

	})
}

function time (io, ss) {
	//io.adapter(redis({ host: 'localhost', port: 6379 }))

	//Connetion de todos los sockets
	io.on('connection', function (socket) {
		console.log(`Connected to Muro: ${socket.id}`)

		// Connection por room
		socket.on('MuroFriend', function(MuroFriend) {
			console.log('RoomMuro to send friend session Is : ' + MuroFriend)
		    // Si el usuario ya esta suscrito a otro MuroFriend, sale de ese y se une al nuevo
			if(socket.MuroFriend) {
				socket.leave(socket.MuroFriend)
			}

			// Uniendo al usuario al nuevo MuroFriend
		 	socket.MuroFriend = MuroFriend
		    console.log('EL valor del socket.MuroFriend: ' + socket.MuroFriend)
		  	socket.join(MuroFriend)
		})

		// Connection por room para Notificacioens
		socket.on('MyNotificaciones', function(MyNotificaciones) {
			console.log('MyNotificaciones session Is : ' + MyNotificaciones)
		    // Si el usuario ya esta suscrito a otro MyNotificaciones, sale de ese y se une al nuevo
			if(socket.MyNotificaciones) {
				socket.leave(socket.MyNotificaciones)
			}

			// Uniendo al usuario al nuevo MyNotificaciones
		 	socket.MyNotificaciones = MyNotificaciones
		    console.log('EL valor del socket.MyNotificaciones: ' + socket.MyNotificaciones)
		  	socket.join(MyNotificaciones)
		})

		ss(socket).on('up_file_to_muro_friend', function(stream, data) {
			console.log('FILE RECIBIDO from : ' + socket.id)
			console.log('data del stream: ----')
			console.log(stream)
			console.log('data del file -----')
			console.log(data)
			console.log('----')

			var filename = path.basename(data.name)
			console.log('filename')
			console.log(filename)
			var new_path = 'uploads/news/' + filename
		    stream.pipe(fs.createWriteStream(new_path))
		    
		})
		
		// Like: Escuchando a los sockets 
		socket.on('muro_friend_publish_like', function (content_like_event) {

			console.log('Evento like de esta publicación: ' + content_like_event)

			// Almacenar el evento like en la base de datos
			incrementVote(content_like_event, function (err, article) {
				if (err) {
					return socket.emit('like:error', err)
				}

				var element_likes = {
					id: article._id,
					likes: article.number_likes
				}

				// Enviar repuesta like actualizada
				console.log(`${element_likes.id} tiene ${element_likes.likes} likes`)
				
				io.emit('muro_friend_publish_like', element_likes)

			})
		})

		// Like by comment: Escuchando sockets
		socket.on('muro_friend_publish_like_by_comment', function (content_like_by_comment) {

			console.log('Evento like this comment: ' + content_like_by_comment)
			// Almacenar el evento like by comment a la base de datos
			incrementVoteComment(content_like_by_comment, function (err, comment) {
				if(err) {
					return socket.emit('like_comment:error', err)
				}

				// Elemento like enviado to SEND
				var element_like_send_comment = {
					article_id: comment.article_id,
					comment_id: comment.comment_id,
					counter_likes: comment.counter_likes
				}

				io.emit('muro_friend_publish_like_by_comment', element_like_send_comment)
			})

		})

		// Like by answer: Escuchando sockets
		socket.on('muro_friend_publish_like_by_answer', function (content_like_by_answer) {
			console.log('Evento LIKE BY ANSWER recibido: ' + content_like_by_answer)
			//console.log(content_like_by_answer)

			// Almacenar el evento like by answer a la base de datos
			incrementVoteAnswer(content_like_by_answer, function (err, answer_here) {
				if(err) {
					return socket.emit('like_comment:error', err)
				}

				// Elemento like enviado to SEND
				var element_like_send_answer = {
					article_id: answer_here.article_id,
					answer_id: answer_here.answer_id,
					comment_id: answer_here.comment_id,
					counter_likes: answer_here.counter_likes
				}

				io.emit('muro_friend_publish_like_by_answer', element_like_send_answer)
			})
		})

		// Comment: Escuchando a los sockets 
		socket.on('muro_friend_publish_comment', function (content_comment_event) {
			console.log('Comentario de este friend recibido: ' + content_comment_event)
			console.log(`Connected to comunidad: ${socket.id}`)
			
			// Buscando la publicación por id
			var article_id = content_comment_event.article_id
			Comunidad_publish_muro_friend.findById({'_id': article_id }, function (err, articulo) {
				if(err) {
					return console.log('Error al encontrar los articulos:' + err)
				}

				var new_comment = {
					article_id: content_comment_event.article_id, 
					comment_id: '',
					user_id: content_comment_event.user_id,
					user_name: content_comment_event.user_name,
					user_nick: content_comment_event.user_nick,
					user_photo: content_comment_event.user_photo,
					comment: content_comment_event.comment,
					answers: [],
					users_liked: [],
					status_color: 'gray',
					counter_likes: 0,
					counter_answers: 0
				}
				
				//Asignando numero de posicion creado a cada comentario
				new_comment.comment_id = articulo.users_comments.length + 1

				// Guardando nuevo comentario
				articulo.users_comments.push(new_comment)

				// Guardando el numero de comentarios
				articulo.number_comments = articulo.users_comments.length
				
				content_comment_event.comment_id = new_comment.comment_id
				content_comment_event.counter_likes = 0
				content_comment_event.status_color = 'gray'
				content_comment_event.counter_answers = 0

				articulo.save(function (err) {
					if(err) {
						return console.log('Error al guardar el nuevo comentario')
					}
					content_comment_event.fecha_creacion = articulo.fecha_creacion

					var publish_comment_date = new Date()
					
					// Definiendo tiempo cronologico en tiempo real
					var RTime = new Date(publish_comment_date)
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
					
					content_comment_event.fecha_creacion = date_template


					io.emit('muro_friend_publish_comment', content_comment_event)
				})
				
			})

		})

		// Respuestas por comentario de publicación
		socket.on('muro_friend_publish_answer', function (content_answer_event) {
			console.log(`Connected to comunidad: ${socket.id}`)

			console.log('repuesta para, articulo: ' + content_answer_event.article_id + ' comment: ' + content_answer_event.comment_id)
			
			var article_by_id = content_answer_event.article_id

			// Guardando en la base de datos
			Comunidad_publish_muro_friend.findById({'_id': article_by_id}, function (err, article) {
				if(err) {
					return console.log('Error al encontrar el articulo en la base de datos: ' + err)
				}

				var new_answer = {
					article_id: content_answer_event.article_id,
					comment_id: content_answer_event.comment_id,  
					user_id:    content_answer_event.user_id,
					user_name:  content_answer_event.user_name,
					user_nick:  content_answer_event.user_nick,
					user_photo: content_answer_event.user_photo,
					answer:     content_answer_event.answer,
					status_color: 'gray',
					users_liked: [],
					counter_likes: 0
				}


				// Obteniendo el comentario por id
				var position_orden = Number(content_answer_event.comment_id) - 1
				console.log('position orden: ' + position_orden)

				// Registrando answer_id para esta respuesta
				var sum_position_now = Number(article.users_comments[position_orden].answers.length) + 1
				//var largo = String(sum_position_now)

				new_answer.answer_id =  Number(sum_position_now)
				//new_answer.answer_id =  Number(content_answer_event.comment_id + '.' + sum_position_now)
				
				//console.log('Answer_id creado: ')
				//console.log(new_answer.answer_id)
				//console.log('answer_id al creado :' + typeof(new_answer.answer_id))

				article.users_comments[position_orden].answers.push(new_answer)

				// Guardando el numero total de comentarios
				article.users_comments[position_orden].counter_answers = article.users_comments[position_orden].answers.length
				
				// Asignando inicial para contados de likes
				content_answer_event.answer_id = new_answer.answer_id
				content_answer_event.counter_likes = 0
				content_answer_event.status_color = 'gray'
				
				article.save(function (err) {
					if(err) {
						return console.log('Error al guardar la respuesta en viada en: article_id: ' + content_answer_event.article_id + ' , comment_id: ' + content_answer_event.comment_id + ' , answer_id: ' + content_answer_event.answer_id + ' error: ' + err)
					}

					console.log('Nuevo answer guardado: ')
					console.log('article_id: ' + content_answer_event.article_id + ' , comment_id: ' + content_answer_event.comment_id + ' , answer_id: ' + content_answer_event.answer_id)
				})

				var publish_answer_date = new Date()
				
				// Definiendo tiempo cronologico en tiempo real
				var RTime = new Date(publish_answer_date)
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
				
				content_answer_event.fecha_creacion = date_template

				content.number_likes = 0
				content.number_comments = 0
				content.status_color = 'gray'

				//io.emit('answer', content_answer_event)
				io.to(socket.MuroFriend).emit('muro_friend_publish_answer', content_answer_event)

			})


		})


		// Publicacion: Escuchando a los sockets
		socket.on('muro_friend_publish', function (content) {
			console.log('PUblicacion al muro de: ' + content.user_onwer_id + ' enviado por ' + content.user_author_id)
			
			// Guardando Resenñas
			var publish_to_friend_new = new Comunidad_publish_muro_friend({
				form_publish_type:  'muro_friend',
				user_onwer_id: content.user_onwer_id,
				user_author_id: content.user_author_id,
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_grado: content.user_grado,
				user_photo: content.user_photo,
				publish_content: content.publish_content,
				status_color: 'gray',
				number_likes: 0,
				number_comments: 0
			})
			
			if(content.publish_multimedia !== null) {
				console.log('Usuario envio un publicacion, CON file multimedia: ' + content.publish_multimedia)
				publish_to_friend_new.publish_multimedia = {
					name: content.publish_multimedia.name,
					path: 'news/' + content.publish_multimedia.name,
					type: content.publish_multimedia.type
				}

				content.publish_multimedia = {
					name: content.publish_multimedia.name,
					path: 'news/' + content.publish_multimedia.name,
					type: content.publish_multimedia.type
				}
			}	

			publish_to_friend_new.save(function (err) {
				if(err) {
					return console.log('Error al guardar resenia: ' + err)
				}

				// Almacenando notificacón por like
				var new_muro_friend_box = new Notificaciones({
					article_id:   publish_to_friend_new._id,
					article_type: 'muro_friend',
					datos_user:   {
						user_id:  content.user_author_id
					}
				})

				new_muro_friend_box.save(function (err) {
					if(err) {
						return console.log('Error al guardar la nueva notificación:' + erre)
					}
					console.log('Notificiacón comment guadada')

					// Buscanado Datos de usuario
					ProcessFindEvent(new_muro_friend_box, function (err, user_nu) {
						if(err) {
							return console.log('Error al encontrar usuario: ' + err)
						}

						// Fecha Amigable
						var today_date = new Date()

						var RTime = new Date(today_date)
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

						var data = {
							article_id:   new_muro_friend_box.article_id,
							article_type: new_muro_friend_box.article_type,
							datos_user:   {
								user_id:  user_nu._id,
								name:     user_nu.name,
								photo:    user_nu.photo
							},
							fecha_creacion: date_template
						}

						io.emit('notificaciones', data)

					})

				})

			})

			content.id = publish_to_friend_new._id //Para que el usuario mismo pueda eliminar su propia publicacion
			var publish_to_friend_date = new Date()
			
			// Definiendo tiempo cronologico en tiempo real
			var RTime = new Date(publish_to_friend_date)
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
			
			content.fecha_creacion = date_template

			content.number_likes = 0
			content.number_comments = 0
			content.status_color = 'gray'

			io.to(socket.MuroFriend).emit('muro_friend_publish', content)

		})

	})

}

module.exports = time
