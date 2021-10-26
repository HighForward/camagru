import AbstractView from "./abstractView.js";
import {fetch_get} from "../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Page");
    }

    isSameUser(user, target_user)
    {
        if (user && target_user && target_user.id === user.id) {
            return true
        }
        return false
    }

    getSettingButton(user, target_user) {
        if (this.isSameUser(user, target_user))
            return `
            <a href="/settings" class="flex items-center justify-center hover:text-white bg-gray-200 px-2 rounded" data-link>Settings</a>
            `
        return ``
    }

    getHtml(user, target_user) {

        // let html = `
        //     <div class="flex flex-col items-center w-full text-3xl font-bold" style="height: calc(100vh - 4rem); padding-top: 8rem">
        //         <h1>${target_user.username}</h1> `
        //
        // if (this.isSameUser(user, target_user)) {
        //     html += `<a href="/settings" class="flex items-center justify-center w-36 bg-gray-200 text-white" data-link>Settings</a>`
        // }
        //
        // html += '</div>'

        let html = `
            <div class="w-full flex justify-center" style="min-height: calc(100vh - 4rem)">
                <div class="flex flex-col bg-white border rounded m-4">
                    <div class="flex flex-row justify-around m-4">
                        <div id="profile-picture" class="w-24 h-24"></div>
                        <div class="flex-1">
                        <div class="flex flex-row justify-around">
                            <div class="font-bold text-lg">` + target_user.username + `</div>
                            ` + this.getSettingButton(user, target_user) + `
                        </div>
                        <div class="px-2">Biography</div>
                        </div>
                    </div>                
                    <div class="grid grid-cols-3 gap-2 mx-4">
                        <div class="bg-gray-400 flex justify-center h-32 w-32">a</div>
                        <div class="bg-gray-400 flex justify-center h-32 w-32">a</div>
                        <div class="bg-gray-400 flex justify-center h-32 w-32">a</div>
                        <div class="bg-gray-400 flex justify-center h-32 w-32">a</div>
                        <div class="bg-gray-400 flex justify-center h-32 w-32">a</div>
                        <div class="bg-gray-400 flex justify-center h-32 w-32">a</div>
                    </div>
                </div>
            </div>
        `


        return html
    }

    async getView(user, param) {


        let target_user = await fetch_get(`http://localhost:4000/users/${param}`).then(e => {
            return e
        }).catch(e => {
            return null
        })


        if (!target_user || target_user.error) {

            document.location.href = '/'
            return
        }

        super.getView()

        let app_div = document.getElementById('app')

        app_div.insertAdjacentHTML("afterbegin", this.getHtml(user, target_user))


        if (target_user)
        {
            let img = await fetch_get(`http://localhost:4000/cdn/profile-picture/${target_user.username}`)
            let profile_picture = document.getElementById('profile-picture')

            profile_picture.innerHTML = `<img style="width: 96px; height: 96px" class="rounded-full" src="data:image/png;base64,${img.imgBase64}" />`;

        }

        // app_div.innerHTML = this.getHtml()

    }

}