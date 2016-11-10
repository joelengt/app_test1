myApp.controller('editInfoPerfil',['$scope', '$http', 'multipartForm', '$location', '$routeParams', function($scope, $http, multipartForm, $location, $routeParams){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'POST',
		url: '/plataforma/perfil/edit/' + $routeParams.id,
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		console.log(res)
		if (res.data.user_edit) {
			$scope.miUsuario = res.data.user_edit
			$scope.user = res.data.user_edit
			$scope.usuario = res.data.user_edit;
			$scope.first_name = $scope.usuario.first_name;
			$scope.last_name = $scope.usuario.last_name;
			$scope.nickname = $scope.usuario.nickname;
			$scope.email = $scope.usuario.email;
			$scope.genero = $scope.usuario.genero;
			$scope.age = parseInt($scope.usuario.age);
			$scope.lugar = $scope.usuario.lugar;
			$scope.address = $scope.usuario.address;
			$scope.phone = $scope.usuario.phone;
			$scope.categoria = $scope.usuario.categoria;
			$scope.grado = $scope.usuario.grado;
			$scope.social_facebook = $scope.usuario.social_facebook;
			$scope.social_twitter = $scope.usuario.social_twitter;
			$scope.social_instagram = $scope.usuario.social_instagram;

			if ($scope.miUsuario.news === 'si') {
				document.getElementById('yes').checked = true
			}

			if($scope.miUsuario.news === 'no'){
				document.getElementById('not').checked = true
			}

			var inputFile = document.getElementById('exampleInputFile')
			var labelInput = document.getElementById('labelInputFile')

			inputFile.addEventListener('change', function(){
				labelInput.innerHTML = this.value
			})

			$scope.saveUpdate = function(){
				var data
				if ($scope.file != undefined || $scope.file != null || $scope.file != '') {
					data = {
						avatar_perfil: $scope.file,
						first_name: $scope.first_name,
						last_name: $scope.last_name,
						nickname: $scope.nickname,
						email: $scope.email,
						genero: $scope.genero,
						age: $scope.age,
						lugar: $scope.lugar,
						address: $scope.address,
						phone: $scope.phone,
						categoria: $scope.categoria,
						grado: $scope.grado,
						news: $scope.news || 'si',
						url_facebook: $scope.social_facebook,
						url_twitter: $scope.social_twitter,
						url_instagram: $scope.social_instagram
					}

					console.log(data)

					var uploadUrl = '/plataforma/perfil/edit/'+$routeParams.id+'?_method=put';
					multipartForm.post(uploadUrl, data)

					$location.url("/perfil/about/" + $routeParams.id)


				} else {
					data = {
						first_name: $scope.first_name,
						last_name: $scope.last_name,
						nickname: $scope.nickname,
						email: $scope.email,
						genero: $scope.genero,
						age: $scope.age,
						lugar: $scope.lugar,
						address: $scope.address,
						phone: $scope.phone,
						categoria: $scope.categoria,
						grado: $scope.grado,
						news: $scope.news,
						url_facebook: $scope.social_facebook,
						url_twitter: $scope.social_twitter,
						url_instagram: $scope.social_instagram
					}

					console.log(data)

					$http({
						method: 'POST',
						data: data,
						url: '/plataforma/perfil/edit/'+$routeParams.id+'?_method=put'
					}).then(function(res){	
						console.log(res)	
					},function(err){
						console.log(err)
					})
					
					$location.url("/perfil/about/" + $routeParams.id)
					
				}

			}
		} else {
			$location.url('/')
		}
	},function(err){
		$scope.loading = false
		console.log('Ocurrio un error' + err);
	})

}])
