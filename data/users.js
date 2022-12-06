const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;
const validation = require("../validation");
const { ObjectId } = require("mongodb");

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
  /*
  let myUser = {};
  if (age >= 18) {
    myUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      phone: phone,
      hashedPassword: hashedPassword,
      jobsPosted: [],
      jobsHired: [],
    };
  } else {
    myUser = {
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
  }*/
  const insertInfo = await userCollection.insertOne(myUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add movie";
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
  const user = getUserById(id);
  let userEditInfo = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    age: age,
    phoneNumber: phoneNumber,
  };
  const userCollection = await users();
  const editStatus = await userCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: userEditInfo }
  );
  if (!editStatus.matchedCount && !editStatus.modifiedCount)
    throw "Edit failed";

  return await getUserById(id);
};

const loginCheck = async (email, pwd) =>{
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw "The user does not exist!";
  if (!validation.validatePwd(pwd, user.hashedPassword)) throw "The conbination of email and password does not exist!"
  return user
}

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

module.exports = { createUser, getUserById, editUser, loginCheck, jobPosterCheck };
