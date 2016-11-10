myApp.controller('ChatListController', ['$scope', '$routeParams', '$http', '$location', function($scope, $routeParams, $http, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method:'GET',
		url: '/plataforma/comunidad/chat/list-friends'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.friends = res.data.friends
		$scope.miUsuario = res.data.user
		$scope.user = res.data.user
		// $scope.friends = res.data.friends

		$scope.initialChat = function(id){
			console.log(id)
			var id_friend = id
			$http({
				method:'POST',
				url: '/plataforma/comunidad/chat/new-chat/' + id_friend
			}).then(function(res){
				console.log(res)
				var room;

				/*var room = res.data.chats[0].list.chat_content_id
				console.log(room)*/

				for (var i = 0; i < res.data.chats.length; i++) {
					if (res.data.chats[i].user_id === id_friend) {
						room = res.data.chats[i].list.chat_content_id
						console.log(room)
						break
					}
				}

				console.log('#/chat/'+room+'/'+id_friend)
				//var  room = res.data.chats.
				$location.url('/chat/'+room+'/'+id_friend)
			}, function(err){
				console.log(err)
			})
		}
	}, function(err){
		$scope.loading = false
		console.log(err)
	})
}])