function initialize() {
    var isTaken = document.querySelectorAll("button.fire-button");
    if (isTaken.length > 0) {
        const hireButton = document.querySelectorAll('button.hire-button');
        hireButton.forEach(hireButton => {
            hireButton.remove();
        });
    }
}


//change job status function
function changeStatus(id, curStatus) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${id}/changeStatus`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var container = document.getElementById("jobStatusMsg")
                if (curStatus === "Open" || curStatus === "Taken") container.innerText = "Finished"
                else container.innerText = "Open"
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var targetStatus = "Open"
    if (curStatus !== "Finished") targetStatus = "Finished"
    xhttp.send(`status=${targetStatus}`);
}

function hire(obj, applicantId) {
    var user = document.getElementsByName('authorId')[0].content;
    var jobId = document.getElementsByName('jobId')[0].content;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/job/hire`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var newButton = document.createElement("button")
                newButton.class = "fire-button"
                newButton.innerText = "Fire!"
                newButton.onclick = new Function('fire(this,"{{applicantId}}")')
                obj.parentNode.replaceChild(newButton, obj)
                var elements = document.getElementsByClassName("hire-button");
                for (var i = elements.length - 1; i >= 0; i--) {
                    elements[i].parentNode.removeChild(elements[i]);
                }
            }
            var statusTxt = document.getElementById('jobStatusMsg')
            statusTxt.innerText = "Taken"
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`authorId=${user}&jobId=${jobId}&applicantId=${applicantId}`);
}

function fire(obj, applicantId) {
    var user = document.getElementsByName('authorId')[0].content;
    var jobId = document.getElementsByName('jobId')[0].content;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/job/fire`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                obj.parentNode.parentNode.removeChild(obj.parentNode);
                var applicantDOM = document.querySelectorAll("ul.applicants-list li");
                for (var v = 0; v < applicantDOM.length; v++) {
                    var newButton = document.createElement("button")
                    newButton.class = "hire-button"
                    newButton.innerText = "Hire!"
                    newButton.onclick = new Function('hire(this,"{{applicantId}}")')
                    applicantDOM[v].appendChild(newButton);
                }
                var statusTxt = document.getElementById('jobStatusMsg')
                statusTxt.innerText = "Open"
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`authorId=${user}&jobId=${jobId}&applicantId=${applicantId}`);
}


initialize()