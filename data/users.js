const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;
const jobs = mongoCollections.jobs;
const validation = require("../validation");
const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');
const saltRounds = 12;
const jobsData = require("./jobs");

const createUser = async (
  firstName,
  lastName,
  email,
  age,
  phone,
  password
) => {
  firstName = validation.checkString(firstName);
  lastName = validation.checkString(lastName);
  validation.checkFirstName(firstName);
  validation.checkLastName(lastName);
  email = validation.checkString(email);
  validation.checkEmail(email);
  age = validation.checkAge(age);
  phone = validation.checkPhone(phone);
  password = validation.checkPassword(password);
  const hashedPassword = validation.encryptPwd(password)
  const userCollection = await users();
  const myUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    age: age,
    phone: phone,
    hashedPassword: hashedPassword,
    jobsPosted: [],
    jobsHired: [],
    jobsApplied: [],
    jobsSaved: [],
    hiredForJobs: "",
  };
  const insertInfo = await userCollection.insertOne(myUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add user";
  const newId = insertInfo.insertedId.toString();
  const user = await getUserById(newId);
  user._id = user._id.toString();
  return user;
};


const getUserById = async (id) => {
	id = validation.checkId(id);
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: ObjectId(id) });
	if (!user) throw "User not found";
	return user;
};


const editUser = async (id, firstName, lastName, email, age, phoneNumber) => {
	firstName = validation.checkString(firstName);
	lastName = validation.checkString(lastName);
	validation.checkFirstName(firstName);
	validation.checkLastName(lastName);
	email = validation.checkString(email);
	validation.checkEmail(email);
	age = validation.checkAge(age);
	phoneNumber = validation.checkPhone(phoneNumber);
	id = validation.checkId(id);

	const user = await getUserById(id);
	let editFlag = 0;
	if (firstName !== user.firstName) editFlag++;
	if (lastName !== user.lastName) editFlag++;
	if (email !== user.email) editFlag++;
	if (age !== user.age) editFlag++;
	if (phoneNumber !== user.phone) editFlag++;
	if (editFlag < 1) throw "No changes were made";

	let userEditInfo = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		age: age,
		phone: phoneNumber,
	};
	const userCollection = await users();
	const editStatus = await userCollection.updateOne({ _id: ObjectId(id) }, { $set: userEditInfo });
	if (!editStatus.matchedCount && !editStatus.modifiedCount) throw "Edit failed";

	return await getUserById(id);
};

const getAllJobsByUser = async (authorId) => {
  authorId = validation.checkId(authorId);
  const myUser = await getUserById(authorId);
  return myUser.jobsPosted;
};

const getAllApplicants = async (jobId) => {
	jobId = validation.checkId(jobId);
	const myJob = await jobsData.getJobById(jobId);
	return myJob.applicants;
};

const getResumeById = async (jobId, applicantId) => {
	applicantId = validation.checkId(applicantId);
	jobId = validation.checkId(jobId);
	const myJob = await jobsData.getJobById(jobId);
	const applicants = myJob.applicants;

	for (const applicant of applicants) {
		if (applicant.applicantId === applicantId) return applicant.resume;
	}
	return "Cannot find resume";
};

const hireForJob = async (authorId, jobId, applicantId) => {
	jobId = validation.checkId(jobId);
	applicantId = validation.checkId(applicantId);
	authorId = validation.checkId(authorId);
	const myJob = await jobsData.getJobById(jobId);
	const myApplicant = await getUserById(applicantID);
	myJob.hired = {
		id: applicantID,
		name: myApplicant.firstName + myApplicant.lastName,
	};
};

const fireFromJob = async (authorId, jobId, applicantId) => {
	jobId = validation.checkId(jobId);
	applicantId = validation.checkId(applicantId);
	authorId = validation.checkId(authorId);
	const myJob = await jobsData.getJobById(jobId);
	myJob.hired = {};
};

const applyToJob = async (jobId, applicantId) => {
	jobId = validation.checkId(jobId);
	applicantId = validation.checkId(applicantId);
	const myApplicant = getUserById(applicantId);
	const userCollection = await users();
	const addToJobsApplied = await userCollection.updateOne({ _id: ObjectId(applicantId) }, { $push: { jobsApplied: jobId } });
	if (!addToJobsApplied.matchedCount && !addToJobsApplied.modifiedCount) throw "Could not apply to job";
	const applicantObject = {
		applicantId: applicantId,
		name: `${myApplicant.firstName} ${myApplicant.lastName}`,
		resume: `../resources/jobs/${jobId}/resume/${applicantId}.pdf`,
	};
	const jobsCollection = await jobs();
	const addToAllApplicants = await jobsCollection.updateOne({ _id: ObjectId(jobId) }, { $push: { applicannts: applicantObject } });
	if (!addToAllApplicants.matchedCount && !addToAllApplicants.modifiedCount) throw "Could not apply to job";

	return true;
};

const withdrawJobApplication = async (jobId, applicantId) => {
	jobId = validation.checkId(jobId);
	applicantId = validation.checkId(applicantId);
	const myApplicant = getUserById(applicantId);
	for (const job of myApplicant.jobsApplied) {
		if (job === jobId) myApplicant.jobsApplied.splice(myApplicant.jobsApplied.indexOf(jobId), 1);
	}
};
const checkUser = async (email, password) => {
  
  const userCollection = await users()
  const validatedEmail = validation.checkString(email)
  const validatedPassword = validation.checkPassword(password)
  let userFound = await userCollection.findOne({email: validatedEmail})
  if(userFound === null) throw "Either the email or passwaord is invalid"
  let userPassword = userFound.hashedPassword
  let comparePassword = false
  comparePassword = await bcrypt.compare(validatedPassword, userPassword)
  if(comparePassword){
    return {AuthenticatedUser: true}
  }else throw "Either the email or password is invalid"
}

const loginCheck = async (email, pwd) =>{
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw "The user does not exist!";
  if (!validation.validatePwd(pwd, user.hashedPassword)) throw "The conbination of email and password does not exist!"
  return user
}

/*************Post Job functions********** */

const getAllPostJobsById = async (id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found";
  var IDs = []
  for (let i=0;i<user.jobsPosted.length;i++){
    IDs.push(user.jobsPosted[i].id)
  }
  return IDs
}

const jobPosterCheck = async (jobId, id) => {
  id = validation.checkId(id);
  jobId = validation.checkId(jobId)
  const IDS = await getAllPostJobsById(id)
  if (IDS.indexOf(jobId)>-1) return true
  return false
}

//*************Save job functions */

const getAllSavedJob = async(id) => {
  id = validation.checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id)});
  return user.jobsSaved
}

const saveJob = async(jobId, id) =>{
  id = validation.checkId(id);
  jobId = validation.checkId(jobId)
  const jobData = await jobsData.getJobById(jobId)
  const jobShort = {
    id: jobData._id.toString(),
    title: jobData.jobTitle
  }
  const userCollection = await users();
	const saveJob = await userCollection.updateOne({ _id: ObjectId(id) }, { $push: { jobsSaved: jobShort } });
  if (!saveJob.matchedCount && !saveJob.modifiedCount) throw "Save job failed!";
  return jobShort
}

const unSaveJob = async(jobId, id) =>{
  id = validation.checkId(id);
  jobId = validation.checkId(jobId)
  const userCollection = await users();
	const unSaveJob = await userCollection.updateOne({ _id: ObjectId(id) }, { $pull: { jobsSaved: {id: jobId} } });
  if (!unSaveJob.matchedCount && !unSaveJob.modifiedCount) throw "UnSave job failed!";
}

const isJobSaved = async(jobId, id) =>{
  id = validation.checkId(id);
  jobId = validation.checkId(jobId);
  const jobList = await getAllSavedJob(id)
  if (!jobList || jobList.length===0) return false
  if (jobList.find(item => item.id === jobId)) return true
  return false
}

/**********apply job function************* */
const getAllAppliedJobs = async(id)=>{
  id = validation.checkId(id);
  const user = await getUserById(id)
  return user.jobsApplied
}

module.exports = {
  createUser,
  getUserById,
  editUser,
  getAllJobsByUser,
  getAllApplicants,
  getResumeById,
  hireForJob,
  fireFromJob,
  applyToJob,
  withdrawJobApplication,
  checkUser,
  loginCheck,
  jobPosterCheck,
  getAllSavedJob,
  saveJob,
  unSaveJob,
  isJobSaved,
  getAllAppliedJobs,
};
