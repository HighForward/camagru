import AbstractView from "../abstractView/abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("404");
    }

    async getView() {
        super.getView();
        console.log('404')

        await this.getHtml()

    }

}