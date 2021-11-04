import home from './views/home/home.js'
import login from './views/login/login.js'
import error from './views/404/404.js'
import feed from './views/feed/feed.js'
import creator from './views/creator/creator.js'
import register from "./views/register/register.js";
import {isUserOnline} from "./app_utils.js";
import logout from "./views/logout/logout.js";
import notify from "./views/notify/notify.js";
import profil_settings from "./views/settings/profil_settings.js";
import user_id from "./views/user_id/user-id.js";
import header from "./views/header/header.js";
import validate from "./views/validate/validate.js";
import lostPassword from "./views/lostpassword/lostpassword.js";

let online_state = false
export let app_header = new header()
export const routes = [
    {path: "/", file_path: 'views/home/home.html', view: home},
    {path: "/login", file_path: "views/login/login.html", view: login},
    {path: "/register", file_path: "views/register/register.html", view: register},
    {path: "/logout", file_path: "views/logout/logout.html" ,view: logout},
    {path: "/feed", file_path: "views/feed/feed.html" , view: feed},
    {path: "/creator", file_path: "views/creator/creator.html", view: creator},
    {path: "/settings", file_path: 'views/settings/settings.html', view: profil_settings},
    {path: "/user", file_path: 'views/user_id/user_id.html', view: user_id},
    {path: "/validate", file_path: 'views/validate/validate.html', view: validate},
    {path: "/lostpassword", file_path: 'views/lostpassword/lostpassword.html', view: lostPassword},
];

function perform_routing()
{
    let match = routes.find((e) => e.path === location.pathname)
    let split_route = location.pathname.split('/').filter((e) => e)

    if (split_route && split_route.length === 2 && split_route[0] === 'user') {
        match = routes.find((e) => e.path === '/user')
    }

    if (split_route && split_route.length === 2 && split_route[0] === 'validate') {
        match = routes.find((e) => e.path === '/validate')
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
