const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users
const jobs = data.jobs

router
  .route('/')
  .get(async (req, res) => {
    res.redirect('/index')
  })

router
  .route("/deleteJob/:id")
  .delete(async (req, res) => {
    if (!req.session.user) {
      res.status(401).json({ result: "failed" })
      return
    }
    try {
      const jobInfo = await jobs.getJobById(req.params.id)
      if (jobInfo.jobAuthor.id != req.session.user.id) throw "Unauthorized opration"
      await jobs.removeJob(req.params.id)
      res.status(200).json({ result: "success" })
      return
    } catch (e) {
      console.log(e)
      res.status(404).json({ result: "failed" })
      return
    }
  })

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    var login = false
    var selfReview = true
    var adultUser = true
    if (req.session.user) login = true
    if (login && req.session.user.id !== req.params.id) {
      selfReview = false
    }
    try {
      const userData = await users.getUserById(req.params.id)
      if (userData.age < 21) adultUser = false
      return res.render('userProfile', {
        title: `Personal Info - ${userData.firstName} ${userData.lastName}`,
        login: login,
        loginUserData: req.session.user,
        selfReview: selfReview,
        adultUser: adultUser,
        curUser: userData
      })
    } catch (e) {
      return res.render('error', {
        title: `User Not Found`,
        login: login,
        loginUserData: req.session.user,
        errormsg: "User Not Found"
      })
    }
  })

router
  .route('/:id/savedJob')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.user) return res.redirect('/index')
    if (req.session.user.id !== req.params.id) return res.redirect('/index')
    try {
      const userData = await users.getUserById(req.session.user.id)
      return res.render('savedJobs', {
        title: `Saved Jobs - ${userData.firstName} ${userData.lastName}`,
        login: true,
        loginUserData: req.session.user,
        curUser: userData
      })
    } catch (e) {
      return res.render('error', {
        title: `Saved Jobs - Not Found`,
        login: true,
        loginUserData: req.session.user,
        errormsg: "Current No Saved Jobs"
      })
    }
  })

  router
  .route('/:id/editUser')
  .get(async (req, res) => {
    if (!req.session.user) return res.redirect('/index')
    if (req.session.user.id !== req.params.id) return res.redirect('/index')
    var userData = null
    try {
      userData = await users.getUserById(req.session.user.id)
      return res.render('editProfile', {
        title: `Edit Profile - ${req.session.user.fullName}`,
        login: true,
        loginUserData: req.session.user,
        presetUser: userData
      })
    } catch (e) {
      return res.render('error', {
        title: `Error`,
        login: true,
        loginUserData: req.session.user,
        errormsg: "e"
      })
    }
  })
  .post(async (req, res) => {
    if (!req.session.user) return res.redirect('/index')
    if (req.session.user.id !== req.params.id) return res.redirect('/index')
    try{
      await users.editUser(
        req.params.id, 
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.phoneInput,
        req.body.passwordInput)
      res.redirect(`/user/${req.params.id}`)
    }catch(e){
      res.render("createJob", {
        title: `Edit Profile - ${req.session.user.fullName}`,
        login: true,
        loginUserData: req.session.user,
        presetUser: userData,
        errmsg: e
      })
    }
  })
module.exports = router