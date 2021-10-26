import AbstractView from "./abstractView.js";
import {fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Log in to Camagru");
    }

    getHtml() {
        return `
            <div id="log_1" class="flex items-center justify-center w-full" style="height: calc(100vh - 4rem)">
                <div id="log_2" class="flex flex-col bg-white p-4 rounded shadow w-96">
                    <h1 class="text-2xl text-text text-center my-8 font-medium">Connexion à <span class="text-secondary">Camagru</span></h1>
                    <form id="form_register" class="flex flex-col m-2 text-xl">
                        <input id="username" placeholder="username" class="rounded-md border border-text w-full mb-6 p-2">
                        <input id="password" placeholder="password" class="rounded-md border border-text w-full mb-6 p-2">
                        <div class="font-light text-sm mb-6 text-center">tu n\'as pas de profil ? créer en un <a href="/register" style="color: #2ECC71" class="text-primary font-semibold" data-link>ici </a>!</div>
                        <button style="background: #2ECC71" class="border rounded-md hover:text-gray-200 flex w-full items-center font-medium justify-center py-4 ">Connexion</button>
                    </form>
                </div>
            </div>
        `
    }

    async getView(app) {

        super.getView()

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin',  this.getHtml())

        document.getElementById('form_register').addEventListener("submit", async (e) => await perform_register(e))
    }
}

async function perform_register(e) {

    if (e.preventDefault) e.preventDefault()

    let data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    }

    const res = await fetch_json('http://localhost:4000/auth/login', 'POST', data)

    if (res.error) {
        notifyHandler.PushNotify('error',res.error)
    }
    else
    {
        notifyHandler.PushNotify('success', 'Welcome !')

        localStorage.setItem('jwt', `${res.jwt}`);
        document.location.href = '/feed'
    }


    console.log(res)

    return false
}

