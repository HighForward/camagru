import home from './js/views/home.js'
import register from './js/views/register.js'
import error from './js/views/404.js'

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

const router = async () => {
    const routes = [
        {path: "/", view: home},
        {path: "/posts", view: register},
        {path: "/posts/:id"},
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


document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});

window.addEventListener("popstate", router);
