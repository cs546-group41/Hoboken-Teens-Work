const mongoCollections = require("../config/mongoCollection");
const jobs = mongoCollections.jobs;
const users = mongoCollections.users;
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


const getJobById = async (jobId) => {
  jobId = validation.checkId(jobId);
  const jobsCollection = await jobs();
  const findJob = await jobsCollection.findOne({ _id: ObjectId(jobId) });
  if (!findJob) throw "Job not found";
  return findJob
};

// Search keywords for job titles or description in the entire database
const searchJobs = async (jobSearchQuery) => {

  jobSearchQuery = validation.checkSearchQuery(jobSearchQuery)
  const jobList = await jobs()
  const searchJobs = await jobList.find({ jobTitle: { $regex: jobSearchQuery, $options: "i" } }).toArray()
  if (searchJobs.length === 0) throw "No job was found for the entered text"
  return searchJobs

};

// Create a new job posting
const createJob = async (jobTitle, jobDescription, jobStreetName, authorId) => {
  jobTitle = validation.checkJobTitle(jobTitle);
  jobDescription = validation.checkJobDescription(jobDescription);
  jobStreetName = validation.checkJobStreetName(jobStreetName);
  authorId = validation.checkId(authorId);
  let jobAuthorPhoneNumber = null;

  const usersCollection = await users();
  const user = await usersCollection.findOne({_id: ObjectId(authorId)});
  if (user.phone) {
    jobAuthorPhoneNumber = user.phone;
  }
  const newJob = {
    jobTitle: jobTitle,
    jobDescription: jobDescription,
    jobStreetName: jobStreetName,
    jobAuthor: {
      id: authorId,
      name: `${user.firstName} ${user.lastName}`,
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
    id: insertJob.insertedId.toString(),
    jobTitle: jobTitle
  }
  const userUpdate = await userCollection.updateOne({ _id: ObjectId(authorId) }, { $push: { jobsPosted: newJobShortInfo } })
  if (userUpdate.modifiedCount === 0) throw "Update user info failed!"
  return insertJob;

};

// Remove a job from the database
const removeJob = async (jobId) => {
  jobId = validation.checkId(jobId);

  const jobsCollection = await jobs();
  const job = await jobsCollection.findOne({ _id: ObjectId(jobId) });
  if (!job) throw "No job with that ID";

  const theJob = await getJobById(jobId);
  const jobName = theJob.title;


  const deleteJob = await jobsCollection.deleteOne({ _id: ObjectId(jobId) });

  if (deleteJob.deletedCount === 0) throw "Job could not be removed";

  const userCollection = await users();
  const userUpdate = await userCollection.updateOne({ _id: ObjectId(theJob.jobAuthor.id) }, { $pull: { jobsPosted: {id:jobId} } })
  if (userUpdate.modifiedCount === 0) throw "Update user info failed!"
  return `The Job: "${jobName}" has been successfully removed`;

};

// Edit a job in the database
const editJob = async (
  jobId,
  authorId,
  jobTitle,
  jobDescription,
  jobStreetName,
  //jobStatus,
  phoneNumber
) => {
  jobId = validation.checkId(jobId);
  jobTitle = validation.checkJobTitle(jobTitle);
  jobDescription = validation.checkJobDescription(jobDescription);
  jobStreetName = validation.checkJobStreetName(jobStreetName);
  //jobStatus = validation.checkJobStatus(jobStatus);
  authorId = validation.checkId(authorId);

  if (phoneNumber) {
    phoneNumber = validation.checkPhone(phoneNumber);
  } else {
    phoneNumber = null;
  }

  const usersCollection = await users();
  const author = await usersCollection.findOne({_id: ObjectId(authorId)});
  let jobToEdit = null;
  if (author.age >= 18 && author.jobsPosted) {
    for (job of author.jobsPosted) {
      if (job.id === jobId) {
        jobToEdit = getJobById(jobId);
      }
    }
  }
  if (jobToEdit === null) throw "No job found with that ID";

  let editFlag = 0;

  if (jobTitle !== jobToEdit.jobTitle) editFlag++;
  if (jobDescription !== jobToEdit.jobDescription) editFlag++;
  if (jobStreetName !== jobToEdit.jobStreetName) editFlag++;
  //if (jobStatus !== jobToEdit.jobStreetName) editFlag++;
  if (phoneNumber !== jobToEdit.phone) editFlag++;

  if (editFlag < 1) throw "No changes were made";

  jobToEdit = {
    jobTitle: jobTitle,
    jobDescription: jobDescription,
    jobStreetName: jobStreetName,
    phone: phoneNumber,
  };
  const jobsCollection = await jobs();
  const editedJob = await jobsCollection.updateOne(
    { _id: ObjectId(jobId) },
    { $set: jobToEdit }
  );
  if (!editedJob.matchedCount && !editedJob.modifiedCount)
    throw "Job could not be edited";

  return await getJobById(jobId);
};

const changeStatus = async (jobId, id)=>{
  jobId = validation.checkId(jobId);
  id = validation.checkId(id);
  const jobsCollection = await jobs();
  const jobData = await jobsCollection.findOne({ _id: ObjectId(jobId) });
  if (jobData.jobAuthor.id != id) throw "Unauthorized Operation"
  const curStatus = jobData.jobStatus
  if (curStatus==="open"){
    const statusUpdate = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $set: { jobStatus: "closed" } })
    if (statusUpdate.modifiedCount === 0) throw "Update user info failed!"
    return "open"
  }else{
    const statusUpdate = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $set: { jobStatus: "open" } })
    if (statusUpdate.modifiedCount === 0) throw "Update user info failed!"
    return "closed"
  }
}

module.exports = {
  getAllJobs,
  getJobById,
  searchJobs,
  createJob,
  removeJob,
  editJob,
  changeStatus
};
