const express = require("express");
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const path = require("path")
const data = require("../data")
const users = data.users
const xss = require("xss");
const validation = require('../validation')
// use multer as file upload middleware
const saveOptions = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, md5(Date.now() + file.originalname) + file.originalname.substring(file.originalname.lastIndexOf(".")));
    }
});
const upload = multer({ storage: saveOptions });


router.use(function (req, res, next) {
    //authentication
    if (!req.session.user) return res.sendStatus(401);
    next();
});


router.route("/upload").post(upload.single("resume"), async (req, res) => {
    const file = req.file;
    try{
        var userId = validation.checkId(req.session.user.id);
        var jobId = validation.checkId(xss(req.body.jobId));
    }catch(e){
        res.sendStatus(400);
        return;
    }
    try {
        await users.applyForJob(userId, jobId, file.path);
        res.sendStatus(200);
        return;
    } catch (e) {
        res.sendStatus(400);
        return;
    }
})
.all(async(req,res)=>{
	res.status(400)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/download/:filename").get(async (req, res) => {
    const filePath = path.join(__dirname, `../uploads/${req.params.filename}`)
    res.download(filePath, function (err) {
        //send  Intenal Server Error if file not exist
        if (err) res.sendStatus(500); return;
    })
    return;
})
.all(async(req,res)=>{
	res.status(400)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});


module.exports = router;
