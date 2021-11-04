import AbstractView from "../abstractView/abstractView.js";
import {fetch_json} from "../../app_utils.js";
import {notifyHandler} from "../../app.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Creator");
    }

    async getView(user, target_user) {

        if (!user)
            document.location.href = '/'

        super.getView()
        await this.getHtml()


        let filters = []
        let imageBase = undefined;
        let videoBase = undefined
        let videoInterval
        let cameraButtonState = 0

        let canvas = document.getElementById("canvas_creator");
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        let camera_button = document.getElementById("start-camera");

        function drawImg(filters) {
            if (filters)
            {
                filters.forEach((filter) => {

                    if (filter.focus) {
                        drawBorder(filter)
                    }
                    ctx.drawImage(filter.img, filter.x, filter.y, filter.width, filter.height)
                })
            }
        }

        function clear() {
            ctx.clearRect(0, 0, 600, 600);
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawBorder(item)
        {
            ctx.beginPath()
            ctx.lineWidth = '1'
            ctx.strokeStyle = "white"
            ctx.moveTo(item.x, item.y)
            ctx.lineTo(item.x, item.y + item.height)
            ctx.lineTo(item.x + item.width, item.y + item.height)
            ctx.lineTo(item.x + item.width, item.y)
            ctx.lineTo(item.x, item.y)
            ctx.stroke()
            ctx.closePath()
        }

        function draw() {
            clear();
            if (imageBase)
                ctx.drawImage(imageBase,0,0, imageBase.width, imageBase.height, 0, 0, canvas.width, canvas.height)
            if (videoBase)
                ctx.drawImage(videoBase, 0, 0, canvas.width, canvas.height)

            drawImg(filters)
        }

        function stopTrackCamera()
        {
            videoBase.srcObject.getTracks().forEach(function(track) {
                if (track.readyState == 'live' && track.kind === 'video') {
                    track.stop();
                }
            });
        }

        function generateFilters()
        {
            let filters_tag = ['red', 'corona', 'gold', 'rose', 'santa-hat', 'gift', 'flowers']
            let filters_div = document.getElementById('filters')

            filters_tag.forEach((tag) => {
                filters_div.insertAdjacentHTML('beforeend',
                    `<img crossorigin="anonymous" id='${tag}' src="http://localhost:4000/img/${tag}.png" alt="" class="p-2 filter_class w-24 h-24">`)

                document.getElementById(tag).addEventListener('click', (e) => {

                    if (!imageBase) {
                        notifyHandler.PushNotify('error', 'Tu n\'as pas de photo sélectonné')
                        return
                    }
                    let imgOk = new Image()
                    imgOk.src = `http://localhost:4000/img/${tag}.png`
                    imgOk.crossOrigin = 'Anonymous';
                    filters.push({ x:50, y:50, width:64, height:64, img: imgOk, focus: false, resize: null })

                    imgOk.onload = () => {
                        ctx.drawImage(imgOk, 50, 50, 64, 64)
                    }
                })
            })
        }

        function getLastIndexFilter(e)
        {
            const canvas_screen = canvas.getBoundingClientRect()

            let mouse_x = Math.floor(e.x - canvas_screen.left)
            let mouse_y = Math.floor(e.y - canvas_screen.top)

            let img_target_index = -1
            for (let i = 0; i < filters.length; i++)
            {
                let filter = filters[i]
                if ((mouse_x >= filter.x && mouse_x <= filter.x + filter.width) && (mouse_y >= filter.y && mouse_y <= filter.y + filter.height))
                    img_target_index = i
            }

            if (img_target_index !== -1)
                return ({img_target_index, mouse_x, mouse_y})
            return null
        }

        function OnBorderResize(item, img_target)
        {
            if (item.mouse_x >= img_target.x && item.mouse_x <= img_target.x + 16 &&
                    item.mouse_y >= img_target.y + 16 && item.mouse_y <= img_target.y + img_target.height - 16)
                return ('left')
            if (item.mouse_x >= img_target.x + img_target.width - 16 && item.mouse_x <=  img_target.x + img_target.width &&
                    item.mouse_y > img_target.y + 16 && item.mouse_y <= img_target.y + img_target.height - 16)
                return ('right')
            if (item.mouse_y >= img_target.y && item.mouse_y <=  img_target.y + 16 &&
                    item.mouse_x >= img_target.x + 16 && item.mouse_x <= img_target.x + img_target.width - 16)
                return ('top')
            if (item.mouse_y >= img_target.y + img_target.height - 16 && item.mouse_y <=  img_target.y + img_target.height &&
                    item.mouse_x >= img_target.x + 16 && item.mouse_x <= img_target.x + img_target.width - 16)
                return ('bot')

            if (item.mouse_x >= img_target.x && item.mouse_x <= img_target.x + 16 &&
                    item.mouse_y >= img_target.y && item.mouse_y <= img_target.y + 16)
                return ('nw')
            if (item.mouse_x >= img_target.x + img_target.width - 16 && item.mouse_x <= img_target.x + img_target.width &&
                    item.mouse_y >= img_target.y && item.mouse_y <= img_target.y + 16)
                return ('ne')
            if (item.mouse_x >= img_target.x && item.mouse_x <= img_target.x + 16 &&
                    item.mouse_y >= img_target.y + img_target.height - 16 && item.mouse_y <= img_target.y + img_target.height)
                return ('sw')
            if (item.mouse_x >= img_target.x + img_target.width - 16 && item.mouse_x <= img_target.x + img_target.width &&
                    item.mouse_y >= img_target.y + img_target.height - 16 && item.mouse_y <= img_target.y + img_target.height)
                return ('se')

            return null

        }

        generateFilters()

        draw()


        canvas.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const canvas_screen = canvas.getBoundingClientRect()

            let item = getLastIndexFilter(e)

            if (item && item.img_target_index !== -1)
            {
                let img_target = filters.at(item.img_target_index)
                filters.splice(item.img_target_index, 1)
                filters.push(img_target)
                let offsetX = item.mouse_x - img_target.x
                let offsetY = item.mouse_y - img_target.y
                // draw()

                canvas.onmousemove = (e) => {

                    if (img_target.resize)
                    {
                        if (img_target.resize === 'right')
                            img_target.width = (e.offsetX - img_target.x) < 64 ? 64 : (e.offsetX - img_target.x)
                        if (img_target.resize === 'bot')
                            img_target.height = (e.offsetY - img_target.y) < 64 ? 64 : (e.offsetY - img_target.y)
                        if (img_target.resize === 'left')
                        {
                            img_target.width = ((img_target.x - e.offsetX) + img_target.width) <= 64 ? 64 : ((img_target.x - e.offsetX) + img_target.width)
                            img_target.x =  img_target.width <= 64 ? img_target.x : e.offsetX
                        }
                        if (img_target.resize === 'top')
                        {
                            img_target.height = ((img_target.y - e.offsetY) + img_target.height) <= 64 ? 64 : ((img_target.y - e.offsetY) + img_target.height)
                            img_target.y =  img_target.height <= 64 ? img_target.y : e.offsetY
                        }
                        if (img_target.resize === 'se')
                        {
                            img_target.width = (e.offsetX - img_target.x) < 64 ? 64 : (e.offsetX - img_target.x)
                            img_target.height = (e.offsetY - img_target.y) < 64 ? 64 : (e.offsetY - img_target.y)
                        }
                        if (img_target.resize === 'sw')
                        {
                            img_target.width = ((img_target.x - e.offsetX) + img_target.width) <= 64 ? 64 : ((img_target.x - e.offsetX) + img_target.width)
                            img_target.x =  img_target.width <= 64 ? img_target.x : e.offsetX
                            img_target.height = (e.offsetY - img_target.y) < 64 ? 64 : (e.offsetY - img_target.y)
                        }
                        if (img_target.resize === 'ne')
                        {
                            img_target.height = ((img_target.y - e.offsetY) + img_target.height) <= 64 ? 64 : ((img_target.y - e.offsetY) + img_target.height)
                            img_target.y =  img_target.height <= 64 ? img_target.y : e.offsetY
                            img_target.width = (e.offsetX - img_target.x) < 64 ? 64 : (e.offsetX - img_target.x)
                        }
                        if (img_target.resize === 'nw')
                        {
                            img_target.height = ((img_target.y - e.offsetY) + img_target.height) <= 64 ? 64 : ((img_target.y - e.offsetY) + img_target.height)
                            img_target.y =  img_target.height <= 64 ? img_target.y : e.offsetY
                            img_target.width = ((img_target.x - e.offsetX) + img_target.width) <= 64 ? 64 : ((img_target.x - e.offsetX) + img_target.width)
                            img_target.x =  img_target.width <= 64 ? img_target.x : e.offsetX
                        }
                    }
                    else
                    {
                        item.mouse_x = Math.floor(e.x - canvas_screen.left)
                        item.mouse_y = Math.floor(e.y - canvas_screen.top)

                        img_target.x = item.mouse_x - offsetX
                        img_target.y = item.mouse_y - offsetY
                    }
                    draw()
                }
            }
        }

        function resetStateOnCanvas()
        {
            filters.forEach((filter) => {
                filter.focus = false
                filter.resize = null
            })
            document.body.style.cursor = 'default'
            draw()
        }



        canvas.onmouseup = (e) => {
            canvas.onmousemove = (e) => {

                let item = getLastIndexFilter(e)

                if (item && item.img_target_index !== -1)
                {
                    let img_target = filters.at(item.img_target_index)

                    filters.forEach((e) => e.focus = false)
                    img_target.focus = true

                    let border = OnBorderResize(item, img_target)
                    if (border)
                    {
                        let pointer_style

                        img_target.resize = border
                        if (border === 'right' ||  border === 'left')
                            pointer_style = 'ew-resize'
                        else if (border === 'top' ||border === 'bot')
                            pointer_style = 'ns-resize'
                        else if (border === 'nw' || border === 'se')
                            pointer_style = 'nwse-resize'
                        else if (border === 'ne' || border === "sw")
                            pointer_style = 'nesw-resize'
                        img_target.resize = border
                        document.body.style.cursor = pointer_style
                    }
                    else {
                        img_target.resize = null
                        document.body.style.cursor = 'pointer'
                    }
                    draw()
                }
                else {
                    resetStateOnCanvas()
                }
            }
        }

        canvas.addEventListener ("mouseout", () => {
            resetStateOnCanvas()
        }, false);

        document.getElementById('file').addEventListener('change', (e) => {
            e.preventDefault()

            let uploaded = document.getElementById('file').files[0]

            if (uploaded) {

                const { name: fileName, size: fileSize } = uploaded;
                const fileExtension = fileName.split(".").pop();

                if (!(fileExtension === 'png' || fileExtension === 'PNG') || fileSize > 3500000)
                {
                    notifyHandler.PushNotify('error', 'Le format doit être en .png et 3Mo maximum')
                    return
                }

                let reader = new FileReader()
                reader.readAsDataURL(uploaded);

                reader.onloadend = () => {

                    imageBase = new Image()
                    imageBase.src = reader.result;
                    imageBase.onload = () => {

                        if (videoBase) {
                            stopTrackCamera()
                            filters.splice(0, filters.length)

                            videoBase = undefined
                            if (cameraButtonState === 1) {
                                cameraButtonState = 0
                                clearInterval(videoInterval)
                                camera_button.innerHTML = 'Activer la webcam'
                                camera_button.style.background = '#0a0a0a'
                            }
                        }

                        notifyHandler.PushNotify('success', 'Image chargé avec succès')

                        ctx.drawImage(imageBase, 0, 0, imageBase.width, imageBase.height, 0, 0, canvas.width, canvas.height)
                        draw()
                    }
                }
            }

        })


        document.getElementById('upButton').addEventListener('click', (e) => {
            let filters_div = document.getElementById('filters')
            filters_div.append(filters_div.firstChild)
        })

        document.getElementById('downButton').addEventListener('click', (e) => {
            let filters_div = document.getElementById('filters')
            filters_div.prepend(filters_div.lastChild)
        })

        camera_button.addEventListener('click', async function() {

            filters.splice(0, filters.length)
            draw()
            if (cameraButtonState === 0)
            {
                if (imageBase)
                    imageBase = undefined
                let video = document.querySelector("#video");
                video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});

                videoBase = video
                videoInterval = setInterval((e) => {
                    draw()
                }, 25)
                cameraButtonState = 1
                camera_button.innerHTML = 'Prendre la photo'
                camera_button.style.background = '#2ECC71'
            }
            else
            {
                ctx.drawImage(videoBase, 0, 0, canvas.width, canvas.height)
                let image_data_url = canvas.toDataURL('image/jpeg');
                let tmpImg = new Image()
                tmpImg.src = image_data_url
                tmpImg.onload = () => {
                    imageBase = tmpImg
                    draw()
                    notifyHandler.PushNotify('success', 'Photo prise avec succès')
                }

                stopTrackCamera()
                clearInterval(videoInterval)
                cameraButtonState = 0
                videoBase = undefined
                camera_button.innerHTML = 'Activer la webcam'
                camera_button.style.background = '#0a0a0a'
            }
        });

        document.getElementById("sharebutton").addEventListener('click', e => {

            if (imageBase) {
                let img = canvas.toDataURL('image/png')

                fetch_json('http://localhost:4000/cdn/post', 'POST', {
                    imgData: img
                }, true).then((res) => {
                    if (res.success) {
                        notifyHandler.PushNotify('success', 'Montage publié avec succès')
                        setTimeout((e) => {
                            document.location = '/feed'
                        }, 1000)
                    }
                })
            }
            else
                notifyHandler.PushNotify('error', 'Tu dois d\'abord uploader une image')
        })
    }

}

