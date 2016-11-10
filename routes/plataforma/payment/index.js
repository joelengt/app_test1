var express = require('express')
var app = express.Router()

var config = require('../../../config')
var permiso = config.typeUser
var crypto  = require('crypto')

var Culqi = require('../../../controllers/culqi-api')
var Users = require('../../../models/usuarios')
var Culqi_sales = require('../../../models/culqi_users')
var Culqi_user_paid = require('../../../models/culqi_user_pay')

// Tipo de Servicio - Material de Acceso
var material = {
	textos: 'textos',
	audiolibros: 'audiolibros',
	simuladores: 'simuladores',
	premium: 'premium'
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/login')
}

//  Function upgrade user method put API
function Upgrade(user_id, res, type_service, cb) {
	// Upgrade en Users access to textos
	var data_user = {
		access: type_service
	}

	// Update con la data de acceso de nuevo usuario
	Users.update({'_id': user_id}, data_user, function (err, success) {
		if(err) {
			return cb(err)
		}
		if(success) {

			Users.findById({'_id': user_id}, function (err, user) {
				if(err) {
					return cb(err)
				}

				if(user) {
					
					var usuario_access = '' 
					usuario_access = user.access

					cb(err, usuario_access, function data(result) {
						console.log('Ejecutando el renderde vista data')
						
						//return res.render('./plataforma/cursos_diplomados/cursos/payment/success', {
						//  user: user,
						//	service_access: result.service_access,
						//	process_messages: result.process_messages
						//})

						return res.status(200).json({
							user: user,
							service_access: result.service_access,
							process_messages: result.process_messages
						})
					
					})

				}
				
			})
			
		}

	})

}

// ---Util ---

function base64URLSafetoBytes (base64) {
	base64 += Array(5 - base64.length % 4).join('=');
	base64 = base64.replace(/\-/g, '+').replace(/\_/g, '/');
	return new Buffer(base64, 'base64');
}

function descifrar_now (str, llave_comercio_now) {
	var buf1, buf2, cipher, iv
	str = base64URLSafetoBytes(str)
  	var iv = str.slice(0, 16)
  	str = str.slice(16)
  	cipher = crypto.createDecipheriv('aes-256-cbc', base64URLSafetoBytes(llave_comercio_now), iv)
  	cipher.setAutoPadding(true)
  	buf1 = cipher.update(str)
  	buf2 = cipher.final()
  	return Buffer.concat([buf1, buf2])
}

// API POST: crear venta , agregar a intencion de compra, agregar al carrito
app.post('/:user_id/:type_service', isLoggedIn, function (req, res) {
	if(req.user) {
		var user_id = req.params.user_id
		var type_service = req.params.type_service

		// Validando el tipo de servicio
		if(type_service === material.audiolibros ||
		   type_service === material.simuladores ||
		   type_service === material.premium) {

				// Obteniendo datos de usuario
			Users.findById({"_id": user_id}, function (err, usuario_find) {
				if(err) {
					return console.log('Error al encontrar al usuario en la base de datos: ' + err)
				}

				var date_service = {}

				// Agregando data al tipo de servicio la creación de la venta
				if(type_service === material.audiolibros) {
					date_service = {
						type_service: material.audiolibros,
						price: 10.00,
						description: 'Servicio de Audiolibros'
					}

				} else if(type_service === material.simuladores) {
					date_service = {
						type_service: material.simuladores,
						price: 10.00,
						description: 'Servicio de Simuladores'
					}

				} else if(type_service === material.premium) {
					date_service = {
						type_service: material.premium,
						price: 15.00,
						description: 'Servicio Premiun'
					}

				} else {
					console.log('Error el tipo de servicio enviado No coincide')
				}

				// Intregrando culqi
				//Culqi.INTEGRACION = 'https://integ-pago.culqi.com'
				//Culqi.PRODUCCION  = 'https://pago.culqi.com'

				//  Creando el objeto reutilizable,
				//	Los parámetros son (codigo_comercio, llave_comercio, ambiente (Culqi.PRODUCCION o Culqi.INTEGRACION))
				var culqi = new Culqi(config.culqi.code_comercio, config.culqi.key_api, Culqi.PRODUCCION)

				// LLamamos los metodos (.crear, .anular o .consultar) con los parámetros indicados en la documentación de culqi.
				culqi.crear({
				    numero_pedido: String('NRAS000' + Date.now()), // *** Debe ser unico por cada venta, generar una por venta
				    moneda: 	   'PEN',   // venta para peru, queda como tal
				    monto: 		   date_service.price,      // ** con punto, la libreria lo convierte a como culqi lo require
				    descripcion:   date_service.type_service,         // ** description del tipo de producto
				    correo_electronico: usuario_find.email, // email del cliente
				    cod_pais: 'PE',   // codigo de pais del cliente
				    ciudad:    usuario_find.lugar,      // ciudad del cliente
				    direccion: usuario_find.address,    // direccion del cliente
				    num_tel:   usuario_find.phone,      // numero de telefono del cliente
				    id_usuario_comercio: user_id,       // id del usuario en mi plataforma
				    nombres:   usuario_find.first_name, // nombre del usuario
				    apellidos: usuario_find.last_name   // apellidos del usuario

				}, function (err, resultado) {
					if(err) {
						return console.log('Error al crear venta: ' + err)
					}

					console.log('Venta CREADA')
				    console.log(resultado)

				    // Guardar datos de venta por el usuario en DB
				    var new_culqi_sales = new Culqi_sales({
				    	user_data: {
				    		id: usuario_find._id,
				    		service: date_service.type_service
				    	},
				    	culqi_response: resultado
				    })

				    // Almacenando usuario con intencion de compra en la base de datos
				    new_culqi_sales.save(function (err) {
				    	if(err) {
				    		console.log('Error al guardar al usuario con intencion de compra: ' + err)
				    	}
				    })

				    console.log('Datos del usuario comprador y el servicio')

				    console.log(new_culqi_sales.user_data)

				    var resultado_now = {}

			    	// Si el resultado fue venta_registrada
				    if(resultado.codigo_respuesta === 'venta_registrada') {
					    resultado_now = {
					    	ticket: resultado.ticket,
					    	numero_pedido: resultado.numero_pedido,
					    	codigo_comercio: resultado.codigo_comercio,
					    	informacion_venta: resultado.informacion_venta
					    }

					    // Enviar resultados to client
					    res.status(200).json({
					    	status: resultado.codigo_respuesta,
					    	message: resultado.mensaje_respuesta,
					    	data: resultado_now,
					    	help: 'venta registrada exitosamente, porfavor llene los campo de su tarjeta credito o debito para acceder al servicio'
					    })
			    	
			    	// Si el resultado fue comercio_invalido
				    } else if (resultado.codigo_respuesta === 'comercio_invalido') {
				    	resultado_now = {
					    	ticket: resultado.ticket,
					    	numero_pedido: resultado.numero_pedido
					    }

				    	// Enviar resultados to client
					    res.status(200).json({
					    	status: resultado.codigo_respuesta,
					    	message: resultado.mensaje_respuesta,
					    	data: resultado_now,
					    	help: 'el codigo de comercio, es invalido para esta venta, intente recargar el navegador o contactanos para ayudarte'
					    })

			    	// Si el resultado fue parametro_invalido
				    } else if (resultado.codigo_respuesta === 'parametro_invalido') {
				    	resultado_now = {
					    	ticket: resultado.ticket,
					    	numero_pedido: resultado.numero_pedido
					    }

				    	// Enviar resultados to client
					    res.status(200).json({
					    	status: resultado.codigo_respuesta,
					    	message: resultado.mensaje_respuesta,
					    	data: resultado_now,
					    	help: 'Por tu seguridad, necesitas llenar los campos de información en tu perfil: ciudad, telefono, email, dirección.'
					    })

			    	// Si el resultado fue error_procesamiento
				    } else if (resultado.codigo_respuesta === 'error_procesamiento') {
				    	resultado_now = {
					    	ticket: resultado.ticket,
					    	numero_pedido: resultado.numero_pedido
					    }

				    	// Enviar resultados to client
					    res.status(200).json({
					    	status: resultado.codigo_respuesta,
					    	message: resultado.mensaje_respuesta,
					    	data: resultado_now,
					    	help: 'error de procesamiento, algo no esta bien, contactanos para ayudarte'
					    })

			    	// Si el resultado fue venta_registrada
				    } else {
				    	// Enviar resultados to client
					    res.status(200).json({
					    	status: 'fail server, venta no registrada',
					    	message: 'Error del servidor, mensaje desconocido, sin respuesta'
					    })
				    }

				})


			})

		} else {
			console.log('Error el tipo de servicio enviado No se encuentra registrado: ' + type_service)

			res.status(200).json({
				status: 'Error: el tipo de servicio enviado No se encuentra registrado: ' + type_service
			})
		
		}
		
	} else {
		res.redirect('/login')
	}
})

// API update Access: UPGRADE - Textos 
app.put('/check/:user_id/:type_service', isLoggedIn, function (req, res) {

	var user_id = req.params.user_id
	var type_service = req.params.type_service

	console.log('Respuesta de culqi - sobre el pago, llego al server')
	
	// Obteniendo la data del usuario
	var culqi_answer_about_sale = { 
		resultado: req.body.respuesta
	}
	
	console.log('Repuesta de culqi - JSON')
	console.log(culqi_answer_about_sale.resultado)

	if(culqi_answer_about_sale.resultado === 'checkout_cerrado') {
		res.status(200).json({
			status: 'La caja de pago fue cerrada.',
			process_messages: 'check_not_pass',
			service_access: type_service
		})

	} else if (culqi_answer_about_sale.resultado === 'parametro_invalido') {
		res.status(200).json({
			status: 'Los parametros ingresados son invalidos, Ingrese los campos correctamente.',
			process_messages: 'check_not_pass',
			service_access: type_service
		})
	} else if (culqi_answer_about_sale.resultado === 'venta_expirada') {
		res.status(200).json({
			status: 'Tiempo limite concluido, Venta expirada.',
			process_messages: 'check_not_pass',
			service_access: type_service
		})
	} else if (culqi_answer_about_sale.resultado === 'error') {
		res.status(200).json({
			status: 'Error en el envio de datos de la caja.',
			process_messages: 'check_not_pass',
			service_access: type_service
		})
	} else {
		// Decodificar encryting about message culqi payment
		var sale_descifrado = JSON.parse(descifrar_now(culqi_answer_about_sale.resultado, config.culqi.key_api).toString('utf8'))

		console.log('Respuesta de culqi Descifrado!!!!!!!!!')
		console.log(sale_descifrado)

		// Creando nuevo usuario, con info de tarjeta
		var new_Culqi_user_paid = new Culqi_user_paid(sale_descifrado)
		
		// Almacenando nuevo usuario en proceso de pago - para hacer consultar por ticket de usuario y ver su proceso en culqi y en la base de datos
		new_Culqi_user_paid.save(function (err) {
			if(err) {
				console.log('Error en almacenar datos de proceso de venta del usuario en la DB : ' + err)
			}
		})

		// Validar la respuesta antes de enviar al cliente
		if(sale_descifrado.codigo_respuesta === 'venta_exitosa') {
			// Evento upgrade de usuario
			console.log(sale_descifrado.codigo_respuesta)

			Users.findById({"_id": user_id}, function (err, user) {
				if(err) {
					return console.log(" Error al encontrar usuario: " + err)		
				}

				// Acceso de de undefinedsuario
				var user_access = user.access

				console.log('El servicio para subir es: ' + type_service)
				console.log('Data de user access ANTES DE ENTRAR : ' + user_access)

				// Validando tipo de servicio
				if (type_service === material.audiolibros) {

					// Validando acceso Premiun si ya tiene un acceso anterior
					if(user_access === permiso.acceso_simulador) {
						// Upgrade user to premium access have other service
						Upgrade(user_id, res, permiso.premium, function (err, usuario_access, data) {
							if(err) {
								return console.log('Error al actualizar usuario: ' + err)
							}

							console.log('Usuario Actualizado de: ' + user_access + ' a ' + usuario_access)
							console.log('Ventanna de Felicidades: nuevo upgrade : ' + usuario_access)
							
							var result_upgrade = {
								service_access: 'Premium',
								process_messages: {
									numero_pedido: sale_descifrado.numero_pedido,
									ticket: sale_descifrado.ticket,
									mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
									mensaje_respuesta: sale_descifrado.mensaje_respuesta,
									codigo_respuesta: sale_descifrado.codigo_respuesta
								}
							}

							data(result_upgrade)

						})

					} else {
						// Upgrade user to audioLibros if first payment us a service
						Upgrade(user_id, res, permiso.acceso_audiolibros, function (err, usuario_access, data) {
							if(err) {
								return console.log('Error al actualizar usuario: ' + err)
							}

							console.log('Usuario Actualizado de: ' + user_access + ' a ' + usuario_access)
							console.log('Ventanna de Felicidades: nuevo upgrade : ' + usuario_access)
							
							var result_upgrade = {
								service_access: 'Audiolibros',
								process_messages: {
									numero_pedido: sale_descifrado.numero_pedido,
									ticket: sale_descifrado.ticket,
									mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
									mensaje_respuesta: sale_descifrado.mensaje_respuesta,
									codigo_respuesta: sale_descifrado.codigo_respuesta
								}
							}

							data(result_upgrade)
							
						})
								
					}

				} else if (type_service === material.simuladores) {

					// Validando acceso Premiun si ya tiene un acceso anterior
					if(user_access === permiso.acceso_audiolibros) {
						// Upgrade user to premium access have other service
						Upgrade(user_id, res, permiso.premium, function (err, usuario_access, data) {
							if(err) {
								return console.log('Error al actualizar usuario: ' + err)
							}

							console.log('Usuario Actualizado de: ' + user_access + ' a ' + usuario_access)
							console.log('Ventanna de Felicidades: nuevo upgrade : ' + usuario_access)
							
							var result_upgrade = {
								service_access: 'Premium',
								process_messages: {
									numero_pedido: sale_descifrado.numero_pedido,
									ticket: sale_descifrado.ticket,
									mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
									mensaje_respuesta: sale_descifrado.mensaje_respuesta,
									codigo_respuesta: sale_descifrado.codigo_respuesta
								}
							}

							data(result_upgrade)
							
						})

					} else {
						// Upgrade user to simulador if first payment us a service
						Upgrade(user_id, res, permiso.acceso_simulador, function (err, usuario_access, data) {
							if(err) {
								return console.log('Error al actualizar usuario: ' + err)
							}

							console.log('Usuario Actualizado de: ' + user_access + ' a ' + usuario_access)
							console.log('Ventanna de Felicidades: nuevo upgrade : ' + usuario_access)
							
							var result_upgrade = {
								service_access: 'Simuladores',
								process_messages: {
									numero_pedido: sale_descifrado.numero_pedido,
									ticket: sale_descifrado.ticket,
									mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
									mensaje_respuesta: sale_descifrado.mensaje_respuesta,
									codigo_respuesta: sale_descifrado.codigo_respuesta
								}
							}

							data(result_upgrade)

						})
					}

				} else if (type_service === material.premium) {
					// Upgrade user to premium
					Upgrade(user_id, res, permiso.premium, function (err, usuario_access, data) {
						if(err) {
							return console.log('Error al actualizar usuario: ' + err)
						}

						console.log('Usuario Actualizado de: ' + user_access + ' a ' + usuario_access)
						console.log('Ventanna de Felicidades: nuevo upgrade : ' + usuario_access)
						
						var result_upgrade = {
							service_access: 'Premium',
							process_messages: {
								numero_pedido: sale_descifrado.numero_pedido,
								ticket: sale_descifrado.ticket,
								mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
								mensaje_respuesta: sale_descifrado.mensaje_respuesta,
								codigo_respuesta: sale_descifrado.codigo_respuesta
							}
						}

						data(result_upgrade)

					})

				} else {
					console.log('Error el tipo de usuario para Upgrade no coincide')
				}
					
			})

		} else if(sale_descifrado.codigo_respuesta === 'venta_expirada') {
			console.log(sale_descifrado.codigo_respuesta)

			Users.findById({"_id": user_id}, function (err, user) {
				if(err) {
					return console.log(" Error al encontrar usuario: " + err)		
				}
			
				// Venta expirada
				res.status(200).json({
					user: user,
					service_access: type_service,
					process_messages: {
						numero_pedido: sale_descifrado.numero_pedido,
						ticket: sale_descifrado.ticket,
						mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
						mensaje_respuesta: sale_descifrado.mensaje_respuesta,
						codigo_respuesta: sale_descifrado.codigo_respuesta
					}
				})
			})

		} else if(sale_descifrado.codigo_respuesta === 'error') {
			console.log(sale_descifrado.codigo_respuesta)
			
			Users.findById({"_id": user_id}, function (err, user) {
				if(err) {
					return console.log(" Error al encontrar usuario: " + err)		
				}

				// error
				res.status(200).json({
					user: user,
					service_access: type_service,
					process_messages: {
						numero_pedido: sale_descifrado.numero_pedido,
						ticket: sale_descifrado.ticket,
						mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
						mensaje_respuesta: sale_descifrado.mensaje_respuesta,
						codigo_respuesta: sale_descifrado.codigo_respuesta
					}
				})		
			})

		} else if(sale_descifrado.codigo_respuesta === 'parametro_invalido') {
			console.log(sale_descifrado.codigo_respuesta)
			
			Users.findById({"_id": user_id}, function (err, user) {
				if(err) {
					return console.log(" Error al encontrar usuario: " + err)		
				}

				// parametro invalido
				res.status(200).json({
					user: user,
					service_access: type_service,
					process_messages: {
						numero_pedido: sale_descifrado.numero_pedido,
						ticket: sale_descifrado.ticket,
						mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
						mensaje_respuesta: sale_descifrado.mensaje_respuesta,
						codigo_respuesta: sale_descifrado.codigo_respuesta
					}
				})
			})
			
		} else if(sale_descifrado.codigo_respuesta === 'error_procesamiento') {
			console.log(sale_descifrado.codigo_respuesta)
			
			Users.findById({"_id": user_id}, function (err, user) {
				if(err) {
					return console.log(" Error al encontrar usuario: " + err)		
				}

				// parametro invalido
				res.status(200).json({
					user: user,
					service_access: type_service,
					process_messages: {
						numero_pedido: sale_descifrado.numero_pedido,
						ticket: sale_descifrado.ticket,
						mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
						mensaje_respuesta: sale_descifrado.mensaje_respuesta,
						codigo_respuesta: sale_descifrado.codigo_respuesta
					}
				})
			})
			
		} else {
	        Users.findById({"_id": user_id}, function (err, user) {
	        	if(err) {
	        		return console.log(" Error al encontrar usuario: " + err)		
	        	}
	        	
				// No se recibio respuesta
		        res.status(200).json({
					user: user,
					service_access: type_service,
					process_messages: {
						numero_pedido: sale_descifrado.numero_pedido,
						ticket: sale_descifrado.ticket,
						mensaje_respuesta_usuario: sale_descifrado.mensaje_respuesta_usuario,
						mensaje_respuesta: sale_descifrado.mensaje_respuesta,
						codigo_respuesta: sale_descifrado.codigo_respuesta
					}
				})
	        })
		}
	}
		
})

app.put('/facebook_invites/:user_id/:type_service', isLoggedIn, function (req, res) {
	var user_id = req.params.user_id
	var type_service = req.params.type_service

	console.log('Facebook protocol')


	// Comprobando si cumple con los requisitos para subir de nivel
	if(req.body.button_like === true && req.body.invite_friends >= 3) {
		// Actualizando usuario Upgrade: acceso_libros

		Users.findById({"_id": user_id}, function (err, user) {
			if(err) {
				return console.log(" Error al encontrar usuario: " + err)		
			}

			// Acceso de de undefinedsuario
			var user_access = user.access

			console.log('El servicio para subir es: ' + type_service)
			console.log('Data de user access ANTES DE ENTRAR : ' + user_access)

			if (type_service === material.textos) {

				console.log('Nuevo acceso a materiales textos')
				
				Upgrade(user_id, res, permiso.acceso_libros, function (err, usuario_access, data) {
					if(err) {
						return console.log('Error al actualizar usuario: ' + err)
					}

					console.log('Data de user access LUEGO DE ENTRAR : ' + user_access)

					console.log('Usuario Actualizado de: ' + user_access + ' a ' + usuario_access)
					console.log('Ventanna de Felicidades, nuevo upgrade : ' + usuario_access)
						
					var result_upgrade = {
						service_access: 'Textos',
						codigo_respuesta: 'acceso a los textos'
					}

					data(result_upgrade)

				})

			}
		})

	} else if(req.body.button_like === false) {
		// Rechazando, razones que faltan para acceder a subir
		res.status(200).json({
			status: 'not_access',
			message: 'El evento like, no se efectuo'
		})

	} else if (req.body.invite_friends < 3) {
		// Rechazando, razones que faltan para acceder a subir
		res.status(200).json({
			status: 'not_access',
			message: 'El evento amigos invite, menor a 3'
		})

	} else {
		// Rechazando, razones que faltan para acceder a subir
		res.status(200).json({
			status: 'not_access',
			message: 'Hace falta, evneto like o invitar amigos para acceder'
		})

	}


})

module.exports = app
