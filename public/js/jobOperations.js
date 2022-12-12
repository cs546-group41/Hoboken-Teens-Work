//add comment js funciton
const addCommentForm = document.getElementById("add-comment")
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
                    + `<li><p>By: <a href="/id/${result.authorId}">${result.name}</a></p><p>${result.comment}</p><p>On: ${result.commentDate}</p></li>`
            } else {
                alert("Failed to add comment")
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`jobId=${this.jobId.value}&comment=${this.comment.value}`);
});


//save job js function
function saveJob(id,saved) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "saveJob", true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                if (saved === true){
                    document.getElementById("save-job-saved").setAttribute("style","display: none")
                    document.getElementById("save-job-unsave").setAttribute("style","display: initial")
                }else {
                    document.getElementById("save-job-saved").setAttribute("style","display: initial")
                    document.getElementById("save-job-unsave").setAttribute("style","display: none")
                }
            }
        }
    }
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(`jobId=${id}&saved=${saved}`);
}



