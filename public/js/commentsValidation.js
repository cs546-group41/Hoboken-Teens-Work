

function checkComment(comment){
    if (!comment) throw "Must provide a comment";
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
}