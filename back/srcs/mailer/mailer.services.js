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

function getTextFromMailType(user, mail_type)
{
    // console.log(mail_type)
    if (mail_type === MAIL_TYPE.REGISTER)
    {
        return `<div>` +
        `<p>Pour finir de t'enregistrer et profiter à fond de camagru, clique sur ce lien:</p>` +
        `<p>http://localhost:80/validate/${user.uuid}</p>` +
        `</div>`
    }

    if (mail_type === MAIL_TYPE.RESET)
    {
        return `<div>` +
            `<p>Pour definir un nouveau mot de passe, clique sur ce lien</p>` +
            // `<p>http://localhost:80/reset/${user.uuid}</p>` +
            `</div>`
    }
}

export async function sendMail(email, user, mail_type)
{
    try {
        await transporter.sendMail({
            from: process.env.MAIL_APP,
            to: email,
            subject: mail_type.subject,
            html: getTextFromMailType(user, mail_type)
        })
        return true
    } catch (e) {
        return false
    }
}