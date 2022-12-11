const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const usersData = require("./users");
const jobsData = require("./jobs");
 
const createComment = async (jobId, commentorId, comment) => {
  if (!jobId) throw "Must provide a Job ID";
  if (!commentorId) throw "Must provide user ID of commentor";
  if (!comment) throw "Must provide a comment";
  jobId = validation.checkId(jobId);
  commentorId = validation.checkId(commentorId);
  comment = validation.checkString(comment);
  const myJob = await jobsData.getJobById(jobId);
  const myCommentor = await usersData.getUserById(commentorId)
  const newComment = {_id: ObjectId(), authorId: commentorId, name: myCommentor.firstName + myCommentor.lastName, comment: comment, commentDate: new Date().toLocaleString() };
  myJob.comments.push(newComment);
  return myJob;

const deleteComment = async (jobId, commentorId, commentId) => {
  if (!jobId) throw "Must provide a Job ID";
  if (!commentorId) throw "Must provide user ID of commentor";
  if (!commentId) throw "Must provide ID of comment to be deleted";
  jobId = validation.checkId(jobId);
  commentorId = validation.checkId(commentorId);
  comment = validation.checkString(comment);
  let myJob = await jobsData.getJobById(jobId);
 
    myJob = myJob.comments.filter(comment => {
        comment._id !== commentId;
    })
  return myJob;
};

module.exports = {
  createComment,
  deleteComment,
};
