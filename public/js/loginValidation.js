const checkUser = async (email, password) => {
    const userCollection = await users()
    const validatedEmail = validation.checkString(email)
    const validatedPassword = validation.checkPassword(password)
    let userFound = await userCollection.findOne({ email: validatedEmail })
    if (userFound === null) throw "Either the email or passwaord is invalid"
    let userPassword = userFound.hashedPassword
    let comparePassword = false
    comparePassword = await bcrypt.compare(validatedPassword, userPassword)
    if (comparePassword) {
        return { AuthenticatedUser: true }
    } else throw "Either the email or password is invalid"
}


const staticForm = document.getElementById("login-form")
console.log(staticForm)

if (staticForm) {
    const usernameInput = document.getElementById("username")
    console.log(usernameInput)

    const passwordInput = document.getElementById("password")
    console.log(passwordInput)

    const resultContainer = document.getElementById('result-container')
    const resultTextElem = resultContainer.getElementsByClassName('text-goes-here')[0];

    const errorContainer = document.getElementById('error-container')
    const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

    staticForm.addEventListener('submit', (event) => {
        event.preventDefault();


    })
}
