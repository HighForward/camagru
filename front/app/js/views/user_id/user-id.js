import AbstractView from "../abstractView/abstractView.js";
import {fetch_get} from "../../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Page");
    }

    setHeaderProfile(user, target_user) {

        let profile_username =  document.getElementById('profile_username')
        profile_username.innerHTML = `${target_user.username}`
        if (user && target_user && target_user.id === user.id)
        {
            let header_profile =  document.getElementById('header_profile')

            header_profile.insertAdjacentHTML('beforeend', `<a href="/settings" class="flex items-center justify-center hover:text-white bg-gray-200 px-2 rounded" data-link>Settings</a>`)
        }
    }

    async  setProfilePicture(target_user)
    {
        if (target_user)
        {
            let img = await fetch_get(`http://localhost:4000/cdn/profile-picture/${target_user.username}`)
            let profile_picture = document.getElementById('profile-picture')
            profile_picture.innerHTML = `<img style="width: 96px; height: 96px" class="rounded-full" src="data:image/png;base64,${img.imgBase64}" />`;
        }
    }

    async setPosts(target_user)
    {
        let gallery = document.getElementById('galerie')

        let posts = await fetch_get(`http://localhost:4000/cdn/post/user/${target_user.username}`)

        if (!posts.error && posts.length)
        {
            for (let i = 0; i < posts.length; i++)
            {
                let post = await fetch_get(`http://localhost:4000/cdn/post/${posts[i].id}`)
                gallery.insertAdjacentHTML('beforeend', `<img class="flex justify-center h-32 w-32" src="data:image/png;base64,${post.imgBase64}">`)
            }
        }
        else if (!posts.error)
        {
            console.log('0 post')
        }
        else
        {

        }

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
        await this.getHtml()

        this.setHeaderProfile(user, target_user)

        await this.setProfilePicture(target_user)

        await this.setPosts(target_user)

    }

}