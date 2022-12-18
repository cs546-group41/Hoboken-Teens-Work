const express = require("express");
const router = express.Router();
const data = require('../data');
const users = data.users;
const jobs = data.jobs;
const comments = data.comments;
const validation = require("../validation");
const fs = require('fs');
const path = require('path');
const xss = require("xss");

router.route("/searchJobs").post(async (req, res) => {
  var title = "Search Results"
  if (req.session.user !== undefined) {
    try {
      await users.getUserById(req.session.user.id)
    } catch (e) {
      req.session.destroy()
    }
  }
  try {
    var searchQuery = validation.checkSearchQuery(xss(req.body.jobsInput))
  } catch (e) {
    //if the Search input was not valid
    res.status(400)
    return res.render("error", {
      title: "Search Results - Error",
      login: false,
      errormsg: e
    })
  }
  var searchResults = null
  try {
    searchResults = await jobs.searchJobs(searchQuery,req.body.searchType)
  } catch (e) {
    //should be server side if throws error
    res.status(500)
    return res.render("error", {
      title: "Search Results - Error",
      login: false,
      errormsg: e
    })
  }

  res.render("searchResults", {
    title: title,
    login: req.session.user ? true:false,
    loginUserData: req.session.user,
    searchResults: searchResults
  })


}).all(async (req, res) => {
  //other method should not Allowed
  res.status(405)
  res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/createJob")
  .get(async (req, res) => {
    //console.log(req.session.user);
    var userData = null;
    if (req.session.user !== undefined) {
      try {
        userData = await users.getUserById(validation.checkId(req.session.user.id));
        //console.log(userData);
      } catch (e) {
        req.session.destroy()
        res.status(400)
        res.redirect("/index")
      }
    }
    if (!req.session.user) {
      //only loggin user can use this function
      res.status(401)
      return res.redirect('/index')
    }
    else {
      //render with defalut value
      res.render("createJob", {
        title: "Creating New Job",
        login: true,
        loginUserData: userData,
        phone: userData.phone
      })
    }
  })
  .post(async (req, res) => {
    if (req.session.user !== undefined) {
      try {
        var user = await users.getUserById(validation.checkId(req.session.user.id))
      } catch (e) {
        req.session.destroy()
        res.status(400)
        res.redirect("/index")
      }
    }
    try {
      //route side validtaion
      console.log(req.body.jobTitle)
      var jobTitle = validation.checkJobTitle(xss(req.body.jobTitle));
      console.log(req.body.jobDescription)
      var jobDescription = validation.checkJobDescription(xss(req.body.jobDescription));
      console.log(req.body.jobStreetName)
      var jobStreetName = validation.checkJobStreetName(xss(req.body.jobStreetName));
      console.log(req.body.jobTag)
      var jobTag = validation.checkJobTag(xss(req.body.jobTag));
      console.log("done!")
    } catch (e) {
      console.log(e)
      res.status(400)
      return res.render("createJob", {
        title: "Creating New Job - Error",
        login: true,
        loginUserData: req.session.user,
        phone: user.phone,
        errormsg: e
      })
    }

    try {
      await jobs.createJob(jobTitle, jobDescription, jobStreetName, req.session.user.id, jobTag);
      return res.redirect('/user/' + req.session.user.id);
    } catch (e) {
      res.status(500);
      res.render("createJob", {
        title: "Creating New Job - Error",
        login: true,
        loginUserData: req.session.user,
        phone: user.phone,
        presetJob: xss(req.body),
        errormsg: e
      })
    }
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });


router.route("/addComment").post(async (req, res) => {
  if (!req.session) return res.sendStatus(401);
  if (req.session.user !== undefined) {
    try {
      await users.getUserById(req.session.user.id);
    } catch (e) {
      req.session.destroy();
      return res.sendStatus(401);
    }
  }
  
  //route side validation
  try {
    var jobId = validation.checkId(xss(req.body.jobId))
    var commentText = validation.checkString(xss(req.body.comment))
    var userId = validation.checkId(req.session.user.id)
    var name = validation.checkFullName(req.session.user.fullName)
  } catch (e) {
    return res.status(400).json({ results: e });
  }

  try {
    const comment = await comments.createComment(jobId, userId, name, commentText);
    res.status(200).json({ results: comment });
  } catch (e) {
    res.status(400).json({ results: e });
  }
})
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });


router.route("/saveJob").post(async (req, res) => {
  if (!req.session) return res.sendStatus(401);
  if (req.session.user !== undefined) {
    try {
      await users.getUserById(req.session.user.id);
    } catch (e) {
      req.session.destroy();
      return res.sendStatus(401);
    }
  }

  //route side validation
  try {
    var jobId = validation.checkId(xss(req.body.jobId))
    var userId = validation.checkId(req.session.user.id)
  } catch (e) {
    return res.sendStatus(400)
  }

  try {
    if (await users.isJobSaved(jobId, userId)) {
      await users.unSaveJob(jobId, userId);
      res.sendStatus(200);
    } else {
      await users.saveJob(jobId, userId);
      res.sendStatus(200);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ results: e });
  }
})
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router
  .route('/hire')
  .post(async (req, res) => {
    if (!req.session.user) return res.sendStatus(401)

    //route side validation
    try {
      var jobId = validation.checkId(xss(req.body.jobId))
      var applicantId = validation.checkId(xss(req.body.applicantId))
      var userId = validation.checkId(req.session.user.id)
    } catch (e) {
      return res.sendStatus(400)
    }

    try {
      await users.hireForJob(userId, jobId, applicantId)
      await jobs.changeStatus(jobId, userId, "Taken")
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router
  .route('/fire')
  .post(async (req, res) => {
    if (!req.session.user) return res.sendStatus(401)

    //route side validation
    try {
      var jobId = validation.checkId(xss(req.body.jobId))
      var authorId = validation.checkId(req.session.user.id)
      var applicantId = validation.checkId(xss(req.body.applicantId))
    } catch (e) {
      return res.sendStatus(400)
    }

    try {
      const path = await users.fireFromJob(authorId, jobId, applicantId)
      await jobs.changeStatus(jobId, authorId, "Open")
      try {
        fs.unlinkSync("./" + path);
      } catch (e) {
        //the file is missing 
        return res.sendStatus(202)
      }
      res.sendStatus(200)
    } catch (e) {
      //console.log(e)
      res.sendStatus(500)
    }
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router.route("/:id")
  .get(async (req, res) => {
    let isMinor = false;
    if (req.session.user !== undefined) {
      try {
        var user = await users.getUserById(req.session.user.id);
      } catch (e) {
        req.session.destroy();
      }
    }
    var login = false;
    var saved = false;
    var applied = false;

    //validation1
    try {
      var jobId = validation.checkId(req.params.id)
    } catch (e) {
      res.status(400)
      res.redirect("/index")
      return
    }

    if (req.session.user) {
      login = true;
      isMinor = user.age > 18 ? false : true;

      //validation2
      try {
        var userId = validation.checkId(req.session.user.id)
      } catch (e) {
        res.status(400)
        res.redirect("/index")
        return
      }

      try {
        saved = await users.isJobSaved(jobId, userId);
        applied = await users.isJobApplied(userId, jobId)
      }
      catch (e) {
        res.status(500)
        return res.render("error", {
          title: "Error",
          login: login,
          errormsg: e,
        });
      }

    }
    try {
      var jobDetail = await jobs.getJobById(jobId);
      var isAvaliable = jobDetail.jobStatus === "Finished" ? false : true;
    } catch (e) {
      res.status(500)
      return res.render("error", {
        title: `Posted Job Detail - Error`,
        login: true,
        loginUserData: req.session.user,
        errormsg: e,
      });
    }
    try {
      if (req.session.user && (await users.jobPosterCheck(jobId, userId))) {
        return res.render("applicants", {
          title: `Posted Job Detail - ${jobDetail.jobTitle}`,
          login: true,
          loginUserData: req.session.user,
          jobDetail: jobDetail,
          saved: saved,
        });
      }
      console.log(jobDetail);
      res.render("individualJob", {
        title: `Job Detail - ${jobDetail.jobTitle}`,
        login: login,
        loginUserData: req.session.user,
        jobDetail: jobDetail,
        jobId:req.params.id,
        saved: saved,
        applied: applied,
        isMinor: isMinor,
        isAvaliable: isAvaliable
      });
    }
    catch (e) {
      res.status(500)
      return res.render("error", {
        title: "Error",
        login: login,
        errormsg: e,
      });
    }
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router.route("/:id/editJob")
  .get(async (req, res) => {
    //check if logged in and if it is the author of the job, if not redirect to the job detail page
    if (!req.session.user) return res.redirect(`jobs/${req.params.id}`)
    var jobDetail = null
    try {
      jobDetail = await jobs.getJobById(req.params.id)
      if (jobDetail.jobAuthor.id != req.session.user.id) res.redirect(`jobs/${req.params.id}`)
    } catch (e) {
      return res.redirect("/index")
    }
    res.render("createJob", {
      title: "Editing Job",
      login: true,
      loginUserData: req.session.user,
      presetJob: jobDetail
    })
  })
  .post(async (req, res) => {
    //check if login in and if is the author of the job, if not redirect to the job detail page
    if (!req.session.user) return res.redirect(`jobs/${req.params.id}`)
    
    //route side validation
    //validation
    try {
      console.log(req.body)
      var jobId = validation.checkId(req.params.id)
      var userId = validation.checkId(req.session.user.id)
      var jobTitle = validation.checkJobTitle(xss(req.body.jobTitle)) 
      var jobDescription = validation.checkJobDescription(xss(req.body.jobDescription))  
      var jobStreetName = validation.checkJobStreetName(xss(req.body.jobStreetName)) 
      var jobTag = validation.checkJobTag(xss(req.body.jobTag))
      var phone = validation.checkPhone(xss(req.body.phone))  
    } catch (e) {
      res.status(400)
      res.redirect("/index")
      return
    }
    
    var jobDetail = null
    try {
      jobDetail = await jobs.getJobById(jobId)
      if (jobDetail.jobAuthor.id != userId) res.redirect(`jobs/${jobId}`)
    } catch (e) {
      res.status(400)
      return res.redirect("/index")
    }
    //edit job part
    try {
      await jobs.editJob(jobId, userId, jobTitle, jobDescription, jobStreetName, phone, jobTag);
      res.redirect(`/job/${jobId}`);
    } catch (e) {
      console.log(e)
      //add status code here
      res.status(500)
      res.render("createJob", {
        title: "Editing Job",
        login: true,
        loginUserData: req.session.user,
        presetJob: jobDetail,
        errormsg: e
      })
    }
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router.route("/:id/changeStatus")
  .post(async (req, res) => {
    //check if login in and if is the author of the job, if not redirect to the job detail page
    if (!req.session) return res.status(401).json({ results: "Unauthorized User Request." })
    if (req.session.user !== undefined) {
      try {
        await users.getUserById(req.session.user.id)
      } catch (e) {
        req.session.destroy()
        return res.status(401).json({ results: "Unauthorized User Request." })
      }
    }

    //validation
    try {
      var jobId = validation.checkId(req.params.id)
      var userId = validation.checkId(req.session.user.id)
      var status = validation.checkJobStatus(xss(req.body.status))  
    } catch (e) {
      res.status(400).json({ results: e })
      return
    }

    try {
      var result = await jobs.changeStatus(jobId, userId, status)
      res.status(200).json({ results: result })
    } catch (e) {
      //console.log(e)
      res.status(400).json({ results: e })
    }
  })
  .all(async (req, res) => {
    //other method should not Allowed
    res.status(405)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

module.exports = router;
