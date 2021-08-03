import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register to Camagru");
    }

    getHtml() {
        return `
            <div class="flex items-center justify-center w-full" style="height: calc(100vh - 4rem)">
                <div class="fixed pt-16" style="top: 30px; left: 30px">
                    <a href="/" data-link>< Retour</a>
                </div>
                <div class="flex flex-col justify center bg-fullwhite p-4 rounded shadow w-96">
                    <h1 class="text-2xl text-text text-center my-8 font-medium">Login to <span class="text-secondary">Camagru</span></h1>
                    <form  class="flex flex-col m-2 text-xl">
                        <input class="rounded-md border border-text w-full mb-6 p-2">
                        <input class="rounded-md border border-text w-full mb-6 p-2">
                        <input class="rounded-md border border-text w-full mb-6 p-2">
                        <div class="font-light text-sm mb-6 text-center">
                            tu as déjà un profil ? connecte toi <a href="/auth/login.html" class="text-primary font-semibold">ici</a> !
                        </div>
                        <button class="border rounded-md border-text hover:text-primary hover:bg-stroke flex bg-primary text-light w-full items-center font-medium justify-center py-4">
                            Je m'enregistre
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
}