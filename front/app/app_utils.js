export async function isUserOnline() {
    let header_connect = document.getElementById('online_state_header')
    if (header_connect.firstChild)
        header_connect.removeChild(header_connect.firstChild)

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
            console.log(e)
        })

        if (!online)
            localStorage.clear();
    }

    if (!online)
        document.getElementById('online_state_header').insertAdjacentHTML('afterbegin', `<a href="/login" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Connexion</a>`)
    else
        document.getElementById('online_state_header').insertAdjacentHTML('afterbegin', `<a href="/logout" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Déconnexion</a>`)

    return (online)
}

export async function fetch_json(url, method, data) {
    return await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    }).then((res) => {
        return res.json()
    }).catch((e) => {
        return ({ error: 'error request'})
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
        return ({ error: 'error request'})
    })
}