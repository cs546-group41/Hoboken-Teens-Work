function deleteJob(Obj, jobId){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            Obj.parentNode.parentNode.removeChild(Obj.parentNode);
            location.reload();
       }
    };
    xhttp.open("DELETE", "deleteJob/"+jobId, true);
    xhttp.send();
}

