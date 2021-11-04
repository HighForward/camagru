export default class inputValidator
{
    constructor(email, username, password, confirm_password) {
        this.email = email
        this.username = username
        this.password = password
        this.confirm_password = confirm_password
    }

    isValidEmail()
    {
        let email_regex = /^[^\s@]+@[^\s@]+$/

        return email_regex.test(this.email);

    }

    isValidPassword()
    {
        let password_regex = /^[A-Za-z]\w{2,14}$/

        return password_regex.test(this.password)
    }

    isValidUsername()
    {
        let password_regex = /^[A-Za-z]\w{2,14}$/

        return password_regex.test(this.username)
    }

    checkValueRegister()
    {

        if (!this.isValidEmail())
            return ({error: 'l\'email est incorrect'})

        if (!this.isValidUsername())
            return ({error: 'le nom d\'utilisateur est incorrect'})

        if (!this.isValidPassword())
            return ({ error: 'le mot de passe est incorrect' })

        if (this.password !== this.confirm_password)
            return ({ error: 'les mot de passe ne sont pas identique' })

        return ({success: 'Informations corrects'})
    }

    checkValueLogin()
    {
        if (!this.isValidUsername())
            return ({error: 'le nom d\'utilisateur est incorrect'})

        if (!this.isValidPassword())
            return ({ error: 'le mot de passe est incorrect' })

        return ({ success: 'Information corrects '})
    }

    checkValueUpdate()
    {
        if (!this.isValidEmail())
            return ({error: 'l\'email est incorrect'})

        if (!this.isValidUsername())
            return ({error: 'le nom d\'utilisateur est incorrect'})

        if (!this.isValidPassword())
            return ({ error: 'le mot de passe est incorrect' })

        return ({ success: 'Information corrects '})
    }

}