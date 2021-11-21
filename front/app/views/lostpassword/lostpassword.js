import AbstractView from "../abstractView/abstractView.js";
import {checkEmail, fetch_get, fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Lost Password");
    }

    async getView(app) {

        super.getView()

        await this.getHtml()

        let form = document.getElementById('lostpassword')

        form.addEventListener("submit", async (e) => {
            if (e.preventDefault) e.preventDefault()

            let input = document.getElementById('email').value

            let data = {
                email: input
            }

            if (!checkEmail(data.email))
            {
                notifyHandler.PushNotify('error', 'Mauvaise adresse email')
                return
            }

            if (!data.email || !data.email.length)
                return

            let res = await fetch_json('http://localhost:4000/auth/reset', 'POST', data)
            if (res.error)
                notifyHandler.PushNotify('error', res.error)
            if (res.success)
                notifyHandler.PushNotify('success', res.success)
        })

    }
}
