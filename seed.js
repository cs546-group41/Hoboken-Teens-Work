const users = require("./data/users");
const connection = require("./config/mongoConnection");
const jobs = require("./data/jobs")

let firstUser = undefined;

async function main() {
  const db = await connection.dbConnection();
  try{
    await jobs.createJob("test","this is a test job","main st","638add4a89d01f01e5dd77bb")
  }catch(e){
    console.log(e)
  }
  /*
  try {
    firstUser = await users.createUser(
      "abc",
      "bcd",
      "ab@ab.edu",
      14,
      "9465312648",
      "QWE123!@#"
    );
    // console.log(firstUser);
  } catch (err) {
    console.log(err);
  }
  */
  // await db.dropDatabase();
  /*
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
  */
  /* 
  try {
    const result = await users.getUserById(firstUser._id);
    // console.log(result);
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



  */
  ///
  await connection.closeConnection();
}

main();
