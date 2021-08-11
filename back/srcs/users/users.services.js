import { query } from "../mysql/mysql";


export async function findAll()
{
    return await query(`SELECT * FROM users`).then(e => {
        return e
    }).catch(e => {
        return null
    })
}

export async function findOne(id)
{
    return await query(`SELECT * from users where id = ${id}`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function findOneByUsername(username)
{
    return await query(`SELECT * from users where username = '${username}'`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function userExists(email)
{
    return await query(`SELECT * from users where email = '${email}'`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}


export async function createUser(payload)
{

    let { email, username, password } = payload

    let user = await userExists(email)

    if (!user) {

        return await query(`INSERT into users(email, username, password)
                            VALUES ('${email}', '${username}', '${password}') `).then(async e => {
            return await findOneByUsername(username)
        }).catch(e => {
            return null
        })
    }
    throw ({ error: 'Username or email already registered' })
}

export async function updateUser(payload)
{
    let {username, password, email} = payload

    if (!username || !password || !email)
        return ({ error: 'missings values' })

    if (await findOneByUsername(username).then(e => {
        return !e.error;
    }).catch(e => {
      return false
    }))
        return ({ error: 'Username already used' })



    return ({ error: 'Error while trying update user' })
}