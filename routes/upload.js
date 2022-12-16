const express = require("express");
const router = express.Router();
const data = require("../data");
var fs = require('fs');
var multer = require('multer');
var md5 = require('md5');
const users = data.users;
const jobs = data.jobs;

const upload = multer({
    dest: "../uploads",
});

const saveFile = multer.diskStorage({
	destination: function (req, file, callback) {
		const userId = req.body.userId
        const jobId = req.body.jobId
        callback(null, `upload/${jobId}/${userId}`);
	},
	filename: function (req, file, callback) {
		callback(null, md5(Date.now() + file.originalname) + file.originalname.substring(file.originalname.lastIndexOf(".")));  
	}
});

router
    .route("/")
    //.post(upload.single("resume") ,async (req, res) => {
    .get(async(req,res)=>{
        res.render('test')
    })
    .post(async(req,res)=>{
        res.redirect("/index");
    });


module.exports = router;
