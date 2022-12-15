const express = require("express");
const router = express.Router();
const data = require('../data')
const users = data.users
const validation = require("../validation");

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
      console.log(req.body);

      const validatedFirstName = validation.checkFirstName(req.body.firstNameInput);
			const validatedLastName = validation.checkLastName(req.body.lastNameInput);
			const validatedEmail = validation.checkEmail(req.body.emailInput);
			const validatedAge = validation.checkAge(req.body.ageInput);
			const validatedPhone = validation.checkPhone(req.body.phoneNumberInput);
			const validatedPassword = validation.checkPassword(req.body.passwordInput);

      console.log(validatedFirstName,validatedLastName,validatedEmail,validatedAge,validatedPhone,validatedPassword);

			if (validatedFirstName && validatedLastName && validatedEmail && validatedAge && validatedPhone && validatedPassword) {
  
        await users.createUser(
          req.body.firstNameInput,
          req.body.lastNameInput,
          req.body.emailInput,
          req.body.ageInput,
          req.body.passwordInput,
          req.body.phoneNumberInput
        );
        res.redirect('login');

			}
   
     
    
    } catch (e) {
      return res.render("signUp", {
        hideLogin: true,
        errormsg: e
      })
    }
  });

module.exports = router;
