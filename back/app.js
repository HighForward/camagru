import express from 'express'
import cors from 'cors';
import bodyParser from "body-parser"
import usersRouter from './srcs/users/users.routes'
import authRouter from './srcs/auth/auth.routes'
import cdnRouter from './srcs/cdn/cdn.routes'
import commentsRoutes from "./srcs/comments/comments.routes";

const allowedOrigins = ['http://localhost'];

const options = cors.CorsOptions = {
    origin: allowedOrigins
};

let app = express()
app.use(cors(options))

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json({ limit: '50mb'}));
app.use('/img', express.static('img/filters'))
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/cdn', cdnRouter)
app.use('/comments', commentsRoutes)

app.get('/', (req, res) => {
    return res.json({ success: "Camagru API alive" })
})

app.listen(PORT, () => {
    console.log(`Camagru API listening at http://localhost:${PORT}`)
})