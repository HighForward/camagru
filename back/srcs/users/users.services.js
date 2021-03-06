import { query } from "../mysql/mysql";
import inputValidator from "../inputValidator/inputValidator";
import bcrypt from "bcryptjs";


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
    return await query(`SELECT users.id, users.profile_img, users.username, users.email, users.reset_uuid from users where id = ${id}`, false).then(e => {
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
    return await query(`SELECT users.id, users.reset_uuid, users.profile_img, users.validate, users.username, users.email, users.uuid from users where email = '${email}'`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}

export async function userExists(email, username)
{
    return await query(`SELECT users.id, users.profile_img, users.username, users.email from users where email = '${email}' OR username = '${username}'`, false).then(e => {
        return e
    }).catch(e => {
        return ({ error: 'Can\'t find user '})
    })
}


export async function createUser(payload)
{

    let { email, username, password } = payload

    let user = await userExists(email, username)

    if (!user) {

        return await query(`INSERT into users(email, username, password, uuid)
                            VALUES ('${email}', '${username}', '${password}', UUID()) `).then(async e => {
            return await findOneByUsername(username)
        }).catch(e => {
            return null
        })
    }
    throw ({ error: 'Nom d\'utilisateur ou email d??j?? utilis??' })
}

export async function updateUser(req)
{
    let {username, password, email, mailer} = req.body

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
            return ({ error: 'Ce nom d\'utilisateur est d??j?? utilis??' })
        if (!users || users.error)
            await query(`UPDATE users SET username = '${username}' WHERE id = ${req.decoded_token.id}`)
    }

    if (email !== user.email)
    {
        let users = await findOneByEmail(email)
        if (users)
            return ({ error: 'Cette addresse email est d??j?? utilis??' })

        if (!users)
            await query(`UPDATE users SET email = '${email}' WHERE id = ${req.decoded_token.id}`)
    }

    if (password && validator.isValidPassword(password)) {

        let hash = await bcrypt.hash(password, 10).then((hash) => {
            return hash
        })
        await query(`UPDATE users
                     SET password = '${hash}'
                     WHERE id = ${req.decoded_token.id}`)
    }

    if (mailer !== Boolean(user.mailer))
        await query(`UPDATE users SET mailer = ${mailer} WHERE id = ${req.decoded_token.id}`)

    return ({ success: 'Informations mise ?? jour' })
}