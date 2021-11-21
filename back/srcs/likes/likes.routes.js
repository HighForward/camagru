import express from 'express'
import {query} from "../mysql/mysql";
import {createLike, deleteLike, isAlreadyLiked} from "./likes.services";
import jwt_middleware from "../middleware/auth.middleware";


const likesRoutes = express.Router()


likesRoutes.get('/', async (req, res) => {
    let likes = await query('SELECT * FROM likes')
    return res.json(likes)
})

likesRoutes.post('/', jwt_middleware, async (req, res) => {

    const {post_id, user_id} = req.body
    if (post_id && user_id) {

        let liked = await isAlreadyLiked(user_id, post_id)
        if (!liked)
            await createLike(user_id, post_id)
        else
            await deleteLike(user_id, post_id, liked)

        return res.json(liked === undefined)
    }
    res.json({error: 'wrong params' })
})

likesRoutes.post('/isliked', async (req, res) => {
    const {post_id, user_id} = req.body
    if  (post_id && user_id) {
        const like = await isAlreadyLiked(user_id, post_id)
        return res.json(like !== undefined)
    }
    res.json({error: 'wrong params' })

})


export default likesRoutes