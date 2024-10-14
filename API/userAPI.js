const exp = require('express');
const userApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require('bcryptjs');
const jwtToken = require('jsonwebtoken')
const tokenVerify = require('./verifyToken');
const bearerTokenValidation = require('./verifyToken');
var multer  = require('multer')


userApp.use(exp.json()) // To parse the Body of the request


userApp.post('/login-user',expressAsyncHandler(async(request,response)=>{
    const userCollectionObj = request.app.get("userObj")
    let userDetails = request.body;
    let userExist = await userCollectionObj.findOne({username:userDetails.username})
    if(userExist == null){
        response.send({message:"Username doesn't exist",status:"false"})
    }
    else{
        let passwaordCompare = bcryptjs.compare(userDetails.password,userExist.password)

        if(passwaordCompare == false){
            response.status.send({message:"Incorrect password",status:"false"})
        }
        else{
            let jwt = jwtToken.sign({username:userDetails.username},'abcdef',{expiresIn:180})
            response.status(200).send({message:"valid user",token:jwt,status:"true"})
        }
    }

}))



userApp.post('/create-user',expressAsyncHandler(async (request,response)=>{
    console.log("registered");
    const userCollectionObj = request.app.get("userObj")
    const newUser = request.body;
    console.log(newUser)
    let userOfDb = await userCollectionObj.findOne({username:newUser.username})

    if(userOfDb!=null){
        response.status(200).send({message:"user already exist",status:"false"})
    }
    else{
        let hashPassword = await bcryptjs.hash(newUser.password,5);
        newUser.password = hashPassword;
        await userCollectionObj.insertOne(newUser)
        response.send({message:"User created",status:"true"})
    }
}))



userApp.put('/update-user',expressAsyncHandler(async(request,response)=>{
    const userCollectionObj = request.app.get("userObj")
    const modifiedUser = request.body;
    let user = await userCollectionObj.updateOne({id:modifiedUser.id},{$set:modifiedUser})
    response.send({message:"Data updated"})
})
)


userApp.delete('/delete-user/:id',expressAsyncHandler(async(request,response)=>{

    const userCollectionObj = request.app.get("userObj")

    let userId = parseInt(request.params.id);

    let user = await userCollectionObj.deleteOne({id:userId})
    response.send({message:"Data deleted"})
    
}))


userApp.post('/add-task/:id',expressAsyncHandler(async(request,response)=>{
    const userTaskCollectionObj = request.app.get("userTaskCollectionObj")
    const id = parseInt(request.params.id)
    const newTask = request.body
    let user = await userTaskCollectionObj.insertOne({userId:id,task:newTask.task})
    response.send({message:"Task added",status:"true"})
}))

module.exports=userApp;


