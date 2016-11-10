myApp.controller('findFriendFacebook', ['$scope', '$http', function($scope, $http){
	$scope.loading = true
	$http({
		method: 'GET',
		url: '/plataforma/comunidad/find-friends/by-facebook'
	}).then(function(res){
		$scope.loading = false
		console.log(res)
		$scope.user = res.data.user
		$scope.miUsuario = res.data.user

		$scope.friends = []

		var user_data = {
			id: $scope.user.provider_id,
			token_facebook: $scope.user.token,
			data_id: $scope.user._id
		}
		// console.log(`https://graph.facebook.com/v2.6/${user_data.id}/friends?access_token=${user_data.token_facebook}`)
		$http({
			method: 'GET',
			url: `https://graph.facebook.com/v2.6/${user_data.id}/friends?access_token=${user_data.token_facebook}`
		}).then(function(res){
			console.log(res)
			var friends = res.data.data
			for (var i = 0; i < friends.length; i++) {
				$scope.friends.push(friends[i])
			}

			// $http({
			// 	method: 'GET',
			// 	url: '/plataforma/comunidad/friends/list'
			// }).then(function(res){
			// 	console.log(res)
			// 	var myFriends = res.data.friends

			// 	console.log(myFriends.length)
				
			// 	for (var i = 0; i < friends.length; i++) {

			// 		for (var e = 0; e < myFriends.length; e++) {
			// 			if (friends[i].id !== myFriends[e].provider_id) {
			// 				console.log('Estos no coinciden')
			// 				console.log(i)
			// 				console.log(friends[i])
			// 				$scope.friends.push(friends[i])
			// 			} else {
			// 				console.log('XD')
			// 			}
			// 		}

			// 		// if (myFriends.length > 0) {


			// 		// } else {
			// 		// 	$scope.friends.push(friends[i])
			// 		// }

			// 	}

			// }, function(err){
			// 	console.log(res)
			// })

			console.log($scope.friends)
		}, function(err){
			console.log(err)
		})

		$scope.addFriend = function(id){
			// console.log(this)
			var url_send = '/plataforma/comunidad/find-friends/by-facebook/add/'+id
			console.log(document.getElementById(id))
			$http({
				method: 'POST',
				url: url_send
			}).then(function(res){
				console.log(res)
				document.getElementById(id).innerHTML = '<span class="icon-ascent-correcto Aggregate"></span>'
			}, function(err){
				console.log(err)
			})
		}
	}, function(err){
		$scope.loading = false
		console.log(err)
	})
}])