myApp.controller('menuVistaPlataforma', ['$scope','$http', function($scope, $http){

	$scope.viewMenu = function(){
		$('#backgroundModal').animate({
			left: '0',
			opacity: 1
		},0)

		$('#mainModal').animate({
			left: '0',
			opacity: 1
		}, 200)
	}

	$scope.hideMenu = function(){
		$('#backgroundModal').animate({
			left: '-100%',
			opacity:'0'
		},0)

		$('#mainModal').animate({
			left: '-100%',
			opacity:'0'
		}, 50)
	}

	$scope.viewUserPerfil = function(){
		$('#lista-perfil').toggleClass('openViewPerfil')
	}


	$scope.bolean_viewNotification = false
	var itNotification = 0

	// document.getElementById('count').style.display = 'block'
	// document.getElementById('count').innerHTML = $scope.count

	$scope.viewNotification = function(){
		var viewNotification = document.getElementById('notifications')

		if (itNotification === 0) {
			viewNotification.style.display = 'block'
			itNotification = 1
			var data = {
				count: 0,
				user_id:0
			}
			data  = JSON.stringify(data)
			sessionStorage.setItem('count_notification', data)
			document.getElementById('count').style.display = 'none'
		} else {
			viewNotification.style.display = 'none'
			itNotification = 0
		}
	}

	var itFriend = 0

	$scope.viewFriends = function(){
		var viewFriends = document.getElementById('ChatList')
		if (itFriend === 0) {
			viewFriends.style.display = 'block'
			itFriend = 1
		} else {
			viewFriends.style.display = 'none'
			itFriend = 0
		}
	}

}])

myApp.controller('menuVistaLanding', ['$scope','$http', '$location', function($scope, $http, $location){

	$scope.viewMenu = function(){
		$('#backgroundModal').animate({
			left: '0',
			opacity: 1
		},0)

		$('#mainModal').animate({
			left: '0',
			opacity: 1
		}, 200)
	}

	$scope.hideMenu = function(){
		$('#backgroundModal').animate({
			left: '-100%',
			opacity:'0'
		},0)

		$('#mainModal').animate({
			left: '-100%',
			opacity:'0'
		}, 50)
	}

	$scope.viewLogin = false
	$scope.ShowLogin = function(){
		$('#BackgroundModalLogin').animate({
			top: '0',
			bottom: '0',
			opacity: 1
		}, 0)

		$('#loginModal').animate({
			top: '30vh',
			opacity: 1
		}, 200)
	}
	
	$scope.hideLogin = function(){
		$('#BackgroundModalLogin').animate({
			top: '-100%',
			bottom: '100%',
			opacity: '0'
		}, 0)

		$('#loginModal').animate({
			top: '-100%',
			opacity: '0'
		}, 200)
	}

	$http({
		method:'GET',
		url:'/plataforma'
	}).then(function(res){
		if (res.data.user) {
			$location.url('/plataforma/cursos')
		} else {
			console.log('Tienes que registrarte :)')
		}
	}, function(err){
		console.log(err)
	})

	setTimeout(function(){
		$("#slides").slidesjs({
			height: 800,
			width: 700,
			navigation: {
		      active: false
		    },
		    // pagination:{
		    // 	active: false
		    // },
		    play: {
		      active: false,
		      auto: true,
		      effect: 'slide',
		      interval: 7000,
		    }
		})
		$(".custom-item").click(function(e){
		  e.preventDefault();
		  // use data-item value when triggering default pagination link
		  $('a[data-slidesjs-item="' + $(this).attr("data-item") + '"]').trigger('click');
		});
	}, 100)

}])