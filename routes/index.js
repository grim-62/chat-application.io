var express = require('express');
var router = express.Router();
var userModel = require('./users');
var passport = require('passport');
var localstratagy = require('passport-local');

passport.use( new localstratagy(userModel.authenticate()));

const isLoggedIn = (req,res,next)=>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login-page");
}

router.get('/', isLoggedIn ,function(req, res, next) {
  res.render('index',{user:req.user});
});

router.get('/login-page', function(req, res, next) {
  res.render('loginPage')
});

router.get('/register-page', function(req, res, next) {
  res.render('registerPage');
});

router.post('/register',async(req,res)=>{
  var newUser = await new userModel({
    username:req.body.username,
    contact:req.body.contact,
  });
  userModel.register(newUser,req.body.password)
  .then(registeruser =>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect('/')
    })
  })
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login-page',
  failureFlash:true
}),(req,res,next)=>{
});

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if (err) {return next (err);}
    res.redirect('/login-page');
  })
});

module.exports = router;