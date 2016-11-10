myApp.controller('misCursosController', ['$scope', '$http', '$location', function($scope, $http, $location){
	$http({
		method: 'GET',
		url: '/plataforma'
	}).then(function(res){
		console.log(res)
		if (res.data.user.access === 'premium') {
			$scope.user = res.data.user
			$scope.usuario = res.data.user
			$scope.myCourses = []
			$scope.inProgress = []

			$scope.courses = res.data.cursos
			$scope.cursosLection = res.data.user.notas_lecciones.cursos
			
			var notas, idNotasCourse;

			for (var i = 0; i < $scope.courses.length; i++) {
				var idCourse = $scope.courses[i]._id
				// console.log(idCourse)
				for (var e = 0; e < $scope.cursosLection.length; e++) {
					notas = notas || 0
					idNotasCourse = $scope.cursosLection[e].curso_id
					if (idCourse === idNotasCourse) {
						var correctas_muestra = $scope.cursosLection[e].resultados.respuestas_correctas
						notas = notas + parseInt(correctas_muestra)
						// console.log(notas)
					} else {
						notas = 0
					}
					// console.log(notas, idNotasCourse)
				}
				// console.log(notas)
				var muestras = $scope.courses[i].materiales.simulador.muestra.max_questions
				var basico = $scope.courses[i].materiales.simulador.basico.max_questions
				var intermedio = $scope.courses[i].materiales.simulador.intermedio.max_questions
				var avanzado = $scope.courses[i].materiales.simulador.avanzado.max_questions
				var progreso = {
					curso_id: idCourse,
					answer_correct: notas,
					question_muestra: muestras,
					question_basico: basico,
					question_intermedio: intermedio,
					question_avanzado: avanzado,
					questions_max: muestras+basico+intermedio+avanzado
				}

				var data = {
					_id: $scope.courses[i]._id,
					cover: $scope.courses[i].cover,
					createdAt: $scope.courses[i].createdAt,
					description: $scope.courses[i].description,
					icon: $scope.courses[i].icon,
					materiales: $scope.courses[i].materiales,
					promedioRate: $scope.courses[i].promedioRate,
					reseñas: $scope.courses[i].reseñas,
					slogan: $scope.courses[i].slogan,
					tags: $scope.courses[i].tags,
					title: $scope.courses[i].title,
					progreso: progreso,
					colour: $scope.courses[i].colour
				}
				// console.log(data)
				notas = 0
				// console.log('------------------------------------------')
				$scope.myCourses.push(data)
			}
			// console.log(notas)
			for (var i = 0; i < $scope.myCourses.length; i++) {
				if ($scope.myCourses[i].progreso.answer_correct >= 0) {
					$scope.inProgress.push($scope.myCourses[i])
				}
			}

			//console.log('XD')
		} else {
			$location.url('/plataforma/payment/simuladores')
		}
	}, function(err){
		console.log(err)
	})
}])