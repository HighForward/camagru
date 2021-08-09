import AbstractView from "./abstractView.js";
import {fetch_json} from "../../app_utils.js";
import notify from "./notify.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register to Camagru");
    }

    getHtml() {
        return `
        `
    }

    async getView(app) {

        super.getView()

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin', '<div id="log_1" class="flex items-center justify-center w-full" style="height: calc(100vh - 4rem)"</div>')
        document.getElementById('log_1').insertAdjacentHTML('afterbegin', '<div id="log_2" class="flex flex-col justify center bg-white p-4 rounded shadow w-96">')
        document.getElementById('log_2').insertAdjacentHTML('afterbegin', '<h1 class="text-2xl text-text text-center my-8 font-medium">Register to <span class="text-secondary">Camagru</span></h1>\n')
        document.getElementById('log_2').insertAdjacentHTML('beforeend', '<form id="form_register" class="flex flex-col m-2 text-xl"></form>')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="email"  placeholder="email" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="username" placeholder="username" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="password" placeholder="password" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="confirm_password" placeholder="confirmation" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<div class="font-light text-sm mb-6 text-center">tu as déjà un profil ? connecte toi <a href="/login" class="text-primary font-semibold" data-link>ici </a>!</div>')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<button class="border rounded-md border-text hover:text-primary hover:bg-stroke flex bg-primary text-light w-full items-center font-medium justify-center py-4">Je m\'enregistre</button>')

        document.getElementById('form_register').addEventListener("submit", async (e) => await perform_register(e))
    }

}

async function perform_register(e) {

    if (e.preventDefault) e.preventDefault()

    let data = {
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm_password').value
    }

    const res = await fetch_json('http://localhost:4000/auth/register', 'POST', data)

    console.log(res)

    if (res.error) {
        notifyHandler.PushNotify('error', res.error)
    }
    else
    {
        localStorage.setItem('jwt', `${res.jwt}`);
        document.location.href = '/feed'
    }

    return false
}

