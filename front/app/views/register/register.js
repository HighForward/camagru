import AbstractView from "../abstractView/abstractView.js";
import {fetch_json} from "../../app_utils.js";
import notify from "../notify/notify.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register to Camagru");
    }

    async getView(app) {

        super.getView()

        await this.getHtml()

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

