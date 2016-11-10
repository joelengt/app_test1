
console.log('Hollaaa')

// Tipos de servicio
var material = {
	textos: 'textos',
	audiolibros: 'audiolibros',
	simuladores: 'simuladores',
	premium: 'premium'
}

var user_id = document.querySelector('#user_id_plataforma').value

var type_service = ''

var $btn_buy_audiolibros = document.querySelector('#btn_buy_audiolibros')
var $btn_buy_simuladores = document.querySelector('#btn_buy_simuladores')
var $btn_buy_premium = document.querySelector('#btn_buy_premium')

function ConnectCulqi(user_send_id, type_send_service) {
	console.log('Comprando servicio: ' + type_send_service)
	$('#Proceso_msg')[0].innerHTML = 'PROCESANDO...'

	$.ajax({
		method: 'post',
		url: `http://localhost:5000/plataforma/payment/${user_send_id}/${type_send_service}`,
		success: function (resultado) {
			console.log('RESULTADO DE LA CREACION DE VENTAS')
			console.log(resultado)
			if(resultado.status === 'venta_registrada') {
				// Resultado cuando la venta fue 
				$('#Proceso_msg')[0].innerHTML = ''

				console.log('Resultado: ' + type_send_service)
				console.log(resultado.status)
				console.log(resultado.message)
				console.log(resultado.help)

				console.log('SI ocurrio algun problema, contactanos con este numero de pedido: ' + resultado.data.numero_pedido + ' a mario@ascent.pe')
				console.log('ticket de proceso: ' + resultado.data.ticket)

			    var checkout = {
			    	codigo_comercio: resultado.data.codigo_comercio,
			    	informacion_venta: resultado.data.informacion_venta, 
			    	respuesta: "",
			    	abrir: function () {
			    		if (checkout.informacion_venta == "") {
			    			alert("Intente nuevamente. Si el problema persiste, contáctese con el Comercio.")
			    		
			    		} else {
			    			if ( document.querySelector('.culqi_checkout') == null ) { 
			    				var product = "web"
			    				var url = "/api/v1/form/" + product + "/" + checkout.codigo_comercio + "/" + checkout.informacion_venta
			    				iframe = document.createElement("IFRAME")
			    				iframe.setAttribute("src", "https://pago.culqi.com" + url)
			    				iframe.setAttribute("id", "culqi_checkout_frame")
			    				iframe.setAttribute("name", "checkout_frame")
			    				iframe.setAttribute("class", "culqi_checkout")
			    				iframe.setAttribute("allowtransparency", "true")
			    				iframe.setAttribute("frameborder", "0")
			    				iframe.style.zIndex = 99999
			    				iframe.style.display = "block"
			    				iframe.style.backgroundColor = "rgba(0,0,0,0)"
			    				iframe.style.border = "0px none trasparent"
			    				iframe.style.overflowX = "hidden"
			    				iframe.style.overflowY = "auto"
			    				iframe.style.visibility = "visible"
			    				iframe.style.margin = "0px"
			    				iframe.style.position = "fixed"
			    				iframe.style.left = "0px"
			    				iframe.style.top = "0px"
			    				iframe.style.width = "100%"
			    				iframe.style.height = "100%"
			    				iframe.style.backgroundPosition = "initial initial"
			    				iframe.style.backgroundRepeat = "initial initial"
			    				document.body.appendChild(iframe)

			    			} else { 
			    				alert("Ha ocurrido un problema, contáctese con el comercio.")
			    				checkout.cerrar() 
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

			    function culqi (checkout) {
			    	console.log('RESPUESTA de culqi sobre el proceso de pago')
			    	console.log(checkout.respuesta)

			    	// Mandar el resultado al servidor 
			    	$.ajax({
		    	        method: 'post',
		    	        url: `http://localhost:5000/plataforma/payment/check/${user_send_id}/${type_send_service}?_method=put`, // URI del server
		    	        contentType: 'application/json',
		    	        data: JSON.stringify({
		                    'respuesta' : checkout.respuesta
		    	        }),
		    	        success: function(data) {
		    	        	console.log('DATA UPGRADE ??')
		    	        	console.log(data)
		    	        	if(data.process_messages === 'check_not_pass') {
		    	        		console.log(data.status)

		    	        	} else {
			    	            var obj = data

			    	            console.log('Respuesta del usuario. Pago?, Error?')

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

			    	            } else if (tipo_respuesta_venta == "venta_expirada") {
			    	            	console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
			    	            	console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
			    	            	console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
			    	            	
			    	            	console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
			    	            	
			    	            	console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
			    	            	console.log('ticket: ' + obj.process_messages.ticket)
			    	            	
			    	            	console.log('Datos del usuario: ' + obj.user)

			    	            	checkout.cerrar()

			    	            } else if (tipo_respuesta_venta == "error") {
			    	            	console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
			    	            	console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
			    	            	console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
			    	            	
			    	            	console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
			    	            	
			    	            	console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
			    	            	console.log('ticket: ' + obj.process_messages.ticket)

			    	            	console.log('Datos del usuario: ' + obj.user)
			    	            	
			    	            	checkout.cerrar()

			    	            } else if (tipo_respuesta_venta == "parametro_invalido") {
			    	            	console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
			    	            	console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
			    	            	console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
			    	            	
			    	            	console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
			    	            	
			    	            	console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
			    	            	console.log('ticket: ' + obj.process_messages.ticket)
			    	            	
			    	            	console.log('Datos del usuario: ' + obj.user)

			    	            	checkout.cerrar()
			    	            	
			    	            } else if (tipo_respuesta_venta == "error_procesamiento") {
			    	            	console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
			    	            	console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
			    	            	console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
			    	            	
			    	            	console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)
			    	            	
			    	            	console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
			    	            	console.log('ticket: ' + obj.process_messages.ticket)
			    	            	
			    	            	console.log('Datos del usuario: ' + obj.user)

			    	            	checkout.cerrar()
			    	            	
			    	            } else {
			    	                console.log('Algo exatraño paso, el proceso de pago No proceso, contactanos en ascent.peru@gmail.com')
			    	                console.log('codigo respuesta: ' + obj.process_messages.codigo_respuesta)
			    	            	console.log('mensaje respuesta: ' + obj.process_messages.mensaje_respuesta)
			    	            	console.log('mensaje respuesta usuario: ' + obj.process_messages.mensaje_respuesta_usuario)
			    	                
			    	            	console.log(obj.process_messages.codigo_respuesta + ', aun puedes tener acceso a : ' + obj.service_access)

			    	            	console.log('Si ocurrio un error, contactanos con este numero de pedido: ' + obj.process_messages.numero_pedido + ' a ascent.peru@gmail.com')
			    	            	console.log('ticket: ' + obj.process_messages.ticket)

			    	            	console.log('Datos del usuario: ' + obj.user)
			    	                
			    	                checkout.cerrar()
			    	            }

		    	        	}
		    	        },
		    	        error:function(err) {
		    	        	console.log('Error al obtener resultado: ' + err)
		    	        }

			    	})

			    }

			    function culqi_front(checkout, message) {
			    	console.log(checkout.respuesta)
			    	console.log('message: ' + message)
			    }

			    checkout.abrir()

			} else {
				$('#Proceso_msg')[0].innerHTML = ''

				// Resultado cuando la venta no fue creada
				console.log('Resultado: ' + type_send_service)
				console.log(resultado.status)
				console.log(resultado.message)
				console.log(resultado.help)
				
				console.log('SI ocurrio algun problema, contactanos con este numero de pedido: ' + resultado.data.numero_pedido + ' a ascent.peru@gmail.com')
				console.log('ticket de proceso: ' + resultado.data.ticket)

			}
		}
	})
}

// Evento click para btn_buy_audiolibros
if($btn_buy_audiolibros !== null) {
	$btn_buy_audiolibros.addEventListener("click", function () {
		type_service = ''
		type_service = material.audiolibros
		ConnectCulqi(user_id, type_service)
		
	})
}

// Evento click para btn_buy_simuladores
if($btn_buy_simuladores !== null) {
	$btn_buy_simuladores.addEventListener('click', function () {
		type_service = ''
		type_service = material.simuladores
		ConnectCulqi(user_id, type_service)

	})
}

// Evento click para btn_buy_premium
if($btn_buy_premium !== null) {
	$btn_buy_premium.addEventListener('click', function() {
		type_service = ''
		type_service = material.premium
		ConnectCulqi(user_id, type_service)

	})
}
