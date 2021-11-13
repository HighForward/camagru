import {query} from "../mysql/mysql";
import {createUser} from "../users/users.services";
import bcrypt from 'bcryptjs';
import fs from "fs";
import inputValidator from "../inputValidator/inputValidator";

export async function log_in(data)
{
    let { username, password } = data

    let validator = new inputValidator('', username, password)

    let state = validator.checkValueLogin()
    if (!state.success)
        throw ({ error: state.error})

    const user = await query(`SELECT * FROM users WHERE username = '${username}'`, false)

    if (!user)
        throw ({ error: 'Nom d\'utilisateur ou mot de passe incorrect' })

    const match = await bcrypt.compare(password, user.password)

    if (!match)
        throw ({ error: 'Nom d\'utilisateur ou mot de passe incorrect' })

    if (user && user.validate === 0)
        throw ({ error: 'Tu dois d\'abord faire vérifier ton adresse mail.' })

    return user
}

export async function register(body)
{
    let { email, username, password, confirm_password} = body

    let validator = new inputValidator(email, username, password, confirm_password)

    let state = validator.checkValueRegister()
    if (!state.success)
        throw ({ error: state.error })

    body.password = await bcrypt.hash(password, 10).then((hash) => {
        return hash
    })

    console.log(body.password)

    const user = await createUser(body).then(e => {
        return e
    }).catch(e => {
        throw ({ error: e.error })
    })

    fs.mkdir(`./img/users/${user.id}`, {recursive: true}, (e) => {
        // console.log(e)
    })

    return user
}