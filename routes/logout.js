const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    //simple route to loggout will consider adding a page auto redirect after few second if have time to do so
    req.session.destroy((err) => {
      res.redirect('/index')
    })
  })
module.exports = router