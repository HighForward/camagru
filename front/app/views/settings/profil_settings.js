import AbstractView from "../abstractView/abstractView.js";
import {checkEmail, checkPasswordUsername, fetch_get, fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
    }

    async fetch_profile_picture(user)
    {
        let img = await fetch_get(`http://localhost:4000/cdn/profile-picture/${user.username}`)
        if (!img.error)
        {
            let img_target = document.getElementById('img_target')
            img_target.innerHTML = `<img style="width: 128px; height: 128px" class="rounded-full" src="data:image/jpeg;base64,${img.imgBase64}" />`;
        }
    }

    setSettingsInfos(user)
    {
        let username = document.getElementById('username')
        username.value = user.username
        username.placeholder = user.username

        let email = document.getElementById('email')
        email.value = user.email
        email.placeholder = user.email

        let backProfile = document.getElementById('backProfile')
        backProfile.href = `/user/${user.username}`
    }

    async getView(user) {

        if (!user) {
            document.location.href = '/login'
            return
        }

        super.getView()
        await this.getHtml()

        await this.fetch_profile_picture(user)

        this.setSettingsInfos(user)

        document.getElementById('settings_form').addEventListener('submit', (e) => {

            if (e.preventDefault) e.preventDefault()


            let data = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                mailer: document.getElementById('mailoncomments').checked
            }

            if (!checkEmail(data.email) && data.email !== "") {
                notifyHandler.PushNotify('error', 'L\'adresse email est incorrecte')
                return
            }
            if (!checkPasswordUsername(data.username) && data.username !== "") {
                notifyHandler.PushNotify('error', 'Le nom d\'utilisateur est incorrecte')
                return
            }

            if (!checkPasswordUsername(data.password) && data.password !== "") {
                notifyHandler.PushNotify('error', 'Le mot de passe est incorrecte')
                return
            }

            fetch_json('http://localhost:4000/users/update', 'POST', data, true).then((e) => {
                if (e.error)
                    notifyHandler.PushNotify('error', e.error)
                if (e.success)
                    notifyHandler.PushNotify('success', e.success)

            }).catch((e) => {
            })
        })

        let mailer = document.getElementById('mailoncomments')
        await fetch_get('http://localhost:4000/users/mailer').then((val) => {
            mailer.checked = val
        })

        document.getElementById('file').addEventListener('change', (e) => {
            e.preventDefault()

            let uploaded = document.getElementById('file').files[0]

            if (uploaded)
            {
                const { name: fileName, size: fileSize } = uploaded;
                const fileExtension = fileName.split(".").pop();

                if ((fileExtension !== 'png' && fileExtension !== 'PNG') || fileSize > 5000000)
                {
                    notifyHandler.PushNotify('error', 'Le format doit être en .png et 3Mo maximum')
                    return
                }

                let reader = new FileReader()
                reader.readAsDataURL(uploaded);

                reader.onloadend = async () => {
                    let img_target = document.getElementById('img_target')

                    img_target.innerHTML = '<img style="width: 128px; height: 128px" class="rounded-full" src="' + reader.result + '" />';

                    let data = {
                        imgBase64: reader.result
                    }
                    let resp = await fetch_json('http://localhost:4000/cdn/profile-picture', 'POST', data, true)
                }
            }
        })
    }
}