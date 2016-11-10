myApp.controller('simuladorCourseController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$('a').css('pointer-events', 'none')
	$scope.loading = true
	$http({
		method: 'GET',
		url: '/plataforma/cursos/'+$routeParams.id+'/simulador'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {
			console.log($location.path())
			console.log(res)
			$scope.curso = res.data.curso
			$scope.usuario = res.data.user
			$scope.muestra = $scope.curso.materiales.simulador.muestra
			$scope.basico = $scope.curso.materiales.simulador.basico
			$scope.intermedio = $scope.curso.materiales.simulador.intermedio
			$scope.avanzado = $scope.curso.materiales.simulador.avanzado
			//console.log($scope.basico)

			var normalize = (function() {
			  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
			      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
			      mapping = {};
			 
			  for(var i = 0, j = from.length; i < j; i++ )
			      mapping[ from.charAt( i ) ] = to.charAt( i );
			 
			  return function( str ) {
			      var ret = [];
			      for( var i = 0, j = str.length; i < j; i++ ) {
			          var c = str.charAt( i );
			          if( mapping.hasOwnProperty( str.charAt( i ) ) )
			              ret.push( mapping[ c ] );
			          else
			              ret.push( c );
			      }      
			      return ret.join( '' );
			  }			 
			})();

			$scope.basicoName = normalize($scope.basico.title)
		}else{
			$location.url('/')
		}
	},function(err){
		$scope.loading = false
		console.log(err)
	})
}])