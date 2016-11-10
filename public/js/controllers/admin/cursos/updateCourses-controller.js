myApp.controller('updateCoursesController', ['$scope', 'fileUpload', '$http', '$routeParams', '$location', function($scope, fileUpload, $http, $routeParams, $location){
	$http({
		method: 'GET',
		url: '/plataforma/admin/cursos/' + $routeParams.id
	}).then(function(res){
		console.log(res)
		$scope.usuario = res.data.user;
		$scope.curso = res.data.curso;
		$scope.title = $scope.curso.title;
		$scope.curso_logo = $scope.curso.curso_logo;
		$scope.slogan = $scope.curso.slogan;
		$scope.tags = $scope.curso.tags;
		$scope.description = $scope.curso.description;
		$scope.cursos_textos = $scope.curso.cursos_textos;
		$scope.curso_audioLibros = $scope.curso.curso_audioLibros;
		$scope.curso_simuladores = $scope.curso.curso_simuladores;
	},function(err){
		console.log('Ocurrió un error: '+err)
	})

	$scope.updateCourse = function(){

		var avatar_perfil = $scope.myFile;

		var data = {
			cover: avatar_perfil,
			title: $scope.title,
			curso_logo: $scope.cover,
			slogan: $scope.slogan,
			tags: $scope.tags,
			description: $scope.description,
			cursos_textos: $scope.cursos_textos,
			curso_audioLibros: $scope.curso_audioLibros,
			curso_simuladores: $scope.curso_simuladores,
		}

		console.log(data)

		//var textos = $scope.cursos_textos;
		//var audio = $scope.cursos_audioLibros;
		//var simuladores = $scope.curso_simuladores;
		//console.log('file is ' );
		//console.dir(textos, audio, simuladores);
		console.dir(avatar_perfil)
		var uploadUrl = "/uploads";
		fileUpload.uploadFileToUrl(avatar_perfil, uploadUrl)
		//fileUpload.uploadFileToUrl(textos, uploadUrl);
		//fileUpload.uploadFileToUrl(audio, uploadUrl);
		//fileUpload.uploadFileToUrl(simuladores, uploadUrl);

		$http({
			method:'POST',
			data: data,
			url: '/plataforma/admin/cursos/update/'+$routeParams.id+'?_method=put'
		}).then(function(res){
			console.log(res)
		}, function(err){
			console.log('Ocurrió un error: '+err)
		})

		$location.url('/admin/cursos/detail/'+$routeParams.id)
	}
}])