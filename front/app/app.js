import home from './js/views/home/home.js'
import login from './js/views/login/login.js'
import error from './js/views/404/404.js'
import feed from './js/views/feed/feed.js'
import creator from './js/views/creator/creator.js'
import register from "./js/views/register/register.js";
import {isUserOnline} from "./app_utils.js";
import logout from "./js/views/logout/logout.js";
import notify from "./js/views/notify/notify.js";
import profil_settings from "./js/views/settings/profil_settings.js";
import user_id from "./js/views/user_id/user-id.js";
import header from "./js/views/header/header.js";

let online_state = false
export let app_header = new header()
export const routes = [
    {path: "/", file_path: 'js/views/home/home.html', view: home},
    {path: "/login", file_path: "js/views/login/login.html", view: login},
    {path: "/register", file_path: "js/views/register/register.html", view: register},
    {path: "/logout", file_path: "js/views/logout/logout.html" ,view: logout},
    {path: "/feed", file_path: "js/views/feed/feed.html" , view: feed},
    {path: "/creator", file_path: "js/views/creator/creator.html", view: creator},
    {path: "/settings", file_path: 'js/views/settings/settings.html', view: profil_settings},
    {path: "/user", file_path: 'js/views/user_id/user_id.html', view: user_id},
];

function perform_routing()
{
    let match = routes.find((e) => e.path === location.pathname)
    let split_route = location.pathname.split('/').filter((e) => e)

    if (split_route && split_route.length === 2 && split_route[0] === 'user') {
        match = routes.find((e) => e.path === '/user')
    }
    let view = new error({error: '404'})
    if (match)
        view = new match.view(match)
    return ({view, target_user: split_route[1]})
}

const router = async () => {

    let {view, target_user} = perform_routing()

    let user = await isUserOnline(online_state)
    app_header.updateOnlineStateHeader(user)


    await view.getView(user, target_user)

}

document.body.addEventListener("click", async e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault()
        history.pushState(null, null, e.target.href)
        await router()
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await app_header.getView()
    await router()
});

export let notifyHandler = new notify()

window.addEventListener("popstate", router)


