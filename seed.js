const users = require("./data/users");
const connection = require("./config/mongoConnection");

let firstUser = undefined;

async function main() {
  const db = await connection.dbConnection();

  await db.dropDatabase();
  try {
    firstUser = await users.createUser(
      "Anh",
      "Le",
      "random@stevens.edu",
      14,
      "9178950083",
      "Random2@#"
    );
    // console.log(firstUser);
  } catch (err) {
    console.log(err);
  }
  try {
    const result = await users.getUserById(firstUser._id);
    // console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const update = await users.editUser(
      firstUser._id,
      "Bob",
      "David",
      "random@stevens.edu",
      100,
      "9178950083"
    );
    console.log(update);
  } catch (e) {
    console.log(e);
  }

  await connection.closeConnection();
}

main();