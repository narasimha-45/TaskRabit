const exp = require('express');
const home = exp.Router()


home.get('/',(req,res)=>{
    res.send("welcome to Task Rabit");
})

module.exports=home;