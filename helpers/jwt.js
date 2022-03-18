const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked : isRevoked

    }).unless({
        path:[
                {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
                {url: /\/products(.*)/, methods : ['GET' , 'OPTIONS']},
                {url: /\/categories(.*)/, methods : ['GET' , 'OPTIONS']},
                {url: /\/orders(.*)/, methods : ['GET' , 'OPTIONS']},

            '/users/login',
            '/users/register',
            
        ]
    })
}

async function isRevoked(req , payload , done){
    if(!payload.isAdmin){
        done(null , true) ; 
    }
    else{
        done() ;
    }
}




module.exports = authJwt