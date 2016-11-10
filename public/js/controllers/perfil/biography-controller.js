myApp.controller('biographyController', ['$scope', '$http', '$routeParams', 'Socket', '$location', function($scope, $http, $routeParams, Socket, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/muro/'+$routeParams.id
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.miUsuario = res.data.user_edit
		$scope.user = res.data.user
		//$scope.tags = res.data.tags

		$scope.userConnection = res.data.user_edit._id
		$scope.userVisitor = res.data.user._id

		$scope.articles = []

		$scope.tags = {
			model: res.data.tags[0],
			tags: []
		}

		//console.log($scope.tags)

		for (var i = 0; i < res.data.tags.length; i++) {
			$scope.tags.tags.push(res.data.tags[i])
		}

		for (var i = 0; i < res.data.articles.length; i++) {
			$scope.articles.push(res.data.articles[i])
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

		$('#published_publish_multimedia_from_muro').change(function(e) {
			// SI se sube archivo, deshabiltar el boton de publicar, hasta terminada la subida
			console.log('Evento uploar file activado')
			var file = e.target.files[0]
			console.log('datos del archivo')

			console.log(file)
		    
			var stream = ss.createStream()
		 	
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
			  $('#preview_box_to_muro').html(progress_bar)

			  // -> e.g. '42%' 
			  if(Math.floor(size / file.size * 100) === 100) {
			  	console.log('Carga COmpleta')
			    // Habilitar el boton de publicar
				console.log('Ubicacion del archivo')
				var new_path = '../../../../../news/' + file.name

				console.log(new_path)
				// AL obtener el path del archivo subido, colocarlo dentro de los parametros listo para publicar
			  	
			  	//pegando template de contendor de imagen - segun el file.type el tipo de contenerdor de multimedia
			  	var preview_file = document.createElement('img')
			  	preview_file.src = new_path
			  	preview_file.value = file.name
			  	preview_file.id = "published_publish_multimedia_chat_path"
			  	preview_file.width = 100

			  	console.log(preview_file)

			  	$('#preview_box_to_muro').append(preview_file)
			  
			  }
			})
			 
			blobStream.pipe(stream)

			//console.log(blobStream.pipe(stream))
			//stream.pipe(ss.createWriteStream(filename))
		})

		var types_publish = ''

		$scope.Form_comunidad_public = function(){
			if($scope.userConnection === $scope.userVisitor){
				var arr_types_publish = document.querySelectorAll('.published_publish_type')
				
				for(var i = 0 ; i <= arr_types_publish.length - 1; i++) {
					var el = arr_types_publish[i]
					if(el.checked) {
						types_publish = el.value
						console.log('EL elemento checked es el: ' + i)
						console.log('Tipo de publish: ' + types_publish)
					}
				}
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

				var $publish_title = document.querySelector('#published_publish_title').value
				var $publish_content = document.querySelector('#published_publish_content').value
				var $publish_multimedia = document.querySelector('#published_publish_multimedia_chat_path')

				var $publish_type = types_publish

				var select = $scope.tags.model

				var etiquetas_tags = {
					id: select.id,
					title: select.title
				}

				var data = {
					id: '',
					user_id: $scope.miUsuario._id,
					user_name: $scope.miUsuario.name,
					user_nick: $scope.miUsuario.nickname,
					user_grado: $scope.miUsuario.grado,
					user_photo: $scope.miUsuario.photo.path,
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
					document.querySelector('#preview_box_to_muro').innerHTML = ''
				}

				$publish_content.value = ''

				Socket.emit('comunidad_publish', data)

				//console.log(data)
				document.querySelector('#published_publish_title').value = ''
				document.querySelector('#published_publish_content').value = ''
				document.querySelector('#published_publish_multimedia_from_muro').value = ''

				contentText.css('display', 'none')
				typeQuestion.css('display', 'none')
				coursesContent.css('display', 'none')

				var arr_types_publish = document.querySelectorAll('.published_publish_type')

				for(var i = 0 ; i <= arr_types_publish.length - 1; i++) {
					var input = arr_types_publish[i]
					if(input.checked) {
						input.checked = false
					}
				}
			}
		}

		Socket.on('comunidad_publish', function(content){
			console.log(content)
			var data = {
				_id: content.id,
				form_publish_type: 'comunidad',
				fecha_creacion: content.fecha_creacion,
				number_comments: content.number_comments,
				number_likes: content.number_likes,
				publish_content: content.publish_content,
				publish_etiqueta: {
					id: content.publish_etiqueta.id,
					title: content.publish_etiqueta.title,
				},
				publish_multimedia:content.publish_multimedia,
				publish_title: content.publish_title,
				publish_type: content.publish_type,
				status_color: content.status_color,
				user_grado: content.user_grado,
				user_id: content.user_id,
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_photo: content.user_photo,
				users_comments:[],
				users_liked:[]
			}

			//console.log(data)
			//console.log(content)
			if($scope.userVisitor === content.user_id){
				$scope.$apply(function(){
					$scope.articles.unshift(data)
				})
			}
		})

		$scope.likedPublish = function(idArticle){
			//console.log(idArticle)

			let content_like_event = {
				article_id: idArticle,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name
			}

			//console.log(content_like_event)

			Socket.emit('like', content_like_event)

			var btn_like = document.querySelector('[data-id="'+idArticle+'"] .btn_article_like')

			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('like', function(content){
			var idArticle = content.id
			var number_likes = content.likes
			
			if (document.querySelector('[data-id="'+idArticle+'"]')) {
				var counter_likes = document.querySelector('[data-id="'+idArticle+'"] .count_likes')

				counter_likes.innerHTML = number_likes
			}
		})

		$scope.commentPublish = function(idArticle){
			//console.log(idArticle)

			var $txt_comment = document.querySelector('[data-id="'+idArticle+'"] .txt_comment_send')

			var data = {
				article_id: idArticle,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name,
				user_nick: $scope.miUsuario.nickname,
				user_photo: $scope.miUsuario.photo.path,
				comment: $txt_comment.value
			}

			//console.log(data)

			Socket.emit('comment', data)

			$txt_comment.value = ''
		}

		Socket.on('comment', function(content){
			//console.log(content)
			var idArticle = content.article_id

			var data = {
				status_color: 'gray',
				answers:[],
				article_id: content.article_id,
				comment: content.comment,
				comment_id: content.comment_id,
				counter_answers: content.counter_answers,
				counter_likes: content.counter_likes,
				fecha_creacion: content.fecha_creacion,
				user_id: content.user_id,
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_photo: content.user_photo,
				user_liked:[]
			}
			//var 

			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === idArticle) {
					//$scope.articles[i].user_comments
					$scope.$apply(function(){
						$scope.articles[i].users_comments.push(data)
					})
					break
				}
			}
		})

		$scope.likedCommentPublish = function(idArticle, idComment){
			//console.log(idArticle, idComment)
			var article_id = idArticle,
			    orderComment = idComment

			let content_like_event_comment = {
				article_id: article_id,
				comment_id: orderComment,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name
			}

			//console.log(content_like_event_comment)

			var btn_like = document.querySelector('[data-id="'+article_id+'"] [data-comment="'+orderComment+'"] .btn_like_this_comment')

			Socket.emit('like_by_comment', content_like_event_comment)

			//console.log(btn_like)

			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('like_by_comment', function(content){
			var article_id = content.article_id
			var orderComment = content.comment_id
			var count_likes = content.counter_likes

			if(document.querySelector('[data-id="'+article_id+'"] [data-comment="'+orderComment+'"]')){
				var counter_likes = document.querySelector('[data-id="'+article_id+'"] [data-comment="'+orderComment+'"] [data-commentcounterlikes="'+orderComment+'"]')
			//console.log(counter_likes)
				counter_likes.innerHTML = count_likes
			}			
		})

		$scope.answerCommentPublish = function(idArticle, idComment){
			var article_id = idArticle
			var orderComment = idComment

			var txt_answer_send = document.querySelector('[data-id="'+article_id+'"] [data-comment="'+orderComment+'"] [data-txtanswer="'+orderComment+'"]')
			//console.log(txt_answer_send.value)
			var  data = {
				article_id: article_id,
				comment_id: orderComment,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name,
				user_nick: $scope.miUsuario.nickname,
				user_photo: $scope.miUsuario.photo.path,
				answer: txt_answer_send.value
			}

			//console.log(data)

			Socket.emit('answer', data)

			txt_answer_send.value = ''
		}

		Socket.on('answer', function(content){
			var article_id = content.article_id
			var orderComment = content.comment_id

			var data = {
				status_color: 'gray',
				article_id: content.article_id,
				answer: content.answer,
				answer_id:content.answer_id,
				comment_id: content.comment_id,
				counter_likes: content.counter_likes,
				fecha_creacion: content.fecha_creacion,
				user_id: content.user_id, 
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_photo: content.user_photo,
				users_liked: []
			}

			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === article_id) {
					for (var e = 0; e < $scope.articles[i].users_comments.length; e++) {
						//console.log($scope.articles[i].users_comments[e])
						if ($scope.articles[i].users_comments[e].comment_id === orderComment) {
							//console.log($scope.articles[i].users_comments[e])
							$scope.$apply(function(){
								$scope.articles[i].users_comments[e].answers.push(data)
							})
							break
						}
					}
				}
			}
		})

		$scope.likedAnswerPublish = function(idArticle, idComment, idAnswer){
			//console.log(idArticle, idComment, idAnswer)

			var btn_like = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+idComment+'"] [data-answer="'+idAnswer+'"] [data-answerlike="'+idAnswer+'"]')
			//console.log(btn_like)

			let content_like_event_answer = {
				article_id: idArticle,
				comment_id: idComment,
				answer_id: idAnswer,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name
			}

			//console.log(content_like_event_answer)

			Socket.emit('like_by_answer', content_like_event_answer)

			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('like_by_answer', function(content){
			var article_id = content.article_id
			var comment_id = content.comment_id
			var answer_id = content.answer_id
			var counter_likes = content.counter_likes
			//console.log(content)

			if (document.querySelector('[data-id="'+article_id+'"] [data-comment="'+comment_id+'"] [data-answer="'+answer_id+'"]')) {
				var count_likes = document.querySelector('[data-id="'+article_id+'"] [data-comment="'+comment_id+'"] [data-answer="'+answer_id+'"] [data-answercounterlikes="'+answer_id+'"]')

				//console.log(count_likes)

				count_likes.innerHTML = counter_likes
			}
		})

		//-------------------------------------------------------------- Friend Publish

		/*if ($scope.userConnection !== $scope.userVisitor) {
			console.log('Eres visitante')
			Socket.emit('MuroFriend', $scope.user._id)
			Socket.on('connect', function() {
			  // Connected, let's sign-up for to receive messages for this room
				Socket.emit('MuroFriend', MuroFriend)
			})
		}

		/*Socket.on('connect', function() {
		   // Connected, let's sign-up for to receive messages for this room
		})*/
		//Socket.emit('MuroFriend', $scope.user._id)

		Socket.emit('MuroFriend', $scope.user._id)

		$scope.uploading = function(element){
			// SI se sube archivo, deshabiltar el boton de publicar, hasta terminada la subida
			console.log('Evento uploar file activado')
			var file = element.files[0]
			console.log('datos del archivo')

			console.log(file)
		    
			var stream = ss.createStream()
		 	
		    // upload a file to the server. 
			ss(Socket).emit('up_file_to_muro_friend', stream, { name: file.name })
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
			  $('#preview_box_to_muro_from_friend').html(progress_bar)

			  // -> e.g. '42%' 
			  if(Math.floor(size / file.size * 100) === 100) {
			  	console.log('Carga COmpleta')
			    // Habilitar el boton de publicar
				console.log('Ubicacion del archivo')
				var new_path = '../../../../news/' + file.name

				console.log(new_path)
				// AL obtener el path del archivo subido, colocarlo dentro de los parametros listo para publicar
			  	
			  	//pegando template de contendor de imagen - segun el file.type el tipo de contenerdor de multimedia
			  	var preview_file = document.createElement('img')
			  	preview_file.src = new_path
			  	preview_file.value = file.name
			  	preview_file.id = "published_publish_multimedia_write_friend_path"
			  	preview_file.width = 100

			  	console.log(preview_file)

			  	$('#preview_box_to_muro_from_friend').append(preview_file)
			  
			  }
			})
			 
			blobStream.pipe(stream)

			//console.log(blobStream.pipe(stream))
			//stream.pipe(ss.createWriteStream(filename))
		}

		var user_visitant = $scope.miUsuario
		var user_owner = $scope.user


		$scope.publishHere = function(){
			var $publish_content = document.querySelector('#published_publish_to_friend_content')
			var $publish_multimedia = document.querySelector('#published_publish_multimedia_write_friend_path')

			var $msg_alert_box = document.querySelector('#msg_alert_to_friend_box')

			var message_to_friend = {
				id: '',
				user_onwer_id: user_owner._id,
				user_author_id: user_visitant._id,
				user_name: user_visitant.name,
				user_nick: user_visitant.nickname,
				user_grado: user_visitant.grado,
				user_photo: user_visitant.photo.path,
				publish_content: $publish_content.value,
				publish_multimedia: $publish_multimedia,
				fecha_creacion: ''
			}

			if($publish_multimedia !== null) {
				console.log('Publicando con imagen')
				message_to_friend.publish_multimedia = {
					name: $publish_multimedia.value,
					type: '' // si es image/png, image/ppag
				}
			    // Limpiar el preview de imagen
				document.querySelector('#preview_box_to_muro_from_friend').innerHTML = ''
			}


			//console.log('Data a publicar en el perfil de amigo')
			//console.log(message_to_friend)

			Socket.emit('muro_friend_publish', message_to_friend)

			$publish_content.value = ''
			//$publish_multimedia.value = ''
		}

		Socket.on('muro_friend_publish', function(content){
			//console.log(content)

			data = {
				form_publish_type: 'muro_friend',
				_id: content.id,
				fecha_creacion: content.fecha_creacion,
				number_comments: content.number_comments,
				number_likes: content.number_likes,
				publish_content: content.publish_content,
				publish_multimedia: content.publish_multimedia,
				status_color: 'gray',
				user_author_id: content.user_author_id,
				user_grado: content.user_grado,
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_onwer_id: content.user_onwer_id,
				user_photo: content.user_photo,
				users_comments: [],
				publish_multimedia: content.publish_multimedia,
				users_liked: []
			}

			//console.log(data)
			$scope.$apply(function(){
				$scope.articles.unshift(data)
			})
		})

		$scope.likedPublishFriend = function(idArticle){
			let content_like_event = {
				article_id: idArticle,
				user_id: user_visitant._id,
				user_name: user_visitant.name
			}
			//console.log(content_like_event)

			Socket.emit('muro_friend_publish_like', content_like_event)

			var btn_like = document.querySelector('[data-id="'+idArticle+'"] .btn_article_to_friend_like')

			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('muro_friend_publish_like', function (element_likes) {
			//console.log(element_likes)

			let id = element_likes.id
			let num_likes = element_likes.likes
			//let status = element_likes.status

			//if (document.querySelector('[data-id="'+id+'"]')) {
			var counter = document.querySelector('[data-id="'+id+'"] .count_likes')
			counter.innerHTML = num_likes
			//}
		})

		$scope.commentPublishFriend = function(idArticle){
			var txt_comment = document.querySelector('[data-id="'+idArticle+'"] .txt_comment_send')
			//console.log(txt_comment.value)

			Socket.emit('muro_friend_publish_comment',{
				article_id: idArticle,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name,
				user_nick: $scope.miUsuario.nickname,
				user_photo: $scope.miUsuario.photo.path,
				comment: txt_comment.value
			})

			txt_comment.value = ''
		}

		Socket.on('muro_friend_publish_comment', function(content){

			var data = {
				status_color: 'gray',
				answers:[],
				article_id: content.article_id,
				comment: content.comment,
				comment_id: content.comment_id,
				counter_answers: content.counter_answers,
				counter_likes: content.counter_likes,
				fecha_creacion: content.fecha_creacion,
				user_id: content.user_id,
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_photo: content.user_photo,
				user_liked:[]
			}

			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === content.article_id) {
					//$scope.articles[i].user_comments
					$scope.$apply(function(){
						$scope.articles[i].users_comments.push(data)
					})
					break
				}
			}
		})

		$scope.likedCommentFriend = function(idArticle, idComment){
			//console.log(idComment, idArticle)
			var btn_like = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+idComment+'"] .btn_like_this_comment')

			//console.log(btn_like)

			let content_like_event_comment = {
				article_id: idArticle,
				comment_id: idComment,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name
			}

			//console.log(content_like_event_comment)

			Socket.emit('muro_friend_publish_like_by_comment', content_like_event_comment)


			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		Socket.on('muro_friend_publish_like_by_comment', function(content){
			 var article_id = content.article_id
			 var orderComment = content.comment_id
			 var counter_likes = content.counter_likes

			 var count_likes = document.querySelector('[data-id="'+article_id+'"] [data-comment="'+orderComment+'"] [data-commentcounterlikes="'+orderComment+'"]')
			 //console.log(count_likes)

			 count_likes.innerHTML = counter_likes
		})

		$scope.answerCommentFriend = function(idArticle, idComment){
			//console.log(idArticle, idComment)

			var txt_answer_send = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+idComment+'"] [data-txtanswer="'+idComment+'"]')
			//console.log(txt_answer_send.value)

			var data = {
				article_id: idArticle,
				comment_id: idComment,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name,
				user_nick: $scope.miUsuario.nickname,
				user_photo: $scope.miUsuario.photo.path,
				answer: txt_answer_send.value
			}

			Socket.emit('muro_friend_publish_answer', data)

			//console.log(data)

			txt_answer_send.value = ''
		}
		
		Socket.on('muro_friend_publish_answer', function(content){
			var article_id = content.article_id
			var orderComment = content.comment_id

			//console.log(content)

			var data = {
				status_color: 'gray',
				article_id: content.article_id,
				answer: content.answer,
				answer_id:content.answer_id,
				comment_id: content.comment_id,
				counter_likes: content.counter_likes,
				fecha_creacion: content.fecha_creacion,
				user_id: content.user_id, 
				user_name: content.user_name,
				user_nick: content.user_nick,
				user_photo: content.user_photo,
				users_liked: []
			}

			for (var i = 0; i < $scope.articles.length; i++) {
				if ($scope.articles[i]._id === article_id) {
					for (var e = 0; e < $scope.articles[i].users_comments.length; e++) {
						//console.log($scope.articles[i].users_comments[e])
						if ($scope.articles[i].users_comments[e].comment_id === orderComment) {
							//console.log($scope.articles[i].users_comments[e])
							$scope.$apply(function(){
								$scope.articles[i].users_comments[e].answers.push(data)
							})
							break
						}
					}
				}
			}
		})

		$scope.likedAnswerFriend = function(idArticle, idComment, idAnswer){
			//console.log(idAnswer, idComment, idArticle)

			var btn_like = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+idComment+'"] [data-answer="'+idAnswer+'"] [data-answerlike="'+idAnswer+'"]')

			//console.log(btn_like)

			let content_like_event_answer = {
				article_id: idAnswer,
				comment_id: idComment,
				answer_id: idAnswer,
				user_id: $scope.miUsuario._id,
				user_name: $scope.miUsuario.name
			}

			Socket.emit('muro_friend_publish_like_by_answer', content_like_event_answer)
			console.log(content_like_event_answer)

			if(btn_like.style.color === 'blue'){
				btn_like.style.color = 'gray'
			
			} else if (btn_like.style.color === 'gray'){
				btn_like.style.color = 'blue'
			
			} else {
				console.log('Error en la seleccion del button')
			}
		}

		//Por arreglar
		Socket.on('muro_friend_publish_like_by_answer', function(content){
			console.log(content)
		})

		$scope.answerAnswerFriend = function(idArticle, idComment, idAnswer){
			//console.log(idAnswer, idArticle, idComment)

			var txt_answer_send = document.querySelector('[data-id="'+idArticle+'"] [data-comment="'+idComment+'"] [data-txtanswer="'+idComment+'"]')

			//console.log(txt_answer_send)

			txt_answer_send.value = '@'+ $scope.miUsuario.name
		}

		$scope.$on('$locationChangeStart', function(event){
			Socket.disconnect(true)
		})

	}, function(err){
		$scope.loading = false
		console.log(err)
	})

}])