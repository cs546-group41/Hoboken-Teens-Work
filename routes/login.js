const express = require('express');
const router = express.Router();
const data = require('../data')
const users = data.users
router
  .route('/')
  .get(async (req, res) => {
    //if the user have cookie, then will directly go to user page, if the user is not found, cookie will be deleted and
    //go the the login page without error messge
    if (req.session.user){
      try{
        res.redirect(`/user/${req.session.user.id}`)
      }catch(e){
        req.session.destroy()
        res.render("login")
      }      
    }
    else{
      res.render("login")
    }
  })

router
  .route('/')
  .post(async (req,res) =>{
    //if the input match the data in the database, then will store a cookie otherwise re-render the page with error msg
      try{
        const user = await users.loginCheck(req.body.email,req.body.password)
        req.session.user = { fullName: `${user.firstName} ${user.lastName}`, id:user._id}
        return res.redirect("/index")
      }catch(e){
        return res.render("login",{errormsg:e})
      }
  })


module.exports = router