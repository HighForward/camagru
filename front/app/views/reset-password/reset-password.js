import AbstractView from "../abstractView/abstractView.js";
import {checkPasswordUsername, fetch_get, fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Reset Password");
    }

    async getView(app, uuid) {

        super.getView()

        await this.getHtml()
        let form = document.getElementById('reset_password')

        form.addEventListener("submit", async (e) => {
            if (e.preventDefault) e.preventDefault()

            let data = {
                password: document.getElementById('password_reset').value,
                confirm_password: document.getElementById('password_reset_confirm').value,
                uuid: uuid
            }

            if (!data.password || !data.password.length || !data.confirm_password || !data.confirm_password.length)
                return
            if (!checkPasswordUsername(data.password) || !checkPasswordUsername(data.confirm_password))
            {
                notifyHandler.PushNotify('error', 'mauvais format de mot de passe')
                return
            }

            let res = await fetch_json('http://localhost:4000/auth/reset/uuid', 'POST', data)

            if (res.error)
                notifyHandler.PushNotify('error', res.error)
            if (res.success)
                notifyHandler.PushNotify('success', res.success)
        })

    }
}
