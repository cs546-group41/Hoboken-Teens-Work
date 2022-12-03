const express = require('express')
const router = express.Router()
const path = require('path')
const jobData = require('../data')
const jobDataFile = jobData.jobs


router.route("/searchJobs").post(async (req, res) => {
    try {
        const searchQuery = req.body.jobsInput
        console.log(searchQuery)
        const search = await jobDataFile.searchJobs(searchQuery)
        console.log(search)
        if (search) {
            return res.render("jobsFound", { jobs: search })
        }

    } catch (e) {
        return res.sendFile(path.resolve("static/notfound.html"))
    }
})

module.exports = router