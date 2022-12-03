const mongoCollections = require("../config/mongoCollection");
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const usersData = require("./users");

const getAllJobs = async () => {
	const jobsCollection = await jobs();
	const jobsList = await jobsCollection.find({}).toArray();

	if (!jobsList) throw "Could not get all jobs";

	return jobsList;
};

const getJobById = async (jobId) => {};

const searchJobs = async (jobSearchQuery) => {
	const jobSearchQuery1 = validation.checkSearchQuery(jobSearchQuery)
 	const jobSearchQueryLowerCase = jobSearchQuery1.toLowerCase()
    const jobList = await jobs()
    const searchJob1 = await jobList.find({jobTitle: {$regex: jobSearchQueryLowerCase}}).toArray()
	if(searchJob1.length === 0) return "No job was found for the entered text"
    return searchJob1
};


const createJob = async (jobTitle, jobDescription, jobStreetName, authorId) => {
	jobTitle = validation.checkJobTitle(jobTitle);
	jobDescription = validation.checkJobDescription(jobDescription);
	jobStreetName = validation.checkJobStreetName(jobStreetName);
	authorId = validation.checkId(authorId);
	const jobAuthorPhoneNumber = null;

	const user = await usersData.getUserById(authorId);
	if (user.phone) {
		jobAuthorPhoneNumber = user.phone;
	}

	const newJob = {
		jobTitle: jobTitle,
		jobDescription: jobDescription,
		jobStreetName: jobStreetName,
		jobAuthor: jobAuthor,
		phone: jobAuthorPhoneNumber,
		jobStatus: "open",
		applicants: [],
		hired: {},
		comments: []
	};

	const jobsCollection = await jobs();
	const insertJob = await jobsCollection.insertOne(newJob);
	if (!insertJob.acknowledged || !insertJob.insertedId) throw "Could not add job";
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
