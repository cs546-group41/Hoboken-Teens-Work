const users = require("./data/users");
const jobs = require("./data/jobs");
const comments = require("./data/comments");
const connection = require("./config/mongoConnection");
const { ObjectId } = require("mongodb");

let firstUser = undefined;
let secondUser = undefined;
let thirdUser = undefined;
let fourthUser = undefined;
let fifthUser = undefined;
let sixthUser = undefined;
let newJob = undefined;
let newComment = undefined;

async function main() {
	const db = await connection.dbConnection();
	await db.dropDatabase();

	console.log("Create Users");

	try {
		firstUser = await users.createUser("John", "Doe", "johndoe@email.com", 23, "Htw@123", "3482749378");
		console.log(firstUser);
	} catch (err) {
		console.log(err);
	}

	try {
		secondUser = await users.createUser("Jane", "Doe", "janedoe@email.com", 30, "Test@123", "0385943712");
		console.log(secondUser);
	} catch (err) {
		console.log(err);
	}

	try {
		thirdUser = await users.createUser("Derek", "Anderson", "anderson@email.com", 16, "Asd@123", "4950327384");
		console.log(thirdUser);
	} catch (err) {
		console.log(err);
	}

	try {
		fourthUser = await users.createUser("Joel", "Carrey", "joelcarrey@gmail.com", 13, "Qwe@123", "8946783471");
		console.log(fourthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		fifthUser = await users.createUser("Gale", "Hyatt", "galehyatt@hotmail.com", 42, "Zxc@123", "9374856124");
		console.log(fifthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		sixthUser = await users.createUser("Test", "Account", "testacc@email.com", 18, "Test@123", "4756283467");
		console.log(sixthUser);
	} catch (err) {
		console.log(err);
	}

	// try {
	// 	console.log("\n\nGet user by ID\n");
	// 	const result1 = await users.getUserById(firstUser._id);
	// 	const result2 = await users.getUserById(secondUser._id);
	// 	const result3 = await users.getUserById(thirdUser._id);
	// 	const result4 = await users.getUserById(fourthUser._id);
	// 	const result5 = await users.getUserById(fifthUser._id);
	// 	const result6 = await users.getUserById(sixthUser._id);

	// 	console.log(result1);
	// 	console.log(result2);
	// 	console.log(result3);
	// 	console.log(result4);
	// 	console.log(result5);
	// 	console.log(result6);
	// } catch (e) {
	// 	console.log(e);
	// }

	// try {
	// 	newJob = await jobs.createJob("Car Wash", "Need urgent car wash for my Toyota Highlander Hybrid. I will provide all cleaning supplies required for the task.", "12th St", firstUser._id);
	// 	console.log("The new job:");
	// 	console.log(newJob);
	// 	console.log(await users.getUserById(firstUser._id));
	// } catch (e) {
	// 	console.log(e);
	// }

	// try {
	// 	console.log("All jobs by user");
	// 	const result = await users.getAllPostJobsById(firstUser._id);
	// 	console.log(result);
	// } catch (e) {
	// 	console.log(e);
	// }

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

	// try {
	// 	console.log("\n\n Search  Job:\n");
	// 	const searchJob = await jobs.searchJobs("Car Wash");
	// 	console.log(searchJob);
	// } catch (e) {
	// 	console.log(e);
	// }

	// try {
	// 	console.log("Create new comment");
	// 	newComment = await comments.createComment(newJob._id, firstUser._id, `${firstUser.firstName} ${firstUser.lastName}`, "The pay for this job is fixed at $20");
	// 	console.log(newComment);
	// } catch (e) {
	// 	console.log(e);
	// }

	await connection.closeConnection();
}

// try {
// 	const cj = jobs.createJob("porch cleaning", "i need someone to clean my porch", "Jefferson St", "6397b8a78447e7598af73398");
// } catch (e) {
// 	console.log(e);
// }

// try {
// 	const cj = jobs.createJob("porch cleaning", "i need someone to clean my porch", "Jefferson St", "6397b8a78447e7598af73398");
// } catch (e) {
// 	console.log(e);
// }

// try {
// 	const cj = jobs.createJob("porch cleaning", "i need someone to clean my porch", "Jefferson St", "6397b8a78447e7598af73398");
// } catch (e) {
// 	console.log(e);
// }

// try {
// 	const comment = comments.createComment("6397b8d4e42368c1ce92e2ec", "6397b8a78447e7598af73398", "Siddharth", "I would like to do this job");
// } catch (e) {
// 	console.log(e);
// }

main();
