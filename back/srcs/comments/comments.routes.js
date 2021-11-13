import express from 'express'
import jwt_middleware from "../middleware/auth.middleware";
import {createOne, findAll, getOneComment, getPostComments} from "./comments.services";
import {MAIL_TYPE, sendMail} from "../mailer/mailer.services";
import {findOnePost} from "../posts/posts.services";

const commentsRoutes = express.Router()

commentsRoutes.get('/', async (req, res) => {

    let item = await findAll()
    return res.json(item)
})


commentsRoutes.post('/',  jwt_middleware, async (req, res) => {

    if (!req.body.comment || !req.body.post_id || !req.body.comment.length)
        return res.json({error: 'Missing values'})

    let post = await findOnePost(req.body.post_id)
    if (post) {
        let item = await createOne(req.body, req.decoded_token)
        if (item) {
            let newed_post = await getOneComment(item.insertId)
            if (newed_post) {

                if (post && post.user_id !== newed_post.user_id && post.mailer) {
                    sendMail(post.email, MAIL_TYPE.COMMENT, newed_post)
                }
                return res.json(newed_post)
            }
        }
    }
    return res.json({error: 'Can\'t comment this post' })
})

commentsRoutes.get('/:id', async (req, res) => {

    let id = req.params.id
    let comment = await getOneComment(id, false)

    if (comment)
        return res.json(comment)
    return res.json({error: 'can\'t get this comment' })
})

commentsRoutes.get('/post/:id', async (req, res) => {

    if (!req.params.id)
        return res.json({ error: 'wrong params' })

    let comments = await getPostComments(req.params.id)
    if (comments)
        return res.json(comments)
    return res.json({error: 'can\'t get theses comments' })
})

export default commentsRoutes