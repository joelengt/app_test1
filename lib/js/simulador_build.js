

>Simulador (**)
//- funcion de simulador, puntos barra y avance(*)
//- alternativas random
		// Meter con push la respuesta como un elemento adicional de las otras alternativas
		// Reordenar el array de las alternativas (con la respuesta incluida) con posiciones random, sin que estas se repitan
		// Este nuevo array reordenado, reemplazarlo como parte de preguntas.other_answers. Nueva forma de mostrar las respuestas dinamicamente
//- leccion aprobada
//- description de lecciones (*)
- Update and save progreso de leccion en cada usuario al terminar cada leccion, PUT data de usuario con los avances por lecciones '/plataforma/admin/usuarios/update/' + user._id + '?_method=put'
	// Cuando el usuario termina la lección, su puntaje y datos de la misma se envian y se actualiza en el schema del usuario
- Lecciones posteriores a la actual Permanecen bloqueadas 
   // Todas las lecciones tienen su estado terminado: false
   // La primera leccion se podra acceder (aun que no este terminado) y el resto a su derecha permanece desbloqueado 
   
   // Las lecciones inicialmente se van desbloqueando conforme al avance del usuario
   // Si la actual leccion tiene su estado terminado: false, los demás a su derecha permanecen como bloqueado en intentar
   // Si la actual leccion tiene su estado terminado: true, la leccion siguiente a la derecha se desbloquea para intentar
   // Se desbloqueara la leccion siguiente, cuando la actual tenga como parametro de terminado: true

> Sistema de pagos (***)

- Sistema de acceso y forma de subir niveles de usuarios (1)
  // AL inicio el acceso a los materiales de cada curso son restringidos, necesitan un nivel de permiso

- Seguridad SSL: Candadito en la url del Dominio (2)
- Integrar sistema de pagos con culqi (3)

> Comunidad (**)

- chat por cada usuario
- publicaciones de dos tipos: preguntas y aportes

> Perfil de usuario (*)

- Notificaciones
- Nivel de acceso a la plataforma

> Vista de Cursos filtrados por Grados
 // Los oficiales y sub oficiales tienen ciertos cursos que ven y otros que no 
 // Entre los oficiales hay cgrados que requiren varios y algunos que no FILTRAR
> Sistema de reportes (*)

- API crud de reportes '/plataforma/admin/preguntas/reportes'
	// Recibir, almacenar datos de preguntas


// Render view Lecciones por nivel: muestra
function View_Lecciones(curso_id) {
	// Render de Lecciones 
	$.ajax({
		type:'get',
		url: '/plataforma/cursos/'+ curso_id +'/simulador/muestra/',
		success: function (lecciones) {
			// Render template de las lecciones por curso_id
			console.log(lecciones)

			var lecciones_disponibles = ''

			//evento ciclico para mostrar cada leccion
			for (var i = 0; i <= lecciones.length - 1; i++) {
				var leccion = lecciones[0]

				// Mostrando cada titulo de lección
				var template = `<div>
								<h3>Lección: ${leccion.title}</h3>
								<p>${leccion.description}</p>
								<a href="/plataforma/cursos/${curso_id}/simulador/muestra/${leccion.title}">Iniciar</a> 
								</div>`

				// Acumulando las lecciones disponibles
				lecciones_disponibles += template
			}
			
			// Render del template con todas las lecciones por curso
			$('.leccion_box').append(lecciones_disponibles)

		}

	})
	
}


// Simulador

// En la vista de la lecciones  de cada nivel
//  /plataforma/cursos/57427fba367ef3340431948c/simulador/muestra
// Validar la opción si esta completado o no true o false, data dentro de cada usuario

// Evento Inicia al ingresar en una leccion de cualquier nivel
page('/plataforma/cursos/:curso_id/simulador/muestra/:leccion_id', function (ctx, next) {
	
	// capturando datos del enlace boton de iniciar leccion
	var curso_id = ctx.params.curso_id
	var leccion_id = ctx.params.leccion_id

	$.ajax({
		type:'get',
		url: '/plataforma/cursos/'+ curso_id +'/simulador/muestra/' + leccion_id,
		success: function (leccion) {

			// Obteniendo arreglo de la leccion indicada
			
			// Iniciamos la iteración desde el elemento 1, var i = 1, ya que la primera posición del arreglo de cada lección, contiene datos de la leccion y descripción
			var Total_preguntas = leccion.length
			var Preguntas_buenas = 0
			var Puntaje_Total_Leccion = 0
			var avance_progress_bar = 0

			var porcentaje_avance_progress_bar = (100 * 1)/Total_preguntas

			var PuntuaciónPerfecta = 100
			var i = 1
			
			Siguiente()

			// Funcion para mostrar cada preguntas
			function Siguiente() {

				if(i <= Total_preguntas) {

					// La barra de avance debe calcularse a partir del largo de preguntas disponibles

					var pregunta = leccion[i]

					// Render de la pregunta: Template para insertar contenido de la pregunta
					var template = ''

					// Select template por tipo de pregunta
					if(pregunta.type_question === 'alternativa') {
						// Template, listo para preguntas con alternativas
						template = ` Barra de Progreso: ${avance_progress_bar} %
									Pregunta: <h3>${pregunta.question}</h3>
									
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[0].answer}>"
									<label> a) ${pregunta.other_answers[0].answer}</label>
									
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[1].answer}>"
									<label> b) ${pregunta.other_answers[1].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[2].answer}>"
									<label"> c) ${pregunta.other_answers[2].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[3].answer}>"
									<label> d) ${pregunta.other_answers[3].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[4].answer}>"
									<label> e) ${pregunta.other_answers[4].answer}</label>

									<a href="#", id="btn_calificar">Calificar</a>`

					} else if (pregunta.type_question === 'completar') {
						// Template, listo para preguntas para completar
						template = ` Barra de Progreso: ${avance_progress_bar} %
									Pregunta: <h3>${pregunta.question}</h3>
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[0].answer}>"
									<label> a) ${pregunta.other_answers[0].answer}</label>
									
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[1].answer}>"
									<label> b) ${pregunta.other_answers[1].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[2].answer}>"
									<label"> c) ${pregunta.other_answers[2].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[3].answer}>"
									<label> d) ${pregunta.other_answers[3].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[4].answer}>"
									<label> e) ${pregunta.other_answers[4].answer}</label>

									<a href="#", id="btn_calificar">Calificar</a>`

					} else if (pregunta.type_question === 'escribir') {
						// Template, listo para preguntas para escribir una palabra o terminologia etc
						template = ` Barra de Progreso: ${avance_progress_bar} %
									Pregunta: <h3>${pregunta.question}</h3>
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[0].answer}>"
									<label> a) ${pregunta.other_answers[0].answer}</label>
									
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[1].answer}>"
									<label> b) ${pregunta.other_answers[1].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[2].answer}>"
									<label"> c) ${pregunta.other_answers[2].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[3].answer}>"
									<label> d) ${pregunta.other_answers[3].answer}</label>

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[4].answer}>"
									<label> e) ${pregunta.other_answers[4].answer}</label>

									<a href="#", id="btn_calificar">Calificar</a>`

					} else if (pregunta.type_question === 'imagen') {
						// Template, listo para preguntas para seleccionar imagenes 
						template = ` Barra de Progreso: ${avance_progress_bar} %
									Pregunta: <h3>${pregunta.question}</h3>
									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[0].answer}>"

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[1].answer}>"

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[2].answer}>"

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[3].answer}>"

									<input type="radio"  id="alternativa_select_option" value="${pregunta.other_answers[4].answer}>"

									<a href="#", id="btn_calificar">Calificar</a>`

					} else {
						console.log('Error, tipo de pregunta no detectada')
					}

					// Mostrando pregunta lista para seleccionar(marcar) opción y calificar con el boton
					$('question_box').appendChild(template)

					
					var $btn_calificar = document.getElementById('btn_calificar')
					$btn_calificar.addEventListener('click', Calificar(pregunta))

				// Cuando las preguntas acabaron
				} else {
					// Envio de resultados al servidor update del usuario
					// Enviar: leccion aprovada como estado true, numero de preguntas buenas del total, puntaje total de la leccion

					var data_leccion_terminada = {
						notas_lecciones: {
							cursos: {
								type_categority: 'curso',
								categority_id: curso_id,
								nivel: 'muestra',
								leccion: {
									orden: leccion_id,
									numero_respuestas_correctas: Preguntas_buenas,
									puntaje_final: Puntaje_Total_Leccion,
									progreso: avance_progress_bar + '%',
									finalizado: true 
								}	
							}
						}
					}

					$.ajax({
						data: data_leccion_terminada,
						type: 'post',
						url: '/plataforma/admin/usuarios/update/' + user._id + '?_method=put',
						success: function (resultado) {
							console.log(resultado)
						}
					})
					
					// Render vista de resultado final
					console.log('Felicidades Lección Terminada!!')
					console.log('Preguntas buenas: ' + Preguntas_buenas + 'de ' + Total_preguntas)
					console.log('Puntaje Total de la Leccion: ' + Puntaje_Total_Leccion)

					// Template con toda esta data de resultados, y boton de confirmar
					template = `<div>
								<h2>Felicidades Lección Completada!! ${avance_progress_bar} %</h2>
								<p> Preguntas buenas: ${Preguntas_buenas} de ${Total_preguntas} </p>
								<p> Puntaje Total de la Leccion: ${Puntaje_Total_Leccion} </p>
								<a href="#" id ="btn_Terminar">Confirmar</a>
								</div>`

					// Render de la caja luego de terminar las preguntas
					$('question_box').appendChild(template)

					var $btn_Terminar = document.getElementById('btn_Terminar')
					$btn_Terminar.addEventListener('click', View_Lecciones(curso_id))

				}

			}
			
			// Funcion para Calificar cada pregunta
			function Calificar(pregunta) {
				// Obteniendo un elemento selecionado entre las opciones del radio button
				var $alternativa_select = document.querySelector('alternativa_select_option')


				// Validar el ingreso del campo enviado			
				// Obteniendo el value de la respuesta desde el DOM, por id 
				var template_mensaje = ''

				if($alternativa_select.value === pregunta.answer.string) {
					// Aumento de barra de progreso
					//progress_bar += 1
					// Diseño css de barra
					// 100% = Total_preguntas
					// x% = 1

					avance_progress_bar += porcentaje_avance_progress_bar

					// Aumentando puntaje de preguntas correctas
					Preguntas_buenas += 1
					Puntaje_Total_Leccion += parseInt(PuntuaciónPerfecta/Total_preguntas)

					// Mensaje de respeusta correcta y boton de siguiente (id = btn_next_pregunta) en el template verde
					console.log('Mensaje: Respuesta Correcta + boton de siguiente')
					
					template_mensaje = `<div>
											<img src="imange_Correcto">
											<p>Respuesta Correcta</p>
											<a href="#" id="btn_next_pregunta">Siguiente</a>
										</div>` 

				} else {

					// Mensaje de respuesta incorrecta, respuesta correcta, boton reportar y boton de siguiente en el template naranja
					console.log('Mensaje: Repuesta Incorrecta + boton de siguiente')

					template_mensaje = `<div>
											<img src="imange_Incorrecta">
											<p>Respuesta Incorrecta</p>
											<a htef="#" id="btn_reportar">Reportar</a>
											<a href="#" id="btn_next_pregunta">Siguiente</a>
										</div>` 

				}

				// Aumenta en +1 para avanzar a la siguiente pregunta
				i+=1

				// Mensaje es pegado debajo de esta misma pregunta
				$('question_mensaje').appendChild(template_mensaje)

				//Llamando a la funcion de boton de siguiente pregunta
				var $btn_next_pregunta = document.getElementById('btn_next_pregunta')
				$btn_next_pregunta.addEventListener('click', Siguiente)

				// Llamando a la funcion de boton reportar
				var $btn_reportar = document.getElementById('btn_reportar')
				$btn_reportar.addEventListener('click', Reportar(pregunta))
				

			} 

			// Funcion para Reportar cada pregunta
			function Reportar(pregunta) {
				// Render de formulario pequeño para enviar numero de la pregunta.order y contenido de campo input de texto
				var template_reportar = `<div>
											<input type="text" id="txt_reportar_msg">
											<button id="btn_reportar_send">Send</button>
										</div>`

				var $txt_reportar_msg = document.querySelector('#txt_reportar_msg').value

				// Datos necesarios para reportar y archivar pregunta
				var data_reportar_pregunta = {
					pregunta_id: pregunta._id
					pregunta_orden: pregunta.order,
					mensaje: $txt_reportar_msg
				}

				// Boton para enviar datos al servidor de la pregunta a reportar
				var $btn_reportar_send = document.getElementById('btn_reportar_send')
				$btn_reportar_send.addEventListener('click', function () {

					// Enviar data al server por ajax method post al API
					$.ajax({
						data: data_reportar_pregunta,
						type: 'post',
						// API CRUD (creat, read, delete)en construcción en el backend
						url: '/plataforma/admin/preguntas/reportes',
						success: function (respuesta) {
							console.log('Data enviada')
							console.log(respuesta)
						}
					})

				})
			}

				
		}

	})

})

page()