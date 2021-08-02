import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("404");
    }

    getHtml() {
        return `
            <h1>Sorry, this page do not exists</h1>
        `;
    }

}