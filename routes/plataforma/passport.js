var express = require('express')
var passport = require('passport')
var app = express.Router()

var Users = require('../../models/usuarios')

// passport config
app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

app.get('/plataforma/admin/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile', 'user_friends'] }))

app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile', 'user_friends'] }))

app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
	successRedirect: '/#/plataforma/cursos',
	failureRedirect: '/'
}))

module.exports = app
