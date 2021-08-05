// frontend/static/js/views/AbstractView.js

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

    getView(app)
    {
    }

}