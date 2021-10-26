import AbstractView from "./abstractView.js";
import {fetch_get, fetch_json} from "../../app_utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Creator");
    }
    //style='height: calc(100vh - 4rem)'
    // style="background: #ffa000
    // style="background: #830085"
    // style="background: #2ECC71;

    getHtml() {
        return `<div class='flex justify-center items-start' style="min-height: calc(100vh - 4rem); background: #f0f0f0;">
                    <div class="flex mt-4 pt-2 flex-col">
                        <div class="flex flex-row">
                            <canvas style="max-height: 480px" id="canvas_creator" width="640px" height="480px"></canvas>
                            <div id="filtre-panel" class="flex flex-col ml-12">
                                <button class="flex items-center justify-center px-2 font-semibold text-gray-400 hover:text-white" style="background: #0a0a0a">add filtre</button>
                                <div id="filters" class="flex flex-col flex-grow px-2" style="background: #830085"> 
<!--                                    <img src="http://localhost:4000/img/out.png" alt="" id="parcho" class="w-24 h-24">-->
                                </div>  
                            </div>
                        </div>
                        <div class="flex flex-row items-center mt-6 border border-gray-300">
                            <div class="flex flex-1 w-full justify-center">
                                <input class="opacity-0 w-0 h-0 absolute" type="file" id="file" accept="image/*">
                                <label class="hover:text-white cursor-pointer font-semibold text-gray-500" for="file">Choisir une photo</label>
                            </div>
                            <button id="sharebutton" class="flex flex-1 w-full font-semibold justify-center hover:text-white">Partager</button>
                        </div>
                    </div>
                </div>`
    }

    async load_fetch()
    {

    }

    async getView(user, target_user) {

        super.getView()

        let filters = []

        let app_div = document.getElementById('app')
        app_div.insertAdjacentHTML('afterbegin', this.getHtml())

        await this.load_fetch()

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

        // document.getElementById("sharebutton").addEventListener('click', e => {
        //     let img = canvas.toDataURL('image/jpeg', 0.3)
        //     console.log(img)
        //
        //     fetch_json('http://localhost:4000/cdn/post', 'POST', {
        //         imgData: img
        //     }, true).then((res) => {
        //         console.log(res)
        //     })
        // })

        let filters_div = document.getElementById('filters')

        filters_div.insertAdjacentHTML('beforeend',
            `<img id='ok-filter' src="http://localhost:4000/img/red.png" alt="" class="w-24 h-24">`)

        filters_div.insertAdjacentHTML('beforeend',
            `<img id='bird-filter' src="http://localhost:4000/img/red-gold.png" alt="" class="w-24 h-24">`)

        document.getElementById('ok-filter').addEventListener('click', (e) => {
            let imgOk = new Image()
            imgOk.src = 'http://localhost:4000/img/red.png'

            filters.push({x:50, y:50, width:64, height:64, img: imgOk})

            imgOk.onload = () => {
                ctx.drawImage(imgOk, 50, 50, 64, 64)
            }
        })

        document.getElementById('bird-filter').addEventListener('click', (e) => {
            let imgBird = new Image()
            imgBird.src = 'http://localhost:4000/img/red-gold.png'

            filters.push({x:50, y:50, width:64, height:64, img: imgBird})

            imgBird.onload = () => {
                ctx.drawImage(imgBird, 50, 50, 64, 64)
            }
        })


    }

}

