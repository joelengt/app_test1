myApp.controller('friendsLateralController', ['$scope', '$http', '$location', function($scope, $http, $location){
	// console.log(serveData.qty)
	// var userId = serveData.qty
	$http({
		method:'GET',
		url: '/plataforma/comunidad/friends/list'
	}).then(function(res){
		console.log(res)
		$scope.friends = res.data.friends

		$scope.goChat = function(id){
			console.log(id)
			$http({
				method:'GET',
				url: '/plataforma/comunidad/chat/list'
			}).then(function(res){
				console.log('Amigos para chatear')
				console.log(res)
				if (res.data.chats.length > 0) {
					for (var i = 0; i < res.data.chats.length; i++) {
						if (res.data.chats[i].user_id === id) {
							console.log('Existe :D '+id)
							console.log(res.data.chats[i])
							var chat = res.data.chats[i]
							$location.url('/chat/'+chat.list.chat_content_id+'/'+chat.user_id)							
						} else {
							$http({
								method: 'POST',
								url: '/plataforma/comunidad/chat/new-chat/' + id
							}).then(function(res){
								console.log(res)
								console.log('#/chat/'+res.data.chat_room+'/'+id)
								//var  room = res.data.chats.
								$location.url('/chat/'+res.data.chat_room+'/'+id)
							}, function(err){
								console.log(err)
							})
						}
					}
				} else {
					console.log('No pasa nada XD')

					$http({
						method: 'POST',
						url: '/plataforma/comunidad/chat/new-chat/' + id
					}).then(function(res){
						console.log(res)
						console.log('#/chat/'+res.data.chat_room+'/'+id)
						//var  room = res.data.chats.
						$location.url('/chat/'+res.data.chat_room+'/'+id)
					}, function(err){
						console.log(err)
					})
				}
			}, function(err){
				console.log(err)
			})
		}
	}, function(err){
		console.log(err)
	})
}])