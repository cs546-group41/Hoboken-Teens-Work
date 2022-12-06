const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users
const jobs = data.jobs 

router
  .route('/')
  .get(async (req, res) => {
    res.redirect('/')
  })

router
  .route('/:id')
  .get(async (req, res) => {
    var loginUser = false
    var jobPublisher = false
    if (req.session.user){
      loginUser=true
    }
    var jobDetail = {}
    try{
      jobDetail = await jobs.getJobById(req.params.id)
    }catch(e){
      return res.render("error",{errormsg:e})
    }
    if (req.session.user && req.session.user.id === req.params.id) {
      jobPublisher = true    
    }
    res.render("jobDetail",{loginUser:loginUser, login:loginUser, user: req.session.user, jobPublisher: jobPublisher, jobDetail: jobDetail})    
  })

router
  .route('/search')
  .get(async (req, res) =>{
    res.render('jobsFound')
  })


module.exports = router