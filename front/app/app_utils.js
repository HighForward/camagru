export function isUserOnline()
{
    let header_connect = document.getElementById('online_state_header')
    if (header_connect.firstChild)
    header_connect.removeChild(header_connect.firstChild)

    let online = !!document.cookie;

    if (!online)
        document.getElementById('online_state_header').insertAdjacentHTML('afterbegin', `<a href="/login" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Connexion</a>`)
    else
        document.getElementById('online_state_header').insertAdjacentHTML('afterbegin', `<a href="/logout" class="flex justify-center px-4 py-2 rounded text-center border border-gray-400 mr-16" style="background: #2ECC71;" data-link>Déconnexion</a>`)

}

export async function fetch_json(url, data) {
    return await fetch(url, {
        method: "POST",
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