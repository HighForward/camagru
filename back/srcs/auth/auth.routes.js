import express, {response} from 'express'
import jwt from 'jsonwebtoken'
const authRouter = express.Router()
import {log_in, register} from "./auth.services";
import jwt_middleware from "../middleware/auth.middleware";
import {findOne} from "../users/users.services";

authRouter.post('/login', async (req, res) => {

    return await log_in(req.body).then(e => {

        const jwt_token = jwt.sign({
            id: e.id,
            online: true
        }, process.env.JWT_SECRET)

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
        }, process.env.JWT_SECRET)

        return res.json({jwt: jwt_token})
    }).catch(e => {
        return res.status(401).json({error: e.error })
    })
})

authRouter.get('/fetch_user', jwt_middleware, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1]
    const user = jwt.decode(token)

    return res.json(await findOne(user.id))

})

export default authRouter