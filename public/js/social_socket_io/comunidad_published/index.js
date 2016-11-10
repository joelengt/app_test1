
var types_publish = ''
var tags_publish_id = ''
var tags_publish_title = ''

var socket = io()

$('#published_publish_multimedia').change(function(e) {
	// SI se sube archivo, deshabiltar el boton de publicar, hasta terminada la subida
	console.log('Evento uploar file activado')
	var file = e.target.files[0]
	console.log('datos del archivo')

	console.log(file)
    
	var stream = ss.createStream()
	var filename = file.name
 	
    // upload a file to the server. 
	ss(socket).emit('up_file', stream, { name: file.name })
    //ss(socket).emit('up_file', stream)
	//ss.createBlobReadStream(file).pipe(stream)

	var blobStream = ss.createBlobReadStream(file)
	var size = 0
	var progress_bar = document.createElement('strong')
	
	// progreso de carga en la subida el archivo
	blobStream.on('data', function(chunk) {
	  size += chunk.length

	  var charge = Math.floor(size / file.size * 100)
	 
	  console.log(charge + '%')

	  progress_bar.innerHTML = charge + '%'
	  $('#preview_box').html(progress_bar)

	  // -> e.g. '42%' 
	  if(Math.floor(size / file.size * 100) === 100) {
	  	console.log('Carga COmpleta')
	    // Habilitar el boton de publicar
		console.log('Ubicacion del archivo')
		var new_path = '../news/' + file.name

		console.log(new_path)
		// AL obtener el path del archivo subido, colocarlo dentro de los parametros listo para publicar
	  	
	  	//pegando template de contendor de imagen - segun el file.type el tipo de contenerdor de multimedia
	  	var preview_file = document.createElement('img')
	  	preview_file.src = new_path
	  	preview_file.value = file.name
	  	preview_file.id = "published_publish_multimedia_path"
	  	preview_file.width = 100

	  	console.log(preview_file)

	  	$('#preview_box').append(preview_file)
	  
	  }
	})
	blobStream.pipe(stream)


	//console.log(blobStream.pipe(stream))
	//stream.pipe(ss.createWriteStream(filename))
})

$('#Form_comunidad_public').submit(function () {
	console.log('Evento click ocurriendo')
	// Calculando el elemento del array
	// Arry de input radio by class : published_publish_type
	var arr_types_publish = document.querySelectorAll('.published_publish_type')
	
	for(var i = 0 ; i <= arr_types_publish.length - 1; i++) {
		var el = arr_types_publish[i]
		if(el.checked) {
			types_publish = el.value
			console.log('EL elemento checked es el: ' + i)
			console.log('Tipo de publish: ' + types_publish)
		}
	}
	
	// Arry de input radio by class : published_publish_etiqueta
	var arr_tags_publish_id = document.querySelectorAll('.published_publish_etiqueta__id')
	
	for(var j = 0 ; j <= arr_tags_publish_id.length - 1; j++) {
		var el = arr_tags_publish_id[j]
		if(el.checked) {
			console.log('EL elemento checked es el: ' + j)
			tags_publish_id = el.id
			tags_publish_title = el.value
			console.log('tag publish id: ' + tags_publish_id)
			console.log('tag publish title: ' + tags_publish_title)
		}
	}

	// Datos para enviar por publicación
	var $user_id = document.querySelector('#published_user_id').value
	var $user_name = document.querySelector('#published_user_name').value
	var $user_nick = document.querySelector('#published_user_nick').value
	var $user_grado = document.querySelector('#published_user_grado').value
	var $user_photo = document.querySelector('#published_user_photo').value
	var $publish_title = document.querySelector('#published_publish_title').value
	var $publish_content = document.querySelector('#published_publish_content').value
	var $publish_multimedia = document.querySelector('#published_publish_multimedia_path')
	//var $publish_multimedia = document.querySelector('#published_publish_multimedia').value

	var $publish_type = types_publish
	var $publish_etiqueta_id = tags_publish_id
	var $publish_etiqueta_title = tags_publish_title

	var etiquetas_tags = {
		id: $publish_etiqueta_id,
		title: $publish_etiqueta_title
	}

	// Validacion de limpieza del formulario
	var $msg_alert_box = document.querySelector('#msg_alert_box')
	
	var publish_to_content = {
		id: '',
		user_id: $user_id,
		user_name: $user_name,
		user_nick: $user_nick,
		user_grado: $user_grado,
		user_photo: $user_photo,
		publish_type: $publish_type,
		publish_title: $publish_title,
		publish_multimedia: $publish_multimedia,
		publish_content: $publish_content,
		publish_etiqueta: etiquetas_tags,
		fecha_creacion: ''
	}

	if($publish_multimedia !== null) {
		console.log('Publicando con imagen')
		publish_to_content.publish_multimedia = {
			name: $publish_multimedia.value,
			type: '' // si es image/png, image/ppag
		}
		
	    // Limpiar el preview de imagen
		document.querySelector('#preview_box').innerHTML = ''
	}

	console.log('Datos PUBLICAION a Subir: ' + publish_to_content)

	socket.emit('comunidad_publish', publish_to_content)

    document.querySelector('#published_publish_title').value = ''
    document.querySelector('#published_publish_content').value = ''
    document.querySelector('#published_publish_multimedia').value = ''

	return false

})

// Los campos minimos de validación son: 
// publish_type: $publish_type &&
// publish_title: $publish_title &&
// publish_content: $publish_content
// Sin ellos no se pude hacer una publicaicon, le ha de salir un mensaje para avisar. 
//------------------------LISTO
socket.on('comunidad_publish', function (content) {
	console.log('content recibo del backend:' + content.publish_multimedia)
	var template = ''
	if(content.publish_multimedia !== null) {
		console.log('El template SI tiene imagen')
		template = `<article data-id="${content.id}" style="border-top: 1px solid lightgray;" class="Article__read__item">
						        <div>
						        	<form action="/plataforma/comunidad/article/delete/${content.id}?_method=delete" method="post">
							        	<button>Eliminar</button>
							        </form>
						        </div>
						        <strong>${content.publish_type}</strong>
						        <div class="data-publish__user">
							        <img src="${content.user_photo}" width="50"/>
							        <a href="/plataforma/perfil/${content.user_id}">${content.user_name}</a>
							        <strong>@${content.user_nick}</strong>
							        <p>${content.user_grado}</p>
						        </div>
						        <div class="data-publish__content">
							        <h3>${content.publish_title}</h3>
							        <p>${content.publish_content}</p>
							        <img src="../${content.publish_multimedia.path}" width="200"/>
						        	<p>titulo de tag_curso: ${content.publish_etiqueta.title}</p>
						        	<p>id de tag_curso: ${content.publish_etiqueta.id}</p>
						        	<p>publicado hace: ${content.fecha_creacion}</p>
						        </div>
						        <div>
						        	<div>
							        	<p class="count_likes">${content.number_likes}</p>
							        	<p>Me gustas<p>
						        	</div>
						        	<div>
						        		<p class="count_comments">${content.number_comments}</p>
						        		<p>comentarios<p>
						        	</div>
						        </div>
						        <div>
						        	<div>
							        	<button style="color:gray" class="btn_article_like">Me gusta</button>
						        	</div>
						        	<div>	
							        	<button class="btn_article_comment">Comentar</button>
						        	</div>
						        </div>
						        <div>
			        	        	<div class="box_comments_article"></div>
			        	        	<div class="box_form_comment">
			        		        	<form id="form_item_comentar">
			        		        		<input class="txt_comment_send" type="text", placeholder="Ingresa un comentario">
			        		        		<button class="btn_comment_send">Comentar</button>
			        		        	</form>
			        	        	</div>
						        </div>
					      </article>`

	} else {
		console.log('El template NO tiene imagen')
		template = `<article data-id="${content.id}" style="border-top: 1px solid lightgray;" class="Article__read__item">
						        <div>
						        	<form action="/plataforma/comunidad/article/delete/${content.id}?_method=delete" method="post">
							        	<button>Eliminar</button>
							        </form>
						        </div>
						        <strong>${content.publish_type}</strong>
						        <div class="data-publish__user">
							        <img src="${content.user_photo}" width="50"/>
							        <a href="/plataforma/perfil/${content.user_id}">${content.user_name}</a>
							        <strong>@${content.user_nick}</strong>
							        <p>${content.user_grado}</p>
						        </div>
						        <div class="data-publish__content">
							        <h3>${content.publish_title}</h3>
							        <p>${content.publish_content}</p>
						        	<p>titulo de tag_curso: ${content.publish_etiqueta.title}</p>
						        	<p>id de tag_curso: ${content.publish_etiqueta.id}</p>
						        	<p>publicado hace: ${content.fecha_creacion}</p>
						        </div>
						        <div class="data-pulish__rate-info">
						        	<div>
							        	<p class="count_likes">${content.number_likes}</p>
							        	<p>Me gustas<p>
						        	</div>
						        	<div>
						        		<p class="count_comments">${content.number_comments}</p>
						        		<p>comentarios<p>
						        	</div>
						        </div>
						        <div class="data-publish__btn-actions">
						        	<div>
							        	<button style="color:gray" class="btn_article_like">Me gusta</button>
						        	</div>
						        	<div>	
							        	<button class="btn_article_comment">Comentar</button>
						        	</div>
						        </div>
						        <div>
						        	<div class="box_form_comment">
						        	<div class="box_comments_article"></div>
						        	<br>
						        	<br>
						        	<form id="form_item_comentar">
						        		<input class="txt_comment_send" type="text", placeholder="Ingresa un comentario">
						        		<button class="btn_comment_send">Comentar</button>
						        	</form>
						        	<br>
						        	<br>
						        	</div>
						        </div>
					      </article>`
	}

	$('#article_item_published').prepend(template)
})

// subscribiendo the user to this by article-data-id. to like and coments
// El evento like y comentario se generan a partir de darle click en cada uno empieza la sucripcion


var $ArticlesContainer = $('#App_Container').find('.Articles_containers')

// Evento click btn_Like --------------------------------------LISTO
$ArticlesContainer.on('click', 'button.btn_article_like', function (ev) {
	let $this = $(this)
	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')
	
	let content_like_event = {
		article_id: id,
		user_id: document.querySelector('#published_user_id').value,
		user_name: document.querySelector('#published_user_name').value
	}

	// Enviando likes por id de articulo
	socket.emit('like', content_like_event)
	
	// Cambiando estado de Like
	var btn_like = $article.find('.btn_article_like')
	
	if(btn_like[0].style.color === 'blue'){
		btn_like[0].style.color = 'gray'
	
	} else if (btn_like[0].style.color === 'gray'){
		btn_like[0].style.color = 'blue'
	} else {
		console.log('Error en la seleccion del button')
	}
})

// Evento click btn_comment_like ----------------------------------LISTO
$ArticlesContainer.on('click', 'button.btn_like_this_comment', function (ev) {
	let $this = $(this)

	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')

	// Enviar el contenido de la caja a todos los socket dentro de el cuarto de este id
	let $comment_box = $article.find('.box_form_comment')
	let $comment_order = Number($comment_box.context.dataset.commentlike)
	//console.log($comment_box.context)
	//let $txt_answer_send = $article.find('input[data-txtanswer=' + $comment_order + ']')

	let content_like_event_comment = {
		article_id: id,
		comment_id: $comment_order,
		user_id: document.querySelector('#published_user_id').value,
		user_name: document.querySelector('#published_user_name').value
	}

	console.log('Data like por comentario a enviar')
	console.log(content_like_event_comment)

	// Enviando likes por id de articulo
	socket.emit('like_by_comment', content_like_event_comment)
	
	// Cambiando estado de Like de este comentario
	var btn_like = $comment_box.context
	
	if(btn_like.style.color === 'blue'){
		btn_like.style.color = 'gray'
	
	} else if (btn_like.style.color === 'gray'){
		btn_like.style.color = 'blue'
	
	} else {
		console.log('Error en la seleccion del button')
	}
})

// Evento click btn_answer_like -----------------------------------------------LISTO
$ArticlesContainer.on('click', 'button.btn_like_this_asnwer2', function (ev) {
	let $this = $(this)

	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')

	// Enviar el contenido de la caja a todos los socket dentro de el cuarto de este id
	let $comment_box = $article.find('.box_form_comment')
	let $comment_order = Number($comment_box.context.dataset.commentliked)
	let $answer_order = Number($comment_box.context.dataset.answerlike)

	console.log('comment_id recibido del DOM')
	console.log($comment_order)

	console.log('answer_id recibido del DOM: ')
	console.log($answer_order)

	let content_like_event_answer = {
		article_id: id,
		comment_id: $comment_order,
		answer_id: $answer_order,
		user_id: document.querySelector('#published_user_id').value,
		user_name: document.querySelector('#published_user_name').value
	}

	console.log('Data like de un answer para enviar')
	console.log(content_like_event_answer)

	// Enviando likes por id de articulo
	socket.emit('like_by_answer', content_like_event_answer)
	
	// Cambiando estado de Like de este comentario
	var btn_like = $comment_box.context
	
	if(btn_like.style.color === 'blue'){
		btn_like.style.color = 'gray'
	
	} else if (btn_like.style.color === 'gray'){
		btn_like.style.color = 'blue'
	
	} else {
		console.log('Error en la seleccion del button')
	}
})

// Evento click btn_comment  ++++
$ArticlesContainer.on('click', 'button.btn_article_comment', function (ev) {
	let $this = $(this)
	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')

	// Abrir la caja de comentarios y todos los primeros 5 comentarios para este articulo
})

// Evento click btn_answer_this_answer2 --------LISTO
$ArticlesContainer.on('click', 'button.btn_answer_this_asnwer2', function (ev) {
	let $this = $(this)
	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')

	// Obtener el nombre del usuario clickeado 
	let $user_name_to_answer = $article.context.dataset.nameaswer
	console.log($user_name_to_answer)

	// Metiendo en la caja a comentar
	let $comment_box = $article.find('.box_form_comment')
	let $comment_order = Number($comment_box.context.dataset.idanswer)
	let $txt_answer_send = $comment_box.find('input[data-txtanswer=' + $comment_order + ']')

	$txt_answer_send[0].value = '@' + $user_name_to_answer + ' '
})

// Evento Comment para enviar ------------------------------LISTO
$ArticlesContainer.on('click', 'button.btn_comment_send', function (ev) {
	let $this = $(this)
	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')

	// Enviar el contenido de la caja a todos los socket dentro de el cuarto de este id
	var $txt_comment = $article.find('.txt_comment_send')
	//console.log($txt_comment[0].value)

	// Data de usuario que envia el mensaje
	let $user_id = document.querySelector('#published_user_id').value
	let $user_name = document.querySelector('#published_user_name').value
	let $user_nick = document.querySelector('#published_user_nick').value
	let $user_grado = document.querySelector('#published_user_grado').value
	let $user_photo = document.querySelector('#published_user_photo').value

	socket.emit('comment',{
		article_id: id,
		user_id: $user_id,
		user_name: $user_name,
		user_nick: $user_nick,
		user_photo: $user_photo,
		comment: $txt_comment[0].value
	})
	
	$txt_comment[0].value = ''

	return false
})

// Evento Answer para enviar a un comment ----------------------------------LISTO
$ArticlesContainer.on('click', 'button.btn_answer_to_comment_send', function (ev) {
	let $this = $(this)
	let $article = $this.closest('.Article__read__item')
	let id = $article.data('id')

	// Enviar el contenido de la caja a todos los socket dentro de el cuarto de este id
	let $comment_box = $article.find('.box_form_comment')
	let $comment_order = Number($comment_box.context.dataset.parent)

	let $txt_answer_send = $article.find('input[data-txtanswer=' + $comment_order + ']')
	//let $txt_answer_send = $comment_box[0].childNodes[$comment_order - 1].childNodes[4].childNodes[2].childNodes[0]

	// Data de usuario que envia el mensaje
	let $user_id = document.querySelector('#published_user_id').value
	let $user_name = document.querySelector('#published_user_name').value
	let $user_nick = document.querySelector('#published_user_nick').value
	let $user_grado = document.querySelector('#published_user_grado').value
	let $user_photo = document.querySelector('#published_user_photo').value

	socket.emit('answer',{
		article_id: id,
		comment_id: $comment_order,
		user_id: $user_id,
		user_name: $user_name,
		user_nick: $user_nick,
		user_photo: $user_photo,
		answer: $txt_answer_send[0].value
	})

	$txt_answer_send[0].value = ''

	return false
})

// Obteniendo Likes  ------------------------------LISTO
socket.on('like', function (element_likes) {
	// Hacer que el propio canal de numero like se modifique al recibir el cambio 
	
	let id = element_likes.id
	let num_likes = element_likes.likes
	//let status = element_likes.status

	let $article = $ArticlesContainer.find('article[data-id=' + id + ']')
	let counter = $article.find('.count_likes')

	counter.html(num_likes)
})

// Obteniendo Commentarios  ------------------------------LISTO
socket.on('comment', function (element_comments) {
	
	// Hacer que el propio canal de numero like se modifique al recibir el cambio 
	let article_id = element_comments.article_id

	let $article = $ArticlesContainer.find('article[data-id=' + article_id + ']')
	let $box_comments = $article.find('.box_form_comment')

	var template_commment = `<div class="comment__item" data-comment="${element_comments.comment_id}">
								<div>
									<strong>#${element_comments.comment_id}</strong>
									<img src="${element_comments.user_photo}" width="30"/>
									<a href="/plataforma/perfil/${element_comments.user_id}">${element_comments.user_name}</a>
									<p>@${element_comments.user_nick}</p>
									<p>hace ${element_comments.fecha_creacion}</p>
								</div>
								<div>
									<p>${element_comments.comment}</p>
								</div>
								<div class="comment__item__counters">
									<div>
										<p class="count_answers_likes"></p>
										<p> Me gustas <span data-commentcounterlikes="${element_comments.comment_id}">${element_comments.counter_likes}</span></p>
									</div>
									<div>
										<p class="count_answers_this_comment"></p>
										<p>Respuestas <span>${element_comments.counter_answers}</span></p>
									</div>
								</div>
								<div class="comment__item__actions">
									<div>
										<button style="color:gray;" class="btn_like_this_comment" data-commentlike="${element_comments.comment_id}"> Me gusta </button>
									</div>
									<div>
										<button class="btn_answer_this_comment"> Responder </button>
									</div>
								</div>
								<div>
									<div class="box_form_answers_about_this_comment"></div>
									<div class="box_answers_about_this_comment" data-allaswers="${element_comments.comment_id}"></div>
									<form id="form_comment_item_comentar">
										<input class="txt_answer_to_comment_send" type="text" placeholder="Responde este comentario" data-txtanswer="${element_comments.comment_id}">
										<button class="btn_answer_to_comment_send" data-parent="${element_comments.comment_id}">Responder</button>
									</form>
								</div>
							</div>`

	$box_comments.append(template_commment)  
})

// Obteniendo Commentarios  ------------------------------LISTO
socket.on('answer', function (element_answers) {
	// Hacer que el propio canal de numero like se modifique al recibir el cambio 
	// Obteniendo el article_id
	let article_id = element_answers.article_id

	// Buscando article por id
	let $article = $ArticlesContainer.find('article[data-id=' + article_id + ']')

	// Buscando la caja de commentario para guardar la respuestas por comentarios
	let $comment_box = $article.find('.box_form_comment')
	let $comment_order = Number(element_answers.comment_id)

	// Obteniendo la posicion de la caja de comentario sobre la cual se esta respondiendo
	let $box_answers = $article.find('div[data-allaswers=' + $comment_order + ']')

	// Template para respuestas
	var template_answer_comment = `<div data-answer="${element_answers.comment_id}" class="answer_id">
									<div>
										<p>${element_answers.article_id}</p>
										<strong >##${element_answers.comment_id}.${element_answers.answer_id}</strong>
										<img src="${element_answers.user_photo}" width="20"/>
										<a href="/plataforma/perfil/${element_answers.user_id}">${element_answers.user_name}</a>
										<p>@${element_answers.user_nick}</p>
										<p>hace ${element_answers.fecha_creacion}</p>
									</div>
									<div>
										<p>${element_answers.answer}</p>
									</div>
									<div class="asnwer__item__counters">
										<div>
											<p class="count_answers_likes_2">
												<p> Me gustas 
													<span data-answercounterlikes="${element_answers.answer_id}">
														${element_answers.counter_likes}
													</span>
												</p>
											</p>
										</div>
									</div>
									<div class="asnwer__item__actions">
										<div>
											<button style="color:gray;" class="btn_like_this_asnwer2" data-answerlike="${element_answers.answer_id}" data-commentliked="${element_answers.comment_id}"> Me gusta </button>
										</div>
										<div>
											<button class="btn_answer_this_asnwer2" data-nameaswer="${element_answers.user_name}" data-idanswer="${element_answers.comment_id}"> Responder </button>
										</div>
									</div>
								</div>`

	$box_answers.append(template_answer_comment)
})
//-----------------------------------LISTO
socket.on('like_by_comment', function (element_like_by_comment) {
	console.log('Like recibido')
	console.log(element_like_by_comment)

	let article_id = element_like_by_comment.article_id
	let comment_id = element_like_by_comment.comment_id

	// Obteniendo el DOM like by comment
	let $article = $ArticlesContainer.find('article[data-id=' + article_id + ']')
	let $counter_likes_by_comment = $article.find('span[data-commentcounterlikes=' + comment_id + ']')
	$counter_likes_by_comment.html(element_like_by_comment.counter_likes)
})
//----------------------------------------LISTO
socket.on('like_by_answer', function (element_like_by_answer) {
	console.log('Like ANSWER recibido')
	console.log(element_like_by_answer)

	// Obteniendo datos del answer 
	let article_id = element_like_by_answer.article_id
	let answer_id = element_like_by_answer.answer_id
	let comment_id = element_like_by_answer.comment_id
	
	// Obteniendo la posicion 
	let answer_position = Number(answer_id) - 1

	// Obteniendo el DOM like by comment
	let $article = $ArticlesContainer.find('article[data-id=' + article_id + ']')
	let $comment_item = $article.find('div[data-comment=' + comment_id + ']')
	
	let $answer_container = $comment_item.find('.box_form_answers_about_this_comment')
	console.log($answer_container)

	//console.log($answer_container.find('span[data-answercounterlikes=' + answer_id + ']'))

	// Buscando el campo DOM de la caja Contenedora
	let data = $answer_container[0]
	
	let $counter_likes_by_answer = $answer_container.find('span[data-answercounterlikes=' + answer_id + ']')
	console.log('Espacio answerr id ')
	console.log($counter_likes_by_answer[0])

	// Pegando el total de likes en el campo definido de este answer
	$counter_likes_by_answer[0].innerHTML = element_like_by_answer.counter_likes
})


