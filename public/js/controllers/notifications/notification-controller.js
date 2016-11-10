myApp.controller('notificationsController', ['$scope', '$http', 'Socket', function($scope, $http, Socket){
	$http({
		method: 'GET',
		url: '/plataforma/notificaciones'
	}).then(function(res){
		$scope.user = res.data.user
		console.log(res)
		$scope.notificationsDad = res.data.notificaciones

		$scope.notifications = []

		if (sessionStorage.getItem('count_notification')) {
			// $scope.count = sessionStorage.getItem('count_notification') || 0
			var countNotifications = sessionStorage.getItem('count_notification')
			countNotifications = JSON.parse(countNotifications)
			console.log(countNotifications)

			var count_number = countNotifications.count || 0

			if ( count_number > 0) {
				// var new_sessionCountNotifications = JSON.parse(sessionStorage.getItem('count_notification'))
				document.getElementById('count').style.display = 'block'
				document.getElementById('count').innerHTML = countNotifications.count || 0
			}			
		} else {
			var sessionCountNotifications = {
				count: 0,
				user_id: 0
			}
			var data = JSON.stringify(sessionCountNotifications)
			sessionStorage.setItem('count_notification', data)
		}


		for (var i = 0; i < $scope.notificationsDad.length; i++) {
			if ($scope.user._id !== $scope.notificationsDad[i].user_id) {
				$scope.notifications.push($scope.notificationsDad[i])
			}
		}

		$scope.numberNotification = 6

		$scope.moreNotification = function(){
			$scope.numberNotification =  $scope.numberNotification + 3
			// console.log($scope.numberNotification)
		}

		Socket.connect()

		Socket.on('notificaciones', function(content){
			if ($scope.user._id !== content.datos_user.user_id) {
				notificacionHTML(content)
				console.log('a')
				var old_sessionCountNotifications = JSON.parse(sessionStorage.getItem('count_notification'))

				$scope.count = parseInt(old_sessionCountNotifications.count) + 1
				

				var sessionCountNotifications = {
					count: $scope.count,
					user_id: content.datos_user.user_id
				}

				var data = JSON.stringify(sessionCountNotifications)


				sessionStorage.setItem('count_notification', data)

				document.getElementById('count').style.display = 'block'
				var new_sessionCountNotifications = JSON.parse(sessionStorage.getItem('count_notification'))
				document.getElementById('count').innerHTML = new_sessionCountNotifications.count
				
				$scope.notifications.unshift(content)
			}
		})

		var MyNotificaciones = res.data.user._id

		Socket.emit('MyNotificaciones', MyNotificaciones)

		function notificacionHTML(content) {
			var body

			console.log('lalala')

			if (content.article_type === 'muro_friend') {
				body = `${content.datos_user.name} ha publicado en tu biografía`
			} else if(content.article_type === 'like'){
				body = `A ${content.datos_user.name} le ha gustado tu publicación`
			} else {
				body = `${content.datos_user.name} ha comentado tu públicación`
			}

			if(! ('Notification' in window) ){
			  alert("Servicio no disponible para tu dispositivo.");
			  return;
			}

			Notification.requestPermission(function(permission){ 
			  var notification = new Notification("Ascent.pe",{
			    body: body,
			    icon:'../../../images/logoAscent.png',
			    dir:'auto'         
			  });

			  notification.onclick = function() {
			    window.open("https://ascent.pe/");
			  };
			  setTimeout(function(){
			    notification.close();
			  },4000);
			});
		}


	}, function(err){
		console.log(err)
	})
}])