
function checkResume(resume){
    if(!resume) throw "You must upload a resume to submit"
    if(!resume.includes("pdf")) throw "Only pdf is allowed"
    return resume
}

/*
const staticForm1 = document.getElementById("resumeUpload")

if (staticForm1) {
    const Input = document.getElementById("resume").value


    staticForm1.addEventListener('submit', (event) => {
        try {
           
            
            if(Input == ""){
                document.getElementById("resumeError").innerHTML = "You must upload a resume"
            } 
            if (resumeInput) {
                errorContainer.style.display = "none"
            }
        } catch (e) {
            event.preventDefault();
        }
    })
}*/