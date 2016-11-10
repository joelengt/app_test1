myApp.controller('messagesController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/comunidad/chat/list'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		$scope.miUsuario = res.data.user
		$scope.user = res.data.user
		$scope.chats = res.data.chats
		//$scope.user = res.data.user
	}, function(err){
		$scope.loading = false
		console.log(err)
	})
}])