export function isUserOnline()
{
    if (document.cookie)
        console.log('conencted')
    else
        console.log('not connected')
}