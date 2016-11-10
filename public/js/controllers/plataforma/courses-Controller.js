myApp.controller('coursesController', ['$scope', 'serveData', '$http', '$location', function($scope, serveData, $http, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {
			console.log(res)
			$scope.usuario = res.data.user;
			$scope.courses = res.data.cursos;

			$scope.idUser = res.data.user._id

			serveData.qty = $scope.idUser
			// $scope.tags = res.data.cursos.tags;
			console.log($scope.courses);			
		} else {
			$location.url('/')
		}
		if (res.data.user.genero || res.data.user.categoria || res.data.user.grado){
			$location.url('/plataforma/cursos')
		} else {
			$location.url('/update/completar-datos')
		}
	},function(err){
		$scope.loading = false
		console.log('Ocurrió un error' + res);
	})
}])