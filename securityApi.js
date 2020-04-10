//create express mini application to handle security requests
const exp = require("express");
const securityApiObject = exp.Router();

//inform to express object or securityAPiObject to use JASON parser
securityApiObject.use(exp.json());

//import middleware
const secMid = require('../middlewares/secMiddleware')

//use middleware for all requests
//securityApiObject.use(mid1);


//import mongoDb client object
const dbConnectionObject = require('../db');
dbConnectionObject.initDb();

//REQUEST HANDLERS

//POST REQUEST HANDLER FOR SECURITY LOGIN
securityApiObject.post('/login',(req,res)=>{
    //get security colection object
    var securityCollection = dbConnectionObject.getDb().securityCollection;
    securityCollection.findOne({securityId:req.body.username},(err,result)=>{    
        if(err)
        {
            console.log("error in finding",err);    
        }
        else if(result==null)
        {
            res.send({message:"invalid SECURITY ID"})
        }
        else
        {
            if(req.body.password==result.password)
            {
                res.send({message:"LOGGED IN AS SECURITY"})
            }
            else
            {
                res.send({message:"invalid PASSWORD"})
            }
        }
    });
});

//GET REQUEST HANDLER FOR DISPLAYING DATA BASED ON SECURITYID IN SECURITY DASHBOARD
securityApiObject.get('/getSecurity/:securityId',(req,res)=>{
    var securityCollection = dbConnectionObject.getDb().securityCollection;
    securityCollection.findOne({securityId:req.params.securityId},(err,result)=>{
        if(err)
        {
            console.log("error in reading",err);    
        }
        else
        {
            res.send({message:result})
        }
    });
});

//POST REQUEST HANDLER FOR SECURITY REGISTRATION
securityApiObject.post('/create',secMid,(req,res)=>{
    console.log(req.body);
    //get securityCollection object
    var securityCollection = dbConnectionObject.getDb().securityCollection;
    securityCollection.insertOne(req.body,(err,result)=>{
        if(err)
        {
            console.log("error in insert",err);    
        }
        else
        {
            res.send({message:"Security Registered successfully"})
        }
    });
});

//GET REQUEST HANDLER FOR DISPLAYING ALL SECURITIES DATA
securityApiObject.get('/read',(req,res)=>{
    //get securityCollection object
    var securityCollection = dbConnectionObject.getDb().securityCollection;
    securityCollection.find().toArray((err,dataArray)=>{
        if(err)
        {
            console.log("error in displaying data",err);    
        }
        else if(dataArray.length==0)
        {
            res.send({message:"No data to display"})
        }
        else
        {
            res.send({message:dataArray});
        }
    });
});

//DELETE REQUEST HANDLER FOR DELETING DATA OF SECURITY
securityApiObject.delete('/delete/:securityId',(req,res)=>{
    //get securityCollection object
    var securityCollection = dbConnectionObject.getDb().securityCollection;
    securityCollection.deleteOne({securityId:req.params.securityId},(err,result)=>{
        if(err)
        {
            console.log("error deleting data",err);  
        }
        else
        {
            res.send({message:result})
        }
    });
});

//PUT REQUEST HANDLER OF UPDATING DATA
securityApiObject.put('/update',(req,res)=>{
    //get securityCollection object
    var securityCollection = dbConnectionObject.getDb().securityCollection;
    securityCollection.updateOne({securityId:req.body.securityId},{$set:{fullName:req.body.fullName}},(err,result)=>{
        if(err)
        {
            console.log("error in updating data",err);   
        }
        else
        {
            res.send({message:"security updated successfully"});
        }
    });
});

//Export SecurityApiObject
module.exports = securityApiObject;