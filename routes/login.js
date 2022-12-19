const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const xss = require("xss");
const path = require("path")
const validation = require("../validation")

router.route("/").get(async (req, res) => {
  //if the user have cookie, then will directly go to user page, if the user is not found, cookie will be deleted and
  //go the the login page without error messge
  if (req.session.user) {
      
    try {
      await users.getUserById(validation.checkId(req.session.user.id))
    } catch (e) {
      req.session.destroy()
    }
   
    return res.redirect("/index");
  } 
  else {
    res.render("login", { 
      title: "Login",
      hideLogin: true 
    });
  }
  return
})
.post(async (req, res) => {
  //if the input match the data in the database, then will store a cookie otherwise re-render the page with error msg
  if (req.session.user) req.session.destroy()
  
  try {
    //route side validtaion
    var email = validation.checkEmail(xss(req.body.emailInput));
    var password = validation.checkLoginPassword(xss(req.body.passwordInput));
  } catch (e) {
    res.status(400)
    res.render("login", { 
      title: "Login",
      hideLogin: true,
      errormsg: e
    });
    return
  }
  
  
  try {
    const user = await users.loginCheck(email, password);
    req.session.user = {
      fullName: `${user.firstName} ${user.lastName}`,
      id: user._id
    };
    return res.redirect("/index");
  } catch (e) {
    //console.log(e);
    res.status(401)
    return res.render("login", {
      title: "Login",
      hideLogin: true,
      errormsg: e,
    });
  }
})
.all(async (req, res) => {
  //other method should not Allowed
  res.status(405)
  res.sendFile(path.resolve("static/inValidRequest.html"));
  return
});

module.exports = router;
