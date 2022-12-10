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
      res.status(401).json({result:"failed"})
      return 
    }
    try {
      const jobInfo = await jobs.getJobById(req.params.id)
      if (jobInfo.jobAuthor.id != req.session.user.id) throw "Unauthorized opration"
      await jobs.removeJob(req.params.id)
      res.status(200).json({result:"success"})
      return 
    } catch (e) {
      console.log(e)
      res.status(404).json({result:"failed"})
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
      return res.render('userProfile', { selfReview: selfReview, adultUser: adultUser, user: req.session.user, login: login, data: userData })
    } catch (e) {
      return res.render('userProfile', { notFound: true, login: true })
    }
  })



module.exports = router