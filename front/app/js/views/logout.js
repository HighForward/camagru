import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Log out");
    }

    getHtml() {
        return `
        <div class="flex flex-col items-center w-full text-5xl font-bold" style="height: calc(100vh - 4rem); padding-top: 8rem">
            <h1>See you soon !</h1>
        </div>
        `;
    }

    getView(app) {

        super.getView()

        localStorage.clear();

        document.location.href = '/'
        document.getElementById('online_state_header').innerHTML = ''


        let app_div = document.getElementById('app')
        app_div.innerHTML = this.getHtml()

    }

}