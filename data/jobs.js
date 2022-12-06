const mongoCollections = require("../config/mongoCollection");
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const usersData = require("./users");
const users = mongoCollections.users

const getAllJobs = async () => {
	const jobsCollection = await jobs();
	const jobsList = await jobsCollection.find({}).toArray();

	if (!jobsList) throw "Could not get all jobs";

	return jobsList;
};

const getJobById = async (jobId) => {
	const jobsCollection = await jobs();
	const job = await jobsCollection.findOne({ _id: ObjectId(jobId) });
  	if (!job) throw "Job not found";
  	return job;	
};

const searchJobs = async (jobSearchQuery) => {
    const jobList = await jobs()
    const searchJobs = await jobList.find({jobTitle: {$regex: jobSearchQuery, $options:"i"}}).toArray()
    return searchJobs
};


const createJob = async (jobTitle, jobDescription, jobStreetName, authorId) => {
	jobTitle = validation.checkJobTitle(jobTitle);
	jobDescription = validation.checkJobDescription(jobDescription);
	jobStreetName = validation.checkJobStreetName(jobStreetName);
	authorId = validation.checkId(authorId);
	var user = null;
	try{
		user = await usersData.getUserById(authorId);
	}catch(e){
		throw e
	}
	const newJob = {
		jobTitle: jobTitle,
		jobDescription: jobDescription,
		jobStreetName: jobStreetName,
		jobAuthor: {
			id:authorId,
			name:`${user.firstName} ${user.lastName}`,
			phone: user.phone
		},
		jobStatus: "open",
		applicants: [],
		hired: {},
		comments: []
	};

	const jobsCollection = await jobs();
	const insertJob = await jobsCollection.insertOne(newJob);
	if (!insertJob.acknowledged || !insertJob.insertedId) throw "Could not add job";
	const userCollection = await users();
	const newJobShortInfo = {
		id:insertJob.insertedId.toString(),
		jobTitle: jobTitle
	}
	const userUpdate = await userCollection.updateOne({_id: ObjectId(authorId)},{$push:{jobsPosted: newJobShortInfo}})
  	if (userUpdate.modifiedCount === 0) throw "Update user info failed!"


};

const removeJob = async (jobId) => {};

const editJob = async (jobId, jobTitle, jobDescription, jobStreetName, UserId) => {};

const getAllResume = async (authorId, jobId) => {};

const hireForJob = async (authorId, jobId, hiredUserId) => {};

const fireFromJob = async (authorId, jobId, firedUserId) => {};

module.exports = {
	getAllJobs,
	getJobById,
	searchJobs,
	createJob,
	removeJob,
	editJob,
	getAllResume,
	hireForJob,
	fireFromJob,
};
