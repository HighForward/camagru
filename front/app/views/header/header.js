import AbstractView from "../abstractView/abstractView.js";
import {fetch_get} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {

    connected = false
    classList = 'fixed left-0 bottom-0 w-0 overflow-hidden bg-gray-200 z-20 '

    constructor(params) {
        super(params);
        this.last_size = 0
        this.sidebar_state = 0
    }

    insertSearchBar()
    {
        return `
                <div class="relative w-full" style="">
                    <input class='mr-4 px-4 py-2 h-full searchbar' id='searchUser' placeholder='Recherche un utilisateur'>
                    <div id="list-box" class="absolute searchbar">
                        
                    </div>
                </div>
        `
    }

    userDivHTML(user) {
        let img
        if (!user.imgBase64)
            img = `<div class="rounded-full p-1" style="width: 32px; height: 32px;"></div>`
        else
            img = `<img alt="" class="rounded-full p-1" src="data:image/png;base64,${user.imgBase64}" style="width: 32px; height: 32px">`

        return `
        <div id='userfound-${user.username}' class="flex justify-between w-full hover:bg-gray-200 bg-white items-center cursor-pointer">` +
            img + `
            <a class="pr-2">${user.username}</a>
        </div>
        `
    }

    insertUsersFounds(users)
    {

        let list = document.getElementById('list-box')
        list.innerHTML = ''
        users.forEach((user) =>  {
            list.insertAdjacentHTML('afterbegin', this.userDivHTML(user))
            document.getElementById(`userfound-${user.username}`).addEventListener('click',() => {
                location.href = `/user/${user.username}`
            })
        })
    }

    updateOnlineStateHeader(user)
    {
        let online_state = (!!user)

        let online_right = document.getElementById('online_state_header')

        if (this.connected !== online_state) {
            online_right.innerHTML = ''
        }

        if (this.connected !== online_state && online_state) {
            online_right.insertAdjacentHTML('afterbegin', `<a href="/logout" class=" mr-8 flex justify-center px-4 py-2 rounded text-center" style="background: #2ECC71;" data-link>Déconnexion</a>`)
            online_right.insertAdjacentHTML('afterbegin', this.insertSearchBar())
        }

        if (!online_state && online_right.innerHTML === '') {
            online_right.insertAdjacentHTML('afterbegin', `<a href="/login" class=" mr-4 flex justify-center px-4 py-2 rounded text-center" style="background: #2ECC71;" data-link>Connexion</a>`)
            online_right.insertAdjacentHTML('afterbegin', `<a href="/register" class="mr-4 flex justify-center px-4 py-2 rounded text-center" style="background: #2ECC71;" data-link>S'inscrire</a>`)
            online_right.insertAdjacentHTML('afterbegin', this.insertSearchBar())
        }

        // online_right.insertAdjacentHTML('afterbegin', this.insertSearchBar())


        document.getElementById('searchUser').addEventListener('input', async (e) => {
            let list = document.getElementById('list-box')
            list.innerHTML = ''
            if (e.target.value.length >= 3)
            {
                let users = await fetch(`http://localhost:4000/users/search/${e.target.value}`).then((res) => {
                    return res.json()
                }).catch((e) => {
                    if (e.error)
                        return ({ error: e.error })
                    return ({ error: e})
                })

                if (e.error)
                    notifyHandler.PushNotify('error', 'error')

                if (users && users.length)
                {
                    this.insertUsersFounds(users)
                }

            }
        })

        document.getElementById("list-box")

        this.toggleLeftSide(user)
        this.connected = online_state
    }

    onClickATags(trigger)
    {
        let elms = document.querySelectorAll("[id='item_nav']");
        if (trigger) {
            let main_div = document.getElementById('sidebar')
            main_div.className = this.classList + 'invisible transition-all duration-300'
        }
        else
        {
            for (let i = 0; i < elms.length; i++) {
                elms[i].onclick = null
            }
        }
    }

    insertNav(element, user, string)
    {
        element.insertAdjacentHTML('beforeend', `<a id="item_nav" href="/" class="flex justify-center text-center font-semibold ` + string + `" style="color: #2ECC71;" data-link>Camagru</a>`)
        element.insertAdjacentHTML('beforeend', `<a id="item_nav" href="/feed" class="flex justify-center text-center font-semibold ` + string + `" style="color: #2ECC71;" data-link>Feed</a>`)
        if (user) {
            element.insertAdjacentHTML('beforeend', `<a id="item_nav" href="/creator" class="flex justify-center text-center font-semibold ` + string + `" style="color: #2ECC71;" data-link>Creator</a>`)
            element.insertAdjacentHTML('beforeend', `<a id="item_nav" href="/user/${user.username}" class="flex justify-center text-center font-semibold ` + string + `" style="color: #2ECC71;" data-link>Profil</a>`)
        }

        if (this.sidebar_state) {
            this.onClickATags(true)
            this.sidebar_state = !this.sidebar_state
        }
        else
            this.onClickATags(false)

    }

    toggleLeftSide(user)
    {
        let header_nav = document.getElementById('header_nav')
        if (window.innerWidth > 768)
        {
            if (this.last_size && this.last_size > 768)
                return
            if (this.last_size <= 780)
                document.getElementById('sidebar').className = this.classList + 'invisible transition-all duration-300'
            header_nav.innerHTML = ''

            this.last_size = window.innerWidth

            this.insertNav(header_nav, user, 'pl-8')
        }

        if (window.innerWidth <= 768)
        {
            if (this.last_size && this.last_size <= 768)
                return

            header_nav.innerHTML = ''

            this.last_size = window.innerWidth

            header_nav.insertAdjacentHTML('beforeend', '<button id="burger" class="pl-8 flex justify-center text-center font-semibold" style="color: #2ECC71;">Burger</button>')

            document.getElementById('burger').addEventListener('click', (e) => {

                let main_div = document.getElementById('sidebar')
                if (!this.sidebar_state)
                    main_div.className = this.classList + 'right-0 w-full visible transition-all duration-300'
                else
                    main_div.className = this.classList + 'invisible transition-all duration-300'

                this.sidebar_state = !this.sidebar_state
            })

        }
    }

    async createSideBar(user)
    {
        let main_div = document.createElement('div')
        main_div.id = 'sidebar'
        main_div.className = this.classList + 'invisible'
        main_div.style.top = 'var(--header-size)'
        main_div.style.background = 'var(--primary-color)'
        let nav = document.createElement('div')
        nav.className = "flex flex-col items-center text-3xl text-white w-full"


        this.insertNav(nav, user, ' py-8')
        main_div.appendChild(nav)
        document.getElementById('body').insertAdjacentElement('beforeend', main_div)

        window.addEventListener('resize', (e) => {
            this.toggleLeftSide(user)
        })

        main_div.getElementsByTagName('a')
    }

    async getView(user) {

        super.getView()

        let header = await this.fetch_html('views/header/header.html')
        let header_div = document.getElementById('app_header')
        header_div.appendChild(header)
    }

}