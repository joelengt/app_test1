myApp.controller('leccionCourseController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/cursos/'+$routeParams.id+'/simulador/'+$routeParams.name+'/'+$routeParams.number
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {
			console.log(res)
			$scope.curso = res.data.curso
			$scope.usuario = res.data.user
			$scope.lecciones = res.data.leccion

			$scope.Total_preguntas = $scope.lecciones.length - 1
			//console.log($scope.Total_preguntas)
			$scope.Preguntas_buenas = 0
			$scope.Puntaje_Total_Leccion = 0
			$scope.avance_progress_bar = 0

			var Template = ''

			var questionItem

			$scope.porcentaje_avance_progress_bar = (100 * 1)/($scope.Total_preguntas)

			$scope.PuntuaciónPerfecta = 100
			var i = 1

			siguiente()

			var triangle = document.getElementById('triangle')
			var progressBar = document.getElementById('progressBar')
			//console.log(triangle, progressBar)

			if (progressBar.style.width === '0%') {
				triangle.style.display = 'none'
			} else {
				triangle.style.display = 'block'
			}

			function siguiente(){
				if (i <= $scope.Total_preguntas) {
					// La barra de avance debe calcularse a partir del largo de preguntas disponibles

					$scope.pregunta = $scope.lecciones[i]

					//console.log($scope.lecciones[i])

					// Select template por tipo de pregunta
					if($scope.pregunta.type_question === 'alternativa') {
						// Template, listo para preguntas con alternativas
						$scope.Template = `<div class="Skills__containerBox--header">
										<div class="Header__box">
											<!--<div class="Icon">
												<div class="Icon__box"><span class="icon-ascent-incorrecta"></span></div>
											</div>-->
											<div class="Barra">
												<div class="Barra__relleno" style="opacity:1; width:${$scope.avance_progress_bar}%" id="progressBar">
													<span class="Barra__relleno--triangle" id="triangle"></span>
												</div>						
											</div>
											<div class="Circle" id="circleBorder"></div>
											<div class="CircleBackground" id="circleBackground"></div>
										</div>
									</div>
									<div class="Skills__containerBox--body">
										<div class="Options">
											<div class="Options__title">
												<h3>${$scope.pregunta.question}</h3>
											</div>
											<ul class="Options__item">
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="a" value="${$scope.pregunta.other_answers[0].answer}">
													<label for="a">${$scope.pregunta.other_answers[0].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="b" value="${$scope.pregunta.other_answers[1].answer}">
													<label for="b">${$scope.pregunta.other_answers[1].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="c" value="${$scope.pregunta.other_answers[2].answer}">
													<label for="c">${$scope.pregunta.other_answers[2].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="d" value="${$scope.pregunta.other_answers[3].answer}">
													<label for="d">${$scope.pregunta.other_answers[3].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="e" value="${$scope.pregunta.other_answers[4].answer}">
													<label for="e">${$scope.pregunta.other_answers[4].answer}</label>
												</li>
											</ul>
										</div>
									</div>
									<div class="Skills__containerBox--footer" id="footer">
										<div class="Default">
											<div class="Default__button">
												<a id="btn_calificar">Calificar</a>
											</div>
										</div>
									</div>`

					} else if ($scope.pregunta.type_question === 'completar') {
						//  Template, listo para preguntas para completar
						$scope.Template = `<div class="Skills__containerBox--header">
										<div class="Header__box">
											<!--<div class="Icon">
												<div class="Icon__box"><span class="icon-ascent-incorrecta"></span></div>
											</div>-->
											<div class="Barra">
												<div class="Barra__relleno" style="opacity:1; width:${$scope.avance_progress_bar}%" id="progressBar">
													<span class="Barra__relleno--triangle" id="triangle"></span>
												</div>						
											</div>
											<div class="Circle" id="circleBorder"></div>
											<div class="CircleBackground" id="circleBackground"></div>
										</div>
									</div>
									<div class="Skills__containerBox--body">
										<div class="Options">
											<div class="Options__title">
												<h3>${$scope.pregunta.question}</h3>
											</div>
											<ul class="Options__item">
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="a" value="${$scope.pregunta.other_answers[0].answer}">
													<label for="a">${$scope.pregunta.other_answers[0].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="b" value="${$scope.pregunta.other_answers[1].answer}">
													<label for="b">${$scope.pregunta.other_answers[1].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="c" value="${$scope.pregunta.other_answers[2].answer}">
													<label for="c">${$scope.pregunta.other_answers[2].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="d" value="${$scope.pregunta.other_answers[3].answer}">
													<label for="d">${$scope.pregunta.other_answers[3].answer}</label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="e" value="${$scope.pregunta.other_answers[4].answer}">
													<label for="e">${$scope.pregunta.other_answers[4].answer}</label>
												</li>
											</ul>
										</div>
									</div>
									<div class="Skills__containerBox--footer" id="footer">
										<div class="Default">
											<div class="Default__button">
												<a id="btn_calificar">Calificar</a>
											</div>
										</div>
									</div>`

					} else if ($scope.pregunta.type_question === 'escribir') {
						// Template, listo para preguntas para escribir una palabra o terminologia etc
						$scope.Template = `<div class="Skills__containerBox--header">
										<div class="Header__box">
											<!--<div class="Icon">
												<div class="Icon__box"><span class="icon-ascent-incorrecta"></span></div>
											</div>-->
											<div class="Barra">
												<div class="Barra__relleno" style="opacity:1; width:${$scope.avance_progress_bar}%" id="progressBar">
													<span class="Barra__relleno--triangle" id="triangle"></span>
												</div>						
											</div>
											<div class="Circle"></div>
											<div class="CircleBackground"></div>
										</div>
									</div>
									<div class="Skills__containerBox--body">
										<div class="Options">
											<div class="Options__title">
												<h3>${$scope.pregunta.question}</h3>
											</div>
											<ul class="Options__item">
												<li class="answer">
													<input name="seleccion" type="text" id="alternativa_select_option">
												</li>
											</ul>
										</div>
									</div>
									<div class="Skills__containerBox--footer" id="footer">
										<div class="Default">
											<div class="Default__button">
												<a id="btn_calificar">Calificar</a>
											</div>
										</div>
									</div>`

					} else if ($scope.pregunta.type_question === 'imagenes') {
						// Template, listo para preguntas para seleccionar imagenes 
						$scope.Template = `<div class="Skills__containerBox--header">
										<div class="Header__box">
											<!--<div class="Icon">
												<div class="Icon__box"><span class="icon-ascent-incorrecta"></span></div>
											</div>-->
											<div class="Barra">
												<div class="Barra__relleno" style="opacity:1; width:${$scope.avance_progress_bar}%" id="progressBar">
													<span class="Barra__relleno--triangle" id="triangle"></span>
												</div>						
											</div>
											<div class="Circle" id="circleBorder"></div>
											<div class="CircleBackground" id="circleBackground"></div>
										</div>
									</div>									
									<div class="Skills__containerBox--body">
										<div class="Options">
											<div class="Options__title">
												<h3>${$scope.pregunta.question}</h3>
											</div>
											<ul class="Options__item">
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="a" value="${$scope.pregunta.other_answers[0].answer}">
													<label for="a"><img width="300" src="${$scope.pregunta.other_answers[0].answer}" alt="" /></label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="b" value="${$scope.pregunta.other_answers[1].answer}">
													<label for="b"><img width="300" src="${$scope.pregunta.other_answers[1].answer}" alt="" /></label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="c" value="${$scope.pregunta.other_answers[2].answer}">
													<label for="c"><img width="300" src="${$scope.pregunta.other_answers[2].answer}" alt="" /></label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="d" value="${$scope.pregunta.other_answers[3].answer}">
													<label for="d"><img width="300" src="${$scope.pregunta.other_answers[3].answer}" alt="" /></label>
												</li>
												<li class="answer">
													<input name="alternativa_select_option" type="radio" id="e" value="${$scope.pregunta.other_answers[4].answer}">
													<label for="e"><img width="300" src="${$scope.pregunta.other_answers[4].answer}" alt="" /></label>
												</li>
											</ul>
										</div>
									</div>
									<div class="Skills__containerBox--footer" id="footer">
										<div class="Default">
											<div class="Default__button">
												<a id="btn_calificar">Calificar</a>
											</div>
										</div>										
									</div>`
					} else {
						console.log('Error, tipo de pregunta no detectada')
					}

					var question = document.getElementById('question_box')
					//var div = document.createElement('div')
					question.innerHTML = $scope.Template

					//console.log(Template)
					//question.appendChild(div)

					questionItem = $scope.pregunta
					//console.log($scope.pregunta)

					document.getElementById('a').addEventListener('click', changeButtonStyle)
					document.getElementById('b').addEventListener('click', changeButtonStyle)
					document.getElementById('c').addEventListener('click', changeButtonStyle)
					document.getElementById('d').addEventListener('click', changeButtonStyle)
					document.getElementById('e').addEventListener('click', changeButtonStyle)

					function changeButtonStyle(){
						document.querySelector('.Default__button').setAttribute('style', 'border:1px solid #00d9b2;box-shadow: 0 0 8px #00dbde')
						document.getElementById('btn_calificar').style.color = '#00d9b2'
						document.getElementById('btn_calificar').style.backgroundColor = '#fff'
					}
					
					var btn_calificar = document.getElementById('btn_calificar')
					btn_calificar.addEventListener('click', Calificar)
				} else {

					if ($scope.Puntaje_Total_Leccion != '100') {
						$scope.Puntaje_Total_Leccion = parseInt($scope.Puntaje_Total_Leccion);
					}

					//console.log($scope.pregunta._id)

					/*var data_leccion_terminada = {
						notas_lecciones: {
							cursos: {
								type_categority: 'curso',
								categority_id: $scope.curso._id,
								nivel: 'muestra',
								leccion: {
									orden: $scope.pregunta._id,
									numero_respuestas_correctas: $scope.Preguntas_buenas,
									puntaje_final: $scope.Puntaje_Total_Leccion,
									progreso: $scope.avance_progress_bar + '%',
									finalizado: true 
								}	
							}
						}
					}*/

					var progress_lection
					if ($scope.Puntaje_Total_Leccion === 100) {
						progress_lection = true
					} else {
						progress_lection = false
					}

					var data_leccion_terminada = {
						type_categority: 'curso',  // String
						curso_id: $scope.curso._id,  // String
						nivel: $routeParams.name,  // String
						leccion: $routeParams.number,
						resultados:	{ 
							respuestas_correctas: $scope.Preguntas_buenas, // String
							puntaje_final: $scope.Puntaje_Total_Leccion,  // String
							progreso: $scope.avance_progress_bar + '%', // String  
							finalizado: progress_lection // Boolean
						}
					}

					$http({
						method: 'POST',
						url: '/plataforma/cursos/progress/lecciones?_method=put',
						data: data_leccion_terminada,
					}).then(function(res){
						console.log(res)
						//console.log(res.data.status)
						//console.log(res.data.message)
					}, function(err){
						console.log('Ocurrió un error:'+err)
					})

					//var question = document.getElementById('question_box')

					// Template con toda esta data de resultados, y boton de confirmar
					$scope.Template = `<div class="lectionComplet">
									<div class="lectionComplet__container">
										<div class="lectionComplet__container--title">
											<h2>Lección Completada al ${$scope.Puntaje_Total_Leccion}%</h2>
										</div>
										<div class="lectionComplet__container--text">
											<p> <stron>Preguntas buenas:</stron> ${$scope.Preguntas_buenas} de ${$scope.Total_preguntas} </p>
											<p> <strong>Puntaje Total de la Leccion:</strong> ${$scope.Puntaje_Total_Leccion} </p>
										</div>
										<div class="lectionComplet__container--button">
											<a href="${'#/plataforma/cursos/'+$routeParams.id+'/simulador/'+$routeParams.name}" ="btn_Terminar">Confirmar</a>
										</div>
									</div>
								</div>`

					// Render de la caja luego de terminar las preguntas
					var question = document.getElementById('question_box')
					//var div = document.createElement('div')
					question.innerHTML = $scope.Template
				}
			}
			
			function Calificar() {

				// Obteniendo un elemento selecionado entre las opciones del radio button
				var alternativa_select
				//Buscamos el input que tiene checked 'seleccionado'
				if (document.getElementById('a').checked) {
					alternativa_select = document.getElementById('a')
					//console.log(alternativa_select.value)
				} else if (document.getElementById('b').checked) {
					alternativa_select = document.getElementById('b')
					//console.log(alternativa_select.value)
				} else if (document.getElementById('c').checked) {
					alternativa_select = document.getElementById('c')
					//console.log(alternativa_select.value)
				} else if (document.getElementById('d').checked) {
					alternativa_select = document.getElementById('d')
					//console.log(alternativa_select.value)
				} else if (document.getElementById('e').checked){
					alternativa_select = document.getElementById('e')
					//console.log(alternativa_select.value)
				} else {
					alternativa_select = undefined
				}

				
				if (alternativa_select === undefined ) {

					//El template solo aparecera si en caso no existe otro igual, de lo contrario nunca se a;adira
					if (!document.querySelector('.Alerta')) {
						var footerDefaultBox  = document.querySelector('.Default')
						footerDefaultBox.setAttribute('style', 'justify-content: space-between; align-items: center')
						var buttonDefault = document.querySelector('.Default__button')
						//console.log(footerDefault)
						buttonParent = buttonDefault.parentNode
						//console.log(buttonParent)
						var p = document.createElement('p')
						p.setAttribute('class', 'Alerta')
						p.setAttribute('style', 'margin:0; color: #969696')
						p.innerHTML = 'Tienes que marcar una respuesta!'
						buttonParent.insertBefore(p, buttonDefault)
					}

				} else if(alternativa_select.value === $scope.pregunta.answer.string) {


					//al llenar la ultma pregunta se rellena del color el circulo final de la barra de progreso
					if ($scope.pregunta === $scope.lecciones[$scope.lecciones.length-1]) {
						setTimeout(function(){
							document.getElementById('circleBackground').style.backgroundColor = '#5bc0de'
							document.getElementById('circleBorder').style.border = '1px solid #5bc0de'
							document.getElementById('circleBorder').style.backgroundColor= '#5bc0de'
						}, 400)
					}

					//Seleccion de input y respectiva desabilitacion luego de clickear en calificar
					var inputs  = document.getElementsByName('alternativa_select_option')

					///se itera cada input
					//console.log(inputs.length)
					for (var e = 0; e < inputs.length; e++) {
						inputs[e].disabled = true
					}
					//console.log(inputs)
		
					// Obteniendo el value de la respuesta desde el DOM, por id 
					var template_mensaje = ''

					progressBar = document.getElementById('progressBar')

					$scope.avance_progress_bar += $scope.porcentaje_avance_progress_bar
					//console.log($scope.avance_progress_bar)
					progressBar.style.width = $scope.avance_progress_bar + '%'
					if (triangle.style.display === 'none') {
						setInterval(function(){
							triangle.style.display = 'block'
						}, 100)
					}
					// Aumento de barra de progreso
					$scope.Preguntas_buenas += 1
					// Aumentando puntaje de preguntas correctas
					$scope.Puntaje_Total_Leccion += ($scope.PuntuaciónPerfecta/$scope.Total_preguntas)

					// Mensaje de respeusta correcta y boton de siguiente (id = btn_next_pregunta) en el template verde
					//console.log('Mensaje: Respuesta Correcta + boton de siguiente')
					
					template_mensaje = `<div class="Skills__containerBox--footer">
											<div class="Just">
												<div class="Just__left">
													<div class="Just__left--ok">
														<div>
															<span class="icon-ascent-correcto">
															</span>
														</div>
													</div>
													<div class="Just__left--text">
														<p>¡Respuesta Correcta!</p>
													</div>
												</div>
												<div class="Just__right">
													<div class="Just__right--button">
														<a id="btn_next_pregunta">Siguiente</a>
													</div>
												</div>
											</div>
										</div>`
					if (document.querySelector('.Default')) {
						document.querySelector('.Default').remove()
					}
					var question = document.getElementById('footer')
					var div = document.createElement('div')
					div.innerHTML = template_mensaje


					question.appendChild(div)

					//Llamando a la funcion de boton de siguiente pregunta
					var btn_next_pregunta = document.getElementById('btn_next_pregunta')
					btn_next_pregunta.addEventListener('click', siguiente)

					// Aumenta en +1 para avanzar a la siguiente pregunta
					i+=1

				} else {


					//al llenar la ultma pregunta se rellena del color el circulo final de la barra de progreso
					if ($scope.pregunta === $scope.lecciones[$scope.lecciones.length-1]) {
						setTimeout(function(){
							document.getElementById('circleBackground').style.backgroundColor = '#5bc0de'
							document.getElementById('circleBorder').style.border = '1px solid #5bc0de'
						}, 400)
					}

					//Seleccion de input y respectiva desabilitacion luego de clickear en calificar
					var inputs  = document.getElementsByName('alternativa_select_option')

					///se itera cada input
					//console.log(inputs.length)
					for (var e = 0; e < inputs.length; e++) {
						inputs[e].disabled = true
					}
					//console.log(inputs)

					// Validar el ingreso del campo enviado			
					// Obteniendo el value de la respuesta desde el DOM, por id 
					var template_mensaje = ''

					progressBar = document.getElementById('progressBar')

					$scope.avance_progress_bar += $scope.porcentaje_avance_progress_bar
					//console.log($scope.avance_progress_bar)
					progressBar.style.width = $scope.avance_progress_bar + '%'
					if (triangle.style.display === 'none') {
						setInterval(function(){
							triangle.style.display = 'block'
						}, 100)
					}

					// Mensaje de respuesta incorrecta, respuesta correcta, boton reportar y boton de siguiente en el template naranja
					//console.log('Mensaje: Repuesta Incorrecta + boton de siguiente')

					template_mensaje = `<div class="Skills__containerBox--footer">
											<div class="Wrong">
												<div class="Wrong__left">
													<div class="Wrong__left--ok">
														<div>
															<span class="icon-ascent-incorrecta">
															</span>
														</div>
													</div>
													<div class="Wrong__left--text" id="textWrong">
														<p class="title">¡Tu respuesta es incorrecta!</p>
														<p class="answer">${$scope.pregunta.answer.string}</p>
														<div class="report">
															<a id="btn_reportar">Reportar un problema</a>
														</div>
													</div>
												</div>
												<div class="Wrong__right">
													<div class="Wrong__right--button">
														<div class="next">
															<a id="btn_next_pregunta">Siguiente</a>
														</div>
													</div>
												</div>
											</div>
										</div>`
					// Mensaje es pegado debajo de esta misma pregunta
					var question = document.getElementById('footer')
					var div = document.createElement('div')
					div.innerHTML = template_mensaje


					question.appendChild(div)

					// Llamando a la funcion de boton reportar
					//console.log('XD')
					var btn_reportar = document.getElementById('btn_reportar')
					btn_reportar.addEventListener('click', Reportar)			
					if (document.querySelector('.Default')) {
						document.querySelector('.Default').remove()
					}
					//Llamando a la funcion de boton de siguiente pregunta
					var btn_next_pregunta = document.getElementById('btn_next_pregunta')
					btn_next_pregunta.addEventListener('click', siguiente)


					// Aumenta en +1 para avanzar a la siguiente pregunta
					i+=1
				}
			}

			function Reportar() {
				// Render de formulario pequeño para enviar numero de la pregunta.order y contenido de campo input de texto

				var template_reportar = `<div class="ModalReport">
											<div class="ModalReport__box">
												<div class="ModalReport__box--title">
													<h3>¿Cual es problema?</h3>
												</div>
												<div class="ModalReport__box--inputText">
													<textarea height="70" class="form-control" placeholder="Escribenos tu queja..." id="txt_report_msg"/></textarea>
												</div>
												<div class="ModalReport__box--buttons">
													<div class="cancel">
														<div id="btn_report_cancel">Cancelar </div>
													</div>
													<div class="send">
														<div id="btn_report_send">Enviar</div>
													</div>
												</div>
											</div>
										</div>`

				var body = document.body
				//console.log(body)
				var div = document.createElement('div')
				div.setAttribute('id', 'ModelContainer')
				div.innerHTML = template_reportar
				//console.log(div)
				body.appendChild(div)

				//console.log($scope.pregunta._id, $scope.pregunta.order)

				// Datos necesarios para reportar y archivar pregunta

				// Boton para enviar datos al servidor de la pregunta a reportar
				var btn_report_send = document.getElementById('btn_report_send')
				btn_report_send.addEventListener('click', function () {
					var txt_report_msg = document.getElementById('txt_report_msg')

					var data_report_pregunta = {
						pregunta_id: $scope.pregunta._id,
						pregunta_orden: $scope.pregunta.order,
						mensaje: txt_report_msg.value,
					}

					//console.log(data_report_pregunta)
					// Enviar data al server por ajax method post al API
					$http({
						method: 'POST',
						url: '/plataforma/admin/preguntas/reportes',
						data: data_report_pregunta
					}).then(function(res){
						console.log(res)
					}, function(err){
						console.log('Ocurrió un error: '+ err)
					})

					var modalWindows = document.getElementById('ModelContainer')
					document.body.removeChild(modalWindows)
					
					var containerReportMsg = document.getElementById('textWrong')
					//console.log(containerReportMsg)
					var p = document.createElement('p')
					p.setAttribute('style', 'color: white; text-decoration: underline; font-size:14px; margin:0')
					p.innerHTML = '¡Gracias por enviar su reporte!'
					containerReportMsg.appendChild(p)

				})

				var btn_report_cancel = document.getElementById('btn_report_cancel')
				//console.log(btn_report_cancel)
				btn_report_cancel.addEventListener('click', cancelReport)

				function cancelReport(){
					var modalWindows = document.getElementById('ModelContainer')
					document.body.removeChild(modalWindows)
				}
			}
			
		}else{
			$location.url('/')
		}
	},function(err){
		console.log('ocurrió un error: '+err)
	})
}])