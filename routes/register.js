const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;

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
      const myUser = await users.createUser(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailInput,
        req.body.ageInput,
        req.body.passwordInput,
        req.body.phoneInput
      );
      res.redirect("login");
    } catch (e) {
      res.status(404);
      res.render("signUp", { errmsg: e });
    }
  });

module.exports = router;
