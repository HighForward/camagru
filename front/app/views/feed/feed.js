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
            <a href='/user/${comment.username}' class="flex mx-2 font-bold text-white" data-link>${comment.username}</a>
            <div class="flex-1 ml-2" style="color: white">${comment.comment}</div>
        </div>
        `
    }

    fetchLikeButton(post, user, i)
    {

        let likeButton = this.GetElementInsideContainer(`post-${i}`, 'likeButton')

        let setValue = (value) => {
            if (value === true)
                likeButton.innerHTML = 'Je n\'aime plus 💔'
            else if (value === false)
                likeButton.innerHTML = 'J\'aime ♥'
        }

        if (user) {
            fetch_json('http://localhost:4000/likes/isliked', 'POST', {
                post_id: post.id,
                user_id: user.id
            }, true).then((e) => {
                if (!e.error)
                    setValue(e)
            })
        }

        likeButton.addEventListener('click', () => {

            if (!user) {
                notifyHandler.PushNotify('error', `Tu dois te connecter pour aimer une photo`)
                return
            }

            fetch_json('http://localhost:4000/likes', 'POST', {
                post_id: post.id,
                user_id: user.id
            }, true).then(e => {
                if (!e.error)
                    setValue(e)
            })
        })
    }

    async fetchComments(post, i) {
        fetch_get(`http://localhost:4000/comments/post/${post.id}`).then((e) => {
            if (e) {
                let commentsDiv = this.GetElementInsideContainer(`post-${i}`, `comments`)
                e.forEach((e) => {
                    commentsDiv.insertAdjacentHTML('beforeend', this.getCommentHtml(e))
                })
            }
        })
    }

    async performComments(post, user, i)
    {
        this.GetElementInsideContainer(`post-${i}`, 'commentButton').addEventListener('click', () => {
            if (user) {
                let commentInput = this.GetElementInsideContainer(`post-${i}`, 'commentInput')
                fetch_json('http://localhost:4000/comments', 'POST', {
                    comment: commentInput.value,
                    post_id: post.id
                }, true)
                    .then((postback) => {
                        if (postback.error)
                            return null

                        let comment_container = this.GetElementInsideContainer(`post-${i}`, 'comments')
                        comment_container.insertAdjacentHTML('beforeend', this.getCommentHtml(postback))
                        commentInput.value = ''
                    })
                }
                else
                    notifyHandler.PushNotify('error', 'Tu dois te connecter pour commenter un poste')
        })
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

            posts.reverse()

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
                    document.getElementById('feedContainer').insertAdjacentElement('beforeend', post_id)

                    this.GetElementInsideContainer(`post-${i}`, 'post_user').innerHTML = `<a href='/user/${post_img.author}'>${post_img.author}</a>`
                    this.GetElementInsideContainer(`post-${i}`, 'imgFeed').src = img

                    await this.fetchLikeButton(post, user, i)

                    await this.fetchComments(post, i)

                    await this.performComments(post, user, i)



                }
            }
        }
    }
}