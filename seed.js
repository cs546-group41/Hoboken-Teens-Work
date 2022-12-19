// Seed file to populate the database. It will drop pre-existing database if any and create:
// 5 adult users, 5 minor users.
// 2 jobs per adult user.
// 10 comments.

const users = require("./data/users");
const jobs = require("./data/jobs");
const comments = require("./data/comments");
const connection = require("./config/mongoConnection");

let firstUser = undefined;
let secondUser = undefined;
let thirdUser = undefined;
let fourthUser = undefined;
let fifthUser = undefined;
let sixthUser = undefined;
let seventhUser = undefined;
let eighthUser = undefined;
let ninthUser = undefined;
let tenthUser = undefined;

let newJob1 = undefined;
let newJob2 = undefined;
let newJob3 = undefined;
let newJob4 = undefined;
let newJob5 = undefined;
let newJob6 = undefined;
let newJob7 = undefined;
let newJob8 = undefined;
let newJob9 = undefined;
let newJob10 = undefined;

let comment1 = undefined;
let comment2 = undefined;
let comment3 = undefined;
let comment4 = undefined;
let comment5 = undefined;
let comment6 = undefined;
let comment7 = undefined;
let comment8 = undefined;
let comment9 = undefined;
let comment10 = undefined;


async function main() {
	const db = await connection.dbConnection();
	await db.dropDatabase();

	console.log("Create Users");

	try {
		firstUser = await users.createUser("John", "Doe", "johndoe@email.com", 23, "Test@123");
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
		thirdUser = await users.createUser("Derek", "Anderson", "anderson@email.com", 26, "Test@123", "4950327384");
		console.log(thirdUser);
	} catch (err) {
		console.log(err);
	}

	try {
		fourthUser = await users.createUser("Joel", "Carrey", "joelcarrey@email.com", 33, "Test@123");
		console.log(fourthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		fifthUser = await users.createUser("Gale", "Hyatt", "galehyatt@email.com", 42, "Test@123", "9374856124");
		console.log(fifthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		sixthUser = await users.createUser("Jeremy", "Varga", "jeremy@email.com", 13, "Test@123");
		console.log(sixthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		seventhUser = await users.createUser("Brock", "Kramer", "brock@email.com", 14, "Test@123", "7823461089");
		console.log(seventhUser);
	} catch (err) {
		console.log(err);
	}

	try {
		eighthUser = await users.createUser("Jill", "Hunterston", "jill@email.com", 15, "Test@123", "2638469173");
		console.log(eighthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		ninthUser = await users.createUser("Zoe", "Prentos", "zoe@email.com", 16, "Test@123", "8905789156");
		console.log(ninthUser);
	} catch (err) {
		console.log(err);
	}

	try {
		tenthUser = await users.createUser("Danny", "Geller", "danny@email.com", 17, "Test@123", "6781546037");
		console.log(tenthUser);
	} catch (err) {
		console.log(err);
	}

	// Create jobs


	try {
		newJob1 = await jobs.createJob("Car wash", "Need urgent car wash for my Toyota Highlander Hybrid. I will provide all cleaning supplies required for the task.", "12th St", firstUser._id, "Cleaning");
		console.log("The new job:");
		console.log(newJob1);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob2 = await jobs.createJob("House cleaning", "Going out for a weekend, and need my house cleaned while I'm gone. I will leave the keys with a neighbour and let them know to expect you.", "Jefferson St", firstUser._id, "Cleaning");
		console.log("The new job:");
		console.log(newJob2);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob3 = await jobs.createJob("Garage painting", "I need someone to assist me with painting my garage. I have all the supplies already. It's a 2 days job at the most. Will pay for 4 hours each day.", "Sinatra Dr", secondUser._id, "Painting");
		console.log("The new job:");
		console.log(newJob3);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob4 = await jobs.createJob("Move items", "I would require someone to assist me with moving items from my garage to my office. I have already rented a moving truck. It's a 6 hours job and would prefer to do it during a weekend.", "Clinton St", secondUser._id, "Moving");
		console.log("The new job:");
		console.log(newJob4);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob5 = await jobs.createJob("Fixing a vintage car", "I inherited a vintage car from my father, and it has been sitting there for almost 15 years. I finally have the time and resources to fix it, so looking for someone to assist me with it.", "5th St", thirdUser._id, "Repairing");
		console.log("The new job:");
		console.log(newJob5);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob6 = await jobs.createJob("Babysit my 2yr old", "I need a someone to babysit my 2yr old son. I need to go out of town on urgent business for a day and can't take my baby. SO, I want someone to look after him while I'm gone. I'll be gone for about 12 hours, from 8:00 PM to 8:00 AM the following Saturday.", "8th St", thirdUser._id, "Babysitting");
		console.log("The new job:");
		console.log(newJob6);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob7 = await jobs.createJob("Looking for a cashier", "I am looking for a part-time cashier for my departmental store. Working hours will be 4:00 PM to 8:00 PM.", "Court St", fourthUser._id, "Cashier");
		console.log("The new job:");
		console.log(newJob7);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob8 = await jobs.createJob("Maths Tutor for my 10yr old", "If you are good at maths and are confident in teaching a 5th grade student, please apply. My daughter needs help with her studies. Do mention your math grades in the resume.", "Harrison St", fourthUser._id, "Tutoring");
		console.log("The new job:");
		console.log(newJob8);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob9 = await jobs.createJob("Lifeguard for community pool", "We are looking for a lifeguard for the community pool at 7th Street. If you have swimming experience and are part of your school's swim team, do apply for this great opportunity.", "7th St", fifthUser._id, "Swimming");
		console.log("The new job:");
		console.log(newJob9);
		
	} catch (e) {
		console.log(e);
	}

	try {
		newJob10 = await jobs.createJob("Assistant to a wedding videographer", "I record wedding videos and lately my schedule has been very busy. I need an assistant to help me with recording, sorting, editing, mailing, etc. of videos. One of the perks will be free food at all weddings you assist me with.", "6th St", fifthUser._id, "Videography");
		console.log("The new job:");
		console.log(newJob10);
		
	} catch (e) {
		console.log(e);
	}

	try {
		comment1 = await comments.createComment(newJob1.insertedId.toString(), sixthUser._id, `${sixthUser.firstName} ${sixthUser.lastName}`, "Hi, may I ask how much you're paying for this job?");
		console.log(comment1);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment2 = await comments.createComment(newJob2.insertedId.toString(), sixthUser._id, `${sixthUser.firstName} ${sixthUser.lastName}`, "I just uploaded my resume! Hope it's good enough for this job.");
		console.log(comment2);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment3 = await comments.createComment(newJob3.insertedId.toString(), seventhUser._id, `${seventhUser.firstName} ${seventhUser.lastName}`, "Hi, may I ask how much you're paying for this job?");
		console.log(comment3);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment4 = await comments.createComment(newJob4.insertedId.toString(), seventhUser._id, `${seventhUser.firstName} ${seventhUser.lastName}`, "I just uploaded my resume! Hope it's good enough for this job.");
		console.log(comment4);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment5 = await comments.createComment(newJob5.insertedId.toString(), eighthUser._id, `${eighthUser.firstName} ${eighthUser.lastName}`, "I just uploaded my resume! Hope it's good enough for this job.");
		console.log(comment5);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment6 = await comments.createComment(newJob6.insertedId.toString(), eighthUser._id, `${eighthUser.firstName} ${eighthUser.lastName}`, "Hi, may I ask how much you're paying for this job?");
		console.log(comment6);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment7 = await comments.createComment(newJob7.insertedId.toString(), ninthUser._id, `${ninthUser.firstName} ${ninthUser.lastName}`, "I just uploaded my resume! Hope it's good enough for this job.");
		console.log(comment7);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment8 = await comments.createComment(newJob8.insertedId.toString(), ninthUser._id, `${ninthUser.firstName} ${ninthUser.lastName}`, "Hi, may I ask how much you're paying for this job?");
		console.log(comment8);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment9 = await comments.createComment(newJob9.insertedId.toString(), tenthUser._id, `${tenthUser.firstName} ${tenthUser.lastName}`, "I just uploaded my resume! Hope it's good enough for this job.");
		console.log(comment9);
	} catch (e) {
		console.log(e);
	}
	
	try {
		comment10 = await comments.createComment(newJob10.insertedId.toString(), tenthUser._id, `${tenthUser.firstName} ${tenthUser.lastName}`, "I just uploaded my resume! Hope it's good enough for this job.");
		console.log(comment10);
	} catch (e) {
		console.log(e);
	}
	
	await connection.closeConnection();
}

main();