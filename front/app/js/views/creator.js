import AbstractView from "./abstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Creator");
    }

    getHtml() {

    }

    getView(app) {

        super.getView()

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin',"<div id='main_creator' class='w-full flex flex-row justify-center items-center' style='height: calc(100vh - 4rem)'>")
        document.getElementById('main_creator').insertAdjacentHTML('afterbegin',"<input type='file'>")
        document.getElementById('main_creator').insertAdjacentHTML('beforeend',"<div id='creator_1' class=''>")
        document.getElementById('creator_1').insertAdjacentHTML('afterbegin', '<canvas id="canvas_creator" width="600px" height="600px"></canvas>')

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

        draw()
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

                    draw()
                }
            }
        }

        canvas.onmouseup = (e) => {
            canvas.onmousemove = null
        }

    }

}

