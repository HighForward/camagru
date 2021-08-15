import AbstractView from "./abstractView.js";
import {fetch_json} from "../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Creator");
    }

    getHtml() {
        return `<div class='w-full flex flex-row justify-center items-center' style='height: calc(100vh - 4rem)'>
                    <div id="header_info" class="flex flex-row items-center justify-between py-4">
                        <input class="opacity-0 w-0 h-0 absolute" type="file" id="file" accept="image/*">
                        <label class="flex items-center w-48 h-8 border-gray-400 rounded justify-center hover:text-white cursor-pointer" style="background: #2ECC71;" for="file">Select file</label>
                    </div>
                    <canvas id="canvas_creator" width="600px" height="600px"></canvas>
                </div>`
    }

    getView(app) {


        super.getView()

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin', this.getHtml())

        let canvas = document.getElementById("canvas_creator");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function rect(r) {
            ctx.fillStyle=r.fill;
            ctx.fillRect(r.x,r.y,r.width,r.height);
        }

        function clear() {
            ctx.clearRect(0, 0, 600, 600);
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function draw() {
            clear();
            rect(item)
        }

        let item = {x:50, y:50, width:30, height:30, fill:"#444444", selected: true}

        // draw()
        canvas.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const canvas_screen = canvas.getBoundingClientRect()

            let mouse_x = Math.floor(e.x - canvas_screen.left)
            let mouse_y = Math.floor(e.y - canvas_screen.top)

            if ((mouse_x >= item.x && mouse_x <= item.x + item.width) &&
                (mouse_y >= item.y && mouse_y <= item.y + item.height))
            {
                let offsetX = mouse_x - item.x
                let offsetY = mouse_y - item.y

                canvas.onmousemove = (e) => {
                    mouse_x = Math.floor(e.x - canvas_screen.left)
                    mouse_y = Math.floor(e.y - canvas_screen.top)

                    item.x = mouse_x - offsetX
                    item.y = mouse_y - offsetY

                    // draw()
                }
            }
        }

        canvas.onmouseup = (e) => {
            canvas.onmousemove = null
        }

        function ab2str(buf) {
            return String.fromCharCode.apply(null, new Uint16Array(buf));
        }

        document.getElementById('file').addEventListener('change', (e) => {
            e.preventDefault()

            let uploaded = document.getElementById('file').files[0]

            let reader = new FileReader()
            reader.readAsDataURL(uploaded);

            reader.onloadend = () => {
                let data = {
                    imgBase64: reader.result
                }

                let img = new Image()
                img.src = reader.result;
                img.onload = () => ctx.drawImage(img,0,0, img.width, img.height, 0, 0, canvas.width, canvas.height)

                // let resp = await fetch_json('http://localhost:4000/cdn', 'POST', data, true)
            }

        })

    }

}

