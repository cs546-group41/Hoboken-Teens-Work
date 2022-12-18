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
        console.log(req.body)
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
    
    try {
        await users.getUserById(validation.checkId(req.session.user.id))
    } catch (e) {
        req.session.destroy()
        res.status(400)
        res.redirect("/index")
    }
    
    const file = req.file;
    //console.log(1)
    try{
        //route side validation 
        
        var userId = validation.checkId(req.session.user.id);
        console.log(userId)
        console.log(jobId)
        var jobId = validation.checkId(xss(req.body.jobId));
        console.log(jobId)
    }catch(e){
        console.log(e)
        res.sendStatus(400);
        return;
    }
    //console.log(2)
    try {
        await users.applyForJob(userId, jobId, file.filename);
        res.sendStatus(200);
        return;
    } catch (e) {
        console.log(e)
        // normally the error here will be server side problem
        res.sendStatus(500);
        return;
    }
})
.all(async(req,res)=>{
    //other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});

router.route("/download/:filename").get(async (req, res) => {
    const filePath = path.join(__dirname, `../uploads/${req.params.filename}`)
    res.download(filePath, function (err) {
        //send Intenal Server Error if file not exist
        if (err) res.sendStatus(500); return;
    })
    return;
})
.all(async(req,res)=>{
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});


module.exports = router;
