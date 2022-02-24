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
import resetPassword from "./views/reset-password/reset-password.js";

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
    {path: "/reset", file_path: 'views/reset-password/reset-password.html', view: resetPassword},
];

function checkDirRoute(split_route)
{
    for (let route of routes)
    {
        if (route.path === location.pathname || route.path.substring(1) === split_route[0])
            return route
    }
    return undefined
}

function perform_routing()
{
    let split_route = location.pathname.split('/').filter((e) => e)
    let match

    let view = new error({file_path: 'views/404/404.html'})

    if ((match = checkDirRoute(split_route))) {
        view = new match.view(match)
    }

    return ({view, target_user: split_route[1]})
}

const router = async () => {

    let {view, target_user} = perform_routing()

    let user = await isUserOnline()
    await app_header.createSideBar(user)
    app_header.updateOnlineStateHeader(user)

    await view.getView(user, target_user)


    let footer = document.createElement("div")
    footer.className = "w-full flex justify-center items-center flex-col bg-black"
    footer.style.height = "var(--footer-size)"
    footer.style.color = "var(--main-color)"
    footer.innerHTML = "Made with ♥ by mbrignol"

    document.getElementById("app").insertAdjacentElement("beforeend", footer)
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
