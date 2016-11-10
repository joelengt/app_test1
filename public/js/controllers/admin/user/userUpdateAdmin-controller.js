myApp.controller('usersUpdateController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

  // Se obtiene datos del usuario administrador
  $http({
    method: 'GET',
    url: '/plataforma/admin/usuarios',
  }).then(function(res){
    console.log(res)
    $scope.usuario = res.data.user;
  },function(err){
    console.log('Ocurrio un error' + res);
  })
  // Se obtine datos del usuario a eliminar
  $http({
    method:'GET',
    url:'/plataforma/perfil/' + $routeParams.id,
  }).then(function(res){
    console.log(res)
    $scope.user = res.data.user;
    $scope.user = res.data.user_edit;
    $scope.url_facebook = $scope.user.social_facebook,
    $scope.url_twitter = $scope.user.social_twitter,
    $scope.first_name = $scope.user.first_name;
    $scope.last_name = $scope.user.last_name;
    $scope.nickname = $scope.user.nickname;
    $scope.email = $scope.user.email;
    $scope.genero = $scope.user.genero;
    $scope.age = $scope.user.age;
    $scope.lugar = $scope.user.lugar;
    $scope.categoria = $scope.user.categoria;
    $scope.grado = $scope.user.grado;
  }, function(err){
    console.log('Ocurrio un error'+err)
  })



  // Se realiza el proceso de eliminar al usuario
  $scope.userUpdate = function(){

    var data = {
      first_name: $scope.first_name,
      last_name: $scope.last_name,
      nickname: $scope.nickname,
      email: $scope.email,
      genero: $scope.genero,
      age: $scope.age,
      lugar: $scope.lugar,
      categoria: $scope.categoria,
      grado: $scope.grado,
      news: $scope.news,
      social_twitter: $scope.url_twitter,
      social_facebook: $scope.url_facebook,
    }
    console.log(data);

    $http({
      method: 'POST',
      data: data,
      url: '/plataforma/admin/usuarios/update/'+$routeParams.id+'?_method=put'
    }).then(function(res){
      console.log(res)
    }, function(err){
      console.log('Ocurrio un error: '+err)
    })

    $location.url('/admin/usuarios')
  }

}])