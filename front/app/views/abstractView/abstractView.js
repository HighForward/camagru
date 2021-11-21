
export default class {

    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    async fetch_html(path)
    {
        return await fetch(`http://localhost/${path}`).then(async (res) => {
            let text = await res.text()
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, "text/html");
            return (doc.body.firstChild)
        })
    }

    async getHtml() {
        let app_div = document.getElementById('app')
        let html = await this.fetch_html(this.params.file_path)
        app_div.appendChild(html)
    }

    getView()
    {
        let app = document.getElementById('app')

        if (app.innerHTML !== '')
            app.innerHTML = ''

        window.onscroll = null
    }

}