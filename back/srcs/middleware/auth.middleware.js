import jwt from "jsonwebtoken";

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]
}

export default function jwt_middleware(req, res, next) {

    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)


    if (!token) {
        return res.status(401).json({ error: 'Need a token' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ error: 'Bad token' })
        } else {
            // console.log('zeeez')
            req.decoded_token = decodedToken
            return next()
        }
    })
}