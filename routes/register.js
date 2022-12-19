const express = require("express");
const router = express.Router();
const data = require('../data')
const users = data.users
const validation = require("../validation");
const xss = require("xss");
const path = require("path")

router.route("/")
  .get(async (req, res) => {
    //simple render the register page, if already logged in, will not see this page
    if (req.session.user) return res.redirect("/index");
    res.render("signUp",{
      title: "Register",
      login: false,
      hideLogin: true
    });
    return
  })
  .post(async (req, res) => {
    //code here for POST
    //console.log(req);
    if (req.session.user) {
      return res.redirect("/index");
    }
    try {
      //console.log(xss(req.body));
      var validatedFirstName = validation.checkFirstName(xss(req.body.firstNameInput));
			var validatedLastName = validation.checkLastName(xss(req.body.lastNameInput));
			var validatedEmail = validation.checkEmail(xss(req.body.emailInput));
			var validatedAge = validation.checkAge(xss(req.body.ageInput));
			var validatedPhone = validation.checkPhone(xss(req.body.phoneNumberInput));
			var validatedPassword = validation.checkPassword(xss(req.body.passwordInput));
    }catch(e){
      res.status(400)
      return res.render("signUp", {
        title: "Register - Error",
        login: false,
        hideLogin: true,
        errormsg: e
      })
    }

    try{
      //console.log(validatedFirstName,validatedLastName,validatedEmail,validatedAge,validatedPhone,validatedPassword);
      await users.createUser(
        validatedFirstName,
        validatedLastName,
        validatedEmail,
        validatedAge,
        validatedPassword,
        validatedPhone)
      res.redirect('/login');
    } catch (e) {
      res.status(400)
      return res.render("signUp", {
        title: "Register - Error",
        login: false,
        hideLogin: true,
        errormsg: e
      })
    }
    return
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
    return
  });

module.exports = router;
