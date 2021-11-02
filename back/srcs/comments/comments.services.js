import {query} from "../mysql/mysql";
import {findOne} from "../users/users.services"

export async function findAll()
{
    return query('SELECT * FROM comments').then((e) => {return e})
}

export async function createOne(body, decoded_token)
{
    const { comment, post_id } = body
    console.log(decoded_token, comment, post_id)

    return await query(`INSERT into comments(post_id, user_id, comment) VALUES ('${post_id}', '${decoded_token.id}', '${comment}') `).then((e) => {
        // console.log(e)
        return e }).catch((e) => {
        // console.log(e)
            return null
    })
}

export async function getOneComment(id)
{
    return await query(`SELECT comments.id, comments.comment, comments.user_id, comments.post_id, users.username, users.id FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.id = ${id}`, false).then((comments) => {
        return comments
    }).catch((e) => {
        return null })
}

export async function getPostComments(id)
{
    return await query(`SELECT comments.id, comments.comment, comments.user_id, comments.post_id, users.username, users.id FROM comments INNER JOIN users ON comments.user_id = users.id WHERE post_id = ${id}`).then((comments) => {
        return comments
    }).catch((e) => {
        return null })
}