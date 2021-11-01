import AbstractView from "../abstractView/abstractView.js";

export default class {

    nb_alert = 0


    constructor(params) {

    }

    PushNotify(state = 'error', message) {

        // super.getView()
        let curr_nb = ++this.nb_alert

        let to_add = document.getElementById(`notif-${0}`)
        let where = curr_nb === 1 ? 'afterbegin' : 'beforeend'

        to_add.insertAdjacentHTML(where, `<div id="notif-${curr_nb}" style="color: white;" class="flex items-center h-8 justify-center mt-2 rounded">${message}</div>`)

        let item = document.getElementById(`notif-${curr_nb}`)
        item.style.width = '400px'
        if ((state === 'success'))
            item.style.background = '#2ECC71'
        else
            item.style.background = '#D60833'

        setTimeout(() => {
            if (item) {
                document.getElementById('notif-0').removeChild(item)
            }
        }, 3500)

    }

}