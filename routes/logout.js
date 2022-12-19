const express = require('express');
const router = express.Router();
const path = require("path")

router
  .route('/')
  .get(async (req, res) => {
    //simple route to loggout will consider adding a page auto redirect after few second if have time to do so
    req.session.destroy((err) => {
      res.redirect('/index')
    })
    return
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
    return
  });
module.exports = router