const axios = require('axios')

function checkSearchQuery(searchQuery) {
    if (!searchQuery) throw "You must enter something in the search bar";
    if (searchQuery.trim().length === 0) throw "Only blank spaces are not allowed";
    let reg = /^[A-Z a-z 0-9]*$/gm;
    if (!searchQuery.match(reg)) throw "Search can only contain letters and numbers";
    return searchQuery.trim();
}

const staticForm = document.getElementById("search-form")

if (staticForm) {
    const searchInput = document.getElementById("jobsInput")

    const errorContainer = document.getElementById('error-container')
    const errorTextElem = document.getElementsByClassName('text-goes-here')[0];

    staticForm.addEventListener('submit', (event) => {
        try{

            errorContainer.classList.add('hidden')
            const searchBarInput = searchInput.value;
            console.log(searchBarInput)
            const validatedSearchBar = checkSearchQuery(searchBarInput)
            console.log(validatedSearchBar)
            if(validatedSearchBar){
                errorContainer.style.display = "none"
            }
        }catch(e){
            event.preventDefault();
            errorTextElem.textContent = "Error: " + e
            errorContainer.style.display = "block"
        }

    })
}