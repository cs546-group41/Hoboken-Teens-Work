const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    res.redirect('/index')
  })

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.user) return res.redirect('/index')
    var selfReview = true
    var adultUser = true
    if (req.session.user.id !== req.params.id ){
      selfReview = false
    }
    try{
      const userData = await users.getUserById(req.params.id)
      if (userData.age<21) adultUser = false
      return res.render('user',{selfReview:selfReview, adultUser:adultUser, user:req.session.user, login:true, data:userData})
    }catch(e){
      return res.render('user',{notFound:true, login:true})
    }
  })

module.exports = router