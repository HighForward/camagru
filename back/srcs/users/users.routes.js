import express from 'express'
import {createUser, findAll, findOne} from "./users.services";

const usersRoutes = express.Router();

usersRoutes.get('/', async (req, res) => {
    return res.json(await findAll())
})


export default usersRoutes