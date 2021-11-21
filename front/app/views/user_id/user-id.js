import AbstractView from "../abstractView/abstractView.js";
import {fetch_get, fetch_json} from "../../app_utils.js";

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

            header_profile.insertAdjacentHTML('beforeend', `<a href="/settings" class=" stat flex items-center justify-center hover:text-white bg-gray-200 p-1 px-2 rounded" data-link>Settings</a>`)
        }
    }

    async  setProfilePicture(target_user)
    {
        if (target_user)
        {
            let img = await fetch_get(`http://localhost:4000/cdn/profile-picture/${target_user.username}`)
            if (!img.error)
            {
                let profile_picture = document.getElementById('profile-picture')
                if (profile_picture)
                    profile_picture.innerHTML = `<img style="object-fit: cover;" class="profile_picture_img rounded-full" src="data:image/png;base64,${img.imgBase64}" />`;
            }
        }
    }

    async createDivPost(post, target_user, user)
    {
        if (post && post.id && post.imgBase64) {
            let div = document.createElement('div')
            div.id = `post-wrap-${post.id}`
            div.className += 'img-wrap z-10'

            if (target_user && user && target_user.id === user.id)
                div.insertAdjacentHTML('beforeend', `<button id="delete-post-${post.id}" class="close flex items-center justify-center h-4 w-4 font-bold text-red-400 z-10">&times;</button>`)
            div.insertAdjacentHTML('beforeend', `<img class="relative flex justify-center w-full" style="" src="data:image/png;base64,${post.imgBase64}">`)
            return div
        }
        return null
    }

    async setPosts(target_user, user)
    {
        let gallery = document.getElementById('gallery')

        let posts = await fetch_get(`http://localhost:4000/cdn/post/user/${target_user.username}`)
        if (posts && posts.length) {
            let posts_data = posts.map(async (post) => {
                return await fetch_get(`http://localhost:4000/cdn/post/${post.id}`)
            })


            posts_data = await Promise.all(posts_data.filter(item => {
                return !item.error
            }))

            gallery.innerHTML = ''

            for (const post of posts_data) {

                let createdPost = await this.createDivPost(post, target_user, user)
                if (createdPost) {

                    gallery.appendChild(createdPost)

                    if (target_user && user && target_user.id === user.id) {
                        document.getElementById(`delete-post-${post.id}`).addEventListener('click', async () => {
                            await fetch_json(`http://localhost:4000/cdn/post/${post.id}`, 'DELETE', undefined, true).then(async e => {

                                let res = e
                                console.log(res)
                                if (res.success) {
                                    let toDelete = document.getElementById(`post-wrap-${post.id}`)
                                    toDelete.parentNode.removeChild(toDelete)
                                }
                            })
                        })
                    }
                }
            }

        }
        else
        {}


    }

    getStats(user)
    {
        const stats = document.getElementById('stats')
        stats.insertAdjacentHTML('beforeend', `<div class="stat">${user.likes} likes 👍</div>`)
        stats.insertAdjacentHTML('beforeend', `<div class="stat">${user.posts} posts 🖼</div>`)
        stats.insertAdjacentHTML('beforeend', `<div class="stat">${user.comments} comments 💬</div>`)
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

        await this.setPosts(target_user, user)

        await this.getStats(target_user)

    }

}