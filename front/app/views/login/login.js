import AbstractView from "../abstractView/abstractView.js";
import {fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Log in to Camagru");
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

