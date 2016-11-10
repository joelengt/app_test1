myApp.controller('comunidadController', ['$scope', '$http', 'Socket', function($scope, $http, Socket){
	$http({
		method: 'GET',
		url: '/plataforma/comunidad'
	}).then(function(res){
		console.log(res)
		$scope.user = res.data.user
		$scope.miUsuario = res.data.user
		$scope.usuario = res.data.user
		//$scope.tags = res.data.tags
		$scope.articles = []

		$scope.tags = {
			model: res.data.tags[0],
			tags: []
		}

		for (var i = 0; i < res.data.tags.length; i++) {
			$scope.tags.tags.push(res.data.tags[i])
		}
		var inputText = document.getElementById('published_publish_title')

		var contentText = $('.PublishFriend__contentText')
		var typeQuestion = $('.PublishFriend__typeQuestion')
		var coursesContent = $('.PublishFriend__courses')

		inputText.addEventListener('focus', focusInput)

		function focusInput(){
			if (this.value === '') {
				contentText.css('display', 'block')
				typeQuestion.css('display', 'block')
				coursesContent.css('display', 'block')
			}
		}

		inputText.addEventListener('blur', blurInput)

		function blurInput(){
			if(this.value === '') {
				contentText.css('display', 'none')
				typeQuestion.css('display', 'none')
				coursesContent.css('display', 'none')
			}
		}

		Socket.connect()

		$('#published_publish_multimedia').change(function(e) {
			// SI se sube archivo, deshabiltar el boton de publicar, hasta terminada la subida
			console.log('Evento uploar file activado')
			var file = e.target.files[0]
			console.log('datos del archivo')

			console.log(file)
		    
			var stream = ss.createStream()
			var filename = file.name
		 	
		    // upload a file to the server. 
			ss(Socket).emit('up_file', stream, { name: file.name })
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

		for (var i = 0; i < res.data.articles.length; i++) {
			$scope.articles.push(res.data.articles[i])
		}
		
		var types_publish = ''
		//var tags_publish_id = ''
		//var tags_publish_title = ''

		$scope.Form_comunidad_public = function() {
			//console.log('Evento click ocurriendo')
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
			/*var arr_tags_publish_id = document.querySelectorAll('.published_publish_etiqueta__id')
			
			for(var j = 0 ; j <= arr_tags_publish_id.length - 1; j++) {
				var el = arr_tags_publish_id[j]
				if(el.checked) {
					console.log('EL elemento checked es el: ' + j)
					tags_publish_id = el.id
					tags_publish_title = el.value
					console.log('tag publish id: ' + tags_publish_id)
					console.log('tag publish title: ' + tags_publish_title)
				}
			}*/

			// Datos para enviar por publicación
			var $user_id = document.querySelector('#published_user_id').value
			var $user_name = document.querySelector('#published_user_name').value
			var $user_nick = document.querySelector('#published_user_nick').value
			var $user_grado = document.querySelector('#published_user_grado').value
			var $user_photo = document.querySelector('#published_user_photo').value
			var $publish_title = document.querySelector('#published_publish_title').value
			var $publish_content = document.querySelector('#published_publish_content').value
			var $publish_multimedia = document.querySelector('#published_publish_multimedia_path')
			console.log($publish_multimedia)

			//console.log($user_name)

			var $publish_type = types_publish

			var select = $scope.tags.model

			var etiquetas_tags = {
				id: select.id,
				title: select.title
			}

			// Validacion de limpieza del formulario
			var $msg_alert_box = document.querySelector('#msg_alert_box')

			var data = {
				id: '',
				user_id: $user_id,
				user_name: $user_name,
				user_nick: $user_nick,
				user_grado: $user_grado,
				user_photo: $user_photo,
				publish_type: $publish_type,
				publish_title: $publish_title,
				publish_content: $publish_content,
				publish_multimedia: $publish_multimedia,
				publish_etiqueta: etiquetas_tags,
				fecha_creacion: ''
			}

			if($publish_multimedia !== null) {
				console.log('Publicando con imagen')
				data.publish_multimedia = {
					name: $publish_multimedia.value,
					type: '' // si es image/png, image/ppag
				}
				
			    // Limpiar el preview de imagen
				document.querySelector('#preview_box').innerHTML = ''
			}

			console.log(data)
			
			Socket.emit('comunidad_publish', data)

		    document.querySelector('#published_publish_title').value = ''
		    document.querySelector('#published_publish_content').value = ''
		    document.querySelector('#published_user_name').value = ''
		    document.querySelector('#published_publish_multimedia').value = ''

			return false
		}

		Socket.on('comunidad_publish', function (content) {
			//console.log('content recibo del backend:' + content.publish_multimedia)
			//console.log(content)
			var article = {
				_id: content.id,
				fecha_creacion: content.fecha_creacion,
				number_comments: content.number_comments,
				number_likes: content.number_likes,
				publish_content: content.publish_content,
				publish_etiqueta:{
					id: content.publish_etiqueta.id,
					title: content.publish_etiqueta.title
				},
				publish_title: content.publish_title,
				publish_multimedia: content.publish_multimedia,
				publish_type: content.publish_type,
				user_grado: content.user_grado,
				user_id: content.user_id,
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_photo: content.user_photo,
				users_comments:[],
				status_color: 'gray',
				user_liked:[]
			}

			//console.log(article)

			$scope.$apply(function(){
				$scope.articles.unshift(article)
			})
		})

		$scope.liked = function(id){
			var btn_like = document.querySelector('[data-id="'+id+'"] .btn_article_like')
			let content_like_event = {
				article_id: id,
				user_id: document.querySelector('#published_user_id').value,
				user_name: document.querySelector('#published_user_name').value
			}

			//console.log(content_like_event)

			// Enviando likes por id de articulo
			Socket.emit('like', content_like_event)

			//console.log(btn_like)
			
			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('like', function (element_likes) {
			// Hacer que el propio canal de numero like se modifique al recibir el cambio
			//console.log(element_likes)
			
			let id = element_likes.id
			let num_likes = element_likes.likes
			//let status = element_likes.status

			let counter = document.querySelector('[data-id="'+id+'"] .count_likes')

			counter.innerHTML = num_likes
		})

		$scope.commentPublish = function(id){
			//console.log(id)
			var commentText = document.querySelector('[data-id="'+id+'"] .txt_comment_send')

			//console.log(commentText)

			let $user_id = document.querySelector('#published_user_id').value
			let $user_name = document.querySelector('#published_user_name').value
			let $user_nick = document.querySelector('#published_user_nick').value
			let $user_grado = document.querySelector('#published_user_grado').value
			let $user_photo = document.querySelector('#published_user_photo').value

			//console.log($user_name)

			Socket.emit('comment',{
				article_id: id,
				user_id: $user_id,
				user_name: $scope.user.name,
				user_nick: $user_nick,
				user_photo: $user_photo,
				comment: commentText.value
			})

			commentText.value = ""
		}

		Socket.on('comment', function (element_comments) {
			//console.log(element_comments)
			
			// Hacer que el propio canal de numero like se modifique al recibir el cambio 
			let article_id = element_comments.article_id

			//var commentAdd = []

			var comentario = {
				status_color: 'gray',
				answers:[],
				article_id: element_comments.article_id,
				comment: element_comments.comment,
				comment_id: element_comments.comment_id,
				counter_answers: element_comments.counter_answers,
				counter_likes: element_comments.counter_likes,
				fecha_creacion: element_comments.fecha_creacion,
				user_id: element_comments.user_id,
				user_name: element_comments.user_name,
				user_nick: element_comments.user_nick,
				user_photo: element_comments.user_photo,
				user_liked:[]
			}

			//console.log(comentario)

			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === article_id) {
					//$scope.articles[i].user_comments
					$scope.articles[i].users_comments.push(comentario)
					break
				}
			}
		})

		$scope.likedComment = function(idArticle, orderComment){

			var btn_like = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+orderComment+'"] .btn_like_this_comment')

			let content_like_event_comment = {
				article_id: idArticle,
				comment_id: orderComment,
				user_id: document.querySelector('#published_user_id').value,
				user_name: document.querySelector('#published_user_name').value
			}

			//console.log(content_like_event_comment)

			// Enviando likes por id de articulo
			Socket.emit('like_by_comment', content_like_event_comment)
			
			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('like_by_comment', function (element_like_by_comment) {

			let article_id = element_like_by_comment.article_id
			let comment_id = element_like_by_comment.comment_id

			// Obteniendo el DOM like by comment
			let $counter_likes_by_comment = document.querySelector('[data-id="'+article_id+'"] .comment__item__counters [data-commentcounterlikes="'+comment_id+'"]')
			$counter_likes_by_comment.innerHTML = element_like_by_comment.counter_likes
		})

		$scope.answerComment = function(idArticle, idComment){
			var articleParent = document.querySelector('[data-id="'+idArticle+'"]')

			let $comment_order = idComment

			$articleParent = $(articleParent)
			//console.log($articleParent)

			let $txt_answer_send = $articleParent.find('input[data-txtanswer="' + $comment_order + '"]')
			//console.log($txt_answer_send[0].value)

			// Data de usuario que envia el mensaje
			let $user_id = document.querySelector('#published_user_id').value
			let $user_name = document.querySelector('#published_user_name').value
			let $user_nick = document.querySelector('#published_user_nick').value
			let $user_grado = document.querySelector('#published_user_grado').value
			let $user_photo = document.querySelector('#published_user_photo').value

			Socket.emit('answer',{
				article_id: idArticle,
				comment_id: $comment_order,
				user_id: $user_id,
				user_name: $scope.user.name,
				user_nick: $user_nick,
				user_photo: $user_photo,
				answer: $txt_answer_send[0].value
			})
			$txt_answer_send[0].value = ''
		}

		Socket.on('answer', function (element_answers) {
			let article_id = element_answers.article_id
			let comment_id = element_answers.comment_id
			//console.log(element_answers)

			var response = {
				status_color: 'gray',
				article_id: element_answers.article_id,
				answer: element_answers.answer,
				answer_id:element_answers.answer_id,
				comment_id: element_answers.comment_id,
				counter_likes: element_answers.counter_likes,
				fecha_creacion: element_answers.fecha_creacion,
				user_id: element_answers.user_id, 
				user_name: element_answers.user_name,
				user_nick: element_answers.user_nick,
				user_photo: element_answers.user_photo,
				users_liked: []	
			}

			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === article_id) {
					for (var e = 0; e < $scope.articles[i].users_comments.length; e++) {
						//console.log($scope.articles[i].users_comments[e])
						if ($scope.articles[i].users_comments[e].comment_id === comment_id) {
							//console.log($scope.articles[i].users_comments[e])
							$scope.articles[i].users_comments[e].answers.push(response)
						}
					}
				}
			}
		})

		$scope.answerAnswer = function(idArticle, idComment, idAnswer){
			//let article_id = element_answers.article_id
			var namePerfil, idPerfil
			//let comment_id = element_answers.comment_id
			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === idArticle) {
					for (var e = 0; e < $scope.articles[i].users_comments.length; e++) {
						//console.log($scope.articles[i].users_comments[e])
						if ($scope.articles[i].users_comments[e].comment_id === idComment) {
							for (var o = 0; o < $scope.articles[i].users_comments[e].answers.length; o++) {
								if ($scope.articles[i].users_comments[e].answers[o].answer_id === idAnswer) {
									namePerfil = $scope.articles[i].users_comments[e].answers[o].user_name
									idPerfil = $scope.articles[i].users_comments[e].answers[o].user_id
									//console.log($scope.articles[i].users_comments[e].answers[o].user_name)
								}
							}
						}
					}
				}
			}

			var articleParent = document.querySelector('[data-id="'+idArticle+'"]')

			let $comment_order = idComment

			$articleParent = $(articleParent)
			//console.log($articleParent)

			let $txt_answer_send = $articleParent.find('input[data-txtanswer="' + $comment_order + '"]')
			console.log($txt_answer_send)

			$txt_answer_send[0].value = '@'+namePerfil
		}

		$scope.likedAnswer = function(idArticle, orderComment, orderAnswer){
			console.log(idArticle, orderComment, orderAnswer)

			var btn_like = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+orderComment+'"] [data-answer="'+orderAnswer+'"] .btn_like_this_asnwer2')

			let content_like_event_answer = {
				article_id: idArticle,
				comment_id: orderComment,
				answer_id: orderAnswer,
				user_id: document.querySelector('#published_user_id').value,
				user_name: document.querySelector('#published_user_name').value
			}

			// Enviando likes por id de articulo
			Socket.emit('like_by_answer', content_like_event_answer)
			
			
			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('like_by_answer', function (element_like_by_answer) {

			// Obteniendo datos del answer 
			let article_id = element_like_by_answer.article_id
			let answer_id = element_like_by_answer.answer_id
			let comment_id = element_like_by_answer.comment_id
			
			
			let $counter_likes_by_answer = document.querySelector('[data-id="'+article_id+'"] [data-comment="'+comment_id+'"] [data-answercounterlikes="'+answer_id+'"]')

			// Pegando el total de likes en el campo definido de este answer
			$counter_likes_by_answer.innerHTML = element_like_by_answer.counter_likes
		})

		$scope.$on('$locationChangeStart', function(event){
			Socket.disconnect(true)
		})

	}, function(err){
		console.log(err)
	})	
}])