import mysql from "mysql";
import {log_in} from "../auth/auth.services";

export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL");
});


export async function query(sql, array = true) {
    return await new Promise(async (resolve, reject) => {
        await connection.query(sql, (error, elements) => {
            if (error) {
                return reject(error);
            }

            if (array === false)
                return resolve(elements[0]);
            else
                return resolve(elements)
        })
    }).then(data => {
        return (data)
    }).catch(e => {
        console.log(e)
        return null
    })
}