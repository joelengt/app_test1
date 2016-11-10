// import $ from 'jquery'
import angular from 'angular'
import angularRoute from 'angular-route'

var myApp = angular.module('ascent', [angularRoute]);
myApp.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: './templates/home.html'
		})
		.when('/login', {
			templateUrl: './templates/login.html'
		})
		.when('/update/completar-datos', {
			controller: 'formulario',
			templateUrl: './templates/formulario-datos.html'
		})
		.otherwise('/');
})
import './js/controllers/form-controller.js'













=======
import $ from 'jquery'
import page from 'page'

// se selecciona los inputs por grupos
var boxGender = $('#gender')
var boxCategoria = $('#category')
var boxOfficial = $('#official')
var boxSubOfficial = $('#subOfficial')

// seleccion de inputs
var inputsGender = $('input[name="genero"]')
var inputsCategory = $('input[name="categoria"]')
var inputsRange = $('input[name="grado"]')

var enviarDatos = $('#send')
var url

function ocultarInputs(){
	//seleccionando inputs
	var electionCategory = document.querySelector('input[name="genero"]:checked')

	inputsGender.on('click', function(){
		boxGender.css('display', 'none')
		boxCategory.css('display', 'block')
	})
	inputsCategory.on('click', function(){
		boxCategoria.css('display', 'none')
		if( electionCategory.value === 'oficial'){
			boxOfficial.css('display', 'block')
		} else {
			boxSubOfficial.css('display, block')
		}
	})
}

ocultarInputs()

function userName(user){
	// user.forEach(function(id){
	console.log(user)
	var userTemplate = templateUser
		.replace(':name:', user.name)
		.replace(':img:', user.photo)

	url = '/plataforma/start/save/'+user._id+'?_method=put'

	$userTemplate = $(userTemplate)
	$('#header').append($userTemplate)
	enviarDatos.attr('href', '/plataforma/start/save/'+user._id+'?_method=put')
}


templateUser = '<div>'+
					'<h2>Cuentanos más sobre ti</h2>'+
        			'<h3>¡Hola :name:!</h3>'+
        			'<img src=":img:" alt=":name:">'+
      			'</div>'


page('/view/formulario.html', function(ctx, next){
	console.log(ctx)
>>>>>>> 8321e9a19111ed5328b722cf32f353c09f1cba3d






















// //Seleccion de header en formulario
// // var name = $('#name');
// var avatar = $('#avatar');


// // se selecciona los inputs por grupos
// var boxGender = $('#gender');
// var boxCategoria = $('#category');
// var boxOfficial = $('#official');
// var boxSubOfficial = $('#subOfficial');

// // seleccion de inputs
// var inputsGender = $('input[name="genero"]');
// var inputsCategory = $('input[name="categoria"]');
// var inputsRange = $('input[name="grado"]');
// var oficial = $('#oficial');
// var subOficial = $('#subOficial');

// var enviarDatos1 = $('#send1');
// var enviarDatos2 = $('#send2');
// var url;

// function ocultarInputs(){

// 	inputsGender.on('click', function(){
// 		console.log('1')
// 		boxGender.css('display', 'none');
// 		boxCategoria.css('display', 'block');
// 	});

// 	oficial.on('click', function(){
// 		console.log('2')
// 		boxCategoria.css('display', 'none');
// 		boxOfficial.css('display', 'block');
// 	});

// 	subOficial.on('click', function(){
// 		console.log('3')
// 		boxCategoria.css('display', 'none');
// 		boxSubOfficial.css('display', 'block');
// 	});
// }

// ocultarInputs();

// function userName(res){

// 	console.log(res.user.name);

// 	var templateHeader = templateHeaderForm
// 		.replace(':name:', res.user.name)
// 		.replace(':img:', res.user.photo);


// 	url = '/plataforma/start/save/'+res.user._id+'?_method=put';

// 	enviarDatos1.attr('href', '/plataforma/start/save/'+res.user._id+'?_method=put');
// 	enviarDatos2.attr('href', '/plataforma/start/save/'+res.user._id+'?_method=put');
// 	var $templateHeader = $(templateHeader);
// 	$('#header').append($templateHeader);
// }

// function userNameWelcome(res){

// }

// var templateHeaderForm= '<div class="container">'+
// 			      '<div class="HeaderForm">'+
// 			        '<h3>:name:</h3>'+
// 			        '<img class="img-responsive" src=":img:" alt=":name:">'+
// 			      '</div>'+
// 			    '</div>'

// var templateHeaderWelcome = '<div class="container">'+
// 								'<div class="row">'+
// 									'<h2>¡Hola!</h2>'+
// 									'<figure>'+
// 										'<img src="" alt="">'+
// 									'</figure>'+
// 									'<div>'+
// 										'<h1>:name:</h1>'+
// 										'<p>:categoria:</p>'+
// 									'</div>'+
// 									'<div>'+
// 										'<span>Futuro</span>'+
// 										'<h3>:subcategoria:</h3>'+
// 									'</div>'+
// 								'</div>'+  	
// 							'</div>';

// page('/view/formulario.html', function(ctx, next){
// 	console.log(ctx);
	
<<<<<<< HEAD
// 	$.ajax({
// 		type:'GET',
// 		url:'/plataforma/start',
// 		success: function(res){
// 			// console.log(res);
// 			userNameForm(res);
// 		}
// 	});

// 	enviarDatos1.on('click', sendDate);
// 	enviarDatos2.on('click', sendDate);

// 	function sendDate(ev){
// 		ev.preventDefault()
		
// 		var typeGender = document.querySelector('input[name="genero"]:checked').value;
// 		var typeCategory = document.querySelector('input[name="categoria"]:checked').value;
// 		var typeRange = document.querySelector('input[name="grado"]:checked').value;

// 		var data = {
// 			genero: typeGender,
// 			categoria: typeCategory,
// 			grado: typeRange,
// 		};
// 		$.ajax({
// 			type: 'post',
// 			data: data,
// 			url: url,
// 			success: function(contenido){
// 				console.log(contenido)
// 			}
// 		});
// 	}
// });

// page('/view/bienvenida.html', function(ctx, next){

// 	console.log(ctx)

// 	$.ajax({
// 		type:'GET',
// 		url:'/plataforma',
// 		success: function(res){
// 			// console.log(res.user);
// 			userNameWelcome(res);
// 		}
// 	})


// });

// page();

=======
	$.ajax({
		type:'get',
		url:'/plataforma/start',
		success: function(res){
			userName(res)
		}
	})

	enviarDatos.on('click', sendDate)

	function sendDate(ev){
		ev.preventDefault()
		
		var typeGender = document.querySelector('input[name="genero"]:checked').value
		var typeCategory = document.querySelector('input[name="categoria"]:checked').value
		var typeRange = document.querySelector('input[name="grado"]:checked').value

		data = {
			genero: typeGender,
			categoria: typeCategory,
			grado: typeRange,
		}
		
		$.ajax({
			type: 'post',
			data: data,
			url: url,
			success: function(contenido){
				console.log(contenido)
			}
		})
	}

})

page()
>>>>>>> 8321e9a19111ed5328b722cf32f353c09f1cba3d
