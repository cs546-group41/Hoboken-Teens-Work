//change job status function
function changeStatus(id){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${id}/changeStatus`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var result = JSON.parse(xhttp.response).results;
                var container = document.getElementById("jobStatus")
                if (result==="open") container.innerText = "closed"
                else container.innerText = "open"
            }
        }
    }
    xhttp.send();
}