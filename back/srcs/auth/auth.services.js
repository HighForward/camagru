import {query} from "../mysql/mysql";
import {createUser} from "../users/users.services";

export async function log_in(data)
{
    let {username, password } = data

    if (!username || username.length <= 3 || username.length > 30 || !password || password.length < 3 || username.length > 30)
        throw ({ error: 'username or password: wrong format' })

    const user = await query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`, false)

    if (user)
        return user
    else
        throw ({ error: 'Wrong username/email or password'})
}

export async function register(data)
{
    let { email, username, password } = data

    if (!username || username.length <= 3 || username.length > 30 || !password || password.length < 3 || password.length > 30
        || !email || email.length < 3 || email.length > 30)

        throw ({ error: 'username or password: wrong format' })

    return await createUser(data).then(e => {
        return e
    }).catch(e => {
        throw ({ error: e.error })
    })
}