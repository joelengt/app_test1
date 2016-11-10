myApp.controller('formController', ['$scope', '$http', '$location', function($scope, $http, $location){
	var url;
	$http({
		method: 'GET',
		url: '/plataforma/start'
	}).then(function(res){
		// console.log(res);
		if (res.data.user.genero || res.data.user.categoria || res.data.user.grado) {
			$location.url('/plataforma/cursos')
		} else {
			url = '/plataforma/start/save/'+res.data.user._id+'?_method=put';
			$scope.usuario = res.data.user;
		}

	},function(err){
		console.log('Ocurrio un error' + res);
	})

	$scope.ocultarCategoria = true;
	$scope.ocultarSubOficiales = true;
	$scope.ocultarOficiales = true;

	$scope.hideGender = function(){
		$scope.ocultarGenero = true;
		$scope.ocultarCategoria = false;
	}

	$scope.hideCategory = function(){
		if ($scope.categoria == 'oficial') {
			$scope.ocultarOficiales = false;
		} else {
			$scope.ocultarSubOficiales = false;
		}
		$scope.ocultarCategoria = true;
	}

	$scope.sendDate = function(){
		// console.log(url);
		
		var data = {
			genero: $scope.genero,
			categoria: $scope.categoria,
			grado: $scope.grado,
		}

		$http({
			method: 'POST',
			data: data,
			url: url,
		}).then(function(res){		
			console.log(res)		
		},function(err){
			console.log(err)
		})
		$location.url("/bienvenida")
	}
}])