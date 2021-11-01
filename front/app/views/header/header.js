import AbstractView from "../abstractView/abstractView.js";

export default class extends AbstractView {

    connected = false

    constructor(params) {
        super(params);
    }

    updateOnlineStateHeader(user)
    {
        let online_state = (!!user)

        let header_left = document.getElementById('online_state_header')

        if (this.connected !== online_state)
            header_left.innerHTML = ''

        if (this.connected !== online_state && online_state)
        {
            header_left.insertAdjacentHTML('afterbegin', `<a href="/logout" class="flex justify-center px-4 py-2 rounded text-center mr-16" style="background: #2ECC71;" data-link>Déconnexion</a>`)
            header_left.insertAdjacentHTML('afterbegin', `<a href="/user/${user.username}" class="flex justify-center px-4 py-2 rounded text-center mr-4" style="background: #2ECC71;" data-link>Profil</a>`)
            document.getElementById('header_nav').insertAdjacentHTML('beforeend', `<a href="/creator" class="flex justify-center text-center ml-16 font-semibold" style="color: #2ECC71;" data-link>Creator</a>`)
        }

        if (!online_state && header_left.innerHTML === '')
            header_left.insertAdjacentHTML('afterbegin', `<a href="/login" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Connexion</a>`)

        this.connected = online_state
    }

    async getView(user) {

        super.getView()

        let header = await fetch(`http://localhost/views/header/header.html`).then(async (res) => {
            let text = await res.text()
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, "text/html");
            return (doc.body.firstChild)
        })

        let header_div = document.getElementById('app_header')

        header_div.appendChild(header)

    }

}