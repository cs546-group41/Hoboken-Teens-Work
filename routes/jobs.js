const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const jobs = data.jobs;
const comments = data.comments;
const validation = require("../validation");

router.route("/searchJobs").post(async (req, res) => {
	var title = "Search Results";
	if (req.session.user !== undefined) {
		try {
			await users.getUserById(req.session.user.id);
		} catch (e) {
			req.session.destroy();
		}
	}
	if (!req.session.user) {
		res.status(403);
		return res.render("error", {
			title: "Error",
			login: false,
			errormsg: "You Need to Login first to use the Search Function!",
		});
	}
	var errormsg = "";
	var searchResults = null;
	try {
		searchResults = await jobs.searchJobs(req.body.jobsInput);
	} catch (e) {
		title = "Job Not Found!";
		errormsg = e;
	}
	res.render("searchResults", {
		title: title,
		login: true,
		loginUserData: req.session.user,
		searchResults: searchResults,
		errormsg: errormsg,
	});
});

router
	.route("/createJob")
	.get(async (req, res) => {
		if (req.session.user !== undefined) {
			try {
				await users.getUserById(req.session.user.id);
			} catch (e) {
				req.session.destroy();
			}
		}
		if (!req.session.user) return res.redirect("/index");
		res.render("createJob", {
			title: "Creating New Job",
			login: true,
			loginUserData: req.session.user,
			phone: req.session.user.phone,
		});
	})
	.post(async (req, res) => {
		if (req.session.user !== undefined) {
			try {
				await users.getUserById(req.session.user.id);
			} catch (e) {
				req.session.destroy();
			}
		}
		const createJobData = req.body;
		const jobAuthorId = req.session.user.id;
		try {
			createJobData.jobTitle = validation.checkJobTitle(createJobData.jobTitle);
			createJobData.jobDescription = validation.checkJobDescription(createJobData.jobDescription);
			createJobData.jobStreetName = validation.checkJobStreetName(createJobData.jobStreetName);
		} catch (e) {
			res.status(400);
			return res.render("createJob", {
				title: "Creating New Job",
				login: true,
				loginUserData: req.session.user,
				phone: req.session.user.phone,
				errmsg: e,
			});
		}

		try {
			const { jobTitle, jobDescription, jobStreetName } = createJobData;
			jobs.createJob(jobTitle, jobDescription, jobStreetName, jobAuthorId);
			return res.redirect(`/user/${req.session.user.id}`);
		} catch (e) {
			res.status(500);
			res.render("createJob", {
				title: "Creating New Job",
				login: true,
				loginUserData: req.session.user,
				phone: req.session.user.phone,
				errmsg: e,
			});
		}
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
	try {
		const comment = await comments.createComment(req.body.jobId, req.session.user.id, req.session.user.fullName, req.body.comment);
		res.status(200).json({ results: comment });
	} catch (e) {
		res.status(400).json({ results: e });
	}
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
		if (await users.isJobSaved(req.body.jobId, req.session.user.id)) {
			await users.unSaveJob(req.body.jobId, req.session.user.id);
			res.status(200).json({ results: "unSaveJob" });
		} else {
			await users.saveJob(req.body.jobId, req.session.user.id);
			res.status(200).json({ results: "saveJob" });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({ results: e });
	}
});

router.route("/apply").post(async (req, res) => {});

router.route("/:id").get(async (req, res) => {
	let isAdult = false;
	if (req.session.user !== undefined) {
		try {
			var user = await users.getUserById(req.session.user.id);
		} catch (e) {
			req.session.destroy();
		}
	}
	var login = false;
	var saved = false;
	if (req.session.user) {
		login = true;
		saved = await users.isJobSaved(req.params.id, req.session.user.id);
		isAdult = user.age > 18 ? false : true;
	}
	var jobDetail = null;
	try {
		jobDetail = await jobs.getJobById(req.params.id);
	} catch (e) {
		return res.render("error", {
			title: "Error",
			login: login,
			errormsg: e,
		});
	}
	if (req.session.user && (await users.jobPosterCheck(req.params.id, req.session.user.id))) {
		return res.render("applicants", {
			title: `Posted Job Detail - ${jobDetail.jobTitle}`,
			login: true,
			loginUserData: req.session.user,
			jobDetail: jobDetail,
			saved: saved,
		});
	}
	console.log(req.session.user);
	res.render("individualJob", {
		title: `Job Detail - ${jobDetail.jobTitle}`,
		login: login,
		loginUserData: req.session.user,
		jobDetail: jobDetail,
		saved: saved,
		isAdult: isAdult,
	});
});

router
	.route("/:id/editJob")
	.get(async (req, res) => {
		//check if logged in and if it is the author of the job, if not redirect to the job detail page
		if (!req.session.user) return res.redirect(`jobs/${req.params.id}`);
		var jobDetail = null;
		try {
			jobDetail = await jobs.getJobById(req.params.id);
			if (jobDetail.jobAuthor.id != req.session.user.id) {
				console.log(1);
				res.redirect(`jobs/${req.params.id}`);
			}
		} catch (e) {
			return res.redirect("/index");
		}
		res.render("createJob", {
			title: "Editing Job",
			login: true,
			loginUserData: req.session.user,
			presetJob: jobDetail,
		});
	})
	.post(async (req, res) => {
		//check if login in and if is the author of the job, if not redirect to the job detail page
		if (!req.session.user) return res.redirect(`jobs/${req.params.id}`);
		var jobDetail = null;
		try {
			jobDetail = await jobs.getJobById(req.params.id);
			if (jobDetail.jobAuthor.id != req.session.user.id) res.redirect(`jobs/${req.params.id}`);
		} catch (e) {
			return res.redirect("/index");
		}
		//edit job part
		try {
			//validation need to put in client side
			if (req.body.phone === "N/A") {
				await jobs.editJob(req.params.id, req.session.user.id, req.body.jobTitle, req.body.jobDescription, req.body.jobStreetName);
			} else {
				await jobs.editJob(req.params.id, req.session.user.id, req.body.jobTitle, req.body.jobDescription, req.body.jobStreetName, req.body.phone);
			}
			res.redirect(`/job/${req.params.id}`);
		} catch (e) {
			//add status code here
			//res.status()
			res.render("createJob", {
				title: "Editing Job",
				login: true,
				loginUserData: req.session.user,
				presetJob: jobDetail,
				errmsg: e,
			});
		}
	});

router.route("/:id/changeStatus").post(async (req, res) => {
	//check if login in and if is the author of the job, if not redirect to the job detail page
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
		var result = await jobs.changeStatus(req.params.id, req.session.user.id);
		res.status(200).json({ results: result });
	} catch (e) {
		console.log(e);
		res.status(400).json({ results: e });
	}
});

module.exports = router;
