const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

function checkId(id) {
	if (!id) throw `You must provide an ID `;
	if (typeof id !== "string") throw `ID must be a string`;
	id = id.trim();
	if (id.length === 0) throw `ID cannot be an empty string or just spaces`;
	if (!ObjectId.isValid(id)) throw `invalid object ID`;
	return id;
}

function checkString(strVal) {
	if (!strVal) throw "You must supply a string!";
	if (typeof strVal !== "string") throw "Input  must be a string!";
	strVal = strVal.trim();
	if (strVal.length === 0) throw "Input cannot be an empty string or string with just spaces";
	if (!isNaN(strVal)) throw "input is not a valid value for as it only contains digits";
	return strVal;
}

function checkFirstName(input) {
	input = checkString(input);
	if (input.length < 2) throw "First name must be atleast 2 characters";
	const regex = /[^A-z\s'"]/g;
	if (regex.test(input) || input.includes("_")) throw "First name must not contain special characters";
	let count = 0;
	for (char of input) if (char === "'") count++;
	if (count > 1) throw "First name cannot have more than one apostrophe";
	return input;
}

function checkLastName(input) {
	input = checkString(input);
	if (input.length < 2) throw "Last name must be atleast 2 characters";
	const regex = /[^A-z\s'\-"]/g;
	if (regex.test(input) || input.includes("_")) throw "Last name must not contain special characters";
	let countApostrophe = 0;
	for (char of input) if (char === "'") countApostrophe++;
	if (countApostrophe > 1) throw "Last name cannot have more than one apostrophe";
	let countHyphen = 0;
	for (char of input) if (char === "-") countHyphen++;
	if (countHyphen > 1) throw "Last name cannot have more than one countHyphen";
	return input;
}

function checkEmail(email) {
	email = checkString(email);
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		email = email.trim();
		return email;
	} else {
		throw "Invalid email format";
	}
}

function checkAge(age) {
	if (!age) throw "You must provide an age";

	const regex = /[^0-9]/;
	if (regex.test(age)) throw "Age must be an integer number";
	age = parseInt(age);
	if (age > 118 || age < 13) throw "Age must be <= 118 and >= 13";
	return age;
}

function checkPhone(phone) {
	if (!phone) return "N/A";
	const regex = /[^0-9]/;
	phone = phone.trim();
	if (regex.test(phone)) throw "Phone number must contain only integer number";
	if (phone.length !== 10) throw "Phone number must have 10 digits";
	if(!parseInt(phone)) throw "Phone must be a 10 digits number";
	return phone;
}

// function checkStringArray(arr) {
// 	let arrayInvalidFlag = false;
// 	if (!arr || !Array.isArray(arr)) throw `You must provide an array of `;
// 	for (i in arr) {
// 		if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
// 			arrayInvalidFlag = true;
// 			break;
// 		}
// 		arr[i] = arr[i].trim();
// 	}
// 	if (arrayInvalidFlag) throw `One or more elements in  array is not a string or is an empty string`;
// 	return arr;
// }

function checkPassword(strVal) {
	const oneUpper = /[A-Z]/;
	const oneNumber = /[0-9]/;
	const specialChar = /[^\w\s]/;
	if (!strVal) throw "You must supply a password!";
	if (typeof strVal !== "string") throw "Password must be a string!";
	strVal = strVal.trim();
	if (strVal.length === 0) throw "Password cannot be an empty string or string with just spaces";
	if (strVal.length < 6) throw "Password must at least 6 characters long";
	if (strVal.includes(" ")) throw "Password must not contain space";
	if (!oneUpper.test(strVal)) throw "Password must contain one upper case ";
	if (!oneNumber.test(strVal)) throw "Password must contain one number ";
	if (!specialChar.test(strVal) && !strVal.includes("_")) throw "Password must contain one special character ";
	return strVal;
}

function checkJobTitle(title) {
	if (!title) throw "Must provide a job title";
	if (typeof title !== "string") throw "Job title must be a string";
	title = title.trim();
	if (title.length === 0) throw "Job title cannot be empty spaces";
	if (title.match("/[^ws]/g") || title.includes("_")) throw "Job title can only contain alphanumeric characters";
	if (title.length < 3) throw "Job title must be at least 3 characters long";

	return title;
}

function checkJobDescription(jobDescription) {
	if (!jobDescription) throw "Must enter a job description";
	if (typeof jobDescription !== "string") throw "Description must be a string";
	jobDescription = jobDescription.trim();
	if (jobDescription.length === 0) throw "Description cannot be empty spaces";
	if (jobDescription.split(" ").length < 5) throw "Description must have at least 5 words";

	return jobDescription;
}

function checkJobStreetName(streetName) {
	streetName = checkString(streetName);
	if (["10th St", "11th St", "12th St", "13th St", "14th St", "15th St", "16th St", "1st St", "2nd St", "3rd St", "4th St", "5th St", "6th St", "7th St", "8th St", "9th St", "Adams St", "Bloomfield St", "Castle Point Ter", "Church Twrs", "Clinton St", "Constitution Ct", "Court St", "Elysian Park", "Firehouse Plz", "Garden St", "Grand St", "Harrison St", "Henderson St", "Hudson Pl", "Hudson St", "Independence Ct", "Jackson St", "Jefferson St", "Madison St", "Marine View Plz", "Marshall Dr", "Marshall St", "Maxwell Ln", "Monroe St", "Newark St", "Observer Hwy", "Park Ave", "Paterson Ave", "River St", "Shipyard Ln", "Sinatra Dr", "Washington St", "Willow Ave", "Willow Ter"].includes(streetName)) {
		return streetName;
	} else {
    throw "Invalid street name";
  }
}

function checkJobStatus(status) {
	status = checkString(status);

	if (["Open", "Finished"].includes(status)) {
		return status;
	} else {
		throw "Invalid job status";
	}
}

function checkSearchQuery(searchQuery) {
	if (!searchQuery) throw "You must enter something in the search bar";
	searchQuery = searchQuery.trim();
	if (searchQuery.length === 0) throw "Only blank spaces are not allowed";
	let reg = /^[A-Z a-z 0-9]*$/gm;
	if (!searchQuery.match(reg)) throw "Search can only contain letters and numbers";
	return searchQuery;
}

const encryptPwd = (pwd, saltTimes = 12) => {
	const hash = bcrypt.hashSync(pwd, saltTimes)
	return hash
}

const validatePwd = (pwd, hash) => {
	const match = bcrypt.compareSync(pwd, hash)
	return match
}


module.exports = {
	checkString,
	checkFirstName,
	checkLastName,
	checkId,
	checkPassword,
	checkAge,
	checkEmail,
	checkPhone,
	checkJobTitle,
	checkJobDescription,
	checkJobStreetName,
	checkJobStatus,
	checkSearchQuery,
	encryptPwd,
	validatePwd
};
