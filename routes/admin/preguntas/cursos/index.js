var express = require('express')
var app = express()

// Permiso de acceso para usuarios 
var config = require('../../../../config')
var permiso = config.typeUser.admin

var pregunta_categoria = config.pregunta.categoria
var pregunta_tipo = config.pregunta.tipos
var pregunta_dificultad = config.pregunta.dificultad

var Preguntas = require('../../../../models/preguntas')
var Cursos = require('../../../../models/cursos')

// CURSOS

// READ: de todas las preguntas sobre los cursos
app.get('/', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			Preguntas.find(function (err, preguntas) {
				if(err) {
					return console.log('Error al encontrar preguntas: ' + err)
				}

				// Filtrando preguntas por cursos
				var preguntas_cursos = []

				preguntas_cursos = preguntas.filter(function (element) {
					return element.type_categority === pregunta_categoria.curso
				})

				// Calculando Candidad de Preguntas por categoria
				var total_preguntas = 0
				total_preguntas = preguntas_cursos.length
				
				res.render('./admin/dashboard/preguntas/cursos', {
					user: req.user,
					preguntas: preguntas_cursos,
					total_preguntas: total_preguntas
				})

				// res.status(200).json({
				// 	user: req.user,
				// 	preguntas: preguntas_cursos,
				// 	total_preguntas: total_preguntas
				// })

			})

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// Render pregunta por id

app.get('/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {
			
			var id = req.params.id

			Preguntas.findById({'_id': id}, function (err, pregunta) {
				if(err) {
					return console.log('Error al encontrar la preguntas por id: ' + err)
				}

				// Numeros de orden
				var other_answers_pregunta = pregunta.other_answers
				
				var other_answers = []

				for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
					var el = other_answers_pregunta[i]
					
					other_answers.push({orden: i, answer: el.answer })
					
				}

				if(pregunta.type_question == 'imagenes') {

					res.render('./admin/dashboard/preguntas/cursos/detalles/question_images', {
						user: req.user,
						pregunta: pregunta,
						other_answers: other_answers
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	pregunta: pregunta,
					// 	other_answers: other_answers
					// })
			
				} else {

					res.render('./admin/dashboard/preguntas/cursos/detalles', {
						user: req.user,
						pregunta: pregunta,
						other_answers: other_answers
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	pregunta: pregunta,
					// 	other_answers: other_answers
					// })		

				}

			})

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// Render: Form to select 
app.post('/new_question', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			// Render para Crear una pregunta y seleccionar: type_categority, type_question
			res.render('./admin/dashboard/preguntas/cursos/create', {
				user: req.user
			})

			// res.status(200).json({
			// 	user: req.user
			// })

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

//CREATE: Save data to send pregunta

app.post('/add', function (req, res) {
	if(req.user) {
		
		if(req.user.access === permiso) {

			var data = new Preguntas({
				order: '#',
				type_categority: pregunta_categoria.curso || '',
				type_question: req.body.pregunta_tipos || '',
				topic_title: '',
				topic_id: '',
				question: '',
				answer: { string: '' },
				difficulty: '',
				other_answers: [ 
					{answer: ''},
					{answer: ''},
					{answer: ''},
					{answer: ''}
				]
			})

			// Asignando un numero de orden para las preguntas
			var orden_ultima_pregunta = 0
			var orden_actual_pregunta = 0

			Preguntas.find(function (err, preguntas) {
				if(err) {
					return console.log('Error al obtener la preguntas')
				}
				// obteniendo 
				orden_ultima_pregunta = preguntas.length
				orden_actual_pregunta = orden_ultima_pregunta + 1
				data.order = '#' + orden_actual_pregunta

				data.save(function (err) {
					if(err) {
						return console.log('Error al guardar la pregunta')
					}

					var id = data._id

					// Buscando titulos en lista de cursos
					var cursos_data = []
					Cursos.find(function (err, cursos) {
						if(err) {
							return console.log('Error al encontrar datos de preguntas')
						}

						for (var i = cursos.length - 1; i >= 0; i--) {
							var el = cursos[i]
							var course_element = {
								curso_id: el._id,
								curso_title: el.title
							}
							 
							cursos_data[i] = course_element

						}
						
						// Buscando la pregunta creada
						Preguntas.findById({'_id': id}, function (err, pregunta) {
							if(err) {
								return console.log('Error al encontrar pregunta buscada')
							}

							// Numeros de orden
							var other_answers_pregunta = pregunta.other_answers
							
							var other_answers = []

							for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
								var el = other_answers_pregunta[i]
								
								other_answers.push({orden: i, answer: el.answer })
								
							}
							
							if(pregunta.type_question == pregunta_tipo.imagenes) {
								console.log('Esta pregunta es de campo imagen')
								// Vista de update con los campos seleccionables
								res.render('./admin/dashboard/preguntas/cursos/update/update_form_images', {
									user: req.user,
									cursos_datas: cursos_data,
									pregunta: pregunta,
									other_answers: other_answers
								})

								// res.status(200).json({
								// 	user: req.user,
								// 	cursos_datas: cursos_data,
								// 	pregunta: pregunta,
								// 	other_answers: other_answers
								// })

							} else {

								// Vista de update con los campos seleccionables
								res.render('./admin/dashboard/preguntas/cursos/update', {
									user: req.user,
									cursos_datas: cursos_data,
									pregunta: pregunta,
									other_answers: other_answers
								})

								// res.status(200).json({
								// 	user: req.user,
								// 	cursos_datas: cursos_data,
								// 	pregunta: pregunta,
								// 	other_answers: other_answers
								// })

								console.log(data)
							}
							


						})
									
					})

				})

			})

		} else {
			res.redirect('/plataforma')
		}
	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// UPDATE: Render form para actualizar la pregunta 
app.post('/update/:id', function (req, res) {
	if(req.user) {

		if(req.user.access === permiso) {
			var id = req.params.id

			// Buscando titulos en lista de cursos
			var cursos_data = []
			Cursos.find(function (err, cursos) {
				if(err) {
					return console.log('Error al encontrar datos de preguntas')
				}
				
				for (var i = cursos.length - 1; i >= 0; i--) {
					var el = cursos[i]
					var course_element = {
						curso_id: el._id,
						curso_title: el.title
					}
					 
					cursos_data[i] = course_element

				}

				console.log('Lista de cursos filtrados')
				console.log(cursos_data)
				
				// Buscando la pregunta creada
				Preguntas.findById({'_id': id}, function (err, pregunta) {
					if(err) {
						return console.log('Error al encontrar pregunta buscada')
					}

					// Numeros de orden
					var other_answers_pregunta = pregunta.other_answers
					
					var other_answers = []

					for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
						var el = other_answers_pregunta[i]
						
						other_answers.push({orden: i, answer: el.answer })
						
					}
					
					if(pregunta.type_question == pregunta_tipo.imagenes) {
						console.log('Esta pregunta es de campo imagen')
						// Vista de update con los campos seleccionables
						res.render('./admin/dashboard/preguntas/cursos/update/update_form_images', {
							user: req.user,
							cursos_datas: cursos_data,
							pregunta: pregunta,
							other_answers: other_answers
						})

						// res.status(200).json({
						// 	user: req.user,
						// 	cursos_datas: cursos_data,
						// 	pregunta: pregunta,
						// 	other_answers: other_answers
						// })

					} else {

						// Vista de update con los campos seleccionables
						res.render('./admin/dashboard/preguntas/cursos/update', {
							user: req.user,
							cursos_datas: cursos_data,
							pregunta: pregunta,
							other_answers: other_answers
						})

						// res.status(200).json({
						// 	user: req.user,
						// 	cursos_datas: cursos_data,
						// 	pregunta: pregunta,
						// 	other_answers: other_answers
						// })
						
					}

					
				})
							
			})

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.redirect('/plataforma/admin/login')
	}
})

// UPDATE: Api to save new changes of question find by id

app.put('/update/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			var data = {
				question: req.body.question || '' ,
				answer: { string: req.body.answer || '' },
				other_answers: [ 
					{ answer: req.body.answer0 || '' },
					{ answer: req.body.answer1 || '' },
					{ answer: req.body.answer2 || '' },
					{ answer: req.body.answer3 || '' }
				]
			}

			if(req.body.hasOwnProperty('pregunta_tipos')) {
				console.log('tema de la pregunta sobre el curso/diplomado')
				//data.topic_title = req.body.pregunta_tipos || ''
				data.topic_id = req.body.pregunta_tipos || ''
			}

			if(req.body.hasOwnProperty('difficulty')) {
				console.log('Dificultad de la pregunta')
				data.difficulty = req.body.difficulty || ''
			}

			Preguntas.findById({'_id': id}, function (err, pregunta) {
				if(err) {
					return console.log('Error al encontrar la pregunta: ' + err)
				}
				
				Cursos.findById({'_id': data.topic_id || pregunta.topic_id || '5759bd085afe790c1bf4098c'}, function (err, curso) {
					if(err) {
						return console.log('Error al encontrar el curso por id: ' + err)
					}
					data.topic_title = curso.title

					console.log('titulo selecionado: ' + curso.title)
					
					// Actualizando los nuevos datos
					Preguntas.update({'_id': id}, data, function (err) {
						if(err) {
							return res.send('Error al actualizar la pregunta: ' + err)
						}
						
						// Buscando titulos en lista de cursos
						var cursos_data = []

						Cursos.find(function (err, cursos) {
							if(err) {
								return console.log('Error al encontrar datos de preguntas')
							}
							
							for (var i = cursos.length - 1; i >= 0; i--) {
								var el = cursos[i]
								var course_element = {
									curso_id: el._id,
									curso_title: el.title
								}

								cursos_data[i] = course_element

							}

							console.log('Lista de cursos filtrados')
							console.log(cursos_data)

							// Buscando la pregunta creada
							Preguntas.findById({'_id': id}, function (err, pregunta) {
								if(err) {
									return console.log('Error al encontrar pregunta buscada')
								}

								// Numeros de orden
								var other_answers_pregunta = pregunta.other_answers
								
								var other_answers = []

								for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
									var el = other_answers_pregunta[i]
									
									other_answers.push({orden: i, answer: el.answer })
									
								}
								
								if(pregunta.type_question == pregunta_tipo.imagenes) {
									console.log('Esta pregunta es de campo imagen')
									// Vista de update con los campos seleccionables
									res.render('./admin/dashboard/preguntas/cursos/update/update_form_images', {
										user: req.user,
										cursos_datas: cursos_data,
										pregunta: pregunta,
										other_answers: other_answers
									})

									// res.status(200).json({
									// 	user: req.user,
									// 	cursos_datas: cursos_data,
									// 	pregunta: pregunta,
									// 	other_answers: other_answers
									// })

								} else {

									// Vista de update con los campos seleccionables
									res.render('./admin/dashboard/preguntas/cursos/update', {
										user: req.user,
										cursos_datas: cursos_data,
										pregunta: pregunta,
										other_answers: other_answers
									})

									// res.status(200).json({
									// 	user: req.user,
									// 	cursos_datas: cursos_data,
									// 	pregunta: pregunta,
									// 	other_answers: other_answers
									// })
									
								}
								
								console.log('Pregunta actualizado: ' + pregunta)

							})
										
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

// DELETE: api to delete a question by id

app.post('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			Preguntas.findById({'_id': id}, function (err, pregunta) {
				if(err) {
					return console.log('Error al encontrar la pregunta por id: ' + err)
				}

				res.render('./admin/dashboard/preguntas/cursos/delete', {
					user: req.user,
					pregunta: pregunta
				})

				// res.status(200).json({
				// 	user: req.user,
				// 	pregunta: pregunta
				// })

			})

		} else {
			res.redirect('/plataforma')
		}

	} else {
		res.reditect('/plataforma/admin/login')
	}
})


app.delete('/delete/:id', function (req, res) {
	if(req.user) {
		if(req.user.access === permiso) {

			var id = req.params.id

			Preguntas.findById({'_id': id}, function (err, pregunta) {
				if(err) {
					return console.log('Error al encontrar la pregunta por id: ' + err)
				}

				if(req.body.confirm_question == pregunta.question) {

					Preguntas.remove({'_id': id}, function (err) {
						if(err) {
							return console.log('Error al borrar la pregunta: ' + err)
						}

						res.redirect('/plataforma/admin/preguntas/cursos')
					
					})

				} else {

					res.render('./admin/dashboard/preguntas/cursos/delete', {
						user: req.user,
						pregunta: pregunta,
						msg: 'Error al borrar: el campo no coincide'
					})

					// res.status(200).json({
					// 	user: req.user,
					// 	pregunta: pregunta,
					// 	msg: 'Error al borrar: el campo no coincide'
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

module.exports = app
