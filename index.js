const exp = require('express')

const app = exp()

const mongoClient = require('mongodb').MongoClient
app.listen(1234,()=>{
    console.log("server started at port",1234)
})

mongoClient.connect("mongodb://0.0.0.0:27017")
.then((dbRef)=>{
    const dbObj = dbRef.db('TaskRabit');
    const userObj = dbObj.collection("UserDetails");
    const userTaskCollectionObj = dbObj.collection("userTaskCollection")
    app.set("userObj",userObj)
    app.set("userTaskCollectionObj",userTaskCollectionObj)
    console.log("Data base connection is done");
})

const userApp = require("./API/userAPI")
app.use('/usersApi',userApp)  

const home = require('./API/home')
app.use('/',home)

const invalidPathHandlerMiddleWare = (request,response,next)=>{
    response.send({message:"Invalid Path"})
}

app.use("*",invalidPathHandlerMiddleWare)


const errorHandlerMiddleWare = (error,request,response,next)=>{
    response.send({message:error.message})
}
app.use(errorHandlerMiddleWare) 
