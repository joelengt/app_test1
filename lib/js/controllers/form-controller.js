// var myApp = angular.module('ascent', []);
myApp.controller('formulario', ['$scope',' $http', function($scope, $http){
	// $scope.nombre = 'Jorge';
	$http({
			method: 'GET',
			url: '/plataforma/start'
		}).then(function(res){
			// console.log(res);
			$scope.usuario = res.data;
		},function(err){
			console.log('Ocurrio un error' + res);
		})

	$scope.sendDate = function(){
		console.log('Hola mama');
		var data = {
			photo: $scope.newCharacter.photo,
			name: $scope.newCharacter.name,
			age: $scope.newCharacter.age,
			group: $scope.newCharacter.group,
			occupation: $scope.newCharacter.occupation
		}

		$http({
			method: 'POST',
			data: data,
			url: 'http://apipersonajes.herokuapp.com/api/personaje'
		}).then(function(res){
		
			$scope.newCharacter = {}
		
		},function(err){
			console.log(err);
		})
	}
}])