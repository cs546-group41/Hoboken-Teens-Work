const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users

router
  .route('/')
  .get(async (req, res) => {
    //simple render the register page, if already logged in, will not see this page
    if (req.session.user) return res.redirect("homepage")
    res.render("signUp")
  })
  .post(async (req, res) => {
    //code here for POST
    if (req.session.user) {
      return res.redirect("homepage")
    }
    try {
      await users.createUser(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailInput,
        req.body.ageInput,
        req.body.phoneInput,
        req.body.passwordInput
      );
      res.redirect('login')
    } catch (e) {
      res.status(result.code)
      res.render("signUp", {errmsg:e})
    }
  })

module.exports = router