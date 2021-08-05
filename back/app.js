import express from 'express'
import cors from 'cors';
import mysql from 'mysql'
import usersRouter from './srcs/users/users.routes'
import authRouter from './srcs/auth/auth.routes'
import bodyParser from "body-parser"

const allowedOrigins = ['http://localhost'];

const options = cors.CorsOptions = {
    origin: allowedOrigins
};


let app = express()
app.use(cors(options))

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL");
});

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use('/users', usersRouter)
app.use('/auth', authRouter)


app.get('/', (req, res) => {
    return res.json({ success: "Camagru API alive" })
})

app.listen(PORT, () => {
    console.log(`Camagru API listening at http://localhost:${PORT}`)
})