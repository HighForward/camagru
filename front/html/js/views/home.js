import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
    }

    getHtml() {
        return `
            <h1>Welcome back, Dom</h1>
            <p>Hi there, this is your Dashboard.</p>
            <p>
                <a href="/" data-link>back to home</a>.
            </p>
        `;
    }

}