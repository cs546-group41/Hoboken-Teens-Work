const users = require("./data/users");
const connection = require("./config/mongoConnection");
const jobs = require("./data/jobs")

let firstUser = undefined;

async function main() {
  const db = await connection.dbConnection();

  await db.dropDatabase();
  try {
    firstUser = await users.createUser(
      "Anh",
      "Le",
      "random@stevens.edu",
      21,
      "Random2@#",
      "9178950083"
    );
    // console.log(firstUser);
  } catch (err) {
    console.log(err);
  }
  try {
    const result = await users.getUserById(firstUser._id);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await users.getAllJobsByUser(firstUser._id);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  // try {
  //   const update = await users.editUser(
  //     firstUser._id,
  //     "Bob",
  //     "David",
  //     "random@stevens.edu",
  //     100,
  //     "9178950083"
  //   );
  //   console.log(update);
  // } catch (e) {
  //   console.log(e);
  // }

  try {
    const searchJob = await jobs.searchJobs("Por")
    console.log(searchJob)
  } catch (e) {
    console.log(e)
  }





  await connection.closeConnection();
}

main();
