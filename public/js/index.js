var myApp = angular.module('ascent', ['ngRoute', 'btford.socket-io', 'ngAnimate', 'ngFacebook']);
myApp.config(['$routeProvider'/*, '$locationProvider'*/, '$facebookProvider',function($routeProvider, $facebookProvider/*, $locationProvider*/){
	$routeProvider
		.when('/', {
			templateUrl: './templates/home.html'
		})
		.when('/login', {
			templateUrl: './templates/login.html'
		})
		.when('/update/completar-datos', {
			controller: 'formController',
			templateUrl: './templates/form/formulario-datos.html'
		})
		.when('/bienvenida', {
			controller: 'userController',
			templateUrl: './templates/bienvenida/bienvenida.html'
		})
		// .when('/plataforma', {
		// 	controller: 'coursesController',
		// 	templateUrl: './templates/plataforma/cursos/cursos.html'
		// })
		.when('/plataforma/cursos', {
			controller: 'coursesController',
			templateUrl: './templates/plataforma/cursos/cursos.html'
		})
		.when('/plataforma/publication/:id_user/:event_type/:id_article', {
			controller: 'articleEventController',
			templateUrl: './templates/articleEvent/index.html'
		})
		.when('/plataforma/cursos/detail/:id', {
			controller: 'courseDetailController',
			templateUrl: './templates/plataforma/cursos/detalles-cursos.html'
		})
		.when('/plataforma/cursos/:id/text', {
			controller: 'textCourseController',
			templateUrl: './templates/plataforma/cursos/texto/index.html'
		})
		.when('/plataforma/cursos/:id/text/:position', {
			controller: 'textContainerController',
			templateUrl: './templates/plataforma/cursos/texto/textContainer/index.html'
		})
		.when('/plataforma/cursos/:id/simulador', {
			controller: 'simuladorCourseController',
			templateUrl: './templates/plataforma/cursos/simulador/index.html'
		})
		.when('/plataforma/cursos/:id/simulador/:name', {
			controller: 'leccionesCourseController',
			templateUrl: './templates/plataforma/cursos/simulador/lecciones/index.html'
		})
		.when('/plataforma/cursos/:id/simulador/:name/:number', {
			controller: 'leccionCourseController',
			templateUrl: './templates/plataforma/cursos/simulador/lecciones/opciones/index.html'
		})
		.when('/plataforma/cursos/:id/audio-libro', {
			controller: 'audioLibroCourseController',
			templateUrl: './templates/plataforma/cursos/audioLibro/index.html'
		})
		.when('/plataforma/cursos/mis-cursos', {
			controller: 'misCursosController',
			templateUrl: './templates/plataforma/cursos/misCursos.html'
		})
		.when('/plataforma/cursos/completados', {
			controller: 'cursosCompletadosController',
			templateUrl: './templates/plataforma/cursos/completados.html'
		})
		.when('/plataforma/comunidad', {
			controller: 'comunidadController',
			templateUrl: './templates/plataforma/comunidad/index.html'
		})
		.when('/perfil/:id', {
			controller: 'biographyController',
			templateUrl: './templates/plataforma/perfil/biography.html'
		})
		.when('/perfil/about/:id', {
			controller: 'perfilInfoController',
			templateUrl: './templates/plataforma/perfil/perfil.html'
		})
		.when('/perfil/about/editar/:id', {
			controller: 'editInfoPerfil',
			templateUrl: './templates/plataforma/perfil/editar-perfil.html'
		})
		.when('/perfil/friends/:id', {
			controller: 'friendsController',
			templateUrl: './templates/friends/index.html'
		})
		.when('/perfil/my-friends/source', {
			controller: 'myFriendsController',
			templateUrl: './templates/myFriends/index.html'
		})
		.when('/perfil/my-friends/find-friends', {
			controller: 'findFriendsController',
			templateUrl: './templates/friends/find_friends/index.html'
		})
		.when('/perfil/friends/find-friends/friends-of-facebook', {
			controller: 'findFriendFacebook',
			templateUrl: './templates/friends/find_friends/friend_facebook/index.html'
		})
		.when('/messages/:id', {
			controller: 'messagesController',
			templateUrl: './templates/messages/messages.html'
		})
		.when('/chat/:idRoomChat/:idUser', {
			controller: 'chatController',
			templateUrl: './templates/messages/chat/index.html'
		})
		.when('/chat/chat-list/', {
			controller: 'ChatListController',
			templateUrl: './templates/messages/list-chat/index.html'
		})
		.when('/plataforma/payment/:service', {
			controller: 'paymentController',
			templateUrl: './templates/payment/index.html'
		})
		.when('/admin/cursos', {
			controller: 'coursesAdminController',
			templateUrl: './templates/admin/cursos/cursos.html'
		})
		.when('/admin/cursos/new_course', {
			controller: 'newCourseController',
			templateUrl: './templates/admin/cursos/crear-cursos.html'
		})
		.when('/admin/cursos/detail/:id', {
			controller: 'courseAdminDetailController',
			templateUrl: './templates/admin/cursos/detalle.html'
		})
		.when('/admin/cursos/update/:id', {
			controller: 'updateCoursesController',
			templateUrl: './templates/admin/cursos/editar-curso.html'
		})
		.when('/admin/cursos/delete/:id', {
			controller: 'deleteCoursesController',
			templateUrl: './templates/admin/cursos/eliminar-curso.html'
		})
		.when('/admin/usuarios', {
			controller: 'usersController',
			templateUrl: './templates/admin/usuarios/usuarios.html'
		})
		.when('/admin/usuarios/confirm-delete/:id', {
			controller: 'usersDeleteController',
			templateUrl: './templates/admin/usuarios/eliminar-usuario.html'
		})
		.when('/admin/usuarios/update/:id', {
			controller: 'usersUpdateController',
			templateUrl: './templates/admin/usuarios/editar-usuario.html'
		})
		.when('/politicas-privacidad', {
			templateUrl: './templates/politicasPrivacidad/index.html'
		})
		.when('/terminos-condiciones', {
			templateUrl: './templates/terminosCondiciones/index.html'
		})
		.otherwise('/');
	/*$locationProvider.html5Mode({
		enabled: true,
		requireBase: false,
	});*/
	$facebookProvider.setAppId('1721434554779528').setPermissions(['email','user_friends']).setVersion("v2.5");
}])
.run(['$rootScope', '$window', function($rootScope, $window) {
	// window.fbAsyncInit = function() {
 //    FB.init({
 //      appId      : 'your-app-id',
 //      xfbml      : true,
 //      version    : 'v2.7'
 //    });
 //  };
  // (function(d, s, id) {
  //   var js, fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) return;
  //   js = d.createElement(s); js.id = id;
  //   js.src = "//connect.facebook.net/en_US/sdk.js";
  //   fjs.parentNode.insertBefore(js, fjs);
  // }(document, 'script', 'facebook-jssdk'));
  (function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

  $rootScope.$on('fb.load', function() {
    $window.dispatchEvent(new Event('fb.load'));
  });
}])
