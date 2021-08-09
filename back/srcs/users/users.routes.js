import express from 'express'
import {createUser, findAll, findOne} from "./users.services";
import jwt_middleware from "../middleware/auth.middleware";

const usersRoutes = express.Router();

usersRoutes.get('/', jwt_middleware, async (req, res) => {
    return res.json(await findAll())
})

usersRoutes.get('/:id', jwt_middleware, async (req, res) => {

    // console.log(req.params.id)

    return res.json({ ok: "ok"})
})


export default usersRoutes