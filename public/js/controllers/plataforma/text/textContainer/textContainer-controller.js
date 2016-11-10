myApp.controller('textContainerController', ['$scope', '$http', '$routeParams', '$location', '$facebook', function($scope, $http, $routeParams, $location, $facebook){
	$scope.loading = true
	$scope.text = false
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/cursos/'+$routeParams.id +'/textos/'+$routeParams.position
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {
			console.log(res)
			$scope.usuario = res.data.user
			$scope.curso = res.data.curso
			if (res.data.access === 'true' || !res.data.servicio) {
				$scope.service = false
				console.log(res)
				$scope.item = res.data.texto.path

				$scope.bolean_notas = false
				$scope.comments = []

				function getSelectionText(){
				    var selectedText = ""
				    if (window.getSelection){ // all modern browsers and IE9+
				        selectedText = window.getSelection().toString()
				    }
				    return selectedText
				}

				var url = $scope.item
				console.log(url)

				$http({
					method: 'GET',
					url: '/plataforma/notas/cursos/'+$routeParams.id+'/notas-textos-marcado'
				}).then(function(res){
					console.log(res)
					$scope.AllNotes = res.data.notas

					$scope.notas = []

					for (var i = 0; i < $scope.AllNotes.length; i++) {
						$scope.notas.push($scope.AllNotes[i])
					}

					$.get(url, function(element){

						for (var i = 0; i < $scope.notas.length; i++) {
							var txt_nota = $scope.notas[i].texto_marcado
							var txt_resalted

							if ($scope.notas[i].have_comment === true) {
								txt_resalted = '<span class="commented" id="'+$scope.notas[i]._id+'">'+txt_nota+'</span>'
							} else {
								txt_resalted = '<span class="resalted">'+txt_nota+'</span>'
							}

							if(element.indexOf(txt_nota) != -1){
								element = element.replace(txt_nota,txt_resalted)
							} else {
								console.log('not')
								console.log(txt_resalted)
							}
						}

						document.getElementById('ShowText').innerHTML = element

						var lineText
						
						var thetext
						var it = 0

						var atId = 'selected'

						$('#ShowText p').on('mousedown', replaceText)
						$('#ShowText li').on('mousedown', replaceText)

						var menuId = 'MenuText'

						function replaceText(e){
							console.log(this)
							lineText = this
							this.setAttribute('id', atId)

							$('#'+atId+' span').on('mouseup', function(e){
								// this.removeAttribute('id')
								thetext = getSelectionText()
								if (thetext.length> 0){

							   		$('#MenuText').css({'position':'absolute', 'display':'block', 'left':e.pageX, 'top':e.pageY});
									this.removeAttribute('id')

							   	} else {
							   		$('#MenuText').css({'display':'none'});
									this.removeAttribute('id')					   		
							   	}
							})
						}
						
						$(document).keydown(function(e){  
						    if(e.keyCode == 27){  
						        $('#MenuText').css("display", "none");  
						    }  
						});

						$scope.resaltar = function(){
							
							var data = {
								topic_id: $routeParams.id,
								texto_marcado: thetext
							}

							var txtcontent = lineText.innerHTML

							$http({
								method: 'POST',
								data: data,
								url: ' /plataforma/notas/cursos/'+$routeParams.id+'/notas-textos-marcado',
							}).then(function(res){
								console.log(res)
								$('#MenuText').css("display", "none");
							}, function(err){
								console.log(err)
							})

							var txt_nota = thetext
							var txt_resalted = '<span class="resalted">'+txt_nota+'</span>'
							if(txtcontent.indexOf(txt_nota) != -1){
								txtcontent = txtcontent.replace(txt_nota,txt_resalted)
								lineText.innerHTML = txtcontent
							} else {
								console.log('not')
								console.log(txt_resalted)
							}
						}

						$scope.comentar = function(){
							document.getElementById('textSelect').innerHTML = thetext
							// console.log(thetext)
							$('#commentText').css('display', 'block')
						}

						$scope.exitCommentText = function(){
							$('#commentText').css('display', 'none')
							$('#MenuText').css({'display':'none'});
						}

						$scope.sendComment = function(){

							var comment = document.getElementById('comment')

							var data = {								
								content_comment: comment.value,
								topic_id: $routeParams.id,
								texto_marcado: thetext
							}

							var idCommentTextNew

							$http({
								method: 'POST',
								data: data,
								url: ' /plataforma/notas/cursos/'+$routeParams.id+'/notas-textos-comentario',
							}).then(function(res){
								console.log(res)

								$scope.notas.push(res.data.nota)
								console.log($scope.notas)

								idCommentTextNew = res.data.nota._id
								$('#commentText').css('display', 'none')
								$('#MenuText').css("display", "none");
								comment.value = ''

								var txtcontent = lineText.innerHTML

								var txt_nota = thetext
								var txt_resalted = '<span class="commented">'+txt_nota+'</span>'
								if(txtcontent.indexOf(txt_nota) != -1){
									txtcontent = txtcontent.replace(txt_nota,txt_resalted)
									lineText.innerHTML = txtcontent
								} else {
									console.log('not')
									console.log(txt_resalted)
								}
							}, function(err){
								console.log(err)
							})

						}

						$('.commented').on('click', function(){
							// console.log(this.innerHTML)
							for (var i = 0; i < $scope.notas.length; i++) {
								console.log(this.innerHTML)
								// console.log($scope.notas)
								if (this.innerHTML === $scope.notas[i].texto_marcado) {
									var idComment =  $scope.notas[i]._id
									console.log(idComment)

									$http({
										method:'GET',
										url: '/plataforma/notas/curso/'+$routeParams.id+'/notas-textos-marcado/'+idComment
									}).then(function(res){
										// console.log(res)
										$scope.bolean_notas = true
										$scope.comments.push(res.data.nota)
										console.log($scope.comments)

									}, function(err){
										console.log(err)
									})
								}
							}
						})

						$scope.exitComment = function(){
							$scope.bolean_notas = false
							$scope.comments.pop()
						}

						// $('.commented').on('mouseup', function(){
						// 	$scope.notas = {}
						// })

						// var select = document.querySelector('.commented')

						// select.addEventListener('click', function(){
						// 	console.log(this)
						// })
					})
				}, function(err){
					console.log(err)
				})
			} else {
				$scope.$on('fb.auth.authResponseChange', function(response) {
					console.log(response)
				  $scope.status = $facebook.isConnected();
				  // if($scope.status) {
				  //   $facebook.api('/me').then(function(user) {
				  //     $scope.user = user;
				  //   });
				  // }
				});

				// $scope.service = true

				// url_me = '/'+$scope.miUsuario

				// $facebook.api()

				// $http({
				// 	method: 'GET',
				// 	url: 'https://graph.facebook.com/v2.7/'+$scope.usuario.provider_id+'/invitable_friends?access_token='+$scope.usuario.token
				// }).then(function(invite_friends){
				// 	console.log(invite_friends)
				// 	var Object_friends = invite_friends
				// 	var arr_friends = Object_friends.data

				// 	// Arreglo con lista de amigos
				// 	for(var i = 0; i <= arr_friends.length - 1; i++) {
				// 		var friend_element = arr_friends[i]

				// 		var friend =  {
				// 			name: friend_element.name,
				// 			avatar: friend_element.picture.data.url
				// 		}

				// 		var friend_url = friend.avatar

				// 		var friend_url_refactor = friend_url.replace('https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/','')

				// 		var limite = []
				// 		var cant_ = 0

				// 		for(var i = 0; i <= friend_url_refactor.length - 1; i++) {

				// 			var el = friend_url_refactor[i]
														
				// 			if(el === '_') {
				// 				cant_ += 1

				// 				if(cant_ <= 2){
				// 					limite.push(i)

				// 				} else {
				// 					break

				// 					}
				// 				}
				// 		}

				// 		console.log(limite)

				// 		// Obteniendo la palabra completa
				// 		var limite_a = limite[0] + 1
				// 		var limite_b = limite[1] - 1
				// 		var friend_id_new = ''

				// 		for (var h = limite_a; h <= limite_b; h++) {
				// 			friend_id_new += friend_url_refactor[h]
				// 		}

				// 		// Obteniendo id photo de amigo
				// 		console.log(friend_id_new)

				// 		// Buscando amigo desde la url de facebook

				// 		$http({
				// 			method:'GET',
				// 			url: 'https://www.facebook.com/1785211491706675'
				// 		}).then(function(url_profile_user){
				// 				console.log(url_profile_user)
				// 		}, function(err){
				// 			console.log(err)
				// 		})
				// 	}
				// }, function(err){
				// 	console.log(err)
				// })

				// window.fbAsyncInit = function() {
				//   FB.init({
				//     appId      : '1721434554779528',
				//     xfbml      : true,
				//     version    : 'v2.7'
				//   })
				// }

				// $scope.sendFacebook = function(){
				//   FB.ui({
				//   	method: 'send',
				//   	to: '1117756591610111',
				//   	link: 'http://www.nytimes.com/interactive/2015/04/15/travel/europe-favorite-streets.html'
				//   })
				// }

				// $scope.sendPayment = function(){
				// 	$http({
				// 		method: 'POST',
				// 		url: '/plataforma/payment/facebook_invites/'+$routeParams.id+'/textos?_method=put'
				// 	}).then(function(res){
				// 		console.log(res)
				// 	}, function(err){
				// 		console.log(err)
				// 	})
				// }

			}

		} else{
			$location.url('/')
		}
	},function(err){
		$scope.loading = false
		console.log('Ocurrio un: '+err)
	})
}])
