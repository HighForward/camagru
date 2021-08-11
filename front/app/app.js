import home from './js/views/home.js'
import login from './js/views/login.js'
import error from './js/views/404.js'
import feed from './js/views/feed.js'
import creator from './js/views/creator.js'
import register from "./js/views/register.js";
import {isUserOnline} from "./app_utils.js";
import logout from "./js/views/logout.js";
import notify from "./js/views/notify.js";
import profil_settings from "./js/views/profil_settings.js";
import user_id from "./js/views/user-id.js";
import header from "./js/views/header.js";

let online_state = false
export let app_header = new header()

const router = async () => {


    const routes = [
        {path: "/", view: home},
        {path: "/login", view: login},
        {path: "/register", view: register},
        {path: "/logout", view: logout},
        {path: "/feed", view: feed},
        {path: "/creator", view: creator},
        {path: "/settings", view: profil_settings},
        {path: "/user", view: user_id},
    ];

    let match = routes.find((e) => e.path === location.pathname)

    let split_route = location.pathname.split('/').filter((e) => e)

    if (split_route && split_route.length === 2 && split_route[0] === 'user') {
        match = routes.find((e) => e.path === '/user')
    }

    let view = new error({error: '404'})
    if (match)
        view = new match.view(match)

    let user = null
    if ((user = await isUserOnline(online_state)))
        online_state = true

    view.getView(user, split_route[1])

}

document.body.addEventListener("click", async e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault()
        history.pushState(null, null, e.target.href)
        await router()
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    app_header.getView()
    await router()
});

export let notifyHandler = new notify()

window.addEventListener("popstate", router)


