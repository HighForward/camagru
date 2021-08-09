
export default class {

    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    getHtml() {
        return "";
    }

    getView()
    {
        let app = document.getElementById('app')

        if (app.innerHTML !== '')
            app.innerHTML = ''

        if (app.firstChild)
            app.removeChild(app.firstChild)

    }

}