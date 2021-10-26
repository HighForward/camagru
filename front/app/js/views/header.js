import AbstractView from "./abstractView.js";

export default class extends AbstractView {

    connected = false

    constructor(params) {
        super(params);
    }

    updateOnlineStateHeader(online_state, user)
    {
        let header_left = document.getElementById('online_state_header')

        if (this.connected !== online_state)
            header_left.innerHTML = ''

        if (this.connected !== online_state && online_state)
        {
            header_left.insertAdjacentHTML('afterbegin', `<a href="/logout" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Déconnexion</a>`)
            header_left.insertAdjacentHTML('afterbegin', `<a href="/user/${user.username}" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-4" style="background: #2ECC71;" data-link>Profil</a>`)
        }

        if (!online_state && header_left.innerHTML === '')
            header_left.insertAdjacentHTML('afterbegin', `<a href="/login" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Connexion</a>`)

        this.connected = online_state
    }

    getHtml() {
        return `
        <div class="fixed flex w-screen h-16 border justify-between items-center border-b" style="background: white">
            <div class="flex flex-row">
                <a href="/" class="flex justify-center text-center ml-16 font-semibold" data-link>Camagru</a>
                <a href="/feed" class="flex justify-center text-center ml-16 font-semibold" data-link>Feed</a>
                <a href="/creator" class="flex justify-center text-center ml-16 font-semibold" data-link>Creator</a>
            </div>
            <div id="online_state_header" class="flex flex-row"></div>
        </div>
        `;
    }

    getView(user) {

        super.getView()

        let header_div = document.getElementById('app_header')


        header_div.insertAdjacentHTML('afterbegin', this.getHtml())

    }

}