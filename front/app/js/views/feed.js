import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Camagru Feed");
    }

    getHtml() {
        return `
            <div class="flex flex-col items-center w-full pb-8 " style="height: calc(100vh - 4rem)">
                <div class="mt-8 post_container rounded-lg border border-gray-300 bg-white">
                    <div class="flex w-full items-center h-8">
                        <h1 class="pl-4 font-bold">forward</h1>
                    </div>
                    <img src="../assets/img/chat.jpg" alt="" class="img_class">
                    <div>
                        <nav class="pl-4">
                            <a class="px-2" href="#">Like</a>
                            <a class="px-2" href="#">Commente</a>
                        </nav>
                        <form id="my-form2">
                            <input type="text">
                            <button type="submit">submit</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getView(app) {
        let app_div = document.getElementById('app')
        app_div.innerHTML = this.getHtml()
    }

}