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
  hashedPassword
) => {
  firstName = validation.checkString(firstName);
  lastName = validation.checkString(lastName);
  validation.checkFirstName(firstName);
  validation.checkLastName(lastName);
  email = validation.checkString(email);
  hashedPassword = validation.checkPassword(hashedPassword);
  const userCollection = await users();
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
  }
  const insertInfo = await userCollection.insertOne(myUser);
  console.log(insertInfo);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add movie";
  const newId = insertInfo.insertedId.toString();
  const user = await getUserById(newId);
  user._id = user._id.toString();
  return user;
};

const editUser = () => {};

const getUserById = () => {};
module.exports = { createUser };
