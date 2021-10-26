import AbstractView from "./abstractView.js";
import {fetch_get, fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
    }

    getHtml(user) {
        return `
            <div id='profil_div' class="flex justify-center w-full">
                <div id="info_panel" class="flex rounded border flex-col w-xl max-w-xl m-4 bg-white flex-1 items-center">
                    <div id="header" class="flex w-full justify-around items-center border-b py-2">
                        <a href="/user/${user.username}" class=" left-0 text-sm text-gray-300" style="left: 25px" data-link="">Retour au profil</a>
                        <h1>Paramètre de profil</h1>
                    </div>
                    <form id="settings_form" class="flex pt-4 flex-col">
                            <div id="header_info" class="flex flex-row items-center justify-between py-4">
                                <div id="header_photo" class="flex flex-col">
                                    <div id="img_target" class="rounded-full border" style="width: 64px; height: 64px"></div>
                                 </div>
                                <input class="opacity-0 w-0 h-0 absolute" type="file" id="file" accept="image/*">
                                <label class="flex items-center w-48 h-8 border-gray-400 rounded justify-center hover:text-white cursor-pointer" style="background: #2ECC71;" for="file">Select file</label>
                            </div>
                            
                            <div class="flex flex-row justify-between">
                                <div class="">Nom d’utilisateur</div>
                                <input id="username" class="ml-4 border w-48 pl-1" placeholder="${user.username}" value="${user.username}">
                            </div>
                            <div class="text-sm text-gray-400">Aidez les gens à vous retrouver à l\'aide de ce nom.</div>
                            
                            <div class="flex flex-row justify-between pt-8">
                                <div class="">Email</div>
                                <input id="email" class="ml-4 border w-48 pl-1" placeholder="${user.email}" value="${user.email}">
                            </div>
                            <div class="text-sm text-gray-400">Adresse de contact.</div>
                            
                            <div class="flex flex-row justify-between pt-8">
                                <div class="">Mot de passe</div>
                                <input id="password" class="ml-4 border w-48 pl-1">
                            </div>
                            <div class="text-sm text-gray-400">Gardez celui-ci secret.</div>
                            <button class="border my-8 rounded-md border-text hover:text-primary hover:bg-stroke flex bg-primary text-light w-full items-center font-medium justify-center py-4">Modifier</button>
                        </form>
                </div>
            </div>
        `;
    }

    async getView(user) {

        if (!user) {
            document.location.href = '/login'
            return
        }

        super.getView()

        let app_div = document.getElementById('app')

        app_div.insertAdjacentHTML( 'afterbegin' ,this.getHtml(user))

        let img_target = document.getElementById('img_target')

        let img = await fetch_get(`http://localhost:4000/cdn/profile-picture/${user.username}`)

        img_target.innerHTML = `<img style="width: 64px; height: 64px" class="rounded-full" src="data:image/jpeg;base64,${img.imgBase64}" />`;

        document.getElementById('settings_form').addEventListener('submit', (e) => {

            if (e.preventDefault) e.preventDefault()

            let data = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            }

            fetch_json('http://localhost:4000/users/update', 'POST', data, true).then((e) => {
                if (e.error)
                    notifyHandler.PushNotify('error', e.error)
                if (e.success)
                    notifyHandler.PushNotify('success', e.success)

            }).catch((e) => {
                console.log('error', e)

            })
        })

        document.getElementById('file').addEventListener('change', (e) => {
            e.preventDefault()

            let uploaded = document.getElementById('file').files[0]

            let reader = new FileReader()
            reader.readAsDataURL(uploaded);

            reader.onloadend = async () => {
                console.log(reader.result)
                let img_target = document.getElementById('img_target')

                img_target.innerHTML = '<img style="width: 64px; height: 64px" class="rounded-full" src="' + reader.result + '" />';

                let data = {
                    imgBase64: reader.result
                }

                let resp = await fetch_json('http://localhost:4000/cdn/profile-picture', 'POST', data, true)
            }

        })

    }

}