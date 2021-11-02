import { query } from "../mysql/mysql";


export async function findAll()
{
    return await query(`SELECT users.id, users.profile_img, users.username, users.email FROM users`).then(e => {
        return e
    }).catch(e => {
        return null
    })
}

export async function findOne(id)
{
    return await query(`SELECT users.id, users.profile_img, users.username, users.email from users where id = ${id}`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function findOneByUsername(username)
{
    return await query(`SELECT users.id, users.profile_img, users.username, users.email from users where username = '${username}'`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function userExists(email)
{
    return await query(`SELECT users.id, users.profile_img, users.username, users.email from users where email = '${email}'`, false).then(e => {
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

export async function updateUser(req)
{
    let {username, password, email} = req.body


    let user = await findOne(req.decoded_token.id)

    if (!user || user.error)
        return ({ error: 'Updating error' })

    if (!username || username === user.username) {
        // do nothing
    }
    else
    {
        let target_username = await findOneByUsername(username)

        console.log(target_username)

        if (target_username)
            return ({ error: 'Username already used' })

        await query(`UPDATE users SET username = '${username}' WHERE id = ${req.decoded_token.id}`).then(e => {
            console.log(e)
        }).then(e => {

        })

        let new_user = await findOneByUsername(username)



    }






    return ({ success: 'Updated' })
}