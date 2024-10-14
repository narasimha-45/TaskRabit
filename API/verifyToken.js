const jwt = require('jsonwebtoken')

const bearerTokenValidation = (request,response,next)=>{

    const bearerToken = request.headers.authorization;
    console.log(bearerToken)

    if(bearerToken == undefined){
        response.send({message:"Unauthorized request...plz login "})
    }
    else{
        const token = bearerToken.split(" ")[1]
        try {
            jwt.verify(token,'abcdef')
            next()
        } catch (error) {
            next(new Error("Session expired"))
        }
    }
}

module.exports = bearerTokenValidation;