import AbstractView from "../abstractView/abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Camagru Homepage");
    }


    async getView(app) {

        super.getView()

        await this.getHtml()

    }

}