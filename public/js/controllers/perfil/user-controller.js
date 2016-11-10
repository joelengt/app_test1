myApp.controller('userController', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: '/plataforma/bienvenida'
	}).then(function(res){
		console.log(res)
		$scope.usuario = res.data.user;
	},function(err){
		console.log('Ocurrio un error' + res);
	})
}])