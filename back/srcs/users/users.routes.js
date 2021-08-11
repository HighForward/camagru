import express from 'express'
import {createUser, findAll, findOne, findOneByUsername, updateUser} from "./users.services";
import jwt_middleware from "../middleware/auth.middleware";

const usersRoutes = express.Router();

usersRoutes.get('/', jwt_middleware, async (req, res) => {
    return res.json(await findAll())
})

usersRoutes.get('/:username', async (req, res) => {

    if (!req.params.username)
        return res.json({ error: 'wrong param '})

    let user = await findOneByUsername(req.params.username)
    if (!user)
        return res.json({ error: 'user not found' })

    return res.json(user)
})

usersRoutes.post('/update', jwt_middleware, async (req, res) => {
    console.log(req.body)
    return res.json(await updateUser(req.body))
})


export default usersRoutes