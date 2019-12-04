const express = require('express');
const rourter = express.Router();
const {ensureAuthenticated}  = require('../config/auth');

//welcome page
rourter.get('/', (req,res) => res.render('welcome'));

//Dashboard
rourter.get('/dashboard', ensureAuthenticated, (req,res) => 
res.render('dashboard',{
    name: req.user.name
}));

module.exports= rourter;