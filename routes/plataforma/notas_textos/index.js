var express = require('express')
var app = express.Router()

var Users = require('../../../models/usuarios')
var Cursos = require('../../../models/cursos')
var Notas_comentarios = require('../../../models/notas_textos/comentarios/index.js')
var Notas_textos = require('../../../models/notas_textos/textos/index.js')

var config = require('../../../config')

var permiso = config.typeUser

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

// CREATE nota-texto: marcado. amarillo
app.post('/cursos/:topic_id/notas-textos-marcado', isLoggedIn, function (req, res) {
	if(req.user) {
		var user_id = JSON.stringify(req.user._id)
		user_id = JSON.parse(user_id)

		var type_categority = req.params.type_categority

		var notas_texto = new Notas_textos({
			user_id:            user_id,
			type_categority:    'cursos',
			topic_id:           req.body.topic_id,
			//texto_material_id:  req.body.texto_material_id,
			texto_marcado:      req.body.texto_marcado,
			color:              'amarillo',
			have_comment:       false
		})

		console.log(req.body.texto_marcado)

		notas_texto.save(function (err) {
			if(err) {
				return console.log('Error al guardar texto marcado : ' + err)
			}
			console.log('Texto marcado guardado!!')
			console.log(notas_texto)

			console.log(notas_texto)
			res.status(200).json({
				status: 'ok',
				message: 'Texto marcado guardado exitosamente',
				nota: notas_texto
			})
		})

	} else {
		
		res.redirect('/login')

	}
})

// CREATE nota-comment: comment. verde
app.post('/cursos/:topic_id/notas-textos-comentario', isLoggedIn, function (req, res) {
	if(req.user) {

		var user_id = JSON.stringify(req.user._id)
		user_id = JSON.parse(user_id)

		var type_categority = req.params.type_categority

		var notas_texto_marcado = new Notas_textos({
			user_id:            user_id,
			type_categority:    'cursos',
			topic_id:           req.body.topic_id,
			//texto_material_id:  req.body.texto_material_id,
			texto_marcado:      req.body.texto_marcado,
			color:              'verde',
			have_comment:       true
		})

		notas_texto_marcado.save(function (err) {
			if(err) {
				return console.log('Error al guardar texto marcado : ' + err)
			}
			console.log('Texto marcado guardado!!')
			
			var notas_texto_comentado = new Notas_comentarios({
				user_id:            user_id,
				type_categority:    'cursos',
				topic_id:           notas_texto_marcado.topic_id,
				texto_material_id:  notas_texto_marcado.texto_material_id,
				nota_texto_id:      notas_texto_marcado._id,  // id de nota de texto marcada
				content_comment:    req.body.content_comment
			})

			notas_texto_comentado.save(function (err) {
				if(err) {
					return console.log('Error al guardar notas de texto comentado: ' + err)
				}

				var RTime = new Date(notas_texto_marcado.fecha_creacion)
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

				var new_nota = {
					_id: 				notas_texto_marcado._id,
					user_id:            notas_texto_marcado.user_id,
					type_categority:    notas_texto_marcado.type_categority,
					topic_id:           notas_texto_marcado.topic_id,
					texto_material_id:  notas_texto_marcado.texto_material_id,
					texto_marcado:      notas_texto_marcado.texto_marcado,
					color:              notas_texto_marcado.color,
					have_comment:       notas_texto_marcado.have_comment,
					fecha_creacion:     date_template,
					data_comment: {
						_id: 				notas_texto_comentado._id,
						user_id:            notas_texto_comentado.user_id,
						type_categority:    notas_texto_comentado.type_categority,
						topic_id:           notas_texto_comentado.topic_id,
						texto_material_id:  notas_texto_comentado.texto_material_id,
						nota_texto_id:      notas_texto_comentado.nota_texto_id,
						content_comment:    notas_texto_comentado.content_comment,
						fecha_creacion:     date_template
					}
				}

				console.log('Texto marcado con comentario guardado!!!')

				res.status(200).json({
					status: 'ok',
					message: 'Texto marcado guardado exitosamente',
					nota: new_nota
				})

			})

		})

	} else {
		res.redirect('/login')
	}
}) 


// READ: Lectura de todas las notas-textos marcados. Para lista o meter en el documento
app.get('/cursos/:topic_id/notas-textos-marcado', isLoggedIn, function (req, res) {
	if(req.user){
		var user_id = JSON.stringify(req.user._id)
		user_id = JSON.parse(user_id)
		var topic_id = req.params.topic_id

		// Buscando notas marcadas por curso y material texto consultado
		Notas_textos.find(function(err, notas_marcadas) {
			if(err)  {
				return console.log('Error al encontrar notas marcadas: ' + err)
			}
			
			var notas_collections = []

			// Recorriendo las notas y filtrando resultados
			for(var i = 0; i <= notas_marcadas.length - 1; i++) {
				var element = notas_marcadas[i]

				// Filtrando notas por id de texto material
				if( element.user_id === user_id &&
					element.type_categority === 'cursos' &&
					element.topic_id === topic_id ) {
					// Almacenando notas que coinciden
					notas_collections.push(element)
				}
			}

			console.log('Notas Todas')
			console.log(notas_collections)

			Cursos.findById({'_id': topic_id}, function (err, curso) {
				if(err) {
					return console.log('Error al encontrar datosdel curso: ' + err)
				}

				var new_notas_collection = []

				for(var d = 0; d <= notas_collections.length - 1; d++) {
					var element = notas_collections[d]
					console.log('Position: ' + d)
					console.log(element)

					var RTime = new Date(element.fecha_creacion)
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
					  _id:                element._id,
					  user_id:            element.user_id,
					  type_categority:    element.type_categority,
					  topic_id:           element.topic_id,
					  texto_marcado:      element.texto_marcado,
					  color:              element.color,
					  have_comment:       element.have_comment,
					  fecha_creacion:     date_template
					} 

					new_notas_collection[d] = new_resenia

				}

				console.log('NOTAS')
				console.log(new_notas_collection)

				// res.render('./plataforma/cursos_diplomados/cursos/textos/texto-item/notas/index.jade', {
				// 	user: req.user,
				// 	curso: curso,
				// 	notas: new_notas_collection
				// })

				res.status(200).json({
					user: req.user,
					curso: curso,
					notas: new_notas_collection
				})

			})

		})

	} else {
		res.redirect('/login')
	}
})


// READ: Texto marcado por id individual. Texto marcado amarillo o texto marcado con comentario
app.get('/curso/:topic_id/notas-textos-marcado/:texto_marcado_id', isLoggedIn, function (req, res) {
	if(req.user) {

		var texto_marcado_id = req.params.texto_marcado_id
		var topic_id = req.params.topic_id
		var user_id = JSON.stringify(req.user._id)
		user_id = JSON.parse(user_id)

		Notas_textos.findById({'_id': texto_marcado_id}, function (err, nota_texto) {
			if(err) {
				return console.log('Error al encontrar nota de texto marcado')
			}

			// confirmando que la nota es propia del usuario
			if(nota_texto.user_id === user_id &&
			   nota_texto.topic_id === topic_id ) {

				console.log('Resultado de nota de texto')

				console.log('Nota texto marcado individual')

				// Validando si es solo texto marcado o si es texto marcado con comentario
				if(nota_texto.have_comment === true) {
					// Enviando data de comentario
					Notas_comentarios.findOne({'nota_texto_id': nota_texto._id}, function (err, nota_with_comment) {
						if(err) {
							return console.log('Error al encontrar comentario del texto marcado: ' + err)
						}
						console.log('Nota con comentario encontrado')
						console.log(nota_with_comment)

						var RTime = new Date(nota_texto.fecha_creacion)
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

						// Armandao nuevo objeto con todo 
						var new_nota = {
							_id:                nota_texto._id,
							user_id:            nota_texto.user_id,
							type_categority:    nota_texto.type_categority,
							topic_id:           nota_texto.topic_id,
							texto_material_id:  nota_texto.texto_material_id,
							texto_marcado:      nota_texto.texto_marcado,
							color:              nota_texto.color,
							have_comment:       nota_texto.have_comment,
							fecha_creacion:     date_template,
							data_comment: {
								_id: 				nota_with_comment._id,
								user_id:            nota_with_comment.user_id,
								type_categority:    nota_with_comment.type_categority,
								topic_id:           nota_with_comment.topic_id,
								texto_material_id:  nota_with_comment.texto_material_id,
								nota_texto_id:      nota_with_comment.nota_texto_id,
								content_comment:    nota_with_comment.content_comment,
								fecha_creacion:     date_template
							}
						}

						Cursos.findById({'_id': topic_id}, function (err, curso) {
							if(err) {
								return console.log('Error al encontrar datosdel curso: ' + err)
							}
							
							res.status(200).json({
								status: 'ok',
								curso: curso,
								nota: new_nota
						    })

						})

					})

				} else if (nota_texto.have_comment === false) {
					// Enviado data comun
					// Armandao nuevo objeto con todo 

					var RTime = new Date(nota_texto.fecha_creacion)
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

					var new_nota = {
						_id: 				nota_texto._id,
						user_id:            nota_texto.user_id,
						type_categority:    nota_texto.type_categority,
						topic_id:           nota_texto.topic_id,
						texto_material_id:  nota_texto.texto_material_id,
						texto_marcado:      nota_texto.texto_marcado,
						color:              nota_texto.color,
						have_comment:       nota_texto.have_comment,
						fecha_creacion:     date_template
					}

					Cursos.findById({'_id': topic_id}, function (err, curso) {
						if(err) {
							return console.log('Error al encontrar datosdel curso: ' + err)
						}
						
						res.status(200).json({
							status: 'ok',
							curso: curso,
							nota: new_nota
					    })

					})


				} else {
					// Si es que no hay 

					var RTime = new Date(nota_texto.fecha_creacion)
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

					console.log('Error al obtener resultados')
					var new_nota = {
						_id: 				nota_texto._id,
						user_id:            nota_texto.user_id,
						type_categority:    nota_texto.type_categority,
						topic_id:           nota_texto.topic_id,
						texto_material_id:  nota_texto.texto_material_id,
						texto_marcado:      nota_texto.texto_marcado,
						color:              nota_texto.color,
						have_comment:       nota_texto.have_comment,
						fecha_creacion:     date_template
					}

					Cursos.findById({'_id': topic_id}, function (err, curso) {
						if(err) {
							return console.log('Error al encontrar datosdel curso: ' + err)
						}
						
						res.status(200).json({
							status: 'ok',
							curso: curso,
							nota: new_nota
					    })

					})

				}

			}

		})

	} else {
		res.redirect('/login')
	}
})

// DELETE: Texto marcado amarillo
app.delete('/curso/:topic_id/notas-textos-marcado/:texto_marcado_id/delete', isLoggedIn, function (req, res) {
	if(req.user) {
		var texto_marcado_id = req.params.texto_marcado_id

		Notas_textos.remove({'_id': texto_marcado_id}, function (err) {
			if(err) {
				return console.log('Error al eliminar nota marcada de amarillo: ' + err)
			}
			console.log('Nota marcada de amarillo eliminada')
			res.status(200).json({
				status: 'ok',
				message: 'Nota marcada de amarillo eliminada'
			})
		})

	} else {
		res.redirect('/login')
	}
})

// DELETE: Texto marcado con comentario
app.delete('/curso/:topic_id/notas-textos-comentario/:texto_marcado_id/delete', isLoggedIn, function (req, res) {
	if(req.user) {
		var texto_marcado_id = req.params.texto_marcado_id

		Notas_comentarios.remove({'_id': texto_marcado_id}, function (err) {
			if(err) {
				return console.log('Error al eliminar nota marcada de amarillo: ' + err)
			}
			console.log('Nota marcada verde, con comentario eliminada')
			res.status(200).json({
				status: 'ok',
				message: 'Nota marcada de verde eliminada'
			})
		})

	} else {
		res.redirect('/login')
	}
})

// PUT: Texto marcado de verde. Editar
app.put('/curso/:topic_id/notas-textos-comentario/:texto_marcado_id', isLoggedIn, function (req, res) {
	if(req.user) {
		var texto_marcado_id = req.params.texto_marcado_id

		var data = {
			content_comment:    req.body.content_comment
		}

		Notas_comentarios.update({'_id': texto_marcado_id}, data, function (err) {
			if(err) {
				return	res.send('Error al actualizar, porfavor contactanos para ayudarte!! ' + err)
			}

			Notas_comentarios.findById({'_id': texto_marcado_id}, function (err, new_nota_update) {
				if(err) {
					return console.log('Error al encontrar la nota buscada en la base de datos: ' + err)
				}

				console.log('Datos de nota, actualizada!')
				console.log(new_nota_update)

				res.status(200).json({
					status: 'ok',
					message: 'Nota marcada de verde actualizada',
					nota: new_nota_update
				})
			})

		})

	} else {
		res.redirect('/login')
	}
})

// Render - Edit
app.post('/curso/:topic_id/notas-textos-marcado/:texto_marcado_id/edit', isLoggedIn, function (req, res) {
	if(req.user) {

		var texto_marcado_id = req.params.texto_marcado_id
		var topic_id = req.params.topic_id
		var user_id = JSON.stringify(req.user._id)
		user_id = JSON.parse(user_id)

		Notas_textos.findById({'_id': texto_marcado_id}, function (err, nota_texto) {
			if(err) {
				return console.log('Error al encontrar nota de texto marcado')
			}

			// confirmando que la nota es propia del usuario
			if(nota_texto.user_id === user_id &&
			   nota_texto.topic_id === topic_id ) {

				console.log('Resultado de nota de texto')

				console.log('Nota texto marcado individual')

				// Validando si es solo texto marcado o si es texto marcado con comentario
				if(nota_texto.have_comment === true) {
					// Enviando data de comentario
					Notas_comentarios.findOne({'nota_texto_id': nota_texto._id}, function (err, nota_with_comment) {
						if(err) {
							return console.log('Error al encontrar comentario del texto marcado: ' + err)
						}
						console.log('Nota con comentario encontrado')
						console.log(nota_with_comment)

						var RTime = new Date(nota_texto.fecha_creacion)
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


						// Armandao nuevo objeto con todo 
						var new_nota = {
							_id:                nota_texto._id,
							user_id:            nota_texto.user_id,
							type_categority:    nota_texto.type_categority,
							topic_id:           nota_texto.topic_id,
							texto_material_id:  nota_texto.texto_material_id,
							texto_marcado:      nota_texto.texto_marcado,
							color:              nota_texto.color,
							have_comment:       nota_texto.have_comment,
							fecha_creacion:     date_template,
							data_comment: {
								_id: 				nota_with_comment._id, 
								user_id:            nota_with_comment.user_id,
								type_categority:    nota_with_comment.type_categority,
								topic_id:           nota_with_comment.topic_id,
								texto_material_id:  nota_with_comment.texto_material_id,
								nota_texto_id:      nota_with_comment.nota_texto_id,
								content_comment:    nota_with_comment.content_comment,
								fecha_creacion:     date_template
							}
						}

						Cursos.findById({'_id': topic_id}, function (err, curso) {
							if(err) {
								return console.log('Error al encontrar datosdel curso: ' + err)
							}
							
							//res.render('./plataforma/cursos_diplomados/cursos/textos/texto-item/notas/edit/index.jade', {
							//	status: 'ok',
							//	user: req.user,
							//	curso: curso,
							//	nota: new_nota
							//})

							res.status(200).json({
								status: 'ok',
							    user: req.user,
								curso: curso,
								nota: new_nota
						    })

						})

					})

				} else if (nota_texto.have_comment === false) {
					// Enviado data comun
					// Armandao nuevo objeto con todo 

					var RTime = new Date(nota_texto.fecha_creacion)
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

					var new_nota = {
						_id:                nota_texto._id,
						user_id:            nota_texto.user_id,
						type_categority:    nota_texto.type_categority,
						topic_id:           nota_texto.topic_id,
						texto_material_id:  nota_texto.texto_material_id,
						texto_marcado:      nota_texto.texto_marcado,
						color:              nota_texto.color,
						have_comment:       nota_texto.have_comment,
						fecha_creacion:     date_template
					}

					Cursos.findById({'_id': topic_id}, function (err, curso) {
						if(err) {
							return console.log('Error al encontrar datosdel curso: ' + err)
						}
						
						//res.render('./plataforma/cursos_diplomados/cursos/textos/texto-item/notas/edit/index.jade', {
						//	status: 'ok',
						//	user: req.user,
						//	curso: curso,
						//	nota: new_nota
						//})

						res.status(200).json({
							status: 'ok',
						    user: req.user,
							curso: curso,
							nota: new_nota
					    })

					})


				} else {
					// Si es que no hay 

					var RTime = new Date(nota_texto.fecha_creacion)
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

					console.log('Error al obtener resultados')
					var new_nota = {
						_id:                nota_texto._id,
						user_id:            nota_texto.user_id,
						type_categority:    nota_texto.type_categority,
						topic_id:           nota_texto.topic_id,
						texto_material_id:  nota_texto.texto_material_id,
						texto_marcado:      nota_texto.texto_marcado,
						color:              nota_texto.color,
						have_comment:       nota_texto.have_comment,
						fecha_creacion:     date_template
					}

					Cursos.findById({'_id': topic_id}, function (err, curso) {
						if(err) {
							return console.log('Error al encontrar datosdel curso: ' + err)
						}

						//res.render('./plataforma/cursos_diplomados/cursos/textos/texto-item/notas/edit/index.jade', {
						//	status: 'ok',
						//	curso: curso,
						//	user: req.user,
						//	nota: new_nota
						//})

						res.status(200).json({
							status: 'ok',
						    user: req.user,
							curso: curso,
							nota: new_nota
					    })

					})

				}

			}

		})


	} else {
		res.redirect('/login')
	}
})

module.exports = app

