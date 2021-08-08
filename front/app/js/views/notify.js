import AbstractView from "./abstractView.js";

export default class {
    constructor(params) {
    }

    PushNotify(message) {

        // super.getView()

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin', `<div id="notif" style="background: #015709; color: white;" class="fixed flex w-full items-center justify-center">${message}</div>`)

        setTimeout(() => {
            let notify = document.getElementById('notif')
            if (notify)
            app_div.removeChild(notify)
        }, 3500)

        // app_div.innerHTML = this.getHtml()

    }

}