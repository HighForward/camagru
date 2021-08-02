function processForm(e) {
    if (e.preventDefault) e.preventDefault();

    console.log("bite")
    window.location.href = '/auth'

    return false;
}

let form = document.getElementById('my-form');
form.addEventListener("submit", processForm);