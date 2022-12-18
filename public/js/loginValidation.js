

    
function checkUserclientSideEmail(email) {
    if(!email) throw "You should provide a email"
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        email = email.trim();
        return email;
    } else {
        throw "Invalid email format";
    }
}
function checkUserClientSidePassword(strVal) {
    if (!strVal) throw "You must supply a password!";
    if (typeof strVal !== "string") throw "Password must be a string!";
    strVal = strVal.trim();
    if (strVal.length === 0) throw "Password cannot be an empty string or string with just spaces";
    return strVal;
}


const staticForm = document.getElementById("login-form");
console.log(staticForm)
if (staticForm) {

    const usernameInput = document.getElementById("emailInput")
    console.log(usernameInput)
    const passwordInput = document.getElementById("passwordInput")

    const errorContainer = document.getElementById('error-container')
    const errorTextElem = document.getElementsByClassName('text-goes-here')[0];
    staticForm.addEventListener('submit', (event) => {
        console.log("Inside submit")
        
        try {
            errorContainer.classList.add('hidden')
            const usernameInputElem = usernameInput.value;
            
            const passwordInputElem = passwordInput.value;


            const validatedEmail = checkUserclientSideEmail(usernameInputElem)
            const validatedPassword = checkUserClientSidePassword(passwordInputElem)
            console.log(validatedEmail)
            if (validatedEmail && validatedPassword) {
                errorContainer.style.display = "none"
            }

        } catch (e) {
            event.preventDefault();
            errorTextElem.textContent = "Error: " + e
            errorContainer.style.display = "block"
        }
    })
}

    


