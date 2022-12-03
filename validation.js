const { ObjectId } = require("mongodb");

function checkId(id) {
	if (!id) throw `Error: You must provide an ID `;
	if (typeof id !== "string") throw `Error: ID must be a string`;
	id = id.trim();
	if (id.length === 0) throw `Error: ID cannot be an empty string or just spaces`;
	if (!ObjectId.isValid(id)) throw `Error:invalid object ID`;
	return id;
}

function checkString(strVal) {
	if (!strVal) throw `Error: You must supply a string!`;
	if (typeof strVal !== "string") throw `Error:Input  must be a string!`;
	strVal = strVal.trim();
	if (strVal.length === 0) throw `Error:Input cannot be an empty string or string with just spaces`;
	if (!isNaN(strVal)) throw `Error: input is not a valid value for as it only contains digits`;
	return strVal;
}

function checkFirstName(input) {
	if (input.length < 2) throw "First name must be atleast 2 characters";
	const regex = /[^A-z\s'"]/g;
	if (regex.test(input) || input.includes("_")) throw "First name must not contain special characters";
	let count = 0;
	for (char of input) if (char === "'") count++;
	if (count > 1) throw "First name cannot have more than one apostrophe";
}

function checkLastName(input) {
	if (input.length < 2) throw "Last name must be atleast 2 characters";

	const regex = /[^A-z\s'\-"]/g;
	if (regex.test(input) || input.includes("_")) throw "Last name must not contain special characters";
	let countApostrophe = 0;
	for (char of input) if (char === "'") countApostrophe++;
	if (countApostrophe > 1) throw "Last name cannot have more than one apostrophe";
	let countHyphen = 0;
	for (char of input) if (char === "-") countHyphen++;
	if (countHyphen > 1) throw "Last name cannot have more than one countHyphen";
}

function checkEmail(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		email = email.trim();
		return email;
	} else {
		throw "Invalid email format";
	}
}

function checkAge(age) {
	if (!age) throw `Error: You must provide an age `;

	const regex = /[^0-9]/;
	if (regex.test(age)) throw "Age must be an integer number";
	if (age > 118 || age < 0) throw "Age must be <= 118 and >= 0";
	age = parseInt(age);
	return age;
}

function checkPhone(phone) {
	if (!phone) throw `Error: You must provide a phone number `;
	const regex = /[^0-9]/;
	phone = phone.trim();
	if (regex.test(phone)) throw "Phone number must contain only integer number";
	if (phone.length !== 10) throw "Phone number must have 10 digits";
	return phone;
}

function checkStringArray(arr) {
	let arrayInvalidFlag = false;
	if (!arr || !Array.isArray(arr)) throw `You must provide an array of `;
	for (i in arr) {
		if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
			arrayInvalidFlag = true;
			break;
		}
		arr[i] = arr[i].trim();
	}
	if (arrayInvalidFlag) throw `One or more elements in  array is not a string or is an empty string`;
	return arr;
}

function checkPassword(strVal) {
	const oneUpper = /[A-Z]/;
	const oneNumber = /[0-9]/;
	const specialChar = /[^\w\s]/;
	if (!strVal) throw `Error: You must supply a password!`;
	if (typeof strVal !== "string") throw `Error: password must be a string!`;
	strVal = strVal.trim();
	if (strVal.length === 0) throw `Error: password cannot be an empty string or string with just spaces`;
	if (strVal.length < 6) throw "Error: password must at least 6 characters long";
	if (strVal.includes(" ")) throw "Error: password must not contain space";
	if (!oneUpper.test(strVal)) throw "Error: password must contain one upper case ";
	if (!oneNumber.test(strVal)) throw "Error: password must contain one number ";
	if (!specialChar.test(strVal) && !strVal.includes("_")) throw "Error: password must contain one special character ";
	return strVal;
}

function checkJobTitle(title) {
	if (!title) throw "Must provide a job title";
	if (typeof title !== "string") throw "Job title must be a string";
	title = title.trim();
	if (title.length === 0) throw "Job title cannot be empty spaces";
	if (title.match("/[^\w\s]/g") || title.includes("_")) throw "Job title can only contain alphanumeric characters";
	if (title.length < 3) throw "Job title must be at least 3 characters long";

	return title;
}

function checkJobDescription(jobDescription) {
	if (!jobDescription) throw "Must enter a job description";
	if (typeof (jobDescription) !== "string") throw "Description must be a string";
	jobDescription = jobDescription.trim();
	if (jobDescription.length === 0) throw "Description cannot be empty spaces";
	if (jobDescription.split(" ").length < 5) throw "Description must have at least 5 words";

	return jobDescription;
}

function checkJobStreetName(streetName) {

	return streetName;
}

function checkSearchQuery(searchQuery) {
	if (!searchQuery) throw "You must enter something in the search bar"
	if (searchQuery.trim().length === 0) throw "Only blank spaces are not allowed"
	let reg = /^[A-Z a-z 0-9]*$/gm
	if (!searchQuery.match(reg)) throw "Search can only contain letters and numbers"
	return searchQuery.trim()
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
	checkSearchQuery,
};
