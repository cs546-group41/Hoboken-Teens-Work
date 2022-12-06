const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users
const jobs = data.jobs

router
  .route('/')
  .get(async (req, res) => {
    //check aithentication 
    var login = false
    if (req.session.user!==undefined){
      //if have cookie, auto login
      console.log("pass authentication")
      try{
        //check the if the id is valid
        await users.getUserById(req.session.user.id)
        login = true
      }catch(e){
        //if the cookie stored id is not valid, delete the cookie 
        req.session.destroy()
      }
    }
    //recieve data from jobsDatabase
    var jobData = {}
    try{
      jobData = await jobs.getAllJobs()
    }catch(e){
      //fail to get data from database
    }
    if (req.session.user) return res.render("homepage", {login:login, user:req.session.user ,jobs: jobData})
    res.render("homepage", {login:login, jobs: jobData})
  })

module.exports = router