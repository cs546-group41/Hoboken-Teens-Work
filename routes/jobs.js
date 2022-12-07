const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");
const jobsData = data.jobs;
const validation = require("../validation");

router.route("/searchJobs")
    .post(async (req, res) => {
        const searchQuery = req.body.jobsInput;
        try {
            searchQuery = validation.checkSearchQuery(searchQuery);
        } catch (e) {
            return res.status(400).json({error: e});
        }
        try {
            console.log(searchQuery);
            const search = await jobsData.searchJobs(searchQuery);
            console.log(search);
            if (search) {
                return res.render("jobsFound", { jobs: search });
            }
        } catch (e) {
            return res.status(404).sendFile(path.resolve("static/notfound.html"));
        }
    });

router.route("/createJob")
    .post(async (req, res) => {
        const createJobData = req.body;
        const jobAuthorId = req.session.userId;
        try {
            createJobData.jobTitle = validation.checkJobTitle(createJobData.jobTitle);
            createJobData.jobDescription = validation.checkJobDescription(createJobData.jobDescription);
            createJobData.jobStreetName = validation.checkJobStreetName(createJobData.jobStreetName);
        } catch (e) {
            return res.status(400).json({error: e});
        }

        try {
            const {jobTitle, jobDescription, jobStreetName} = createJobData;
            const insertJob = jobsData.createJob(jobTitle, jobDescription, jobStreetName, jobAuthorId);
            if (insertJob) {
                res.json({ success: true, jobTitle: insertJob.jobTitle });
                return;
            } else {
                return res.json({ success: false });
            }
        } catch (e) {
            return res.status(500).json({error: e});
        }
    });

    router.route("editJob")
        .put(async(req, res) => {
            const editJobBody = req.body;
            const authorId = req.session.userId;
            try {
                if(!editJobBody) throw "No input provided";
                editJobBody.jobId = validation.checkId(editJobBody.jobId);
                editJobBody.jobTitle = validation.checkJobTitle(editJobBody.jobTitle);
                editJobBody.jobDescription = validation.checkJobDescription(editJobBody.jobDescription);
                editJobBody.jobStreetName = validation.checkJobStreetName(editJobBody.jobStreetName);
                editJobBody.jobStatus = validation.checkJobStatus(editJobBody.jobStatus);
              
                if (editJobBody.phoneNumber) {
                  phoneNumber = validation.checkPhone(editJobBody.phoneNumber);
                } else {
                  phoneNumber = null;
                }
            } catch (e) {
                return res.status(400).json({error: e});
            }
        });

module.exports = router;
