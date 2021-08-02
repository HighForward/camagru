import express from 'express'

const authRouter = express.Router()

authRouter.get('/', (req, res) => {
    return res.json({ auth:'ok' })
})

export default authRouter