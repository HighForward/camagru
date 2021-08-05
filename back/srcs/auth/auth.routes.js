import express from 'express'
import jwt from 'jsonwebtoken'
const authRouter = express.Router()

authRouter.post('/register', (req, res) => {
    console.log(req.body)

    const data = {
        id: 1,
        username: 'maxou'
    }

    const token = jwt.sign(data, 'shh')


    return res.json({token: token })
})

export default authRouter