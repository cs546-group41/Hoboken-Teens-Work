const users = require("./data/users");
const connection = require("./config/mongoConnection");

let firstUser = undefined;

async function main() {
  const db = await connection.dbConnection();
  console.log(db);
  await db.dropDatabase();
  try {
    firstUser = await users.createUser(
      "Anh",
      "Le",
      "random@stevens.edu",
      12,
      "9178959283",
      "Random1@#"
    );
    console.log(firstUser);
  } catch (err) {
    console.log(err);
  }

  await connection.closeConnection();
}

main();
