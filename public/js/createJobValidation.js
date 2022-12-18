
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

function checkJobTag(jobTag) {
	if (!jobTag) throw "Must enter a job tag";
	if (typeof jobTag !== "string") throw "Job tag must be a string";
	jobTag = jobTag.trim();
	if (jobTag.length === 0) throw "Job tag cannot be empty spaces";
	if (jobTag.length < 5) throw "Job tag must have at least 5 characters";

	return jobTag;
}


const staticForm = document.getElementById("create-Job");
console.log(staticForm)
if (staticForm) {
    const errorContainer = document.getElementById('error-container')
    const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

    const JobTitleInput = document.getElementById("jobTitle")
    const JobDescriptionInput = document.getElementById("jobDescription")
    const JobStreet = document.getElementById("jobStreetName")
    const JobTag = document.getElementById("jobTag")
    console.log(JobStreet)
    

    staticForm.addEventListener('submit', (event) => {
        console.log("Inside submit")
        
        try {
            errorContainer.classList.add('hidden')
            const JobTitleInputValue = JobTitleInput.value;
            const jobDescriptionValue = JobDescriptionInput.value;
            const jobStreetValue = JobStreet.value;
            const JobTagInputValue = JobTag.value;

            const validatedJobTitle = checkJobTitle(JobTitleInputValue)
            const validatedJobDescription = checkJobDescription(jobDescriptionValue)
            const validatedJobTag = checkJobTag(JobTagInputValue)
            if (validatedJobDescription
             && validatedJobTitle && validatedJobTag) {
                errorContainer.style.display = "none"
            }
            if(jobStreetValue == "Select Street") throw "Please select a job Street"

        } catch (e) {
            event.preventDefault();
            errorTextElem.textContent = "Error: " + e
            errorContainer.style.display = "block"
        }
    })
}
