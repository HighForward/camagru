import AbstractView from "../abstractView/abstractView.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("validate");
    }

    async getView(user, uuid) {

        await this.getHtml()
        // console.log(uuid)

        let res = await fetch(`http://localhost:4000/auth/validate/${uuid}`).then(async (e) => {
            return e.json()
        }).catch(e => null)

        console.log(res)
        if (res.success)
        {
            document.getElementById('validate').innerHTML = `Félicitation <span class="font-bold">${res.username}</span>, Tu peux dès à présent te connecter sur le site avec ton compte`
            notifyHandler.PushNotify('success', 'Compte vérifié')
        }
        else if (!res || res.error)
        {
            notifyHandler.PushNotify('error', res.error)
        }


    }

}