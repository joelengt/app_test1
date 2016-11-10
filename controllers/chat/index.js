// require model chat
var path = require('path')
var fs = require('fs')

var Users = require('../../models/usuarios')
var Friends = require('../../models/usuarios/amigos')
var ChatsList = require('../../models/chat')
var ChatsRoom = require('../../models/chat/chat_content')

var config = require('../../config')

function time (io, ss) {
	
	//io.adapter(redis({ host: 'localhost', port: 6379 }))

	//Connetion de todos los sockets
	io.on('connection', function (socket) {
		console.log(`Connected to ChatRoomto to friend ${socket.id}`)

		// Connection por room
		socket.on('Chatroom', function(Chatroom) {
			console.log('Room session Is : ' + Chatroom)
		    // Si el usuario ya esta suscrito a otro Chatroom, sale de ese y se une al nuevo
			if(socket.Chatroom) {
				socket.leave(socket.Chatroom)
			}

			// Uniendo al usuario al nuevo Chatroom
		 	socket.Chatroom = Chatroom
		    console.log('EL valor del socket.Chatroom: ' + socket.Chatroom)
		  	socket.join(Chatroom)
		})

		ss(socket).on('up_file_to_chat', function(stream, data) {
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

		socket.on('chat', function (content) {
			console.log('Usuario envio un mensaje: ' + content)
			

			ChatsRoom.findById({'_id': socket.Chatroom}, function (err, chatSalaRoom) {
				if(err) {
					return console.log('Error al ')
				}

				console.log('Datos de este Room')
				console.log(chatSalaRoom)

				// Obteniendo el nuevo mensaje 
				var new_message = {
					user_id:  content.user_id,
					message: content.message
				}

				if(content.message_multi_data !== null) {
					console.log('El parametro del dato comabio')
					new_message.message_multi_data = {
						name: content.message_multi_data.name,
						type: content.message_multi_data.type,
						path: 'news/' + content.message_multi_data.name
					}

					content.message_multi_data = {
						name: content.message_multi_data.name,
						path: 'news/' + content.message_multi_data.name,
						type: content.message_multi_data.type
					}
				}
				
				console.log('Nuevo mensaje agregado')
				console.log(new_message)
				

				// Guardando Resenñas
				chatSalaRoom.messages.push(new_message)

				chatSalaRoom.save(function (err) {
					if(err) {
						return console.log('Error al guardar el nuevo mensaje: ' + err)
					}
					ChatsList.findOne({'chat_content_id': chatSalaRoom._id}, function (err, chatListItem) {
						if(err) {
							return console.log('Error al encontrar elemento chat en la lsita')
						}
						
						console.log('ChatListItem encontrado')

						chatListItem.ultime_mesage.message = new_message.message
						chatListItem.ultime_mesage.date_send = Date()

						chatListItem.save(function (err) {
							if(err) {
								return console.log('Error al guardar chatListItem')
								
							}
							console.log('Elemento de list fue aguardado')
						})

					})
				})

				console.log('Id de chatRoom socket. ')
				console.log(socket.Chatroom)
				
				content.dateCreateRoom = Date()
				
				console.log('Mensaje enviado en tiempo real')
				console.log(content)

				var RTime = new Date(content.dateCreateRoom)
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

				var new_message_item = { 
					user_id: content.user_id,
					user_full_name: content.user_full_name,
					user_avatar: content.user_avatar,
					message: content.message,
					message_multi_data: content.message_multi_data,
					dateCreateRoom: date_template
				}

				io.to(socket.Chatroom).emit('chat', new_message_item)
			})

		})

	})

}

module.exports = time
