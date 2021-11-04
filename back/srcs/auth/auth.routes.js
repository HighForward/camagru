import express, {response} from 'express'
import jwt from 'jsonwebtoken'
const authRouter = express.Router()
import {log_in, register} from "./auth.services";
import jwt_middleware from "../middleware/auth.middleware";
import {findOne, findOneByEmail} from "../users/users.services";
import {MAIL_TYPE, sendMail} from "../mailer/mailer.services";
import {query} from "../mysql/mysql";
import inputValidator from "../inputValidator/inputValidator";

authRouter.post('/login', async (req, res) => {

    return await log_in(req.body).then(e => {

        const jwt_token = jwt.sign({
            id: e.id,
        }, process.env.JWT_SECRET, { expiresIn: '1h'})

        return res.status(200).json({ jwt: jwt_token })
    }).catch(e => {
        return res.status(401).json({ error: e.error })
    })

})

authRouter.post('/register', async (req, res) => {
    return await register(req.body).then(user => {

        if (!sendMail(user.email, user, MAIL_TYPE.REGISTER))
            console.log('weird email')

        return res.json({ email: user.email})
    }).catch(e => {
        return res.status(401).json({ error: e.error })
    })
})

authRouter.get('/fetch_user', jwt_middleware, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1]
    const user = jwt.decode(token)
    return res.json(await findOne(user.id))
})

authRouter.get('/validate/:uuid', async (req, res) => {
    if (!req.params.uuid)
        return res.json({error: 'wrong uuid' })

    let user = await query(`SELECT users.uuid, users.username FROM users WHERE uuid = '${req.params.uuid}'`, false)

    // console.log(user)
    if (user) {
        await query(`UPDATE users SET validate = true, uuid = null WHERE uuid = '${user.uuid}'`)
        return res.json({ success: 'Ton compte est maintenant vérifié', username: user.username})
    }
    return res.json({error: 'Erreur mauvais token' })
})

authRouter.post('/reset', async (req, res) => {

    const { email } = req.body
    if (!email)
        return ({ error: 'Tu dois d\'abord preciser ton email' })

    let validator = new inputValidator(email, '', '')

    if (!validator.isValidEmail())
        return res.json({ error: 'Email invalid' })

    let user = await findOneByEmail(email)
    console.log(user)
    if (user && !user.error)
    {
        //todo generate token, create route on front to change password
        await sendMail(email, user, MAIL_TYPE.RESET)
    }
    return res.json({ success: 'Un email à été envoyé à l\'adresse indiqué' })
})

export default authRouter