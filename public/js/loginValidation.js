function checkUserclientSideEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        email = email.trim();
        return email;
    } else {
        throw "Invalid email format";
    }
}
function checkUserClientSidePassword(strVal) {
    const oneUpper = /[A-Z]/;
    const oneNumber = /[0-9]/;
    const specialChar = /[^\w\s]/;
    if (!strVal) throw "You must supply a password!";
    if (typeof strVal !== "string") throw "Password must be a string!";
    strVal = strVal.trim();
    if (strVal.length === 0) throw "Password cannot be an empty string or string with just spaces";
    if (strVal.length < 6) throw "Password must at least 6 characters long";
    if (strVal.includes(" ")) throw "Password must not contain space";
    if (!oneUpper.test(strVal)) throw "Password must contain one upper case ";
    if (!oneNumber.test(strVal)) throw "Password must contain one number ";
    if (!specialChar.test(strVal) && !strVal.includes("_")) throw "Password must contain one special character ";
    return strVal;
}


const staticForm = document.getElementById("login-form")

if (staticForm) {
    const usernameInput = document.getElementById("username")

    const passwordInput = document.getElementById("password")

    const errorContainer = document.getElementById('error-container')
    const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

    staticForm.addEventListener('submit', (event) => {
        event.preventDefault();
        try {
            errorContainer.classList.add('hidden')
            const usernameInputElem = usernameInput.value;

            const passwordInputElem = passwordInput.value;


            const validatedEmail = checkUserclientSideEmail(usernameInputElem)
            const validatedPassword = checkUserClientSidePassword(passwordInputElem)

            if (validatedEmail && validatedPassword) {
                errorContainer.style.display = "none"
            }
            
        } catch (e) {
            errorTextElem.textContent = "Error: " + e
            errorContainer.style.display = "block"
        }
    })
}
