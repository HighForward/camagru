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
        // let app_div = document.getElementById('app')
        // app_div.innerHTML = this.getHtml()

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin',"<div id='creator_1' class='w-full flex justify-center items-center text-3xl font-bold' style='height: calc(100vh - 4rem)'>")
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

        let BB = canvas.getBoundingClientRect();
        let offsetX = BB.left;
        let offsetY = BB.top;
        let startmx
        let startmy

        let item = {x:50, y:50, width:30, height:30, fill:"#444444", selected: true}

        draw()
        canvas.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log(e.clientX)

            let mx = parseInt(e.clientX - offsetX);
            let my = parseInt(e.clientY - offsetY);

            startmx = mx
            startmy = my

            let x = e.clientX
            let y = e.clientY
            console.log(e.clientX, e.clientY)
        }

        canvas.onmousemove = (e) => {

            e.preventDefault();
            e.stopPropagation();

            let mx = parseInt(e.clientX - offsetX);
            let my = parseInt(e.clientY - offsetY);
            console.log(mx, my)

            let dx = mx-startmx;
            let dy = my-startmy;
            item.x = dx
            item.y = dy

            draw();
        }
    }

}

// document.getElementById('creator_1').insertAdjacentHTML('afterbegin', '<div id="drag_div" class="absolute bg-black" style="width: 600px; height: 600px;"></div>')
// document.getElementById('drag_div').insertAdjacentHTML('afterbegin', '<div id="creator_drag" class="absolute bg-gray-300 cursor-move" style="width: 100px; height: 100px;"></div>')


/*let mouse_x
let mouse_y
let pos_x
let pos_y

document.getElementById('creator_drag').onmousedown = (e) => {
    e.preventDefault();
    mouse_x = e.clientX
    mouse_y = e.clientY
    document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    document.onmousemove = (e) => {
        e.preventDefault();
        pos_x = mouse_x - e.clientX;
        pos_y = mouse_y - e.clientY;
        mouse_x = e.clientX
        mouse_y = e.clientY
        // console.log(mouse_x, mouse_y)
        document.getElementById('creator_drag').style.top = (document.getElementById('creator_drag').offsetTop - pos_y) + "px";
        document.getElementById('creator_drag').style.left = (document.getElementById('creator_drag').offsetLeft - pos_x) + "px";
    }
};*/