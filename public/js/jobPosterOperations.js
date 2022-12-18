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
                location.reload();
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var targetStatus = "Open"
    if (curStatus !== "Finished") targetStatus = "Finished"
    xhttp.send(`status=${targetStatus}`);
}

function hire(obj, applicantId) {
    var user = document.getElementById("value-authorId").innerText
    var jobId = document.getElementById("value-jobId").innerText
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
                location.reload();
            }
            var statusTxt = document.getElementById('jobStatusMsg')
            statusTxt.innerText = "Taken"
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`authorId=${user}&jobId=${jobId}&applicantId=${applicantId}`);
}

function fire(obj, applicantId) {
    var user = document.getElementById("value-authorId").innerText
    var jobId = document.getElementById("value-jobId").innerText
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/job/fire`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200 || this.status=== 202) {
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
                location.reload();
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`authorId=${user}&jobId=${jobId}&applicantId=${applicantId}`);
}

const addCommentForm = document.getElementById("add-comment")
if(addCommentForm){
    addCommentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "addComment", true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                var result = JSON.parse(xhttp.response).results;
                if (this.status == 200) {
                    var container = document.getElementById('comment-list')
                    container.innerHTML = container.innerHTML
                    +`
                    <li class="comment-listLi">
                        <p>By: <a href="/user/${result.authorId}">${result.name}</a></p>
                        <p>${result.comment}</p>
                        <p>On: ${result.commentDate}</p>
                        <br>
                    </li>`
                }else {
                    alert("Failed to add comment")
                }
            }
        }
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(`jobId=${this.jobId.value}&comment=${this.comment.value}`);
    });
}

initialize()