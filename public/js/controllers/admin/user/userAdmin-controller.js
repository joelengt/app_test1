myApp.controller('usersController', ['$scope', '$http', function($scope, $http){

	$http({
		method: 'GET',
		url: '/plataforma/admin/usuarios'
	}).then(function(res){
		// console.log(res)
		$scope.usuario = res.data.user;
		$scope.usuarios = res.data.usuarios;
		url_delete = $scope.usuario._id;
		// console.log($scope.usuarios)
	},function(err){
		console.log('Ocurrio un error' + res);
	})
}])