const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const usersData = require("./users");
const jobsData = require("./jobs");

const createComment = async(jobId, commentorId, comment) => {
    if(!jobId) throw "Must provide a Job ID";
    if(!commentorId) throw "Must provide user ID of commentor";
    if(!comment) throw "Must provide a comment";
};

const deleteComment = async(jobId, commentorId, commentId) => {
    if(!jobId) throw "Must provide a Job ID";
    if(!commentorId) throw "Must provide user ID of commentor";
    if(!commentId) throw "Must provide ID of comment to be deleted";
};

module.exports = {
    createComment,
    deleteComment
};