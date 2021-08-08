import express from 'express'
import jwt from 'jsonwebtoken'
const authRouter = express.Router()
import {log_in, register} from "./auth.services";

authRouter.post('/login', async (req, res) => {

    return await log_in(req.body).then(e => {

        console.log(e)
        const jwt_token = jwt.sign({
            id: e.id,
            online: true
        }, 'sssshh')

        return res.status(200).json({ jwt: jwt_token })
    }).catch(e => {
        return res.status(401).json({ error: e.error })
    })

})

authRouter.post('/register', async (req, res) => {
    return await register(req.body).then(e => {

        const jwt_token = jwt.sign({
            id: e.id,
            online: true
        }, 'sssshh')

        return res.json({jwt: jwt_token})
    }).catch(e => {
        return res.status(401).json({error: e.error })
    })
})

export default authRouter