myApp.controller('paymentController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
	$scope.loading = true
	$scope.otherService = false
	$scope.premium = false
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.usuario = res.data.user
		$scope.miUsuario = res.data.user
		$scope.service = $routeParams.service

		$scope.loaderPayment = false

		function modalText(text, type_error){

			if (type_error === 'CloseModalError') {

				function BuildModel(Callback) {
					var modal = document.createElement('div')
					modal.setAttribute('class', 'ModalContentPayment')
					modal.setAttribute('style', 'position:fixed;bottom:0;top:0;left:0;right:0;width:100%;display:flex;background-color:rgba(55,76,58,0.48);z-index:85;align-items: center;justify-content: center;')
					var template = `<div style="max-width:400px;padding:1em;background-color:white;border-radius:5px">
										<div>
											<div style="font-size:18px">${text}</div>
										</div>
										<div style="text-align:center;margin-top:1em">
											<button class="ButtonModalPayment" id="${type_error}" style="border-radius:5px;padding:.5em;outline:0;background-color:white;border:2px solid #00d9b2;color:#00d9b2;cursor:pointer">Aceptar</button>
										</div>
									</div>`

					modal.innerHTML = template

					document.querySelector('body').appendChild(modal)

					console.log('Listo para remover11111')
					console.log('box modal1111')
					console.log(modal)

					Callback(modal)

				}

				BuildModel(function(modal) {
					// var buttonCloseModal = document.querySelector('#CloseModalError')

					console.log('Listo para Cerrarr11111')

					$('.ButtonModalPayment').on('click', function(){
						// var modal = $('.ModalContentPayment')
						console.log('Buton actions')

						console.log('REMOVIDO1111111111111111111111')
						// modal.remove()
						$('.ModalContentPayment').remove()
						
					})
				
				})

			} else {
				function BuildModel(Callback) {

					console.log('WAAAAAAAAAAAAA ---------')

					var modal2 = document.createElement('div')
					modal2.setAttribute('class', 'ModalContentPayment')
					modal2.setAttribute('style', 'position:fixed;bottom:0;top:0;left:0;right:0;width:100%;display:flex;background-color:rgba(55,76,58,0.48);z-index:85;align-items: center;justify-content: center;')
					var template = `<div style="max-width:400px;padding:1em;background-color:white;border-radius:5px">
										<div>
											<div style="font-size:18px">${text}</div>
										</div>
										<div style="text-align:center;margin-top:1em">
											<a class="ButtonModalPayment" id="exitModal" style="text-decoration:none;border-radius:5px;padding:.5em;outline:0;background-color:white;border:2px solid #00d9b2;color:#00d9b2;cursor:pointer" href="#/plataforma/cursos">Ir a cursos</a>
										</div>
									</div>`

					modal2.innerHTML = template

					document.querySelector('body').appendChild(modal2)

					Callback(modal2)
				
				}

				BuildModel(function(modal) {
					console.log('WAAAAAAAAAAAAA 222---------')
					// var exitModal = document.querySelector('#exitModal')
					
					console.log('Listo para Cerrarr2222')

					$('.ButtonModalPayment').on('click', function() {

						console.log('Buton actions')
						// var modal = $('#ModalContentPayment')
						console.log('XD')

						$('.ModalContentPayment').remove()

						window.locationf="/#/plataforma/cursos";	
						
						
					})
				})

			}

		}

		var check_clic = document.querySelector('.boxCheckValue')
		var check_clic2 = document.querySelector('.boxCheckValue2')

		// Validando checked Simulador o Textos
		check_clic.addEventListener('click', function() {
			console.log('Jahha1')
			var service_1 = document.querySelector('.PaymentAudioLibro__contentInformation--btn')
			var	$btn_inactive_service = document.querySelector('.btn_inactive_service')
			var	$btn_active_service = document.querySelector('.btn_active_service')

			if(check_clic.checked === true) {
				$btn_inactive_service.style.display = 'none'
				$btn_active_service.style.display = 'block'
				// service_1.style.background='#01637f'
				// service_1.style.borderBottom = '3px solid #004558'

			} else {
				$btn_inactive_service.style.display = 'block'
				$btn_active_service.style.display = 'none'
				// service_1.style.background = 'gray'
				// service_1.style.borderBottom = '3px solid #1b1a1a'
			
			}

		})

		// Valiando checked Premium
		check_clic2.addEventListener('click', function() {
			console.log('Jahha2')
			var service_2 = document.querySelector('.PaymentPremium__contentInformation--btn')
			var $btn_inactive_premium = document.querySelector('.btn_inactive_premium')
			var $btn_active_premium = document.querySelector('.btn_active_premium')

			if(check_clic2.checked === true) {
				$btn_inactive_premium.style.display = 'none'
				$btn_active_premium.style.display = 'block'

				// service_2.style.background='#4cf59d'
				// service_2.style.borderBottom = '3px solid #35b974'

			} else {
				$btn_inactive_premium.style.display = 'block'
				$btn_active_premium.style.display = 'none'

				// service_2.style.background = 'gray'
				// service_2.style.borderBottom = '3px solid #1b1a1a'

			}

		})

		$scope.paymentCulqui = function(service){
			if (service === 'premium') {
				$scope.premium = true
			} else {
				$scope.otherService = true
			}
			console.log($scope.usuario._id,service)
			$http({
				method: 'POST',
				url: '/plataforma/payment/'+$scope.usuario._id+'/'+service
			}).then(function(res){
				if (service === 'premium') {
					$scope.premium = false
				} else {
					$scope.otherService = false
				}
				console.log(res)

				var resultado = res.data

				if (resultado.status === 'venta_registrada') {
					console.log(resultado.data.ticket)

					var checkout = {
						codigo_comercio: resultado.data.codigo_comercio,
						informacion_venta: resultado.data.informacion_venta, 
						respuesta: "",
						abrir: function () {
							if (checkout.informacion_venta == "") {
								alert("Intente nuevamente. Si el problema persiste, contáctese con el Comercio.")
							
							} else {
	
								if (document.querySelector('.culqi_checkout') == null) {	 
									var product = "web"; 
									var url = "/api/v1/form/" + product + "/" + checkout.codigo_comercio + "/" + checkout.informacion_venta; 
									iframe = document.createElement("IFRAME"); 
									iframe.setAttribute("src", "https://pago.culqi.com" + url); 
									iframe.setAttribute("id", "culqi_checkout_frame"); 
									iframe.setAttribute("name", "checkout_frame"); 
									iframe.setAttribute("class", "culqi_checkout"); 
									iframe.setAttribute("allowtransparency", "true"); 
									iframe.setAttribute("frameborder", "0"); 
									iframe.style.zIndex = 99999; 
									iframe.style.display = "block"; 
									iframe.style.backgroundColor = "rgba(0,0,0,0)"; 
									iframe.style.border = "0px none trasparent"; 
									iframe.style.overflowX = "hidden"; 
									iframe.style.overflowY = "auto"; 
									iframe.style.visibility = "visible"; 
									iframe.style.margin = "0px"; 
									iframe.style.position = "fixed"; 
									iframe.style.left = "0px"; 
									iframe.style.top = "0px"; 
									iframe.style.width = "100%"; 
									iframe.style.height = "100%"; 
									iframe.style.backgroundPosition = "initial initial"; 
									iframe.style.backgroundRepeat = "initial initial"; 
									document.body.appendChild(iframe); 
								} else { 
									alert("Ha ocurrido un problema, contáctese con el comercio."); 
									checkout.cerrar(); 
								} 
							} 
						}, 
						autorizado: function () {
							iframe = document.getElementById('culqi_checkout_frame')
							iframe.contentWindow.postMessage("autorizado", "*")
						},
						denegado: function () {
							iframe = document.getElementById('culqi_checkout_frame')
							iframe.contentWindow.postMessage("denegado", "*")
						},
						cerrar: function (){
							var element = document.getElementById("culqi_checkout_frame")
							if (element == null) {

							} else { 
								element.parentNode.removeChild(element)
							}
						}
					}

					function receiveMessage(event) {
						if (event.data == "checkout_cerrado") { 
							checkout.respuesta = event.data
							culqi_front(checkout, 'La caja de pago fue cerrada.')
							checkout.cerrar()

						} else if (event.data == "parametro_invalido") { 
							checkout.respuesta = event.data
							culqi_front(checkout, 'Los parametros ingresados son invalidos, Ingrese los campos correctamente.')
							checkout.cerrar()

						} else if (event.data == "venta_expirada") { 
							checkout.respuesta = event.data
							culqi_front(checkout, 'Tiempo limite concluido, Venta expirada.') 
							checkout.cerrar()

						} else if (event.data == "error") { 
							checkout.respuesta = event.data
							culqi_front(checkout, 'Error en el envio de datos de la caja.')
							checkout.cerrar()

						} else {
							var obj = JSON.parse(event.data)
							var venta_id = obj["id"]
							var venta = obj["venta"]

							if (venta_id == "Culqi") { 
								console.log("Se completó el proceso de pago, respuesta enviada al comercio.")
								checkout.respuesta = venta
								culqi(checkout)
							
							} else {
								console.log("No es de CULQI" + event.data) 
							}

						}
					}

					window.addEventListener("message", receiveMessage, false)

					function culqi(checkout) {
						console.log('RESPUESTA de culqi sobre el proceso de pago')
						console.log(checkout.respuesta)

						$http({
							method: 'POST',
							url: '/plataforma/payment/check/'+$scope.usuario._id+'/'+service+'?_method=put',
							contentType: 'application/json',
							data: JSON.stringify({
								'respuesta': checkout.respuesta
							})
						}).then(function(res){
							console.log(res)
							var data = res.data
							if(data.process_messages === 'check_not_pass') {

								console.log(data.status)

							} else {
								var obj = data
								console.log(obj)

								console.log('Respuesta del usuario. Pago?, Error?')
								console.log(obj.process_messages)

								var tipo_respuesta_venta = obj.process_messages.codigo_respuesta

								if (tipo_respuesta_venta == "venta_exitosa") {
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()

									console.log('Felicidades ya tienes acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)

									console.log('Datos del usuario: ' + obj.user)
									
									// GET a esa misma uri o refrescar la pagina - para dar experiencia de acceso al servicio
									window.open(window.location.href,'_self')

									var text = '<h2 style="margin-bottom: .5em">Felicidades ya tienes acceso a: ' + obj.service_access + '</h2>' + '<p>Ahora ya tienes acceso a nuestra plataforma, disfruta de los mejores contenido y logra tu ascenso policial  ;)</p>'
									console.log(text)

									modalText(text, 'exitModal')

								} else if (tipo_respuesta_venta == "venta_expirada") {
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)
									
									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'
									// console.log(text)

									modalText(text, 'CloseModalError')


								} else if (tipo_respuesta_venta == "error") {
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)

									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'

									console.log(text)
									modalText(text, 'CloseModalError')									

								} else if (tipo_respuesta_venta == "parametro_invalido") {
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)
									
									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'

									// console.log(text)
									modalText(text, 'CloseModalError')

									
								} else if (tipo_respuesta_venta == "error_procesamiento") {
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)
									
									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'

									// console.log(text)
									modalText(text, 'CloseModalError')

									
								} else if(tipo_respuesta_venta === 'cvv_invalido'){
									
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)
									
									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'

									// console.log(text)
									modalText(text, 'CloseModalError')
									
								} else if(tipo_respuesta_venta === 'expiracion_invalida') {
									
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
									
									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)
									
									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'

									// console.log(text)
									modalText(text, 'CloseModalError')

								} else {
									console.log('Algo exatraño paso, el proceso de pago No proceso, contactanos en ascent.peru@gmail.com')
									console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
									console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
									console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
									checkout.cerrar()
									
									console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)

									console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
									console.log('ticket: ' + obj.process_messages.ticket)

									console.log('Datos del usuario: ' + obj.user)
									var text = '<h2 style="margin-bottom: .5em">'+obj.process_messages.mensaje_respuesta+'</h2>' + '<p>Error:' + obj.process_messages.mensaje_respuesta_usuario + '</p>' + '<p>Aun puedes tener acceso a : ' + obj.service_access + '</p>' + '<p><strong>ticket:</strong> ' + obj.process_messages.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com </p>'
									// console.log(text)

									modalText(text, 'CloseModalError')
								}


							}
						}, function(err){
							console.log(err)
						})						
					}

					function culqi_front(checkout, message) {
						console.log(checkout.respuesta)
						console.log('message: ' + message)
					}

					checkout.abrir()

				} else {

					// Resultado cuando la venta no fue creada
					console.log('Resultado: ' + type_send_service)
					console.log(resultado.status)
					console.log(resultado.message)
					console.log(resultado.help)
					
					console.log('SI ocurrio algun problema, contactanos con este numero de pedido: ' + resultado.data.numero_pedido + ' a ascent.peru@gmail.com')
					console.log('ticket de proceso: ' + resultado.data.ticket)
					
					checkout.cerrar()

					var text = '<h2 style="margin-bottom: .5em"><p>' + type_send_service + ' Error - Estado ' + resultado.status + '</p></h2>' + '<p>Error:' + resultado.help + '</p>' + '<p>Aun puedes tener acceso a : ' + type_send_service + '</p>' + '<p><strong>ticket:</strong> ' + resultado.data.ticket + '</p>' + '<p style="margin-top:.5em">Si el problema aun persiste, contactanos con este número de pedido: ' + resultado.data.numero_pedido + ' a ascent.peru@gmail.com </p>'

					modalText(text, 'CloseModalError')
				}

			}, function(err) {
				console.log(err)
			})
		}
	}, function(err) {
		$scope.loading = false
		console.log(err)
	})
}])