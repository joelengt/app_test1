myApp.controller('friendsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	// console.log('XD')
	$http({
		method: 'GET',
		url: '/plataforma/friends/'+$routeParams.id
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.miUsuario = res.data.user_edit
		$scope.user = res.data.user
		$scope.friend = res.data.user
		$scope.usuario = res.data.user
		$scope.friends = res.data.friends
	}, function(err){
		$scope.loading = false
		console.log(err)
	})
}])