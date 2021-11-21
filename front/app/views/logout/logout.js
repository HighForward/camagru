import AbstractView from "../abstractView/abstractView.js";
import {deleteAllCookies} from "../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Logging out");
    }

    async getView(app) {

        super.getView()

        deleteAllCookies()

        document.location.href = '/'
        document.getElementById('online_state_header').innerHTML = ''
        // header.updateOnlineStateHeader()

        await this.getHtml()
    }

}