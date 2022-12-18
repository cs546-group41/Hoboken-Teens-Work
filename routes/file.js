const express = require("express");
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const path = require("path")
const data = require("../data")
const users = data.users
const xss = require("xss");
const fs = require("fs");
const validation = require('../validation')
// use multer as file upload middleware
const saveOptions = multer.diskStorage({
    destination: function (req, file, cb) {
        var resourcesPath = path.join(__dirname,`/../resources`)
        const folders = ["resume",req.params.jobId, req.params.id]
        for (var i = 0; i < folders.length; i++) {
            resourcesPath = resourcesPath +'\\'+folders[i];
            if (fs.existsSync(resourcesPath)) {
                var tempstats = fs.statSync(resourcesPath);
                if (!(tempstats.isDirectory())) {
                    fs.unlinkSync(resourcesPath);
                    fs.mkdirSync(resourcesPath);
                }
            }
            else{
                fs.mkdirSync(resourcesPath);
            }
        }
        resourcesPath = resourcesPath + "\\"
        //console.log(resourcesPath)
        cb(null, resourcesPath);
    },
    filename: function (req, file, cb) {
        cb(null, md5(Date.now() + file.originalname) + file.originalname.substring(file.originalname.lastIndexOf(".")));
    }
});
const upload = multer({ 
    storage: saveOptions,
    limits: { fileSize: 4*1024*1024 },
    fileFilter : (req, file, cb) =>{
        if (file.mimetype=="application/pdf") cb(null, true)
        else {
            cb(null, false)
            return cb(new Error("Only pdf format is allowed!"))
        }
    }
});


router.use(function (req, res, next) {
    //authentication
    if (!req.session.user){ 
        res.send(401);
        res.render("error",{
            title: "Error - Unauthorized!",
            errormsg: "Your request had been reject becuase you had not logged in!"
        })
        return
    }
    next();
});


router.route("/upload/:id/:jobId").post(upload.single("resume"), async (req, res) => {
    try {
        await users.getUserById(validation.checkId(req.session.user.id))
    } catch (e) {
        req.session.destroy()
        res.status(400)
        res.redirect("/index")
    }
    
    //console.log(1)
    try{
        //route side validation   
        var userId = validation.checkId(req.session.user.id);
        var jobId = validation.checkId(req.params.jobId);
    }catch(e){
        res.sendStatus(400);
        return;
    }
    //console.log(2)
    try {
        await users.applyForJob(userId, jobId, req.file.path);
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

router.route("/download/:jobId/:id").get(async (req, res) => {
    try{
        var filePath = await users.getResumeById(req.params.jobId,req.params.id)
        console.log(filePath)
    }catch(e){
        console.log(e)
        res.status(500)
        res.redirect(`/job/${req.params.jobId}`)
    }
    res.download(filePath, function (err) {
        //send Intenal Server Error if file not exist
        if (err){ 
            console.log(err)
            res.status(500)
            res.redirect(`/job/${req.params.jobId}`)
        }
    })
    return;
})
.all(async(req,res)=>{
	//other method should not Allowed
	res.status(405)
	res.sendFile(path.resolve("static/inValidRequest.html"));
});


module.exports = router;
