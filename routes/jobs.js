//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const jobData = require("../data/jobs");
const validation = require("../validation");
router
  .route("/")
  .get(async (req, res) => {
    //
   res.render("createJob", { title: "Create Job" })
  })
  .post(async (req, res) => {
   
  });

router
  .route("/:userId")
  .get(async (req, res) => {
   
  })
  .put(async (req, res) => {

  });

module.exports = router;
