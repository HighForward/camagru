import AbstractView from "../abstractView/abstractView.js";
import {fetch_get} from "../../../app_utils.js";

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

    async getView(user) {

        super.getView()
        await this.getHtml()

        let posts = await fetch_get('http://localhost:4000/cdn/post')

        if (posts && posts.length)
        {
            posts.reverse()
            let postNode = await fetch(`http://localhost/js/views/feed/post.html`).then(async (res) => {
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
                    document.getElementById('feedContainer').insertAdjacentElement('beforeend', post_id)

                    this.GetElementInsideContainer(`post-${i}`, 'post_user').innerHTML = post_img.author
                    this.GetElementInsideContainer(`post-${i}`, 'imgFeed').src = img

                }
            }
        }
    }
}