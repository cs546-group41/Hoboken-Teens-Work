const mongoCollections = require("../config/mongoCollection");
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const usersData = require("./users");

// Return all jobs in the database
const getAllJobs = async () => {
	const jobsCollection = await jobs();
	const jobsList = await jobsCollection.find({}).toArray();

	if (!jobsList) throw "Could not get all jobs";

	return jobsList;
};

// Return individual job by its ID
const getJobById = async (jobId) => {
	jobId = validation.checkId(jobId);
};

// Search keywords for job titles or description in the entire database
const searchJobs = async (jobSearchQuery) => {};

// Create a new job posting
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
		comments: [],
	};

	const jobsCollection = await jobs();
	const insertJob = await jobsCollection.insertOne(newJob);
	if (!insertJob.acknowledged || !insertJob.insertedId) throw "Could not add job";
	const insertedJob = getJobById(insertJob.insertedId.toString());

	return insertedJob;
};

// Remove a job from the database
const removeJob = async (jobId) => {
	jobId = validation.checkId(jobId);

	const jobsCollection = await jobs();
	const job = await jobsCollection.findOne({ _id: ObjectId(id) });
	if (!job) throw "No job with that ID";

	const theJob = await getJobById(id);
	const jobName = theJob.title;

	const deleteJob = await jobsCollection.deleteOne({ _id: ObjectId(id) });

	if (deleteJob.deletedCount === 0) throw "Job could not be removed";

	return `The Job: "${jobName}" has been successfully removed`;
};

// Edit a job in the database
const editJob = async (jobId, authorId, jobTitle, jobDescription, jobStreetName, jobStatus, phoneNumber) => {
	jobId = validation.checkId(jobId);
	jobTitle = validation.checkJobTitle(jobTitle);
	jobDescription = validation.checkJobDescription(jobDescription);
	jobStreetName = validation.checkJobStreetName(jobStreetName);
	jobStatus = validation.checkJobStatus(jobStatus);
	authorId = validation.checkId(authorId);

	if (phoneNumber) {
		phoneNumber = validation.checkPhone(phoneNumber);
	} else {
		phoneNumber = null;
	}

	const author = usersData.getUserById(authorId);
	let jobToEdit = null;
	if (author.age >= 18 && author.jobsPosted) {
		for (job of author.jobsPosted) {
			if (job === jobId) {
				jobToEdit = getJobById(jobId);
			}
		}
	}
	if (jobToEdit === null) throw "No job found with that ID";

	let editFlag = 0;

	if (jobTitle !== jobToEdit.jobTitle) editFlag++;
	if (jobDescription !== jobToEdit.jobDescription) editFlag++;
	if (jobStreetName !== jobToEdit.jobStreetName) editFlag++;
	if (jobStatus !== jobToEdit.jobStreetName) editFlag++;
	if (phoneNumber !== jobToEdit.phone) editFlag++;

	if (editFlag < 1) throw "No changes were made";

	jobToEdit = {
		jobTitle: jobTitle,
		jobDescription: jobDescription,
		jobStreetName: jobStreetName,
		jobAuthor: jobAuthor,
		phone: jobAuthorPhoneNumber,
	};
	const jobsCollection = await jobs();
	const editedJob = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $set: jobToEdit });
	if (!editedJob.matchedCount && !editedJob.modifiedCount) throw "Job could not be edited";

	return await getUserById(id);
};

module.exports = {
	getAllJobs,
	getJobById,
	searchJobs,
	createJob,
	removeJob,
	editJob,
};
