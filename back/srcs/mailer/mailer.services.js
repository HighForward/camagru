import nodemailer from "nodemailer";


export const MAIL_TYPE = {
    REGISTER: {type: 'register' ,subject: 'Bienvenue sur Camagru'},
    COMMENT: {type: 'comment', subject: 'Notification de commentaire'},
    RESET: {type: 'reset', subject: 'Changement de mot de passe'},
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.MAIL_APP,
        pass: process.env.MAIL_PASSWORD
    }
});

let mailOptions = {
    from: process.env.MAIL_APP,
    to: 'm4xth9r@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

function getTextFromMailType(mail_type, data)
{
    // console.log(mail_type)
    if (mail_type === MAIL_TYPE.REGISTER && data)
    {
        return `<div>` +
        `<p>Pour finir de t'enregistrer et profiter à fond de camagru, clique sur ce lien:</p>` +
        `<p>http://localhost:80/validate/${data.uuid}</p>` +
        `</div>`
    }

    if (mail_type === MAIL_TYPE.RESET)
    {
        console.log(data)
        return `<div>` +
            `<p>Pour definir un nouveau mot de passe, clique sur ce lien</p>` +
            `<p>http://localhost:80/reset/${data.reset_uuid}</p>` +
            `</div>`
    }

    if (mail_type === MAIL_TYPE.COMMENT && data)
    {
        return `<div>` +
            `<p>Vous avez un nouveau commentaire de la part de ${data.username}:</p>` +
            `<p>${data.comment}</p>` +
        `</div>`
    }
}

export async function sendMail(email, mail_type, data)
{
    try {
        await transporter.sendMail({
            from: process.env.MAIL_APP,
            to: email,
            subject: mail_type.subject,
            html: getTextFromMailType(mail_type, data)
        })
        return true
    } catch (e) {
        return false
    }
}