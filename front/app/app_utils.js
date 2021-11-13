import {app_header} from './app.js'

export async function isUserOnline() {

    let online = false

    let jwt = localStorage.getItem('jwt');
    let user = null
    if (jwt)
    {
        online = await fetch_get('http://localhost:4000/auth/fetch_user').then((e) => {
            if (!e.error)
                user = e;
            return !e.error;
        }).catch((e) => {
            // console.log(e)
            return false
        })

        if (!online)
            localStorage.clear();
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
        init.headers.append('withCredentials', true)
        init.headers.append('credentials', 'includes')
        init.headers.append("Authorization", `Bearer ${localStorage.getItem('jwt')}`)
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
    return await fetch(url, {
        method: 'GET',
        headers: new Headers({
            withCredentials: true,
            credentials: 'include',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        })
    }).then(async (res) => {
        return res.json()
    }).catch((e) => {

        console.log(e)

        return ({ error: 'error request'})
    })
}