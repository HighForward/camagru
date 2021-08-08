import {query} from "../mysql/mysql";
import {createUser} from "../users/users.services";

export async function log_in(data)
{
    let {username, password, confirm_password} = data

    const user = await query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`, false)

    if (user)
        return user
    else
        throw ({ error: 'Wrong username/email or password'})
}

export async function register(data)
{
    return await createUser(data).then(e => {
        return e
    }).catch(e => {
        throw ({ error: e.error })
    })
}