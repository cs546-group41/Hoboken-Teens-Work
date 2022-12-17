function withdrawJob(Obj,jobId){
    var applicantId = document.getElementsByName('applicantId')[0].content;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/user/${applicantId}/appliedJob/withdraw/${jobId}`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                Obj.parentNode.parentNode.removeChild(Obj.parentNode);
            }
        }
    }
    xhttp.send();
}   