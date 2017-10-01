"use strict";

var express=require('express');
var router=express.Router();
//register
var User=require('../models/user');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
router.get('/register',function(req,res){
    
res.render('register');
});
//login
router.get('/login',function(req,res){
    
res.render('login');
});
//register
router.post('/register/',function(req,res){
var name=req.body.name;
    var username=req.body.username;
    var email=req.body.email;
    var password=req.body.password;
    var password2=req.body.password2;
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Not valid email').isEmail();
    req.checkBody('password','password is required').notEmpty();
        req.checkBody('password2','passwords do not match').equals(req.body.password);
    
    var error=req.validationErrors();
    if(error){
        res.render('register',{
            error:error
        });
    }
        else{
var newuser=new User({
    name:name,
    email:email,
    password:password,
    username:username,
});          
        }
    User.createUser(newuser,function(err,userss){
        if(err)
            throw err;
        console.log(userss);
        
    });
       req.flash('success_msg','You are now registered and can login now');
    res.redirect('/users/login');
});
passport.use(new LocalStrategy(
  function(username, password, done) {
      User.getuserbyusername(username,function(err,user){
          if(err) throw err;
          if(!user){
              return done(null,false,{message:'Unknown user'});
          }
          User.checkpassword(password,user.password,function(err,ismatch){
             if(err) throw err;
              if(ismatch){
                  return done(null,ismatch);
                  
              }
              else{
                  return done(null,false,{message:'Incorrect Password'});
              }
              
          });
          });
  }));

    //User.findOne({ username: username }, function (err, user) {
     // if (err) { return done(err); }
      //if (!user) {
        //return done(null, false, { message: 'Incorrect username.' });
      //}
      //if (!user.validPassword(password)) {
    //    return done(null, false, { message: 'Incorrect password.' });
      //}
    //  return done(null, user);
    //});
//  }

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/users/login' ,failureFlash:true,session:false}),
         function(req,res){
   res.redirect('/');
    
});
        
    router.post('/logout',function(req,res){
        req.logout();
        req.flash('success_msg','You are now logged out');
        res.redirect('/users/login');
        
    });


module.exports=router;