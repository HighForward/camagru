import {app_header} from './app.js'

function getJwtToken()
{
    let jwt
    if (document.cookie && document.cookie.includes('jwt='))
    {
        jwt = document.cookie.substring(4)
        if (jwt && jwt.length)
            return jwt
    }
    return ""
}

export const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export async function isUserOnline() {

    let online = false

    console.log(document.cookie)
    let jwt = getJwtToken()
    let user = null
    if (jwt)
    {
        online = await fetch_get('http://localhost:4000/auth/fetch_user').then((e) => {
            if (!e.error)
                user = e;
            return !e.error;
        }).catch((e) => {
            return false
        })

        console.log(online)

        if (!online)
            console.log('pas online on reset')

        if (!online)
            deleteAllCookies()
    }

    return (user)
}

export async function fetch_json(url, method, data, authJWT = false) {

    let init = {
        method: method,
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    }

    if (authJWT) {
        let jwt = getJwtToken()
        init.headers.append('withCredentials', true)
        init.headers.append('credentials', 'includes')
        init.headers.append("Authorization", `Bearer ${jwt}`)
    }

    return await fetch(url, init).then((res) => {
        return res.json()
    }).catch((e) => {
        if (e.error)
            return ({ error: e.error })
        return ({ error: e})
    })
}

export async function fetch_get(url) {

    let jwt = getJwtToken()
    return await fetch(url, {
        method: 'GET',
        headers: new Headers({
            withCredentials: true,
            credentials: 'include',
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        })
    }).then(async (res) => {
        return res.json()
    }).catch((e) => {

        console.log(e)

        return ({ error: 'error request'})
    })
}


export function checkEmail(value)
{
    let email_regex = /^[^\s@]+@[^\s@]+$/

    return email_regex.test(value);

}

export function checkPasswordUsername(value)
{
    let password_regex = /^[A-Za-z]\w{2,14}$/

    return password_regex.test(value)
}
