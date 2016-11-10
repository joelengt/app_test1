myApp.controller('courseDetailController', ['$scope', '$http', '$routeParams', '$location', 'Socket', function($scope, $http, $routeParams, $location, Socket){
	$scope.loading = true
	$('a').css('pointer-events', 'none')

	$http({
		method: 'GET',
		url: '/plataforma/cursos/' + $routeParams.id
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')

		//console.log(res)
		if (res.data.user) {
			$scope.curso = res.data.curso;
			$scope.usuario = res.data.user;
			$scope.resenias = res.data.resenias;

			var textTitle = $scope.curso.title

			if (textTitle.length > 70) {
				$('#titleCourse').css('font-size', '16px')
			}

			// var maxCharacter = textTitle.html().substring(0, 70)
			// console.log(maxCharacter)

			$scope.reseniaContent = 3

			/*$scope.$apply(function(){
				if ($scope.reseniaContent <= $scope.resenias.cantidad) {
					$('#more').css.display = 'block'
				}
			})*/

			if ($scope.reseniaContent <= $scope.resenias.cantidad) {
				$('#more').css('display', 'block')
			}

			//Se inicia conxion con Socket.io
			Socket.connect();

			var room = $routeParams.id
			Socket.emit('room', room)


			$scope.numberResenias = $scope.resenias.cantidad
			$scope.reseniasLimited = []

			var rate = parseInt($scope.resenias.promedio_rate)

			for (var i = 0; i < $scope.resenias.contenido.length; i++) {
				$scope.reseniasLimited.push($scope.resenias.contenido[i])
			}

			//Vista del rate en curso
			$('.start:lt('+rate+')').css('color','#f8c705')
			//Vista del promedio rate del curso
			if ($('.rate:checked')) {
				var value = $('.rate:checked ').attr('id');
				for (var i = 1; i <= $('.rate:checked ').attr('id'); i++) {
					if (i === 1) {
						value = 'one'
					} else if (i === 2) {
						value = 'two'
					} else if(i === 3){
						value = 'three'
					} else if(i === 4){
						value = 'four'
					} else {
						value = 'five'
					}
					$('#'+value+' label').find('.startRate').css('opacity', '1')
				}
			}


			$('.startRate').on('click', startChecked)

			//Resaltado de strellas segun el rate seleccionado
			function startChecked(){
				var elementChecked = $(this).parent('label').attr('for')
				for (var i = 1; i <= elementChecked; i++) {
					if (i === 1) {
						value = 'one'
					} else if (i === 2) {
						value = 'two'
					} else if(i === 3){
						value = 'three'
					} else if(i === 4){
						value = 'four'
					} else {
						value = 'five'
					}
					$('#'+value+' label').find('.startRate').css('opacity', '1')
				}
				for (var i = 5; i > elementChecked; i--) {
					if (i === 1) {
						value = 'one'
					} else if (i === 2) {
						value = 'two'
					} else if(i === 3){
						value = 'three'
					} else if(i === 4){
						value = 'four'
					} else {
						value = 'five'
					}
					$('#'+value+' label').find('.startRate').css('opacity', '.3')
				}
			}

			//Close de ventana modal de formResenias
			$('#closeModal').on('click', closeModal)

			function closeModal(){
				$('#ModalForm').css('display', 'none')
			}

			$scope.more = function(){
				$('#resenia_item').css('overflow-y', 'overlay')
				$scope.reseniaContent += 3
				if ($scope.reseniaContent >= $scope.resenias.cantidad) {
					$('#more').css('display', 'none')
				}
				setTimeout(function(){
					$('#resenia_item .item').css('margin', '0 0 .5em')
				}, 10)
			}

			//$scope.starts = 5

			//Fuction a button add-comment and resenia
			$('#addComment').on('click', addComment)

			function addComment(){
				$('#ModalForm').css('display', 'flex')
			}
			
			var rate_user = 0
			var $msg_alert_box = document.querySelector('#msg_alert_box')

			$scope.comments = function(){


				var arr = document.querySelectorAll('.rate')

				for(var i = 0; i <= arr.length - 1; i++) {
				  var el = arr[i]
				  if(el.checked) {
				    console.log('EL elemento checked es el: ' + i)
				    rate_user = Number(el.value)
				  }
				}

				var $type_categority = 'curso'
				var $topic_id = document.querySelector('#topic_id').value
				var $topic_title = document.querySelector('#topic_title').value
				var $user_full_name = document.querySelector('#user_full_name').value
				var $user_avatar = document.querySelector('#user_avatar').value
				var $comment = $('#comment').val()

					
				var msg = ''
				$msg_alert_box.innerHTML = ''

				if(rate_user > 0 && $comment !== '') {

					$scope.numberResenias = $scope.numberResenias + 1

					Socket.emit('resenia', {
						id: '',
						type_categority: $type_categority,
						topic_id:  $topic_id,
						topic_title: $topic_title,
						user_full_name: $user_full_name,
						user_avatar: $user_avatar,
						rate: rate_user,
						comment: $comment,
						createdAt: ''
					})

				    $('#rate').val('')
				    $('#comment').val('')

				   /*if ($scope.reseniasLimited.length >= 4) {
				    	$scope.reseniasLimited.pop()
				    }*/

				} else if (rate_user === 0){
					msg = 'Primero tienes que puntuar!!'
					$msg_alert_box.innerHTML += msg

				} else if ($comment === '' || $comment === null) {
					msg = 'Primero tienes que comentar!!'
					$msg_alert_box.innerHTML += msg

				} else {
					msg = 'Tienes que puntuar y comentar primero!!'
					$msg_alert_box.innerHTML += msg
				}	

				/*if ($scope.resenias.contenido.length > 5) {
					$('#resenia_item:last-child').remove()
				}*/
				$('#ModalForm').css('display', 'none')
				return false
			}

			Socket.on('resenia', function (content) {
				$scope.$apply(function(){
					$scope.reseniasLimited.unshift(content)
				})
			})

			/*$('#two').on('click', showMoreComments)

			function showMoreComments(){
				$('.item:gt(2)').animate({
					display: 'none'
				}, 1000)
				$('.item:not(.item:gt(2))').animate({
					display: 'block'
				}, 1000)

			}

			$('#first').on('click', showBeforeComments)

			function showBeforeComments(){
				$('.item:not(.item:gt(2))').css('display', 'block')
				$('.item:gt(2)').css('display', 'none')
			}*/

			$scope.$on('$locationChangeStart', function(event){
				Socket.disconnect(true)
			})

		}else{
			$scope.loading = false
			$location.url('/')
		}
	},function(err){
		console.log('Ocurrió un error: '+err)
	})
}])