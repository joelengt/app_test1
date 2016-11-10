myApp.controller('chatController', ['$scope', '$routeParams', '$http', 'Socket', function($scope, $routeParams, $http, Socket){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	//console.log($routeParams)
	$http({
		method: 'POST',
		url: '/plataforma/comunidad/chat/room/'+$routeParams.idRoomChat+'/'+$routeParams.idUser
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.chatContent = res.data.chatContent
		$scope.contentMessages = res.data.chatContent.messages
		$scope.user_edit = res.data.user
		$scope.miUsuario = res.data.user
		// $scope.countMessage = 10

		$scope.messages = []

		for (var i = 0; i < $scope.contentMessages.length; i++) {
			$scope.messages.unshift($scope.contentMessages[i])
		}

		setTimeout(function(){
			var messageBox = document.querySelector('#ContentMessages')
			messageBox.scrollTop = messageBox.scrollHeight
		}, 100)

		Socket.connect()

		Socket.emit('Chatroom', $scope.chatContent._id)

		$('#published_publish_multimedia_to_chat').change(function(e) {
			// SI se sube archivo, deshabiltar el boton de publicar, hasta terminada la subida
			console.log('Evento uploar file activado')
			var file = e.target.files[0]
			console.log('datos del archivo')

			console.log(file)
		    
			var stream = ss.createStream()
		 	
		    // upload a file to the server. 
			ss(Socket).emit('up_file_to_chat', stream, { name: file.name })
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
			  $('#preview_box_to_chat').html(progress_bar)

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

			  	$('#preview_box_to_chat').append(preview_file)
			  
			  }
			})
			 
			blobStream.pipe(stream)
		})

		$scope.newMessage = function(){
			var txt_message = document.getElementById('txt_message')

			console.log(txt_message.value)
			var $message_multi_data = document.querySelector('#published_publish_multimedia_chat_path')
			console.log($message_multi_data)

			var message_data = {
				user_id: $scope.user_edit._id,
				user_full_name: $scope.user_edit.name,
				user_avatar: $scope.user_edit.photo.path,
				message: txt_message.value,
				message_multi_data: $message_multi_data
			}

			if($message_multi_data !== null) {
				console.log('Publicando con imagen')
				message_data.message_multi_data = {
					name: $message_multi_data.value,
					type: '' // si es image/png, image/ppag
				}
				console.log(message_data)

			    // Limpiar el preview de imagen
				document.querySelector('#preview_box_to_chat').innerHTML = ''
			}

			Socket.emit('chat', message_data)

			txt_message.value = ''
		}

		$('#txt_message').keypress(function(tecla){
			if (tecla.keyCode === 13) {

				function sendMessage() {
					var txt_message = document.getElementById('txt_message')
					console.log(txt_message.value)

					if (txt_message.value !== '') {
						var $message_multi_data = document.querySelector('#published_publish_multimedia_chat_path')
						console.log($message_multi_data)

						var message_data = {
							user_id: $scope.user_edit._id,
							user_full_name: $scope.user_edit.name,
							user_avatar: $scope.user_edit.photo.path,
							message: txt_message.value,
							message_multi_data: $message_multi_data
						}

						if($message_multi_data !== null) {
							console.log('Publicando con imagen')
							message_data.message_multi_data = {
								name: $message_multi_data.value,
								type: '' // si es image/png, image/ppag
							}
							console.log(message_data)

						    // Limpiar el preview de imagen
							document.querySelector('#preview_box_to_chat').innerHTML = ''
						}

						Socket.emit('chat', message_data)

						setTimeout(function(){
							txt_message.value = ''
						},0)
					} else {
						console.log('XD')
						setTimeout(function(){
							txt_message.value = ''
						})
					}
				}
				sendMessage()
			}
		})

		Socket.on('chat', function(content){
			console.log(content)
			console.log(content)
			if (content.message_multi_data !== null) {
				var data = {
					data_send: content.dateCreateRoom,
					message: content.message,
					name: content.user_full_name,
					photo:{
						path: content.user_avatar,
					},
					user_id:content.user_id,
					message_multi_data: {
						name: content.message_multi_data.name,
						path: content.message_multi_data.path
					}
				}
			} else {
				var data = {
					data_send: content.dateCreateRoom,
					message: content.message,
					name: content.user_full_name,
					photo:{
						path: content.user_avatar,
					},
					user_id:content.user_id
				}
			}

			$scope.messages.push(data)
			setTimeout(function(){
				var messageBox = document.querySelector('#ContentMessages')
				messageBox.scrollTop = messageBox.scrollHeight
			})
		})

	}, function(err){
		$scop.loading = false
		console.log(err)
	})
}])