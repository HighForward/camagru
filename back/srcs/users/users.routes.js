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
        console.log(likes, posts, comments)

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

export default usersRoutes