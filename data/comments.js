const mongoCollections = require("../config/mongoCollection");
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const jobsData = require("./jobs");
const userData = require("./users")

const createComment = async (jobId, commentorId, fullname, comment) => {
    if (!jobId) throw "Must provide a Job ID";
    if (!commentorId) throw "Must provide user ID of commentor";
    if (!comment) throw "Must provide a comment";
    const jobsCollection = await jobs()
    await jobsData.getJobById(jobId)
    await userData.getUserById(commentorId)
    const newComment = {
        authorId: commentorId,
        name: fullname,
        comment: comment,
        commentDate: new Date().toUTCString()
    }
    const jobUpdate = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $push: { comments: newComment } })
    if (jobUpdate.modifiedCount === 0) throw "Add Comment failed!"
    return newComment
};

const deleteComment = async (jobId, commentorId, commentId) => {
    if (!jobId) throw "Must provide a Job ID";
    if (!commentorId) throw "Must provide user ID of commentor";
    if (!commentId) throw "Must provide ID of comment to be deleted";
    const jobsCollection = await jobs()
    await jobsData.getJobById(jobId)
    await userData.getUserById(commentorId)
    const jobUpdate = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $pull: { comments: {authorId:commentorId} } })
    if (jobUpdate.modifiedCount === 0) throw "Delete Comment failed!"
};

module.exports = {
    createComment,
    deleteComment
};