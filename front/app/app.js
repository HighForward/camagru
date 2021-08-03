import home from './js/views/home.js'
import register from './js/views/register.js'
import error from './js/views/404.js'
import feed from './js/views/feed.js'

const router = async () => {
    const routes = [
        {path: "/", view: home},
        {path: "/register", view: register},
        {path: "/feed", view: feed},
        // {path: "/settings"}
    ];

    let match = routes.find((e) => e.path === location.pathname)

    let view;
    if (!match)
        view = new error({error: '404'})
    else
        view = new match.view(match)
    document.querySelector("#app").innerHTML = view.getHtml();
}

document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        history.pushState(null, null, e.target.href);
        router();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    router();
});

window.addEventListener("popstate", router);


// function processForm(e) {
//     if (e.preventDefault) e.preventDefault();
//
//     console.log("bite")
//     window.location.href = '/auth'
//
//     return false;
// }
//
// let form = document.getElementById('my-form');
// form.addEventListener("submit", processForm);