import { query } from "../mysql/mysql";
import inputValidator from "../inputValidator/inputValidator";


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

export async function findOneSecretInside(id)
{
    return await query(`SELECT * from users where id = ${id}`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function findOneByUsername(username)
{
    return await query(`SELECT users.id, users.profile_img, users.username, users.email, users.uuid from users where username = '${username}'`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function findOneByEmail(email)
{
    console.log(email)
    return await query(`SELECT users.id, users.profile_img, users.username, users.email, users.uuid from users where email = '${email}'`, false).then(e => {
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

        return await query(`INSERT into users(email, username, password, uuid)
                            VALUES ('${email}', '${username}', '${password}', UUID()) `).then(async e => {
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

    let user = await findOneSecretInside(req.decoded_token.id)

    if (!user || user.error)
        return ({ error: 'Updating error' })


    let validator = new inputValidator(email, username, password)
    let state = validator.checkValueUpdate()

    if (!state.success)
        return ({error: state.error})

    if (username !== user.username)
    {
        let users = await findOneByUsername(username)

        if (users)
            return ({ error: 'Ce nom d\'utilisateur est déjà utilisé' })
        if (!users || users.error)
            await query(`UPDATE users SET username = '${username}' WHERE id = ${req.decoded_token.id}`)
    }

    if (email !== user.email)
    {
        let users = await findOneByEmail(email)
        if (users)
            return ({ error: 'Cette addresse email est déjà utilisé' })

        if (!users && users.error)
            await query(`UPDATE users SET email = '${email}' WHERE id = ${req.decoded_token.id}`)
    }

    if (password) {
        await query(`UPDATE users SET password = '${password}' WHERE id = ${req.decoded_token.id}`)
    }

    return ({ success: 'Informations mise à jour' })
}