const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isUser
    }).unless({
        path: [
            // {url: /\/tttn\/product(.*)/ , methods: ['GET','OPTIONS', 'POST', 'PUT', 'DELETE'] },
            // {url: /\/tttn\/category(.*)/ , methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'] },
            `${api}/user/login`,
            `${api}/user/register`,
            `${api}/shipper/login`,
            `${api}/shipper/register`,
            // { url: /\/tttn\/user(.*)/, methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'] },
            // { url: /\/tttn\/shipper(.*)/, methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'] },
            // { url: /\/tttn\/order(.*)/, methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'] },
            // {url: /\/public\/uploads(.*)/ , methods: ['GET','OPTIONS', 'POST', 'PUT', 'DELETE'] },
            // { url: /\/tttn\/auth(.*)/, methods: ['GET'] },
            {url: /\/(.*)/ , methods: ['GET','OPTIONS', 'POST', 'PUT', 'DELETE'] },
        ]
    })
}

// async function isRevoked(req, payload, done) {
//     if(!payload.isAdmin) {
//         done(null, true)
//     }

//     done();
// }
async function isUser(req, payload, done) {
    if (payload.userId || payload.shipperId) {
        done();
    } else {
        done(null, true);
    }
}


module.exports = authJwt