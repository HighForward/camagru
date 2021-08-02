import express from 'express'

const usersRoutes = express.Router();

usersRoutes.get('/', (req, res) => {
    return res.json({ users: "alive" })
})


export default usersRoutes