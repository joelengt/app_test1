
//var Progress_simulator = require('../../models/progress_simulator')
//var path = require('path')
//var fs = require('fs')

//var incrementVote = require('./increment_vote')
//var incrementVoteComment = require('./increment_vote_by_comment')
//var incrementVoteAnswer = require('./increment_vote_by_answer')

function time (io) {
/*
	//io.adapter(redis({ host: 'localhost', port: 6379 }))

	//Connetion de todos los sockets
	io.on('connection', function (socket) {
		console.log(`Connected to Muro: ${socket.id}`)

		// Connection por room
		socket.on('MuroProgress', function(MuroFriend) {
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

		// Like: Escuchando a los sockets 
		socket.on('muro_progress_publish_like', function (content_like_event) {

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
				
				io.emit('muro_progress_publish_like', element_likes)

			})
		})

		// Like by comment: Escuchando sockets
		socket.on('muro_progress_publish_like_by_comment', function (content_like_by_comment) {

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

				io.emit('muro_progress_publish_like_by_comment', element_like_send_comment)
			})

		})

		// Like by answer: Escuchando sockets
		socket.on('muro_progress_publish_like_by_answer', function (content_like_by_answer) {
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

				io.emit('muro_progress_publish_like_by_answer', element_like_send_answer)
			})
		})

		// Comment: Escuchando a los sockets
		socket.on('muro_progress_publish_comment', function (content_comment_event) {
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

					io.emit('muro_progress_publish_comment', content_comment_event)
				})
				
			})

		})

		// Respuestas por comentario de publicación
		socket.on('muro_progress_publish_answer', function (content_answer_event) {
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
				content_answer_event.fecha_creacion = Date()
				
				article.save(function (err) {
					if(err) {
						return console.log('Error al guardar la respuesta en viada en: article_id: ' + content_answer_event.article_id + ' , comment_id: ' + content_answer_event.comment_id + ' , answer_id: ' + content_answer_event.answer_id + ' error: ' + err)
					}

					console.log('Nuevo answer guardado: ')
					console.log('article_id: ' + content_answer_event.article_id + ' , comment_id: ' + content_answer_event.comment_id + ' , answer_id: ' + content_answer_event.answer_id)
				})

				//io.emit('answer', content_answer_event)
				io.to(socket.MuroFriend).emit('muro_progress_publish_answer', content_answer_event)

			})


		})

	})

*/
}

module.exports = time
