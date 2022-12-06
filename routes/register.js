const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users

router
  .route('/')
  .get(async (req, res) => {
    //simple render the register page, if already logged in, will not see this page
    if (req.session.user) return res.redirect("homepage")
    res.render("register")
  })
  .post(async (req, res) => {
    //code here for POST
    if (req.session.user) {
      return res.redirect("/user")
    }
    try {
      await users.createUser(
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.age,
        req.body.phone,
        req.body.password
      );
      res.redirect('login')
    } catch (e) {
      res.status(result.code)
      res.render("register", { "Error": e.toString() })
    }
  })

module.exports = router