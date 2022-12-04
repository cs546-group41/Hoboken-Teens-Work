const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;
const bcrypt = require('bcrypt')
const validation = require("../validation");
const { ObjectId } = require("mongodb");

const createUser = async (
  firstName,
  lastName,
  email,
  age,
  hashedPassword,
  phone
) => {
  firstName = validation.checkString(firstName);
  lastName = validation.checkString(lastName);
  validation.checkFirstName(firstName);
  validation.checkLastName(lastName);
  email = validation.checkString(email);
  validation.checkEmail(email);
  age = validation.checkAge(age);
  phone = validation.checkPhone(phone);
  hashedPassword = validation.checkPassword(hashedPassword);
  const userCollection = await users();
  let myUser = {};
  if (age >= 18) {
    myUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      hashedPassword: hashedPassword,
      phone: phone,
      jobsPosted: [],
      jobsHired: [],
    };
  } else {
    myUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      hashedPassword: hashedPassword,
      phone: phone,
      jobsApplied: [],
      jobsSaved: [],
      hiredForJobs: "",
    };
  }
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

const getAllJobsByUser = async (authorId) => {
  const myUser = await getUserById(authorId);
  return myUser.jobsPosted;
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

const getAllResume = async (authorId, jobId) => {};
const hireForJob = async (authorId, jobId, applicantId) => {};
const fireFromJob = async (authorId, jobId, applicantId) => {};
const applyToJob = async (jobId, applicantId) => {};
const withdrawJobApplication = async (jobId, applicantId) => {};
module.exports = { createUser, getUserById, editUser, getAllJobsByUser, checkUser };