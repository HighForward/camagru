import express from 'express'
import jwt_middleware from "../middleware/auth.middleware";
import fs from 'fs'
import {query} from "../mysql/mysql";
import {findOne, findOneByUsername} from "../users/users.services";
import {createPost, findOnePost, getPostForUserId} from "../posts/posts.services";
import {getUserProfilePicture} from "./cdn.services";

const cdnRoutes = express.Router();

cdnRoutes.post('/profile-picture', jwt_middleware, async (req, res) => {

    let img = req.body.imgBase64

    if (!img)
        return (res.json({error: 'img needed'}))

    let base64Data = img.replace(/^data:image\/png;base64,/, "")

    if (base64Data === img)
        return res.json({ error: 'wrong extension' })

    let user = await findOne(req.decoded_token.id)

    if (!user)
        return res.json({error: 'wrong user'})

    await query(`UPDATE users
                 SET profile_img='${user.id}-profile'
                 WHERE username = '${user.username}'`)
    fs.writeFile(`./img/users/${user.id}/${user.id}-profile.png`, base64Data, 'base64', function (err) {

        return res.json({success: 'profile picture updated'})
    })
})

cdnRoutes.get('/profile-picture/:username', async (req, res) => {

    return res.json(await getUserProfilePicture(req.params.username))
})


cdnRoutes.post('/post', jwt_middleware, async (req, res) => {

    let img = req.body.imgData

    if (!img)
        return (res.json({error: 'img needed'}))

    let base64Data = img.replace(/^data:image\/png;base64,/, "")

    if (base64Data === img)
        return res.json({ error: 'wrong extension' })

    let user = await findOne(req.decoded_token.id)

    if (!user)
        return res.json({error: 'error user'})

    let imgId = await createPost(user)
    if (imgId)
    {
        await query(`UPDATE posts
                     SET img_path = '${user.id}-post-${imgId}.png'
                     WHERE id = ${imgId}`)
        fs.writeFile(`./img/users/${user.id}/${user.id}-post-${imgId}.png`, base64Data, 'base64', function(err) {
        });
        return res.json({ success: 'Post created' })
    }

    return res.json({ error: 'cannot create post' })

})

cdnRoutes.get('/post/user/:user_id', async (req, res) => {

    if (!req.params.user_id)
        return res.json({error: 'wrong param'})

    const user = await findOneByUsername(req.params.user_id)
    if (user.error)
        return res.json({ error: 'wrong user_id' })

    const posts = await getPostForUserId(user.id)
    return res.json(posts)
})

cdnRoutes.get('/post', async (req, res) => {
    let index = req.query.index
    if (!index)
        index = 0
    let posts = await query(`SELECT * FROM posts LIMIT 5 OFFSET ${index}`)
    return res.json(posts)
})

cdnRoutes.get('/post/:id', async (req, res) => {
    if (!req.params.id)
        return res.json({error: 'wrong param'})

    const post = await findOnePost(req.params.id)
    if (post)
    {
        const user = await findOne(post.user_id)
        if (user.error)
            return res.json({ error: 'wrong user_id' })
        const contents = fs.readFileSync(`img/users/${user.id}/${user.id}-post-${post.id}.png`, {encoding: 'base64'});

        post.imgBase64 = contents
        post.author = user.username
        return res.json(post)
    }
    return res.json({ error: 'Inexisting post' })
})

cdnRoutes.delete('/post/:id', jwt_middleware, async (req, res) => {
    if (!req.params.id)
        return res.json({error: 'wrong param'})

    const post = await findOnePost(req.params.id)
    if (post && post.user_id === req.decoded_token.id) {
        await query(`DELETE FROM posts WHERE id = ${post.id}`)
        return res.json({success: 'post deleted' })
    }
    return res.json({error: 'wrong post' })

})

export default cdnRoutes