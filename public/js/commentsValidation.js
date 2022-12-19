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