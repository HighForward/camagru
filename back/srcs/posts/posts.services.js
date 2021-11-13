import {query} from "../mysql/mysql";


export async function createPost(user) {
    let post = await query(`INSERT INTO posts(user_id) VALUES ('${user.id}')`).then((e) => e).catch(e => e)
    return post.insertId
}

export async function getPostForUserId(id)
{
    return await query(`SELECT * FROM posts WHERE user_id = ${id}`).then(e => e)
}

export async  function findOnePost(id) {
    return await query(`SELECT posts.id, posts.user_id, posts.img_path, users.mailer, users.email, users.username FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = ${id}`, false)
}

export async function getPostSizeForUserId(id)
{
    return await query(`SELECT * FROM posts WHERE user_id = ${id}`, true).then(e => e.length)
}