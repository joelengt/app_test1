myApp.controller('courseAdminDetailController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	$http({
		method: 'GET',
		url: '/plataforma/admin/cursos/' + $routeParams.id
	}).then(function(res){
		console.log(res)
		$scope.usuario = res.data.user;
		$scope.curso = res.data.curso;
	},function(err){
		console.log(err)
	})
}])