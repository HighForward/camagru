import AbstractView from "../abstractView/abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("404");
    }

    async getView() {
        super.getView();

        await this.getHtml()

    }

}