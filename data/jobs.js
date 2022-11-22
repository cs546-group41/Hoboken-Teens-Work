const mongoCollections = require("../config/mongoCollections");
const jobs = mongoCollections.jobs;

const getAllJobs = async() => {

}

const searchJobs = async(jobSearchQuery) => {

}

const createJob = async (jobTitle, jobDescription, jobStreetName, jobAuthor) => {

	
	const newJob = {
		jobTitle: jobTitle,
		jobDescription: jobDescription,
		jobStreetName: jobStreetName,
		jobAuthor: jobAuthor,
		jobStatus: "open",
		applicants: [],
		hired: {},
		comments: [],
	};
};

const removeJob = async (jobId) => {};

const editJob = async (jobId, jobTitle, jobDescription, jobStreetName, jobAuthor) => {};

module.exports = {
	createJob,
	removeJob,
    editJob
};
