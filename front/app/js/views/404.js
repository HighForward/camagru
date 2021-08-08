import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("404");
    }

    getHtml() {
        return `<div class="h-screen">
                <h1>Sorry, this page do not exists</h1>
                <div>ERROR 404</div>
            </div>
        `;
    }

    getView() {
        super.getView();

        let app_div = document.getElementById('app')
        app_div.innerHTML = this.getHtml()

    }

}