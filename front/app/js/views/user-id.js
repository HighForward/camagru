import AbstractView from "./abstractView.js";
import {fetch_get} from "../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Page");
    }

    isSameUser(user, target_user)
    {
        if (user && target_user && target_user.id === user.id) {
            return true
        }
        return false
    }

    getHtml(user, target_user) {

        let html = `
            <div class="flex flex-col items-center w-full text-3xl font-bold" style="height: calc(100vh - 4rem); padding-top: 8rem">
                <h1>${target_user.username}</h1> `

        if (this.isSameUser(user, target_user)) {
            html += `<a href="/settings" class="flex items-center justify-center w-36 bg-gray-200 text-white" data-link>Settings</a>`
        }

        html += '</div>'



        return html
    }

    async getView(user, param) {


        let target_user = await fetch_get(`http://localhost:4000/users/${param}`).then(e => {
            return e
        }).catch(e => {
            return null
        })


        if (!target_user || target_user.error) {

            document.location.href = '/'
            return
        }

        super.getView()

        let app_div = document.getElementById('app')

        app_div.insertAdjacentHTML("afterbegin", this.getHtml(user, target_user))

        // app_div.innerHTML = this.getHtml()

    }

}