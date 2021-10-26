import express from 'express'
import jwt_middleware from "../middleware/auth.middleware";
import fs from 'fs'
import {query} from "../mysql/mysql";
import {findOne, findOneByUsername} from "../users/users.services";

const cdnRoutes = express.Router();

cdnRoutes.post('/profile-picture', jwt_middleware, async (req, res) => {

    let img = req.body.imgBase64

    if (!img)
        return (res.json({ error: 'img needed' }))

    let base64Data = img.replace(/^data:image\/png;base64,/, "")

    let user = await findOne(req.decoded_token.id)

    if (!user)
        return res.json({error: 'wrong user'})

    if (!user.profil_path)
    {
        await query(`UPDATE users SET profil_path='${user.username}-profile' WHERE username='${user.username}'`)
        fs.writeFile(`./img/profile/${user.username}-profile.png`, base64Data, 'base64', function(err) {
        });

    }
    else
    {
        console.log("faire quand ça existe deja")
    }

    console.log(`${user.username}-profile created; `)
    return res.json({success: 'profile picture updated'})
})

cdnRoutes.get('/profile-picture/:username', jwt_middleware, async (req, res) => {

    if (!req.params.username)
        return res.json({error: 'wrong param'})

    let user = await findOneByUsername(req.params.username)
    if (!user)
        return res.json({error: 'user not found'})

    if (user.profil_path) {

        const contents = fs.readFileSync(`img/profile/${user.username}-profile.png`, {encoding: 'base64'});
        console.log(contents)
        return res.json({imgBase64: contents})
    }

    return res.json({error: 'no profile picture found'})
})

cdnRoutes.get('/filters', jwt_middleware, (req, res) => {
    let file = fs.readFileSync(`img/filters/ok.jpg`);
    return  res.json({ ok: file })
})


cdnRoutes.post('/post', jwt_middleware, (req, res) => {
    console.log(req.body.dataImg)
    return res.json({success: 'img received'})

})





//
// cdnRoutes.get('/', jwt_middleware, (req, res) => {
//     res.set({'Content-Type': 'image/png'});
//     return res.sendFile('img/out.png')
// })
//
//
// cdnRoutes.get('/1', (req, res) => {
//
//     return res.json({ bite: 'bite' })
//
// })


export default cdnRoutes