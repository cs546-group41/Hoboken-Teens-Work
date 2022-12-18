
const staticForm1 = document.getElementById("resumeUpload")
const errorContainer = document.getElementById('error-container')
const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

if (staticForm1) {
   

    staticForm1.addEventListener('submit', (event) => {
      event.preventDefault();

        try {
          const Input1 = document.getElementById("resume")
          const Input = Input1.value;
          const Inputtrim = Input.trim()
          if(Inputtrim.length === 0) throw "upload something to submit"
          else{
            errorContainer.style.display = "none"
        }
        const re = /.+\.(.pdf)$/i
        if(re.test(Inputtrim)){
          errorContainer.style.display = "none"
        }else throw "Upload format should be of a pdf file"
          
        } catch (e) {
            event.preventDefault();
            errorTextElem.textContent = "Error: " + e
            errorContainer.style.display = "block"
        }
    })
}








// $('#resumeUpload').submit((event) => {
//     const re = /.+\.(.pdf)$/i
//     const value =$('#resume').val().trim()
//     if ($('#resume').val().trim()) {
//       $('#error').hide();
//       $('#resume').focus();
//     }
//     else{
//       $('#error').show();
//       $('#error').html('You must upload something before submitting');
//       $('#resume').focus();
//     }
//     if(!value.match(re)){
//         event.preventDefault();
//         $('#error').show();
//         $('#error').html('only pdf file is allowed');
//         $('#resume').focus();
//       }

//     // if(re.match($('#resume').val().trim())){
//     //   $('#error1').hide();
//     //   $('#resume').focus();
//     // }else{
//     //   event.preventDefault();
//     //   $('#error1').show();
//     //   $('#error1').html('only pdf file is allowed');
//     //   $('#resume').focus();
//     // }
//     if ($('#resume').val().trim()) {
//         $('#error1').hide();
//         $('#resume').focus();
//       }
//   });