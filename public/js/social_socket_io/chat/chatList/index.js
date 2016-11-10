
console.log('HA2')

var socket = io()

var count = 0
socket.on('chat', function (content) {
	console.log('Mensaje Llego al chatRoom')
	console.log(content)
	
	var id = $('.ContentChats').find('[data-id="'+ content.chat_content_id +'"]')[0]

	console.log(id)

	count = count + 1

	console.log('chat: ' + content.chat_content_id)
	console.log(count)

})

// var Chatroom = document.querySelector('#chatRoom_id').value

// Saber de donde viene el id de room.
socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this room
   
   socket.emit('Chatroom', '5781cebdd94aa9283e25e2f4')
})


