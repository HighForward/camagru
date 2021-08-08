import home from './js/views/home.js'
import login from './js/views/login.js'
import error from './js/views/404.js'
import feed from './js/views/feed.js'
import creator from './js/views/creator.js'
import register from "./js/views/register.js";
import {isUserOnline} from "./app_utils.js";
import logout from "./js/views/logout.js";

let online_state = false

const router = async () => {
    const routes = [
        {path: "/", view: home},
        {path: "/login", view: login},
        {path: "/register", view: register},
        {path: "/logout", view: logout},
        {path: "/feed", view: feed},
        {path: "/creator", view: creator},
    ];

    let match = routes.find((e) => e.path === location.pathname)

    let app = document.querySelector("#app")
    let view;
    if (!match)
        view = new error({error: '404'})
    else
        view = new match.view(match)

    view.getView()

    // console.log(document.cookie)

    isUserOnline()
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


