const express = require("express");
const router = express.Router();
const data = require('../data')
const users = data.users
const validation = require("../validation");
const xss = require("xss");
const path = require("path")

router
  .route("/")
  .get(async (req, res) => {
    //simple render the register page, if already logged in, will not see this page
    if (req.session.user) return res.redirect("homepage");
    res.render("signUp");
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req);
    if (req.session.user) {
      return res.redirect("homepage");
    }
    try {
      //console.log(xss(req.body));
      const validatedFirstName = validation.checkFirstName(xss(req.body.firstNameInput));
			const validatedLastName = validation.checkLastName(xss(req.body.lastNameInput));
			const validatedEmail = validation.checkEmail(xss(req.body.emailInput));
			const validatedAge = validation.checkAge(xss(req.body.ageInput));
			const validatedPhone = validation.checkPhone(xss(req.body.phoneNumberInput));
			const validatedPassword = validation.checkPassword(xss(req.body.passwordInput));
      //console.log(validatedFirstName,validatedLastName,validatedEmail,validatedAge,validatedPhone,validatedPassword);
			if (validatedFirstName && validatedLastName && validatedEmail && validatedAge && validatedPhone && validatedPassword) {
  
        await users.createUser(
          validatedFirstName,
          validatedLastName,
          validatedEmail,
          validatedAge,
          validatedPassword,
          validatedPhone
        );
        res.redirect('login');
			}
    } catch (e) {
      return res.render("signUp", {
        hideLogin: true,
        errormsg: e
      })
    }
  })
  .all(async (req, res) => {
    res.status(400)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

module.exports = router;
