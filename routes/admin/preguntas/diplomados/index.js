var express = require('express')
var app = express()

// Permiso de acceso para usuarios 
var config = require('../../../../config')
var permiso = config.typeUser.admin

var pregunta_categoria = config.pregunta.categoria
var pregunta_tipo = config.pregunta.tipos
var pregunta_dificultad = config.pregunta.dificultad

var Preguntas = require('../../../../models/preguntas')
var Diplomados = require('../../../../models/diplomados')

// DIPLOMADOS

// READ: de todas las preguntas sobre los diplomados
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
					return element.type_categority === pregunta_categoria.diplomado
				})

				res.render('./admin/dashboard/preguntas/diplomados', {
					user: req.user,
					preguntas: preguntas_cursos
				})

				// res.send({
				// 	user: req.user,
				// 	preguntas: preguntas_cursos
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


				// Orden para alternativas
				var other_answers_pregunta = pregunta.other_answers
				
				var other_answers = []

				for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
					var el = other_answers_pregunta[i]
					
					other_answers.push({orden: i, answer: el.answer })
					
				}

				if(pregunta.type_question == 'imagenes') {
			
					res.render('./admin/dashboard/preguntas/diplomados/detalles/question_images', {
						user: req.user,
						pregunta: pregunta,
						other_answers: other_answers
					})

					// res.send({
					// 	user: req.user, 
					// 	pregunta: pregunta, 
					// 	other_answers: other_answers
					// })
			
				} else {

					res.render('./admin/dashboard/preguntas/diplomados/detalles', {	
						user: req.user,
						pregunta: pregunta,
						other_answers: other_answers
					})

					// res.send({
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
			res.render('./admin/dashboard/preguntas/diplomados/create', {
				user: req.user
			})

			// res.send({
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
				type_categority: pregunta_categoria.diplomado || '',
				type_question: req.body.pregunta_tipos || '',
				topic_title: '',
				question: '',
				answer: { string: '' },
				difficulty: '',
				other_answers: [ 
					{ answer: '' },
					{ answer: '' },
					{ answer: '' }
				]
			})	

			data.save(function (err) {
				if(err) {
					return console.log('Error al guardar la pregunta')
				}

				var id = data._id

				// Buscando titulos en lista de cursos
				var diplomados_titles = []

				Diplomados.find(function (err, diplomados) {
					if(err) {
						return console.log('Error al encontrar datos de preguntas')
					}

					for (var i = diplomados.length - 1; i >= 0; i--) {
						var el = diplomados[i]
						diplomados_titles[i] = el.title
					}
					
					// Buscando la pregunta creada
					Preguntas.findById({'_id': id}, function (err, pregunta) {
						if(err) {
							return console.log('Error al encontrar pregunta buscada')
						}

						// Orden para alternativas
						var other_answers_pregunta = pregunta.other_answers
						
						var other_answers = []

						for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
							var el = other_answers_pregunta[i]
							
							other_answers.push({orden: i, answer: el.answer })
							
						}
						
						// Vista de update con los campos seleccionables
						res.render('./admin/dashboard/preguntas/diplomados/update', {
							user: req.user,
							diplomados_titles: diplomados_titles,
							pregunta: pregunta,
							other_answers: other_answers
						})

						// res.send({
						// 	user: req.user, 
						// 	diplomados_titles: diplomados_titles, 
						// 	pregunta: pregunta, 
						// 	other_answers: other_answers
						// })
						

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
			var diplomados_titles = []
			Diplomados.find(function (err, diplomados) {
				if(err) {
					return console.log('Error al encontrar datos de preguntas')
				}
				
				for (var i = diplomados.length - 1; i >= 0; i--) {
					var el = diplomados[i]
					diplomados_titles[i] = el.title
				}
				
				// Buscando la pregunta creada
				Preguntas.findById({'_id': id}, function (err, pregunta) {
					if(err) {
						return console.log('Error al encontrar pregunta buscada')
					}

					// Orden para alternativas
					var other_answers_pregunta = pregunta.other_answers
					
					var other_answers = []

					for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
						var el = other_answers_pregunta[i]
						
						other_answers.push({orden: i, answer: el.answer })
						
					}

					// Vista de update con los campos seleccionables
					res.render('./admin/dashboard/preguntas/diplomados/update', {
						user: req.user,
						diplomados_titles: diplomados_titles,
						pregunta: pregunta,
						other_answers: other_answers
					})

					// res.send({
					// 	user: req.user, 
					// 	diplomados_titles: diplomados_titles, 
					// 	pregunta: pregunta, 
					// 	other_answers: other_answers
					// })
					
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
					{ answer: req.body.answer2 || '' }
				]
			}

			if(req.body.hasOwnProperty('pregunta_tipos')) {
				console.log('tema de la pregunta sobre el curso/diplomado')
				data.topic_title = req.body.pregunta_tipos || ''
			}

			if(req.body.hasOwnProperty('difficulty')) {
				console.log('Dificultad de la pregunta')
				data.difficulty = req.body.difficulty || ''
			}

			Preguntas.findById({'_id': id}, function (err, curso) {
				if(err) {
					return console.log('Error al encontrar el curso como elemento: ' + err)
				}

				// Actualizando los nuevos datos
				Preguntas.update({'_id': id}, data, function (err) {
					if(err) {
						return res.send('Error al actualizar la pregunta: ' + err)
					}
					
					// Buscando titulos en lista de diplomados
					var diplomados_titles = []
					Diplomados.find(function (err, diplomados) {
						if(err) {
							return console.log('Error al encontrar datos de preguntas')
						}
						
						for (var i = diplomados.length - 1; i >= 0; i--) {
							var el = diplomados[i]
							diplomados_titles[i] = el.title
						}
						

						// Buscando la pregunta creada
						Preguntas.findById({'_id': id}, function (err, pregunta) {
							if(err) {
								return console.log('Error al encontrar pregunta buscada')
							}

							// Oden para alternativas
							var other_answers_pregunta = pregunta.other_answers
							
							var other_answers = []

							for (var i = 0 ; i <= other_answers_pregunta.length - 1; i++) {
								var el = other_answers_pregunta[i]
								
								other_answers.push({orden: i, answer: el.answer })
								
							}
							
							// Vista de update con los campos seleccionables
							res.render('./admin/dashboard/preguntas/diplomados/update', {
								user: req.user,
								diplomados_titles: diplomados_titles,
								pregunta: pregunta,
								other_answers: other_answers
							})


							// res.send({
							// 	user: req.user, 
							// 	diplomados_titles: diplomados_titles, 
							// 	pregunta: pregunta, 
							// 	other_answers: other_answers
							// })
							

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

				res.render('./admin/dashboard/preguntas/diplomados/delete', {
					user: req.user,
					pregunta: pregunta
				})

				// res.send({user: req.user, pregunta: pregunta})

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

						res.redirect('/plataforma/admin/preguntas/diplomados')
					
					})

				} else {

					res.render('./admin/dashboard/preguntas/diplomados/delete', {
						user: req.user,
						pregunta: pregunta,
						msg: 'Error al borrar: el campo no coincide'
					})

					// res.send({user: req.user, pregunta: pregunta, msg: 'Error al borrar: el campo no coincide'})
					
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
