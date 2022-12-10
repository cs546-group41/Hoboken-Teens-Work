const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users
const jobs = data.jobs

router
  .route('/')
  .get(async (req, res) => {
    //check aithentication 
    const title = "Hoboken Teens Work"
    var login = false
    var loginUserData = null
    if (req.session.user!==undefined){
      //if have cookie, auto login
      try{
        //check the if the id is valid
        await users.getUserById(req.session.user.id)
        login = true
        loginUserData = req.session.user
      }catch(e){
        //if the cookie stored id is not valid, delete the cookie 
        req.session.destroy()
      }
    }
    //recieve data from jobsDatabase
    var jobData = {}
    var errormsg = ""
    try{
      jobData = await jobs.getAllJobs()
    }catch(e){
      //fail to get data from database
      errormsg = e
    }
    res.render("homepage", {
      title: title,
      login:login,
      loginUserData:loginUserData, 
      jobList: jobData, 
      errormsg: errormsg})
  })

module.exports = router