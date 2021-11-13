import {query} from "../mysql/mysql";


export async function createLike(user_id, post_id) {
    let res = await query(`INSERT INTO likes(user_id, post_id)
                           VALUES (${user_id}, ${post_id})`)
    if (res.insertId) {
        let like = await query(`SELECT *
                                FROM likes
                                WHERE id = ${res.insertId}`, false)
        if (like)
            return like
    }
    return ({error: 'error while creating like'})
}

export async function deleteLike(user_id, post_id, liked)
{
    return await query(`DELETE FROM likes WHERE id = ${liked.id}`)
}

export async function isAlreadyLiked(user_id, post_id)
{
    return await query(`SELECT * FROM likes WHERE user_id = '${user_id}' AND post_id = '${post_id}'`, false);

}

export async function LikeFromUser(user_id)
{
    return await query(`SELECT * FROM likes WHERE user_id = '${user_id}'`, true).then((e) => e.length);

}