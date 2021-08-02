import express from 'express'
import mysql from 'mysql'
let app = express()
import usersRouter from './srcs/users/users.routes'
import authRouter from './srcs/auth/auth.routes'
import bodyParser from "body-parser"

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