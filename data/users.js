const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;
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
  const user = await getUserById(id);
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

module.exports = { createUser, getUserById, editUser };
