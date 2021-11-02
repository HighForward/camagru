import AbstractView from "../abstractView/abstractView.js";
import {fetch_get, fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Camagru Feed");
    }

    GetElementInsideContainer(containerID, childID) {
        let element
        let elements = document.getElementById(containerID).getElementsByTagName("*");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === childID) {
                element = elements[i];
                break;
            }
        }
        return element;
    }

    getCommentHtml(comment)
    {
        return `
        <div class="flex flex-row w-full">
            <a href='/user/${comment.username}' class="flex mx-2 font-bold text-white">${comment.username}</a>
            <div class="flex-1 ml-2" style="color: white">${comment.comment}</div>
            <button class="flex flex-initial mr-2 text-red-500 w-8 h-8 font-bold text-3xl items-center justify-center">
                ♥
            </button>
        </div>
        `
    }

    async getView(user) {

        super.getView()
        await this.getHtml()

        let posts = await fetch_get('http://localhost:4000/cdn/post')

        if (posts && posts.length)
        {
            let postNode = await fetch(`http://localhost/views/feed/post.html`).then(async (res) => {
                let text = await res.text()
                let parser = new DOMParser();
                let doc = parser.parseFromString(text, "text/html");
                return (doc.body.firstChild)
            })

            for (let i = 0; i < posts.length; i++)
            {
                let post = posts[i]
                if (post && post.id)
                {
                    let post_img = await fetch_get(`http://localhost:4000/cdn/post/${post.id}`)
                    let img

                    img = `data:image/png;base64,${post_img.imgBase64}`

                    let post_id = document.createElement('div')
                    post_id.id = `post-${i}`

                    post_id.appendChild(postNode.cloneNode(true))
                    document.getElementById('feedContainer').insertAdjacentElement('afterbegin', post_id)

                    this.GetElementInsideContainer(`post-${i}`, 'post_user').innerHTML = `<a href='/user/${post_img.author}'>${post_img.author}</a>`
                    this.GetElementInsideContainer(`post-${i}`, 'imgFeed').src = img

                    fetch_get(`http://localhost:4000/comments/post/${post.id}`).then((e) => {
                        if (e) {
                            let commentsDiv = this.GetElementInsideContainer(`post-${i}`, `comments`)
                            e.forEach((e) => {
                                commentsDiv.insertAdjacentHTML('beforeend', this.getCommentHtml(e))
                            })
                        }
                    })

                    this.GetElementInsideContainer(`post-${i}`, `comments`).insert

                    this.GetElementInsideContainer(`post-${i}`, 'commentButton').addEventListener('click', () => {
                        if (user)
                        {
                            let commentInput = this.GetElementInsideContainer(`post-${i}`, 'commentInput')
                            let comment = fetch_json('http://localhost:4000/comments', 'POST', {
                                comment: commentInput.value,
                                post_id: post.id
                            }, true).then((postback) => {
                                console.log(postback)
                                if (postback.error)
                                    return null

                                let comment_container = this.GetElementInsideContainer(`post-${i}`, 'comments')
                                comment_container.insertAdjacentHTML('beforeend', this.getCommentHtml(postback))
                                commentInput.value = ''
                            })
                        }
                        else
                            notifyHandler.PushNotify('error', 'Tu doit être connecté pour commenter un poste')
                })

                }
            }
        }
    }
}