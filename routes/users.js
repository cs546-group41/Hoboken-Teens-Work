const express = require('express');
const { jobs } = require('../data');
const router = express.Router();
const data = require('../data')
const users = data.users

router
  .route('/')
  .get(async (req, res) => {
    res.redirect('/index')
  })

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    var login = false
    var selfReview = true
    var adultUser = true
    if (req.session.user) login = true
    if (login && req.session.user.id !== req.params.id ){
      selfReview = false
    }
    try{
      const userData = await users.getUserById(req.params.id)
      if (userData.age<21) adultUser = false
      return res.render('user',{selfReview:selfReview, adultUser:adultUser, user:req.session.user, login:login, data:userData})
    }catch(e){
      return res.render('user',{notFound:true, login:true})
    }
  })

router
  .route('/:id/postjob')
  .get(async (req, res) => {
    if (!req.session.user) return res.redirect('/index')
    if (req.session.user.id !== req.params.id ) return res.redirect('/index')
    var user = null
    try{
      user = await users.getUserById(req.params.id)
    }catch(e){
      return res.redirect('/index')
    }
    res.render("postJob",{login:true, user:req.session.user, phone:user.phone})
  })

  router
  .route('/postjob')
  .post(async (req, res) => {
    if (!req.session.user) return res.redirect('/index')
    var user = null
    try{
      user = await users.getUserById(req.session.user.id)
    }catch(e){
      return res.redirect('/index')
    }
    try{
      await jobs.createJob(req.body.jobTitle,req.body.jobDescription, req.body.jobStreetName, user._id.toString())
      return res.redirect(`/user/${req.session.user.id}`)
    }catch(e){
      res.render("postJob",{login:true, user:req.session.user, phone:user.phone, errormsg:e})
    }
  })
module.exports = router