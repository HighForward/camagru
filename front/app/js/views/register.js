import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register to Camagru");
    }

    getHtml() {
        return `
            <div class="flex items-center justify-center w-full" style="height: calc(100vh - 4rem)">
                <div class="fixed pt-16" style="top: 30px; left: 30px">
                    <a href="/" data-link>< Retour</a>
                </div>
                <div class="flex flex-col justify center bg-white p-4 rounded shadow w-96">
                    <h1 class="text-2xl text-text text-center my-8 font-medium">Login to <span class="text-secondary">Camagru</span></h1>
                    <div>
                        <form name="register" id="form_register" class="flex flex-col m-2 text-xl">
                            <input class="rounded-md border border-text w-full mb-6 p-2">
                            <input class="rounded-md border border-text w-full mb-6 p-2">
                            <input class="rounded-md border border-text w-full mb-6 p-2">
                            <div class="font-light text-sm mb-6 text-center">
                                tu as déjà un profil ? connecte toi <a href="/auth/login.html" class="text-primary font-semibold">ici</a> !
                            </div>
                            <button class="border rounded-md border-text hover:text-primary hover:bg-stroke flex bg-primary text-light w-full items-center font-medium justify-center py-4">
                                Je m'enregistre
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `
    }

    async getView(app) {

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin', '<div id="log_1" class="flex items-center justify-center w-full" style="height: calc(100vh - 4rem)"</div>')
        document.getElementById('log_1').insertAdjacentHTML('afterbegin', '<div id="log_2" class="flex flex-col justify center bg-white p-4 rounded shadow w-96">')
        document.getElementById('log_2').insertAdjacentHTML('afterbegin', '<h1 class="text-2xl text-text text-center my-8 font-medium">Login to <span class="text-secondary">Camagru</span></h1>\n')
        document.getElementById('log_2').insertAdjacentHTML('beforeend', '<form id="form_register" class="flex flex-col m-2 text-xl"></form>')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="username" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="password" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<input id="confirm_password" class="rounded-md border border-text w-full mb-6 p-2">')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<div class="font-light text-sm mb-6 text-center">tu as déjà un profil ? connecte toi <a href="/auth/login.html" class="text-primary font-semibold">ici </a>!</div>')
        document.getElementById('form_register').insertAdjacentHTML('beforeend', '<button class="border rounded-md border-text hover:text-primary hover:bg-stroke flex bg-primary text-light w-full items-center font-medium justify-center py-4">Je m\'enregistre</button>')

        document.getElementById('form_register').addEventListener("submit", async (e) => await perform_register(e))
    }

}

async function perform_register(e) {

    if (e.preventDefault) e.preventDefault()

        let data = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            confirm_password: document.getElementById('confirm_password').value
        }

        fetch('http://localhost:4000/auth/register', {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }).then(async (res) => {
            let result = await res.json()
            console.log(result.token)
            document.cookie = `jwt:${result.token}`
            console.log(document.cookie)
        }).then((e) => {

        })
        return false
}

