const mongoCollections = require("../config/mongoCollection");
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const jobsData = require("./jobs");
const userData = require("./users");


// Create a new comment
const createComment = async (jobId, authorId, fullname, comment) => {
    jobId = validation.checkId(jobId);
    authorId = validation.checkId(authorId);
    if (!comment) throw "Must provide a comment";
    const jobsCollection = await jobs();
    await jobsData.getJobById(jobId);
    await userData.getUserById(authorId);
    const newComment = {
        authorId: authorId,
        name: fullname,
        comment: comment,
        commentDate: new Date().toLocaleString("en-US")
    }
    const jobUpdate = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $push: { comments: newComment } });
    if (jobUpdate.modifiedCount === 0) throw "Add Comment failed!";
    return newComment
};


// Delete an existing comment
const deleteComment = async (jobId, authorId, commentId) => {
    jobId = validation.checkId(jobId);
    authorId = validation.checkId(authorId);
    commentId = validation.checkId(commentId);
    const jobsCollection = await jobs();
    await jobsData.getJobById(jobId);
    await userData.getUserById(authorId);
    const jobUpdate = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $pull: { comments: {authorId:authorId} } });
    if (jobUpdate.modifiedCount === 0) throw "Delete Comment failed!";
};

module.exports = {
  createComment,
  deleteComment,
};
