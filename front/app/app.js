import home from './js/views/home.js'
import register from './js/views/register.js'
import error from './js/views/404.js'
import feed from './js/views/feed.js'
import {isUserOnline} from "./app_utils.js";

const router = async () => {
    const routes = [
        {path: "/", view: home},
        {path: "/register", view: register},
        {path: "/feed", view: feed},
    ];

    let match = routes.find((e) => e.path === location.pathname)

    let app = document.querySelector("#app")
    let view;
    if (!match)
        view = new error({error: '404'})
    else
        view = new match.view(match)

    view.getView()
}

document.body.addEventListener("click", async e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault()
        history.pushState(null, null, e.target.href)
        await router()
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await router()
});

window.addEventListener("popstate", router)

isUserOnline()