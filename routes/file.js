const express = require("express");
const router = express.Router();
const data = require("../data");
const fs = require('fs');
const multer = require('multer');
const md5 = require('md5');
const path = require("path")
const xss = require("xss");
const saveOptions = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        //console.log(file)
        cb(null, md5(Date.now() + file.originalname) + file.originalname.substring(file.originalname.lastIndexOf(".")));
    }
});
const upload = multer({ storage: saveOptions });


router
    .route("/upload")
    .post(upload.single("resume"), async (req, res) => {
        if (!req.session.user) return res.sendStatus(401)
        const file = req.file;
        try{
            await users.applyForJob(req.session.user.id, xss(req.body.jobId), file.path)
            res.sendStatus(200)
        }catch(e){
            //console.log(e)
            res.sendStatus(400);
            return;
        }
    });

    router
    .route("/download/:filename")
    .get(async (req, res) => {
        if (!req.session.user) return res.sendStatus(401)
        try {
            const filePath = path.join(__dirname, `../uploads/${req.params.filename}`)
            res.download(filePath,function (err) {
                if (err) res.sendStatus(500) // send a 500 on error
            })
        } catch (e) {
            // console.log(e)
            res.sendStatus(400);
            return;
        }
    })


module.exports = router;
