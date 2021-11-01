import { query } from "../mysql/mysql";


export async function createPost(user) {
    let post = await query(`INSERT INTO posts(user_id) VALUES ('${user.id}')`).then((e) => e).catch(e => e)
    return post.insertId
}

export async function getPostForUserId(id)
{
    let posts = await query(`SELECT * FROM posts WHERE user_id = ${id}`).then(e => e)
    return posts
}

export async  function findOnePost(id)
{   let post = await query(`SELECT * FROM posts WHERE id = ${id}`, false).then(e => e)
    return post

}
