import express from 'express'
import jwt_middleware from "../middleware/auth.middleware";
import fs from 'fs'

const cdnRoutes = express.Router();

cdnRoutes.post('/', jwt_middleware, (req, res) => {

    let img = req.body.imgBase64

    if (!img)
        return (res.json({ error: 'img needed' }))

    let base64Data = img.replace(/^data:image\/png;base64,/, "")

    fs.writeFile("out.png", base64Data, 'base64', function(err) {
    });
    return res.json({okey: 'okeyyy'})
})

export default cdnRoutes