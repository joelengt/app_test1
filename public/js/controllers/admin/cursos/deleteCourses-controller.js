myApp.controller('deleteCoursesController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$http({
		method: 'GET',
		url: '/plataforma/admin/cursos/'+$routeParams.id
	}).then(function(res){
		console.log(res)
		$scope.curso = res.data.curso;
	},function(err){
		console.log('Ocurrio un error' + res);
	})

	$scope.deleteCourse = function(){

		var data = {
			curso_confirmar: $scope.curso_confirmar,
		}

		$http({
			method: 'POST',
			data: data,
			url: '/plataforma/admin/cursos/delete/'+$routeParams.id+'?_method=delete'
		}).then(function(res){
			console.log(res)
		},function(err){
			console.log('Ocurrio un error' + res);
		})
		$location.url('/admin/cursos')
	}
}])
