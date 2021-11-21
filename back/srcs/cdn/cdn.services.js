import {findOneByUsername} from "../users/users.services";
import fs from "fs";

export async function getUserProfilePicture(username)
{
    if (!username)
        return {error: 'wrong param'}

    let user = await findOneByUsername(username)
    if (!user)
        return {error: 'user not found'}

    if (user.profile_img) {

        const contents = fs.readFileSync(`img/users/${user.id}/${user.id}-profile.png`, {encoding: 'base64'});
        return {imgBase64: contents}
    }

    return {error: 'no profile picture found'}
}