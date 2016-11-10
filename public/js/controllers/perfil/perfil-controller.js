myApp.controller('perfilInfoController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/perfil/'+$routeParams.id
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {
			console.log(res);
			$scope.usuario = res.data.user;
			$scope.user = res.data.user;
			$scope.miUsuario = res.data.user_edit;

			$scope.userConnection = res.data.user_edit._id
			$scope.userVisitor = res.data.user._id

			$scope.editInfo = function(){
				if ($scope.userConnection === $scope.userVisitor) {
					$location.url('/perfil/about/editar/'+ $scope.miUsuario._id)
				}
			}
			
		} else {
			$location.url('/')
		}
		
	},function(err){
		$scope.loading = false
		console.log('Ocurrio un error' + res);
	})
}])