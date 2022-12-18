
// function checkResume(resume){
//     if(!resume) throw "You must upload a resume to submit"
//     const re = /\.pdf/
//     if(!re.exec(resume)){
//         throw "Invalid file type please only upload pdf"
//     }
//     return resume
// }

// const staticForm1 = document.getElementById("resumeUpload")
// const errorContainer = document.getElementById('error-container')
// const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

// if (staticForm1) {
//     const Input1 = document.getElementById("resume")
//     const Input = Input1.value;
//     console.log(Input)

//     staticForm1.addEventListener('submit', (event) => {
//         try {
//             function resume(input){
//             const re = /.+\.(.pdf)$/i
//             if(re.test(Input)) throw "File should be of type pdf"
//             return input
//             }
//             const validatedResume = resume(Input)
//             if(validatedResume){
//                 errorContainer.style.display = "none"
//             }
           
            
//         } catch (e) {
//             event.preventDefault();
//             errorTextElem.textContent = "Error: " + e
//             errorContainer.style.display = "block"
//         }
//     })
// }