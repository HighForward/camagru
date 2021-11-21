import express from 'express'
import {
    createUser,
    findAll,
    findOne,
    findOneByUsername,
    updateUser
} from "./users.services";
import jwt_middleware from "../middleware/auth.middleware";
import {query} from "../mysql/mysql";
import {LikeFromUser} from "../likes/likes.services";
import {getPostForUserId, getPostSizeForUserId} from "../posts/posts.services";
import {getCommentsFromUser} from "../comments/comments.services";
import {getUserProfilePicture} from "../cdn/cdn.services";
import inputValidator from "../inputValidator/inputValidator";

const usersRoutes = express.Router();

usersRoutes.get('/', jwt_middleware, async (req, res) => {
    return res.json(await findAll())
})

usersRoutes.get('/mailer', jwt_middleware, async (req, res) => {
    let user = await query(`SELECT mailer FROM users WHERE id = ${req.decoded_token.id}`, false)
    if (user)
        return res.json(user.mailer)
    return res.json({ error: 'user not found' })
})

usersRoutes.get('/:username', async (req, res) => {

    if (!req.params.username)
        return res.json({ error: 'wrong param '})

    let user = await findOneByUsername(req.params.username)
    if (user) {
        let likes = await LikeFromUser(user.id)
        let posts = await getPostSizeForUserId(user.id)
        let comments = await getCommentsFromUser(user.id)

        user.likes = likes
        user.posts = posts
        user.comments = comments
    }
    if (!user)
        return res.json({ error: 'user not found' })

    return res.json(user)
})

usersRoutes.post('/update', jwt_middleware, async (req, res) => {
    return res.json(await updateUser(req))
})

usersRoutes.get('/search/:input', async (req, res) => {

    if (!req.params.input)
        return res.json({error: "wrong input"})

    let validator = new inputValidator('', req.params.input, '')
    if (!validator.isValidUsername())
        return res.json({error: 'wrong input'})

    const users = await query(`SELECT users.username, users.id FROM users`)

    let target = users.filter((item) => {
        if (item.username.includes(req.params.input))
            return true
    })

    let val = await Promise.all(target.map(async (item) => {
        let img = await getUserProfilePicture(item.username)
        if (img)
            item.imgBase64 = img.imgBase64
        return item
    })).then((e) => e)

    return res.json(val)
})

export default usersRoutes