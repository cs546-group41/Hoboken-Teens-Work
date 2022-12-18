
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
//             if(!re.test(Input)) throw "File should be of type pdf"
//             return input
//             }
//             const validatedResume = resume(Input)
//             // if(validatedResume){
//             //     errorContainer.style.display = "none"
//             // }
//             if(!validatedResume){
//                 document.getElementById("resumeError").innerHTML = "File should be of type pdf"

//             }
           
            
//             if(Input == ""){
//                 document.getElementById("resumeError").innerHTML = "You must upload a resume"
//             } 
//             if (resumeInput) {
//                 errorContainer.style.display = "none"
//             }
//         } catch (e) {
//             event.preventDefault();
//         }
//     })
// }
// }*/
//         } catch (e) {
//             event.preventDefault();
//             errorTextElem.textContent = "Error: " + e
//             errorContainer.style.display = "block"
//         }
//     })
// }








$('#resumeUpload').submit((event) => {
    const re = /.+\.(.pdf)$/i
    const value =$('#resume').val().trim()
    if ($('#resume').val().trim()) {
      $('#error').hide();
      $('#resume').focus();
    }
    else{
      $('#error').show();
      $('#error').html('You must upload something before submitting');
      $('#resume').focus();
    }
    if(!value.match(re)){
        event.preventDefault();
        $('#error').show();
        $('#error').html('only pdf file is allowed');
        $('#resume').focus();
      }

    // if(re.match($('#resume').val().trim())){
    //   $('#error1').hide();
    //   $('#resume').focus();
    // }else{
    //   event.preventDefault();
    //   $('#error1').show();
    //   $('#error1').html('only pdf file is allowed');
    //   $('#resume').focus();
    // }
    if ($('#resume').val().trim()) {
        $('#error1').hide();
        $('#resume').focus();
      }
  });