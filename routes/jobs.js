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
  if (!req.session.user) {
    res.status(403)
    return res.render("error", {
      title: "Search Results - Error",
      login: false,
      errormsg: "You Need to Login first to use the Search Function!"
    })
  }
  try{
    var searchQuery = validation.checkSearchQuery(xss(req.body.jobsInput))
  }catch(e){
    return res.render("error", {
      title: "Search Results - Error",
      login: false,
      errormsg: e
    })
  }
  var searchResults = null
  try {
    searchResults = await jobs.searchJobs(searchQuery)
  } catch (e) {
    return res.render("error", {
      title: "Search Results - Error",
      login: false,
      errormsg: e
    })
  }
  res.render("searchResults", {
    title: title,
    login: true,
    loginUserData: req.session.user,
    searchResults: searchResults
  })
}).all(async (req, res) => {
  res.status(400)
  res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/createJob")
  .get(async (req, res) => {
    //console.log(req.session.user);
    var userData = null;
    if (req.session.user !== undefined) {
      try {
        userData = await users.getUserById(req.session.user.id);
        //console.log(userData);
      } catch (e) {
        req.session.destroy()
      }
    }
    if (!req.session.user) {
      return res.redirect('/index')
    }
    else {
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
        await users.getUserById(req.session.user.id)
      } catch (e) {
        req.session.destroy()
      }
    }
    try {
      var jobTitle = validation.checkJobTitle(xss(req.body.jobTitle));
      var jobDescription = validation.checkJobDescription(xss(req.body.jobDescription));
      var jobStreetName = validation.checkJobStreetName(xss(req.body.jobStreetName));
    } catch (e) {
      res.status(400)
      return res.render("createJob", {
        title: "Creating New Job - Error",
        login: true,
        loginUserData: req.session.user,
        phone: req.session.user.phone,
        errormsg: e
      })
    }

    try {
      await jobs.createJob(jobTitle, jobDescription, jobStreetName, req.session.user.id);
      return res.redirect('/user/' + req.session.user.id);
    } catch (e) {
      res.status(500);
      res.render("createJob", {
        title: "Creating New Job - Error",
        login: true,
        loginUserData: req.session.user,
        phone: req.session.user.phone,
        presetJob: xss(req.body),
        errormsg: e
      })
    }
  })
  .all(async (req, res) => {
    res.status(400)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router.route("/addComment").post(async (req, res) => {
  if (!req.session) return res.status(401).json({ results: "Unauthorized User Request." });
  if (req.session.user !== undefined) {
    try {
      await users.getUserById(req.session.user.id);
    } catch (e) {
      req.session.destroy();
      return res.status(401).json({ results: "Unauthorized User Request." });
    }
  }
  try{
  }catch(e){}
  try {
    const comment = await comments.createComment(xss(req.body.jobId), req.session.user.id, req.session.user.fullName, xss(req.body.comment));
    res.status(200).json({ results: comment });
  } catch (e) {
    res.status(400).json({ results: e });
  }
})
  .all(async (req, res) => {
    res.status(400)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router.route("/saveJob").post(async (req, res) => {
  if (!req.session) return res.status(401).json({ results: "Unauthorized User Request." });
  if (req.session.user !== undefined) {
    try {
      await users.getUserById(req.session.user.id);
    } catch (e) {
      req.session.destroy();
      return res.status(401).json({ results: "Unauthorized User Request." });
    }
  }
  try {
    if (await users.isJobSaved(xss(req.body.jobId), req.session.user.id)) {
      await users.unSaveJob(xss(req.body.jobId), req.session.user.id);
      res.status(200).json({ results: "unSaveJob" });
    } else {
      await users.saveJob(xss(req.body.jobId), req.session.user.id);
      res.status(200).json({ results: "saveJob" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ results: e });
  }
})
  .all(async (req, res) => {
    res.status(400)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router
  .route('/hire')
  .post(async (req, res) => {
    if (!req.session.user) return res.sendStatus(401)
    try {
      await users.hireForJob(req.session.user.id, xss(req.body.jobId), xss(req.body.applicantId))
      await jobs.changeStatus(req.body.jobId, req.session.user.id, "Taken")
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(400)
    }
  })
  .all(async (req, res) => {
    res.status(400)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

router
  .route('/fire')
  .post(async (req, res) => {
    if (!req.session.user) return res.sendStatus(401)
    try {
      const path = await users.fireFromJob(req.session.user.id, xss(req.body.jobId), xss(req.body.applicantId))
      await jobs.changeStatus(req.body.jobId, req.session.user.id, "Open")
      try {
        fs.unlinkSync("./" + path);
      } catch (e) {
        return res.sendStatus(200)
      }
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(400)
    }
  })
  .all(async (req, res) => {
    res.status(400)
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
    if (req.session.user) {
      login = true;
      isMinor = user.age > 18 ? false : true;
      try {
        saved = await users.isJobSaved(req.params.id, req.session.user.id);
        applied = await users.isJobApplied(req.session.user.id, req.params.id)
      }
      catch (e) {
        return res.render("error", {
          title: "Error",
          login: login,
          errormsg: e,
        });
      }

    }
    try {
      var jobDetail = await jobs.getJobById(req.params.id);
      var isAvaliable = jobDetail.jobStatus === "Finished" ? false : true;
    } catch (e) {
      return res.render("error", {
        title: `Posted Job Detail - - Error`,
        login: true,
        loginUserData: req.session.user,
        errormsg: e,
      });
    }
    try {
      if (req.session.user && (await users.jobPosterCheck(req.params.id, req.session.user.id))) {
        return res.render("applicants", {
          title: `Posted Job Detail - ${jobDetail.jobTitle}`,
          login: true,
          loginUserData: req.session.user,
          jobDetail: jobDetail,
          saved: saved,
        });
      }
      res.render("individualJob", {
        title: `Job Detail - ${jobDetail.jobTitle}`,
        login: login,
        loginUserData: req.session.user,
        jobDetail: jobDetail,
        saved: saved,
        applied: applied,
        isMinor: isMinor,
        isAvaliable: isAvaliable
      });
    }
    catch (e) {
      return res.render("error", {
        title: "Error",
        login: login,
        errormsg: e,
      });
    }
  })
  .all(async (req, res) => {
    res.status(400)
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
    var jobDetail = null
    try {
      jobDetail = await jobs.getJobById(req.params.id)
      if (jobDetail.jobAuthor.id != req.session.user.id) res.redirect(`jobs/${req.params.id}`)
    } catch (e) {
      return res.redirect("/index")
    }
    //edit job part
    try {
      //validation need to put in client side
      if (xss(req.body.phone) === "N/A") {
        await jobs.editJob(
          req.params.id,
          req.session.user.id,
          xss(req.body.jobTitle),
          xss(req.body.jobDescription),
          xss(req.body.jobStreetName));
      } else {
        await jobs.editJob(
          req.params.id,
          req.session.user.id,
          xss(req.body.jobTitle),
          xss(req.body.jobDescription),
          xss(req.body.jobStreetName),
          xss(req.body.phone));
      }
      res.redirect(`/job/${req.params.id}`)

    } catch (e) {
      //add status code here
      //res.status()
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
    res.status(400)
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
    try {
      var result = await jobs.changeStatus(req.params.id, req.session.user.id, req.body.status)
      res.status(200).json({ results: result })
    } catch (e) {
      console.log(e)
      res.status(400).json({ results: e })
    }
  })
  .all(async (req, res) => {
    res.status(400)
    res.sendFile(path.resolve("static/inValidRequest.html"));
  });

module.exports = router;
