import AbstractView from "../abstractView/abstractView.js";
import {fetch_get, fetch_json} from "../../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Creator");
    }

    async getView(user, target_user) {

        super.getView()
        await this.getHtml()




        let filters = []
        let imageBase = undefined;

        let canvas = document.getElementById("canvas_creator");
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function drawImg(filters) {
            if (filters)
            {
                filters.forEach((filter) => {
                    ctx.drawImage(filter.img, filter.x, filter.y, filter.width, filter.height)

                })
            }
        }

        function clear() {
            ctx.clearRect(0, 0, 600, 600);
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function draw() {
            clear();
            if (imageBase)
            {
                ctx.drawImage(imageBase,0,0, imageBase.width, imageBase.height, 0, 0, canvas.width, canvas.height)
            }
            drawImg(filters)
        }

        draw()


        canvas.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const canvas_screen = canvas.getBoundingClientRect()

            let mouse_x = Math.floor(e.x - canvas_screen.left)
            let mouse_y = Math.floor(e.y - canvas_screen.top)

            let img_target_index = filters.findIndex((filter) => { return (mouse_x >= filter.x && mouse_x <= filter.x + filter.width) &&
            (mouse_y >= filter.y && mouse_y <= filter.y + filter.height) })

                if (img_target_index !== -1)
                {
                    let img_target = filters.at(img_target_index)
                    filters.splice(img_target_index, 1)
                    filters.push(img_target)
                    let offsetX = mouse_x - img_target.x
                    let offsetY = mouse_y - img_target.y

                    canvas.onmousemove = (e) => {
                        mouse_x = Math.floor(e.x - canvas_screen.left)
                        mouse_y = Math.floor(e.y - canvas_screen.top)

                        img_target.x = mouse_x - offsetX
                        img_target.y = mouse_y - offsetY
                        draw()
                    }
                }
        }

        canvas.onmouseup = (e) => {
            canvas.onmousemove = null
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

                imageBase = new Image()
                imageBase.src = reader.result;
                imageBase.onload = () => {
                    ctx.drawImage(imageBase,0,0, imageBase.width, imageBase.height, 0, 0, canvas.width, canvas.height)
                    draw()
                }
            }

        })

        document.getElementById("sharebutton").addEventListener('click', e => {
            let img = canvas.toDataURL('image/jpeg')
            // console.log(img)
        //
            fetch_json('http://localhost:4000/cdn/post', 'POST', {
                imgData: img
            }, true).then((res) => {
                console.log(res)
            })
        })

        let filters_div = document.getElementById('filters')

        filters_div.insertAdjacentHTML('beforeend',
            `<img crossorigin="anonymous" id='ok-filter' src="http://localhost:4000/img/red.png" alt="" class="w-24 h-24">`)

        filters_div.insertAdjacentHTML('beforeend',
            `<img crossorigin="anonymous" id='bird-filter' src="http://localhost:4000/img/red-gold.png" alt="" class="w-24 h-24">`)

        document.getElementById('ok-filter').addEventListener('click', (e) => {
            let imgOk = new Image()
            imgOk.src = 'http://localhost:4000/img/red.png'
            imgOk.crossOrigin = 'Anonymous';
            filters.push({x:50, y:50, width:64, height:64, img: imgOk})

            imgOk.onload = () => {
                ctx.drawImage(imgOk, 50, 50, 64, 64)
            }
        })

        document.getElementById('bird-filter').addEventListener('click', (e) => {
            let imgBird = new Image()
            imgBird.src = 'http://localhost:4000/img/red-gold.png'
            imgBird.crossOrigin = 'Anonymous';
            filters.push({x:50, y:50, width:64, height:64, img: imgBird})

            imgBird.onload = () => {
                ctx.drawImage(imgBird, 50, 50, 64, 64)
            }
        })


    }

}

