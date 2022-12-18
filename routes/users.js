const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const jobs = data.jobs;
const xss = require("xss");
const path = require("path")
const fs = require('fs')

router.route("/").get(async (req, res) => {
	res.redirect("/index");
});

router.route("/deleteJob/:id").delete(async (req, res) => {
	if (!req.session.user) {
		res.status(401).json({ result: "failed" });
		return;
	}
	try {
		const jobInfo = await jobs.getJobById(req.params.id);
		if (jobInfo.jobAuthor.id != req.session.user.id) throw "Unauthorized opration";
		await jobs.removeJob(req.params.id);
		res.status(200).json({ result: "success" });
		return;
	} catch (e) {
		console.log(e);
		res.status(404).json({ result: "failed" });
		return;
	}
})
	.all(async (req, res) => {
		res.status(400)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});

router.route("/:id").get(async (req, res) => {
	//code here for GET
	var login = false;
	var selfReview = true;
	var adultUser = true;
	if (req.session.user) login = true;
	if (login && req.session.user.id !== req.params.id) {
		selfReview = false;
	}
	try {
		const userData = await users.getUserById(req.params.id);
		if (userData.age < 21) adultUser = false;
		return res.render("userProfile", {
			title: `Personal Info - ${userData.firstName} ${userData.lastName}`,
			login: login,
			loginUserData: req.session.user,
			selfReview: selfReview,
			adultUser: adultUser,
			curUser: userData,
		});
	} catch (e) {
		return res.render("error", {
			title: "Personal Info - Error",
			login: login,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
})
	.all(async (req, res) => {
		res.status(400)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});

router.route("/:id/savedJob").get(async (req, res) => {
	//code here for GET
	if (!req.session.user) return res.redirect("/index");
	if (req.session.user.id !== req.params.id) return res.redirect("/index");
	try {
		const userData = await users.getUserById(req.session.user.id);
		return res.render("savedJobs", {
			title: `Saved Jobs - ${userData.firstName} ${userData.lastName}`,
			login: true,
			loginUserData: req.session.user,
			curUser: userData,
		});
	} catch (e) {
		return res.render("error", {
			title: `Saved Jobs - Error`,
			login: true,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
})
	.all(async (req, res) => {
		res.status(400)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});

router.route("/:id/appliedJob").get(async (req, res) => {
	if (!req.session.user) return res.redirect("/index");
	if (req.session.user.id !== req.params.id) return res.redirect("/index");
	try {
		const userData = await users.getUserById(req.session.user.id);
		return res.render("appliedJobs", {
			title: `Applied Jobs - ${userData.firstName} ${userData.lastName}`,
			login: true,
			loginUserData: req.session.user,
			curUser: userData,
		});
	} catch (e) {
		return res.render("error", {
			title: `Applied Job - Error`,
			login: true,
			loginUserData: req.session.user,
			errormsg: e,
		});
	}
})
	.all(async (req, res) => {
		res.status(400)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});

router.route("/:id/appliedJob/withdraw/:jobId").post(async (req, res) => {
	if (!req.session.user) return res.sendStatus(401)
	if (req.session.user.id !== req.params.id) return res.sendStatus(401)
	try {
		const applicant = await jobs.getApplicantById(req.params.jobId, req.session.user.id)
		var filePath = applicant.resume
		filePath = path.join(__dirname, `../${filePath}`)
		//console.log(filePath)
		await users.withdrawJobApplication(req.params.jobId, req.params.id)
		try {
			fs.unlinkSync(filePath);
		} catch (e) {
			console.log(e)
			return res.sendStatus(200)
		}
		return res.sendStatus(200)
	} catch (e) {
		console.log(e)
		res.sendStatus(400)
	}
})
	.all(async (req, res) => {
		res.status(400)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});

router.route("/:id/editUser")
	.get(async (req, res) => {
		if (!req.session.user) return res.redirect("/index");
		if (req.session.user.id !== req.params.id) return res.redirect("/index");
		var userData = null;
		try {
			userData = await users.getUserById(req.session.user.id);
			return res.render("editProfile", {
				title: `Edit Profile - ${req.session.user.fullName}`,
				login: true,
				loginUserData: req.session.user,
				presetUser: userData,
			});
		} catch (e) {
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
		if (req.session.user.id !== req.params.id) return res.redirect("/index");
		try {
			await users.editUser(req.params.id, xss(req.body.firstNameInput), xss(req.body.lastNameInput), xss(req.body.phoneInput), xss(req.body.passwordInput));
			res.redirect(`/user/${req.params.id}`);
		} catch (e) {
			try {
				const userData = await users.getUserById(req.session.user.id)
				res.render("editProfile", {
					title: `Edit Profile - ${req.session.user.fullName}`,
					login: true,
					loginUserData: req.session.user,
					presetUser: userData,
					errmsg: e,
				});
			} catch (e2) {
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
		res.status(400)
		res.sendFile(path.resolve("static/inValidRequest.html"));
	});



module.exports = router;
