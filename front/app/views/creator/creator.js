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

            if (uploaded) {

                const { name: fileName, size: fileSize } = uploaded;
                const fileExtension = fileName.split(".").pop();

                if (fileExtension !== 'png' || fileSize > 5000000)
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







        /** zone sombre **/

        let filters_div = document.getElementById('filters')

        filters_div.insertAdjacentHTML('beforeend',
            `<img crossorigin="anonymous" id='ok-filter' src="http://localhost:4000/img/red.png" alt="" class="w-24 h-24 mb-2">`)

        filters_div.insertAdjacentHTML('beforeend',
            `<img crossorigin="anonymous" id='bird-filter' src="http://localhost:4000/img/red-gold.png" alt="" class="w-24 h-24 mb-2">`)

        filters_div.insertAdjacentHTML('beforeend',
            `<img crossorigin="anonymous" id='santa-hat' src="http://localhost:4000/img/santa-hat.png" alt="" class="w-24 h-24 mb-2">`)

        document.getElementById('ok-filter').addEventListener('click', (e) => {

            if (!imageBase) {
                notifyHandler.PushNotify('error', 'Tu n\'as pas de photo sélectonné')
                return
            }
            let imgOk = new Image()
            imgOk.src = 'http://localhost:4000/img/red.png'
            imgOk.crossOrigin = 'Anonymous';
            filters.push({x:50, y:50, width:64, height:64, img: imgOk})

            imgOk.onload = () => {
                ctx.drawImage(imgOk, 50, 50, 64, 64)
            }
        })

        document.getElementById('santa-hat').addEventListener('click', (e) => {

            if (!imageBase) {
                notifyHandler.PushNotify('error', 'Tu n\'as pas de photo sélectonné')
                return
            }

            let imgOk = new Image()
            imgOk.src = 'http://localhost:4000/img/santa-hat.png'
            imgOk.crossOrigin = 'Anonymous';
            filters.push({x:50, y:50, width:128, height:128, img: imgOk})

            imgOk.onload = () => {
                ctx.drawImage(imgOk, 50, 50, 128, 128)
            }
        })

        document.getElementById('bird-filter').addEventListener('click', (e) => {

            if (!imageBase) {
                notifyHandler.PushNotify('error', 'Tu n\'as pas de photo sélectonné')
                return
            }

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

