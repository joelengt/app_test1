myApp.controller('leccionesCourseController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/cursos/'+$routeParams.id+'/simulador/'+$routeParams.name
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {
			console.log(res)
			$scope.usuario = res.data.user
			$scope.curso = res.data.curso
			$scope.niveles = res.data.nivel

			$scope.lections = []

			if (res.data.access === 'true' || !res.data.servicio) {
				$scope.nameLection = $routeParams.name
				$scope.id = $routeParams.id

				for (var i = 0; i < $scope.niveles.length; i++) {
					$scope.lections.push($scope.niveles[i])
				}
			}  else {
				$location.url('/plataforma/payment/simuladores')
				// $scope.service = res.data.servicio
				// var template = 	`<div>
				// 					<div>
				// 						<h1>Accede a Todos los ${$scope.service}</h1>
				// 						<p>a solo
				// 							<h2>S/10.00</h2><a href="/plataforma/payment/form/">Comprar</a>
				// 						</p>
				// 						<div>
				// 							<p>Proceso UPDATE luego de verificiar el pago</p>
				// 							<form action="/plataforma/payment/${$scope.usuario._id}/${$scope.service}?_method=put" method="post">
				// 								<button style="display: block; background: #0dab0e; color: white; width: 150px; text-decoration: none;">Acceder a Todos los ${$scope.service}</button>
				// 							</form>
				// 						</div>
				// 					</div>
				// 					<p>o</p>
				// 					<div>
				// 						<h1>Promo!! Simuladores + Audiolibros</h1>
				// 						<p>a solo
				// 							<h2>S/15.00 <a href="/plataforma/payment/form/premium">Comprar</a></h2>
				// 						</p>
				// 						<div>
				// 							<p>Proceso UPDATE luego de verificiar el pago</p>
				// 							<form action="/plataforma/payment/${$scope.usuario._id}/premium?_method=put" method="post">
				// 								<button style="display: block; background: #0dab0e; color: white; width: 150px; text-decoration: none;">Accede a Todo con premium</button>
				// 							</form>
				// 						</div>
				// 					</div>
				// 				</div>`

				// document.getElementById('ShowLection').innerHTML = template
			}

			/*else {
				$scope.curso = {
					_id: $routeParams.id
				}
			}
			console.log($scope.curso)
			$scope.niveles = res.data.nivel
			$scope.id = $routeParams.id
			$scope.nameLection = $routeParams.name
			if ($scope.niveles === undefined) {
				$scope.niveles = [[
					{
						description: 'Necesitas ser premiun para ver el contenido de esta sección.',
						title: 'Necesitas ser usuario premium'
					}
				]]
				console.log($scope.niveles)
			}*/
			
		}else{
			$location.url('/')
		}
	},function(err){
		$scope.loading = false
		console.log('ocurrió un error: '+err)
	})
}])