myApp.controller('coursesAdminController', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: '/plataforma/admin/cursos'
	}).then(function(res){
		console.log(res)
		$scope.usuario = res.data.user;
		$scope.courses = res.data.cursos;
		// $scope.tags = res.data.cursos.tags;
		console.log($scope.courses);
	},function(err){
		console.log('Ocurrio un error' + res);
	})
}])