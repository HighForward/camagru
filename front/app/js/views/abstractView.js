import notify from "./notify.js";

export default class {

    constructor(params) {
        this.params = params;
        this.notif = new notify()
    }

    setTitle(title) {
        document.title = title;
    }

    getHtml() {
        return "";
    }

    getView()
    {
        let app = document.getElementById('app')

        if (app.innerHTML !== '')
            app.innerHTML = ''

        if (app.firstChild)
            app.removeChild(app.firstChild)


        // document.getElementById('app').parentNode.removeChild(document.getElementById('app'))
        // console.log(document.getElementById('app').parentNode.removeChild())
    }

    pushNotify(message)
    {
        this.notif.PushNotify(message)
    }

}