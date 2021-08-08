import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Log out");
    }

    getHtml() {
        return `
        <div class="flex flex-col items-center w-full text-3xl font-bold" style="height: calc(100vh - 4rem); padding-top: 8rem">
            <h1>See you soon !</h1>
            <a href="/login" class="text-3xl " style="color: #2ECC71" data-link>
                Come back here :3
            </a>
        </div>
        `;
    }

    getView(app) {

        super.getView()

        document.cookie = 'jwt' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        let app_div = document.getElementById('app')
        app_div.innerHTML = this.getHtml()

        this.pushNotify('Vous êtes maintenant déconnecté !')
    }

}