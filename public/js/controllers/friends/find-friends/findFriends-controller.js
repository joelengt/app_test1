myApp.controller('findFriendsController',['$scope', '$http', function($scope, $http){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/comunidad/find-friends'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.miUsuario = res.data.user
		$scope.user = res.data.user
	}, function(err){
		$scope.loading = false
		console.log(err)
	})
}])