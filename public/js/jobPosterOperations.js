//change job status function
function changeStatus(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${id}/changeStatus`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var result = JSON.parse(xhttp.response).results;
                var container = document.getElementById("jobStatus")
                if (result === "open") container.innerText = "closed"
                else container.innerText = "open"
            }
        }
    }
    xhttp.send();
}

function hire(applicantId) {
    var user = document.getElementsByName('authorId')[0].content;
    var jobId = document.getElementsByName('jobId')[0].content;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/job/hire`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                document.getElementById("fire-button").setAttribute("style", "display: initial")
                document.getElementById("hire-button").setAttribute("style", "display: none")
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`authorId=${user}&jobId=${jobId}&applicantId=${applicantId}`);
}

function fire(Obj,applicantId) {
    var user = document.getElementsByName('authorId')[0].content;
    var jobId = document.getElementsByName('jobId')[0].content;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/job/fire`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                Obj.parentNode.parentNode.removeChild(Obj.parentNode);
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`authorId=${user}&jobId=${jobId}&applicantId=${applicantId}`);
}