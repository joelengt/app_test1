// require model chat
var config = require('../../config')

var Users = require('../../models/usuarios')
var Cursos = require('../../models/cursos')
var Resenias = require('../../models/resenias')

function time (io) {
	
	//io.adapter(redis({ host: 'localhost', port: 6379 }))

	//Connetion de todos los sockets
	io.on('connection', function (socket) {
		console.log(`Connected to resenias for courses ${socket.id}`)

		// Connection por room
		socket.on('room', function(room) {
			console.log('Room session Is : ' + room)
		    // Si el usuario ya esta suscrito a otro room, sale de ese y se une al nuevo
			if(socket.room) {
				socket.leave(socket.room)
			}

			// Uniendo al usuario al nuevo room
		 	socket.room = room
		    console.log('EL valor del socket.room: ' + socket.room)
		  	socket.join(room)
		})

		socket.on('resenia', function (content) {
			console.log('Usuario envio un mensaje: ' + content)
			
			// Guardando Resenñas
			var resenia_new = new Resenias({
				type_categority : content.type_categority,
				topic_id: content.topic_id,
				topic_title: content.topic_title,
				user_full_name: content.user_full_name,
				user_avatar: content.user_avatar,
				user_grado:  content.user_grado,
				rate: content.rate,
				comment: content.comment,
			})

			resenia_new.save(function (err) {
				if(err) {
					return res.send('Error al guardar resenia: ' + err)
				}
				
				// Validando fecha en formato amigable
				var RTime = new Date(resenia_new.createdAt)
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

				content.createdAt = date_template

				io.to(socket.room).emit('resenia', content)

			})

		})

		socket.on('disconnect', function(){
			console.log('se ha desconectado de las resenias')
		})

	})

}

module.exports = time

//http://socket.io/docs/rooms-and-namespaces/
//http://socket.io/docs/server-api/
//https://gist.github.com/crtr0/2896891