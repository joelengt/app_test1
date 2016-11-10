myApp.controller('myFriendsController', ['$scope', '$http', function($scope, $http){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/comunidad/friends/list'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.miUsuario = res.data.user
		$scope.user = res.data.user
		$scope.friends = res.data.friends
	}, function(err){
		$scope.loading = false
		console.log(err)
	})
}])