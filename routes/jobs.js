const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");
const jobsData = data.jobs;
const validation = require("../validation");

router.route("/searchJobs")
    .post(async (req, res) => {
        try {
            const searchQuery = req.body.jobsInput;
            console.log(searchQuery);
            const search = await jobsData.searchJobs(searchQuery);
            console.log(search);
            if (search) {
                return res.render("jobsFound", { jobs: search });
            }
        } catch (e) {
            return res.status(404).sendFile(path.resolve("static/notfound.html"));
            return;
        }
    });

router.route("/createjob")
    .post(async (req, res) => {
        const createJobData = req.body;
        const jobAuthorId = req.session.userId;
        try {
            createJobData.jobTitle = validation.checkJobTitle(createJobData.jobTitle);
            createJobData.jobDescription = validation.checkJobDescription(createJobData.jobDescription);
            createJobData.jobStreetName = validation.checkJobStreetName(createJobData.jobStreetName);
        } catch (e) {
            res.status(400).json({error: e});
            return;
        }

        try {
            const {jobTitle, jobDescription, jobStreetName} = createJobData;
            const insertJob = jobsData.createJob(jobTitle, jobDescription, jobStreetName, jobAuthorId);
            if (insertJob) {
                res.json({ success: true, jobTitle: insertJob.jobTitle });
                return;
            } else {
                res.json({ success: false });
                return;
            }
        } catch (e) {
            res.status(500).json({error: e});
            return;
        }
    });

module.exports = router;
