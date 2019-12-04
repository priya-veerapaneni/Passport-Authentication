const express = require('express');
const rourter = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
const User = require('../models/User');

//login page

rourter.get('/login', (req,res) => res.render('login'));

// REgister page

rourter.get('/register', (req,res) => res.render('Register'));

//register handle
rourter.post('/register', (req, res) =>{
   const { name, email, password, password2} = req.body;
let errors = [];

//chek required fields
if(!name || !email || !password || !password2){
    errors.push({msg: 'please fill in all the fields'});
}

//check password match 
if(password != password2){
    errors.push({msg: 'passwords dont match'});
}

//check pwd length
if(password.length < 6){
    errors.push({msg: 'password should be atlest 6 chars'});
}

if(errors.length > 0){
    res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    });

}else{
  //validation passed

  User.findOne({ email: email})
    .then(user => {
        if(user){
            //User exists
            errors.push({ msg: 'email already exists'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            }); 
        } else{
                const newUser = new User({
                        name,
                        email,
                        password
                });
               //Hash password
               bcrypt.genSalt(10, (err, salt) => 
                 bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //set pwd to hash
                    newUser.password = hash;
                    //save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'you are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err))

               }))

        }
    });

}

});

//login handle
rourter.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req,res,next);

});


//logout handle
rourter.get('/logout', (req,res) =>{
    req.logout();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
});

module.exports= rourter;