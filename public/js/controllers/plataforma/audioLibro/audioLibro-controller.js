myApp.controller('audioLibroCourseController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$scope.loading = true
	$('a').css('pointer-events', 'none')
	$http({
		method: 'GET',
		url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros'
	}).then(function(res){
		$scope.loading = false
		$('a').css('pointer-events', 'auto')
		if (res.data.user) {

			var soundtrack = document.getElementById('soundtrack')
			var playButton = document.getElementById('Play')
			var pauseButton = document.getElementById('Pause')
			var before = document.getElementById('before')
			var next = document.getElementById('next')
			var volumeAudio = document.getElementById('volume')
			var volumeOn = document.getElementById('volumeOn')
			var volumeOff = document.getElementById('volumeOff')
			var activeLoop = document.getElementById('active-loop')
			var disableLoop = document.getElementById('disable-loop')
			var tiempoParcial = document.querySelector('#played')
			var tiempoTotal = document.querySelector('#totalTime')

			var playList, pauseList, duration, listSoundPath

			$scope.usuario = res.data.user
			$scope.curso = res.data.curso
			$scope.audios = res.data.audios

			//console.log($scope.curso, $scope.audios)

			positionAudios = []
			listSoundPath = []

			for (var i = 0; i < $scope.audios.length; i++) {
				listSoundPath.push($scope.curso.materiales.audioLibro[i].path)
				positionAudios.push($scope.audios[i].position)
			}

			$scope.Play = function(res){

				playList = document.getElementById(res.position)
				pauseList = document.getElementById('pause'+res.position)
				//console.log(playList, pauseList)
				playList.style.display = 'none'
				pauseList.style.display = 'flex'
				playButton.style.display = 'none'
				pauseButton.style.display = 'flex'

				//console.log($scope.audios.length)
				for(var i = 0; i < $scope.audios.length; i++){
					if (i != res.position) {
						//console.log(i, res.position)
						var otherPause = document.getElementById('pause'+i)
						var otherPlay = document.getElementById(i)
						otherPlay.style.display = 'flex'
						otherPause.style.display = 'none'
					}
				}

				$http({
					method: 'GET',
					url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+res.position
				}).then(function(res){
					//console.log(res)

					if (res.data.access === 'true' || !res.data.servicio) {

						var attribute = soundtrack.getAttribute('src')

						/*if (soundtrack) {
							console.log(soundtrack)
							console.log(res.data.audio.path)
							soundtrack.setAttribute('src', res.data.audio.path)
							soundtrack.addEventListener('canplaythrough', function(){
								console.log(soundtrack.duration)
							})
							console.log(soundtrack)

						}*/

						if (attribute != res.data.audio.path ) {
						 	soundtrack.setAttribute('src', res.data.audio.path)
						 	soundtrack.autoplay = true

						 	audioUpdate =soundtrack.volume
							soundtrack.addEventListener('canplaythrough', function(){
								duration = soundtrack.duration

								//console.log(soundtrack.duration)

								var timeDuration = formatTime(duration)

								tiempoTotal.innerHTML = timeDuration

								//console.log(listSoundPath[listSoundPath.length-1])

								soundtrack.ontimeupdate = function(){
									timeLine = soundtrack.currentTime
									var LineTime = document.querySelector('.Barra__relleno')
									var porcentaje = (timeLine*100)/soundtrack.duration;

									var time = formatTime(soundtrack.currentTime)

									tiempoParcial.innerHTML = time

									if (LineTime === undefined) {
										LineTime = document.querySelector('.Barra__relleno');
									}

									LineTime.style.width = porcentaje + '%'
									timeLine = soundtrack.currentTime

									if (timeDuration === time) {
										if (soundtrack.getAttribute('src') === listSoundPath[listSoundPath.length-1]) {
											pauseSoundTrack()
											console.log('si los audios termiann y ya esta en la ultimassss')
										} else {
											nextAudio()
											console.log('luego del final del audios')
										}
									}
								}
							})
						} else {
						 	soundtrack.play()
						}

					} else {

						// if (!document.getElementById('NoPremium')) {
						// 	var NodoCover = document.querySelector('.Cover')
						// 	var div = document.createElement('div')
						// 	div.setAttribute('id', 'NoPremium')
						// 	div.setAttribute('style', 'text-align: center; margin-top: .5em; color: #d00000')
						// 	var p = '<p>Necesitas ser usuario premium</p>'
						// 	div.innerHTML = p
						// 	NodoCover.appendChild(div)
						// 	console.log('No tienes acceso')
						// }
						pauseList.style.display = 'none'
						playList.style.display = 'flex'
						pauseButton.style.display = 'none'
						playButton.style.display = 'flex'
						soundtrack.pause()
						//console.log('necesitas ser un usuario premiun')
						playList = document.getElementById(positionAudios[0])
						pauseList = document.getElementById('pause'+positionAudios[0])
						$location.url('/plataforma/payment/audiolibros')
					}


				}, function(err){
					console.log(err)
				})
			}

			$scope.Pause =  function(){
				pauseList.style.display = 'none'
				playList.style.display = 'flex'
				pauseButton.style.display = 'none'
				playButton.style.display = 'flex'
				soundtrack.pause()
			}

			playButton.addEventListener('click', playSoundTrack)

			function playSoundTrack(){
				//console.log(positionAudios[0])

				if (!soundtrack.getAttribute('src')) {

					playList = document.getElementById(positionAudios[0])
					pauseList = document.getElementById('pause'+positionAudios[0])
					//console.log(playList, pauseList)
					playList.style.display = 'none'
					pauseList.style.display = 'flex'
					playButton.style.display = 'none'
					pauseButton.style.display = 'flex'

					$http({
						method: 'GET',
						url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[0]
					}).then(function(res){
						console.log(res);
						var attribute = soundtrack.getAttribute('src')

						if (attribute != res.data.audio.path ) {
						 	soundtrack.setAttribute('src', res.data.audio.path)
						 	//soundtrack.play()
						 	soundtrack.autoplay = true

						 	audioUpdate = soundtrack.volume

						 	var timeDuration = formatTime(duration)

						 	soundtrack.addEventListener('canplaythrough', function(){
							//	console.log(soundtrack.duration)
								duration = soundtrack.duration

								//console.log(soundtrack.duration)

								var timeDuration = formatTime(duration)
								tiempoTotal.innerHTML = timeDuration

								soundtrack.ontimeupdate = function(){
									timeLine = soundtrack.currentTime
									var LineTime = document.querySelector('.Barra__relleno')
									var porcentaje = (timeLine*100)/soundtrack.duration;

									var time = formatTime(soundtrack.currentTime)

									tiempoParcial.innerHTML = time

									if (LineTime === undefined) {
										LineTime = document.querySelector('.Barra__relleno');
									}

									LineTime.style.width = porcentaje + '%'
									timeLine = soundtrack.currentTime

								}					 			
							})
						}

					}, function(err){
						console.log(err)
					})
				} else {

					playList.style.display = 'none'
					pauseList.style.display = 'flex'
					playButton.style.display = 'none'
					pauseButton.style.display = 'flex'

					soundtrack.play()

				}
			}

			pauseButton.addEventListener('click', pauseSoundTrack)

			function pauseSoundTrack(){
				pauseList.style.display = 'none'
				playList.style.display = 'flex'
				pauseButton.style.display = 'none'
				playButton.style.display = 'flex'
				soundtrack.pause()
			}

			next.addEventListener('click', nextAudio)

			function nextAudio(){
				if (soundtrack.getAttribute('src') === '' || undefined || null) {
					playList = document.getElementById(positionAudios[0])
					pauseList = document.getElementById('pause'+positionAudios[0])
					//console.log(playList, pauseList)
					playList.style.display = 'none'
					pauseList.style.display = 'flex'
					playButton.style.display = 'none'
					pauseButton.style.display = 'flex'

					$http({
						method: 'GET',
						url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[0]
					}).then(function(res){
						soundtrack.setAttribute('src', res.data.audio.path)
						soundtrack.autoplay = true

						soundtrack.addEventListener('canplaythrough', function(){
							duration = soundtrack.duration

							var timeDuration = formatTime(duration)
							tiempoTotal.innerHTML = timeDuration

							audioUpdate =soundtrack.volume

							soundtrack.ontimeupdate = function(){
								timeLine = soundtrack.currentTime
								var LineTime = document.querySelector('.Barra__relleno')
								var porcentaje = (timeLine*100)/soundtrack.duration;

								var time = formatTime(soundtrack.currentTime)

								tiempoParcial.innerHTML = time

								if (LineTime === undefined) {
									LineTime = document.querySelector('.Barra__relleno');
								}
								LineTime.style.width = porcentaje + '%'
								timeLine = soundtrack.currentTime
							}						 			
						})

					}, function(err){
						console.log(err)
					})
				} else if (soundtrack.getAttribute('src') != listSoundPath[positionAudios.length-1]) {

					for (var i = 0; i < positionAudios.length; i++) {
						if (soundtrack.getAttribute('src') === listSoundPath[i-1]) {
							playList = document.getElementById(positionAudios[i-1])
							pauseList = document.getElementById('pause'+positionAudios[i-1])
							//console.log(playList, pauseList)

							var playButtonNow  = document.getElementById(positionAudios[i])
							var pauseButtonNow  = document.getElementById('pause'+positionAudios[i])							

							$http({
								method: 'GET',
								url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[i]
							}).then(function(res){
								if (res.data.access === 'true' || !res.data.servicio) {

									playList.style.display = 'flex'
									pauseList.style.display = 'none'

									if (playButton.style.display === 'flex') {
										playButton.style.display = 'none'
										pauseButton.style.display = 'flex'
									}

									playButtonNow.style.display = 'none'
									pauseButtonNow.style.display = 'flex'

									soundtrack.setAttribute('src', res.data.audio.path)
									soundtrack.autoplay = true
									soundtrack.addEventListener('canplaythrough', function(){
										duration = soundtrack.duration

										audioUpdate =soundtrack.volume

										//console.log(soundtrack.duration)

										var timeDuration = formatTime(duration)

										tiempoTotal.innerHTML = timeDuration

										soundtrack.ontimeupdate = function(){
											timeLine = soundtrack.currentTime
											var LineTime = document.querySelector('.Barra__relleno')
											var porcentaje = (timeLine*100)/soundtrack.duration;
		
											var time = formatTime(soundtrack.currentTime)
		
											tiempoParcial.innerHTML = time

											if (LineTime === undefined) {
												LineTime = document.querySelector('.Barra__relleno');
											}

											LineTime.style.width = porcentaje + '%'
											timeLine = soundtrack.currentTime

											if (timeDuration === time) {
												if (soundtrack.getAttribute('src') === listSoundPath[listSoundPath.length-1]) {
													pauseSoundTrack()
												} else {
													nextAudio()
												}
											}
										}
									})
								} else {
									$location.url('/plataforma/payment/audiolibros')
									// if (!document.getElementById('NoPremium')) {
									// 	var NodoCover = document.querySelector('.Cover')
									// 	var div = document.createElement('div')
									// 	div.setAttribute('id', 'NoPremium')
									// 	div.setAttribute('style', 'text-align: center; margin-top: .5em; color: #d00000')
									// 	var p = '<p>Necesitas ser usuario premium</p>'
									// 	div.innerHTML = p
									// 	NodoCover.appendChild(div)
									// 	console.log('No tienes acceso')
									// }									
								}
							}, function(err){
								console.log(err)
							})
						}
					}
				} else {

					playList = document.getElementById(positionAudios[0])
					pauseList = document.getElementById('pause'+positionAudios[0])
					//console.log(playList, pauseList)
					playList.style.display = 'none'
					pauseList.style.display = 'flex'

					for(var i = 0; i < $scope.audios.length; i++){
						if (i != positionAudios[0]) {
							//console.log(i, res.position)
							var otherPause = document.getElementById('pause'+i)
							var otherPlay = document.getElementById(i)
							otherPlay.style.display = 'flex'
							otherPause.style.display = 'none'
						}
					}

					$http({
						method: 'GET',
						url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[0]
					}).then(function(res){
						soundtrack.setAttribute('src', res.data.audio.path)
						soundtrack.autoplay = true

						soundtrack.addEventListener('canplaythrough', function(){
							duration = soundtrack.duration

							var timeDuration = formatTime(duration)
							tiempoTotal.innerHTML = timeDuration

							audioUpdate =soundtrack.volume

							soundtrack.ontimeupdate = function(){
								timeLine = soundtrack.currentTime
								var LineTime = document.querySelector('.Barra__relleno')
								var porcentaje = (timeLine*100)/soundtrack.duration;

								var time = formatTime(soundtrack.currentTime)

								tiempoParcial.innerHTML = time

								if (LineTime === undefined) {
									LineTime = document.querySelector('.Barra__relleno');
								}
								LineTime.style.width = porcentaje + '%'
								timeLine = soundtrack.currentTime
							}
						})

					}, function(err){
						console.log(err)
					})
				}
			}

			before.addEventListener('click', previousAudio)

			function previousAudio(){
				if (soundtrack.getAttribute('src') === '' || undefined || null) {
					playList = document.getElementById(positionAudios[0])
					pauseList = document.getElementById('pause'+positionAudios[0])
					//console.log(playList, pauseList)
					playList.style.display = 'none'
					pauseList.style.display = 'flex'
					playButton.style.display = 'none'
					pauseButton.style.display = 'flex'

					$http({
						method: 'GET',
						url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[0]
					}).then(function(res){
						soundtrack.setAttribute('src', res.data.audio.path)
						soundtrack.autoplay = true

						soundtrack.addEventListener('canplaythrough', function(){
							duration = soundtrack.duration

							var timeDuration = formatTime(duration)
							tiempoTotal.innerHTML = timeDuration

							audioUpdate =soundtrack.volume

							soundtrack.ontimeupdate = function(){
								timeLine = soundtrack.currentTime
								var LineTime = document.querySelector('.Barra__relleno')
								var porcentaje = (timeLine*100)/soundtrack.duration;

								var time = formatTime(soundtrack.currentTime)

								tiempoParcial.innerHTML = time

								if (LineTime === undefined) {
									LineTime = document.querySelector('.Barra__relleno');
								}
								LineTime.style.width = porcentaje + '%'
								timeLine = soundtrack.currentTime
							}						 			
						})

					}, function(err){
						console.log(err)
					})
				} else if(soundtrack.getAttribute('src') != listSoundPath[0]){

					for (var i = 0; i < positionAudios.length; i++) {
						if (soundtrack.getAttribute('src') === listSoundPath[i+1]) {
							playList = document.getElementById(positionAudios[i+1])
							pauseList = document.getElementById('pause'+positionAudios[i+1])
							//console.log(playList, pauseList)

							var playButtonNow = document.getElementById(positionAudios[i])
							var pauseButtonNow = document.getElementById('pause'+positionAudios[i])

							if (playButton.style.display === 'flex') {
								playButton.style.display = 'none'
								pauseButton.style.display = 'flex'
							}						

							$http({
								method: 'GET',
								url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[i]
							}).then(function(res){
								if (res.data.access === 'true' || !res.data.servicio) {
									playList.style.display = 'flex'
									pauseList.style.display = 'none'
									playButtonNow.style.display = 'none'
									pauseButtonNow.style.display = 'flex'
									soundtrack.setAttribute('src', res.data.audio.path)
									soundtrack.autoplay = true
								} else {
									if (!document.getElementById('NoPremium')) {
										var NodoCover = document.querySelector('.Cover')
										var div = document.createElement('div')
										div.setAttribute('id', 'NoPremium')
										div.setAttribute('style', 'text-align: center; margin-top: .5em; color: #d00000')
										var p = '<p>Necesitas ser usuario premium</p>'
										div.innerHTML = p
										NodoCover.appendChild(div)
										console.log('No tienes acceso')
									}							
								}
							}, function(err){
								console.log(err)
							})
						}
					}
				} else {

					playList = document.getElementById(positionAudios[0])
					pauseList = document.getElementById('pause'+positionAudios[0])
					//console.log(playList, pauseList)
					playList.style.display = 'none'
					pauseList.style.display = 'flex'

					for(var i = 0; i < $scope.audios.length; i++){
						if (i != positionAudios[0]) {
							//console.log(i, res.position)
							var otherPause = document.getElementById('pause'+i)
							var otherPlay = document.getElementById(i)
							otherPlay.style.display = 'flex'
							otherPause.style.display = 'none'
						}
					}

					$http({
						method: 'GET',
						url: '/plataforma/cursos/'+$routeParams.id+'/audio-libros/'+positionAudios[0]
					}).then(function(res){
						soundtrack.setAttribute('src', res.data.audio.path)
						soundtrack.autoplay = true

						soundtrack.addEventListener('canplaythrough', function(){
							duration = soundtrack.duration

							var timeDuration = formatTime(duration)
							tiempoTotal.innerHTML = timeDuration

							soundtrack.ontimeupdate = function(){
								timeLine = soundtrack.currentTime
								var LineTime = document.querySelector('.Barra__relleno')
								var porcentaje = (timeLine*100)/soundtrack.duration;

								var time = formatTime(soundtrack.currentTime)

								tiempoParcial.innerHTML = time

								if (LineTime === undefined) {
									LineTime = document.querySelector('.Barra__relleno');
								}
								LineTime.style.width = porcentaje + '%'
								timeLine = soundtrack.currentTime
							}						 			
						})
					}, function(err){
						console.log(err)
					})
				}
			}

			volumeAudio.addEventListener('change', volumen)

			//funcionalidad del input range para el volumen
			function volumen() {

				soundtrack.volume = (volumeAudio.value) * 0.01;
				audioUpdate =soundtrack.volume
				rangeUpdate = volumeAudio.value
				if (soundtrack.volume > 0) {
					volumeOff.style.display = 'none'
					volumeOn.style.display = 'block'
				} else {
					volumeOn.style.display = 'none'
					volumeOff.style.display = 'block'
				}
			}

			volumeOn.addEventListener('click', offVolume)

			//Funcionalidad para silenciar audio
			function offVolume(){
				/*if (Audio === undefined) {
					Audio = document.getElementById($scope.objectPlayList[0])
				}*/
				soundtrack.volume = 0
				volumeAudio.value = 0

				volumeOn.style.display = 'none'
				volumeOff.style.display = 'block'
			}

			volumeOff.addEventListener('click', onVolume)

			//funcionalidad para restaurar volumen del audio
			function onVolume(){
				soundtrack.volume = audioUpdate || 1

				if (soundtrack.volume === 1) {
					volumeAudio.value = 100
				} else {
					volumeAudio.value = rangeUpdate
				}

				volumeOff.style.display = 'none'
				volumeOn.style.display = 'block'
			}
			

			activeLoop.addEventListener('click', Activeloop)

			//funcionalidad para activar el loop
			function Activeloop(){
				if (soundtrack != null) {
					if (soundtrack.played) {
						soundtrack.loop = true;
						activeLoop.style.display = 'none'
						disableLoop.style.display = 'block'
					}
				}
			}

			disableLoop.addEventListener('click', Disableloop)

			//funcionalidad para desabilitar el loop
			function Disableloop(){
				//if (Audio != null) {
				soundtrack.loop = false;
				disableLoop.style.display = 'none'
				activeLoop.style.display = 'block'
				//}
			}


			//formato a los tiempos de cada audio
			function formatTime(time){
				var s = Math.floor(time%60)
				var min = Math.floor(time/60)

				var timeText;

				if (s<10) {
					s = '0'+s; 
				}
				if (min<10) {
					min = '0'+min;
				}

				return timeText = min + ':' + s
			}

		}else{
			$location.url('/')
		}
	},function(err){
		$scope.loading = false
		console.log(err)
	})
}])