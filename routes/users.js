const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const jobs = data.jobs;
const xss = require("xss");
const path = require("path")
const fs = require('fs')
const validation = require("../validation")

router.route("/").get(async (req, res) => {
	res.redirect("/index");
})
.all(async (req, res) => {
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/deleteJob/:id").delete(async (req, res) => {
	if (!req.session.user) {
		res.sendStatus(401)
		return;
	}

	try{
		var jobId = validation.checkId(req.params.id)
		var userId = validation.checkId(req.session.user.id)
	}catch(e){
		res.sendStatus(400)
		return
	}

	try {
		var jobInfo = await jobs.getJobById(jobId);
		if (jobInfo.jobAuthor.id != userId) return res.sendStatus(401)
	}catch(e){
		res.sendStatus(500)
		return
	}

	try{
		await jobs.removeJob(jobInfo._id.toString());
		res.sendStatus(200)
		return;
	} catch (e) {
		//console.log(e);
		res.sendStatus(500)
		return;
	}
})
.all(async (req, res) => {
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/:id").get(async (req, res) => {
	//code here for GET
	var login = false;
	var selfReview = true;
	var adultUser = true;
	if (req.session.user) {
		try{
			var loginUserId = validation.checkId(req.session.user.id)
			await users.getUserById(loginUserId)
		}catch(e){
			req.session.destroy()
			res.status(400)
			res.redirect("/index")
			return
		}
		login = true;
	}

	try{
		var curUserId = validation.checkId(req.params.id)
	}catch(e){
		res.status(400)
		return res.render("error", {
			title: "Personal Info - Error",
			login: login,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
	
	if (loginUserId !== curUserId) {	
		selfReview = false;
	}
	
	try {
		const userData = await users.getUserById(curUserId);
		if (userData.age < 18) adultUser = false;
		//console.log(adultUser)
		return res.render("userProfile", {
			title: `Personal Info - ${userData.firstName} ${userData.lastName}`,
			login: login,
			loginUserData: req.session.user,
			selfReview: selfReview,
			adultUser: adultUser,
			curUser: userData,
		});
	} catch (e) {
		res.status(500)
		return res.render("error", {
			title: "Personal Info - Error",
			login: login,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
})
.all(async (req, res) => {
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/:id/savedJob").get(async (req, res) => {
	//code here for GET
	if (!req.session.user) return res.redirect("/index");
	try{
		var loginUserId = validation.checkId(req.session.user.id)
		var curUserId = validation.checkId(req.params.id)
	}catch(e){
		res.status(400)
		res.redirect("/index")
		return
	}

	if (loginUserId !== curUserId) return res.redirect("/index");
	
	try {
		const userData = await users.getUserById(loginUserId);
		return res.render("savedJobs", {
			title: `Saved Jobs - ${userData.firstName} ${userData.lastName}`,
			login: true,
			loginUserData: req.session.user,
			curUser: userData,
		});
	} catch (e) {
		res.status(500)
		return res.render("error", {
			title: `Saved Jobs - Error`,
			login: true,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
})
.all(async (req, res) => {
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});


router.route("/:id/appliedJob").get(async (req, res) => {
	if (!req.session.user) return res.redirect("/index");
	try{
		var loginUserId = validation.checkId(req.session.user.id)
		var curUserId = validation.checkId(req.params.id)
	}catch(e){
		res.status(400)
		res.redirect("/index")
		return
	}
	if (loginUserId !== curUserId) return res.redirect("/index");
	try {
		const userData = await users.getUserById(loginUserId);
		return res.render("appliedJobs", {
			title: `Applied Jobs - ${userData.firstName} ${userData.lastName}`,
			login: true,
			loginUserData: req.session.user,
			curUser: userData,
		});
	} catch (e) {
		res.status(500)
		return res.render("error", {
			title: `Applied Job - Error`,
			login: true,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
})
.all(async (req, res) => {
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});


router.route("/:id/appliedJob/withdraw/:jobId").post(async (req, res) => {
	if (!req.session.user) return res.sendStatus(401)
	try{
		var loginUserId = validation.checkId(req.session.user.id)
		var curUserId = validation.checkId(req.params.id)
		var jobId = validation.checkId(req.params.jobId)
	}catch(e){
		res.sendStatus(400)
		return
	}
	if (loginUserId !== curUserId) return res.sendStatus(401)
	try {
		const applicant = await jobs.getApplicantById(jobId, loginUserId)
		var filePath = applicant.resume
		filePath = path.join(__dirname, `../${filePath}`)
		//console.log(filePath)
		await users.withdrawJobApplication(jobId, loginUserId)
		try {
			fs.unlinkSync(filePath);
		} catch (e) {
			//console.log(e)
			return res.sendStatus(202)
		}
		return res.sendStatus(200)
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


router.route("/:id/editUser")
	.get(async (req, res) => {
		if (!req.session.user) return res.redirect("/index");
		try{
			var loginUserId = validation.checkId(req.session.user.id)
			var curUserId = validation.checkId(req.params.id)
		}catch(e){
			res.status(400)
			res.redirect("/index")
			return
		}
		if (loginUserId !== curUserId) return res.redirect("/index");
		var userData = null;
		try {
			userData = await users.getUserById(loginUserId);
			return res.render("editProfile", {
				title: `Edit Profile - ${req.session.user.fullName}`,
				login: true,
				loginUserData: req.session.user,
				presetUser: userData,
			});
		} catch (e) {
			res.status(500)
			return res.render("error", {
				title: `Error`,
				login: true,
				loginUserData: req.session.user,
				errormsg: e,
			});
		}
	})
	.post(async (req, res) => {
		if (!req.session.user) return res.redirect("/index");
		try{
			var loginUserId = validation.checkId(req.session.user.id)
			var curUserId = validation.checkId(req.params.id)
			var fullName = validation.checkFullName(req.session.user.fullName)
		}catch(e){
			res.status(400)
			res.redirect("/index")
			return
		}
		if (loginUserId !== curUserId) return res.redirect("/index");
		try{
			var firstName = validation.checkFirstName(xss(req.body.firstNameInput))
			var lastName = validation.checkLastName(xss(req.body.lastNameInput))
			var phone = validation.checkPhone(xss(req.body.phoneInput))
			var password = validation.checkPassword(xss(req.body.passwordInput))
		}catch(e){

		}
		try {
			await users.editUser(loginUserId, firstName, lastName, phone, password);
			res.redirect(`/user/${loginUserId}`);
		} catch (e) {
			try {
				const userData = await users.getUserById(loginUserId)
				res.status(500)
				res.render("editProfile", {
					title: `Edit Profile - ${fullName}`,
					login: true,
					loginUserData: req.session.user,
					presetUser: userData,
					errmsg: e,
				});
			} catch (e2) {
				res.status(500)
				return res.render("error", {
					title: `Error`,
					login: true,
					loginUserData: req.session.user,
					errormsg: e2,
				});
			}
		}
	})
	.all(async (req, res) => {
		//other method should not Allowed
		res.status(405)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});



module.exports = router;
