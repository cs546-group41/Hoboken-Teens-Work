function withdrawJob(Obj,jobId){
    var applicantId = document.getElementById("value-applicantId").innerText
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/user/${applicantId}/appliedJob/withdraw/${jobId}`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200 || this.status == 202) {
                Obj.parentNode.parentNode.removeChild(Obj.parentNode);
            }
        }
    }
    xhttp.send();
}   

