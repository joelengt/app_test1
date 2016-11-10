myApp.controller('usersDeleteController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

	// Se obtiene datos del usuario administrador
	$http({
		method: 'GET',
		url: '/plataforma/admin/usuarios',
	}).then(function(res){
		console.log(res)
		$scope.usuario = res.data.user;
	},function(err){
		console.log('Ocurrio un error' + res);
	})
	// Se obtine datos del usuario a eliminar
	$http({
		method:'GET',
		url:'/plataforma/perfil/' + $routeParams.id,
	}).then(function(res){
		console.log(res)
		$scope.user = res.data.user;
	}, function(err){
		console.log('Ocurrio un error'+err)
	})

	// Se realiza el proceso de eliminar al usuario
	$scope.userDelete = function(){

		var data =  {confirmar:$scope.nameConfirm};
		console.log(data);

		$http({
			method: 'POST',
			data: data,
			url: '/plataforma/admin/usuarios/delete/'+$routeParams.id+'?_method=delete'
		}).then(function(res){
			console.log(res)
		}, function(err){
			console.log('Ocurrio un error: '+err)
		})

		$location.url('/admin/usuarios')
	}

}])