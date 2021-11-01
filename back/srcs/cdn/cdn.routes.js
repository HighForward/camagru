import express from 'express'
import jwt_middleware from "../middleware/auth.middleware";
import fs from 'fs'
import {query} from "../mysql/mysql";
import {findOne, findOneByUsername} from "../users/users.services";
import {createPost, findOnePost, getPostForUserId} from "../posts/posts.services";

const cdnRoutes = express.Router();

cdnRoutes.post('/profile-picture', jwt_middleware, async (req, res) => {

    let img = req.body.imgBase64

    if (!img)
        return (res.json({ error: 'img needed' }))

    let base64Data = img.replace(/^data:image\/png;base64,/, "")

    let user = await findOne(req.decoded_token.id)

    if (!user)
        return res.json({error: 'wrong user'})

    // if (!user.profile_img)
    // {
        await query(`UPDATE users SET profile_img='${user.username}-profile' WHERE username='${user.username}'`)
        fs.writeFile(`./img/users/${user.username}/${user.username}-profile.png`, base64Data, 'base64', function(err) {
        });
    // }
    // else
    // {
    //     console.log("faire quand ça existe deja")
    // }

    console.log(`${user.username}-profile created; `)
    return res.json({success: 'profile picture updated'})
})

cdnRoutes.get('/profile-picture/:username', jwt_middleware, async (req, res) => {

    if (!req.params.username)
        return res.json({error: 'wrong param'})

    let user = await findOneByUsername(req.params.username)
    if (!user)
        return res.json({error: 'user not found'})

    if (user.profile_img) {

        const contents = fs.readFileSync(`img/users/${user.username}/${user.username}-profile.png`, {encoding: 'base64'});
        return res.json({imgBase64: contents})
    }

    console.log('ziz')
    return res.json({error: 'no profile picture found'})
})


cdnRoutes.post('/post', jwt_middleware, async (req, res) => {

    let img = req.body.imgData

    if (!img)
        return (res.json({error: 'img needed'}))

    let base64Data = img.replace(/^data:image\/jpeg;base64,/, "")

    let user = await findOne(req.decoded_token.id)

    if (!user)
        return res.json({error: 'error user'})

    let imgId = await createPost(user)
    if (imgId)
    {
        await query(`UPDATE posts
                     SET img_path = '${user.username}-post-${imgId}.png'
                     WHERE id = ${imgId}`)
        fs.writeFile(`./img/users/${user.username}/${user.username}-post-${imgId}.png`, base64Data, 'base64', function(err) {
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
    let posts = await query('SELECT * FROM posts')
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
        const contents = fs.readFileSync(`img/users/${user.username}/${user.username}-post-${post.id}.png`, {encoding: 'base64'});

        post.imgBase64 = contents
        post.author = user.username
        return res.json(post)
    }
    return res.json({ error: 'Inexisting post' })
})

export default cdnRoutes