import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("register");
    }

    getHtml() {
        return `
            <h1>REGISTER TO CAMAGRUUU</h1>
            <p>Hi there, this is your register page.</p>
            <p>
                <a href="/" data-link>back to home</a>.
            </p>
        `;
    }
}