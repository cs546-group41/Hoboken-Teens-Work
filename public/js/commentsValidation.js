/*

function checkComment(comment){
    if (!comment) throw "Must provide a comment";
    return comment
}


const staticForm = document.getElementById("add-comment")

if (staticForm) {
    const Input = document.getElementById("comment")

    const errorContainer = document.getElementById('error-container')
    const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

    staticForm.addEventListener('submit', (event) => {
        try {
            errorContainer.classList.add('hidden')
            const commentInput = Input.value;
            const commentInputTrimmed = commentInput.trim()
            if(commentInputTrimmed.length === 0) throw "Enter something in the comment box before clicking the submit button"
            console.log(commentInput)
            const validatedComment = checkComment(commentInput)
            if (validatedComment) {
                errorContainer.style.display = "none"
            }
        } catch (e) {
            event.preventDefault();
            errorTextElem.textContent = "Error: " + e
            errorContainer.style.display = "block"
        }
    })
}*/

$(document).ready(function () {
    $("#add-comment").submit(function(event){
        event.preventDefault();
        var comment =$('#comment').val().trim()
        const jobId =$('#jobId').val().trim()
        if (comment){
            if ($.isNumeric(comment)) comment = comment.toString();
            $('#error-container').hide();
            $.ajax({
                url:"addComment",
                type:"POST",
                contentType:'application/x-www-form-urlencoded',
                data:{
                    jobId: jobId,
                    comment: comment
                },
                success:function(result){
                    console.log(result)
                    var DOMtext = $(`
                        <li class="comment-listLi">
                            <p>By: <a href="/user/${result.results.authorId}">${result.results.name}</a></p>
                            <p>${result.results.comment}</p>
                            <p>On: ${result.results.commentDate}</p>
                            <br>
                        </li>
                        `)
                    $('#comment-list').append(DOMtext)
                },
                error:function(){
                    $('#error-container').show();
                    $('#error-container').html('Failed to add comment!');
                }
            });
        }
        else{
            $('#error-container').show();
            $('#error-container').html('Cannot post a empty comment!');
        }
    });
});