const users = require("./data/users");
const connection = require("./config/mongoConnection");
const jobs = require("./data/jobs");
const comments = require("./data/comments")
const { ObjectId } = require("mongodb");

let firstUser = undefined;

async function main() {
	const db = await connection.dbConnection();
	// await db.dropDatabase();

	// try{
	//   await jobs.createJob("test","this is a test job","12th St","638add4a89d01f01e5dd77bb")
	// }catch(e){
	//   console.log(e)
	// }

	try {
		firstUser = await users.createUser("abc", "bcd", "ab@ab.edu", 14, "9465312648", "QWE123!@#");
		console.log(firstUser);
	} catch (err) {
		console.log(err);
	}

	try {
    console.log("\n\nGet user by ID\n");
		const result = await users.getUserById(firstUser._id);
		console.log(result);
	} catch (e) {
		console.log(e);
	}

	try {
		newJob = await jobs.createJob("Car Wash", "Need urgent car wash", "12th St", firstUser._id);
		console.log(newJob);
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
    console.log("\n\n Search  Job:\n");
	  const searchJob = await jobs.searchJobs("Car Wash");
	  console.log(searchJob);
	} catch (e) {
	  console.log(e);
	}
	await connection.closeConnection();
}

try{
	const cj = jobs.createJob("porch cleaning", "i need someone to clean my porch", "Jefferson St", "6397b8a78447e7598af73398")

}catch(e){
	console.log(e)
}

try{
	const cj = jobs.createJob("porch cleaning", "i need someone to clean my porch", "Jefferson St", "6397b8a78447e7598af73398")

}catch(e){
	console.log(e)
}

try{
	const cj = jobs.createJob("porch cleaning", "i need someone to clean my porch", "Jefferson St", "6397b8a78447e7598af73398")

}catch(e){
	console.log(e)
}

try{
	const comment = comments.createComment("6397b8d4e42368c1ce92e2ec","6397b8a78447e7598af73398","Siddharth", "I would like to do this job")
}catch(e){
	console.log(e)
}
main();
