myApp.controller('articleEventController', ['$scope', '$http', '$routeParams', 'Socket', function($scope, $http, $routeParams, Socket){
	$http({
		method: 'GET',
		url: '/plataforma/muro/'+$routeParams.id_user+'/item/'+$routeParams.event_type+'/'+$routeParams.id_article
	}).then(function(res){
		console.log(res)
		$scope.user = res.data.user_edit
		$scope.miUsuario = res.data.user_edit
		$scope.article = res.data.article

		Socket.connect()

		$scope.userConnection = res.data.user_edit._id
		$scope.userVisitor = res.data.user._id

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

			$scope.article.users_comments.push(data)
			// for (var i = 0; i < $scope.articles.length; i++) {
			// 	if ($scope.articles[i]._id === idArticle) {
			// 		//$scope.articles[i].user_comments
			// 		$scope.$apply(function(){
			// 		})
			// 		break
			// 	}
			// }
		})

		var user_visitant = $scope.miUsuario
		var user_owner = $scope.user

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

			$scope.article.users_comments.push(data)
			// for (var i = 0; i < $scope.articles.length; i++) {
			// 	if ($scope.articles[i]._id === content.article_id) {
			// 		//$scope.articles[i].user_comments
			// 		$scope.$apply(function(){
			// 		})
			// 		break
			// 	}
			// }
		})

	}, function(err){
		console.log(err)
	})
}])