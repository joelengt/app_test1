var socket = io()
var rate_user = 0

$('#Form_create').submit(function () {

	// Calculando el elemento del array
	var arr = document.querySelectorAll('.rate')

	for(var i = 0; i <= arr.length - 1; i++) {
	  var el = arr[i]
	  if(el.checked) {
	    console.log('EL elemento checked es el: ' + i)
	    rate_user = Number(el.value)
	  }
	}
	
	// Datos para enviar por publicación
	var $type_categority = 'curso'
	var $topic_id = document.querySelector('#topic_id').value
	var $topic_title = document.querySelector('#topic_title').value
	var $user_full_name = document.querySelector('#user_full_name').value
	var $user_avatar = document.querySelector('#user_avatar').value
	var $user_grado = document.querySelector('#user_grado').value
	var $comment = $('#comment').val()

	var $msg_alert_box = document.querySelector('#msg_alert_box')
	
	var msg = ''
	$msg_alert_box.innerHTML = ''

	if(rate_user > 0 && $comment !== '') {
		socket.emit('resenia', {
			id: '',
			type_categority: $type_categority,
			topic_id:  $topic_id,
			topic_title: $topic_title,
			user_full_name: $user_full_name,
			user_avatar: $user_avatar,
			user_grado: $user_grado,
			rate: rate_user,
			comment: $comment,
			createdAt: ''
		})

	    $('#rate').val('')
	    $('#comment').val('')

	} else if (rate_user === 0){
		msg = 'Primero tienes que puntuar!!'
		$msg_alert_box.innerHTML += msg

	} else if ($comment === '') {
		msg = 'Primero tienes que comentar!!'
		$msg_alert_box.innerHTML += msg

	} else {
		msg = 'Tienes que puntuar y comentar primero!!'
		$msg_alert_box.innerHTML += msg
	}	

	return false

})

socket.on('resenia', function (content) {
	var template = `<article style="border-top: 1px solid lightgray;" class="Personajes-app__read__item">
					        <p>${content.topic_title}</p>
					        <strong>${content.user_full_name}</strong>
					        <p>${content.user_grado}</p>
					        <img src="${content.user_avatar}" width="50"/>
					        <h3>${content.rate}</h3>
					        <p>${content.comment}</p>
					        <p>${content.createdAt}</p>
				      </article>`

	$('#resenia_item').prepend(template)
})


var room = document.querySelector('#topic_id').value

socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this room
   socket.emit('room', room)
})