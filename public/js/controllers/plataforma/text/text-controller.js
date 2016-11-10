myApp.controller('textCourseController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$http({
		method: 'GET',
		url: '/plataforma/cursos/'+$routeParams.id +'/textos'
	}).then(function(res){
		if (res.data.user) {
			console.log(res)
			$scope.curso = res.data.curso;
			$scope.usuario = res.data.user;
			$scope.textos = res.data.textos
			console.log($scope.textos);
		}else{
			$location.url('/')
		}
	},function(err){
		console.log(err)
	})
}])
