myApp.controller('newCourseController', ['$scope', /*'fileUpload',*/ '$http', '$location', function($scope,/* fileUpload,*/ $http, $location){

	$http({
		method:'GET',
		url: '/plataforma/admin/cursos',
	}).then(function(res){
		// console.log(res.data.user)
		$scope.usuarioAdmin = res.data.user;
	}, function(err){
		console.log(err)
	})

	$scope.newCourse = function(){

		/*$scope.cover = '/'+$scope.myFile.name*/

		var data = {
			title: $scope.titulo,
			curso_logo: $scope.cover,
			slogan: $scope.slogan,
			tags: $scope.tags,
			description: $scope.descripcion,
			curso_textos: $scope.curso_texto,
			curso_audioLibros: $scope.curso_audioLibro,
			curso_simulador: $scope.curso_simulador,

		};

		console.log(data)

		/*var file = $scope.myFile;
		console.log('file is ' );
		console.dir(file);
		var uploadUrl = "/uploads";
		fileUpload.uploadFileToUrl(file, uploadUrl);*/

		$http({
			method: 'POST',
			data: data,
			url: '/plataforma/admin/cursos/add',
		}).then(function(res){
			console.log(res)
		}, function(err){
			console.log('Ocurio un error: ' + err);
		})
		$location.path('/admin/cursos/')
	}

}])