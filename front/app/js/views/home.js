import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Camagru Homepage");
    }

    getHtml() {
        return `
        <div class="flex flex-col items-center w-full text-3xl font-bold" style="height: calc(100vh - 4rem); padding-top: 8rem">
            <h1>WELCOME !</h1>
            <a href="/feed" class="text-3xl " style="color: #2ECC71" data-link>
                Discover Camagru
            </a>
        </div>
        `;
    }

}