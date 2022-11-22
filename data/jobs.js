const { jobs } = require("../config/mongoCollections");

module.exports = {
	getAllJobs: async () => {
		const jobsCollection = await jobs();
		const jobsList = await jobsCollection.find({}).toArray();

		if (!jobsList) throw new Error("Could not get all jobs");

		return jobsList;
	},

	getJobById: async(jobId) => {},

	searchJobs: async (jobSearchQuery) => {},

	createJob: async (jobTitle, jobDescription, jobStreetName, jobAuthor) => {
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
	},

	removeJob: async (jobId) => {},

	editJob: async (jobId, jobTitle, jobDescription, jobStreetName, jobAuthor) => {},

	getAllResume: async (authorId, jobId) => {},

	hireForJob: async (authorId, jobId, hiredUserId) => {},

	fireFromJob: async (authorId, jobId, firedUserId) => {},
};
