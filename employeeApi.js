//create express mini application to handle employee requests
const exp = require("express");
const employeeApiObject = exp.Router();

//inform to express object or employeeApiObject to use JASON parser
employeeApiObject.use(exp.json());

//import middleware
const mid1 = require('../middlewares/middleware1')

//use middleware for all requests
//securityApiObject.use(mid1);


//import mongoDb client object
const dbConnectionObject = require('../db');
dbConnectionObject.initDb();

//REQUEST HANDLERS

//POST REQUEST HANDLER FOR EMPLOYEE LOGIN
employeeApiObject.post('/login',(req,res)=>{
    //get employee colection object
    var employeeCollection = dbConnectionObject.getDb().employeeCollection;
    employeeCollection.findOne({employeeId:req.body.username},(err,result)=>{
        console.log("hgelloo",result);
        
        if(err)
        {
            console.log("error in finding",err);    
        }
        else if(result==null)
        {
            res.send({message:"invalid EMPLOYEE ID"})
        }
        else
        {
            if(req.body.password==result.password)
            {
                res.send({message:"LOGGED IN AS EMPLOYEE"})
            }
            else
            {
                res.send({message:"invalid PASSWORD"})
            }
        }
    });
});

//POST REQUEST HANDLER(REGISTRATION)
employeeApiObject.post('/create',mid1,(req,res)=>{
    console.log(req.body);
    //get employeeCollection object
    var employeeCollection = dbConnectionObject.getDb().employeeCollection;
    employeeCollection.insertOne(req.body,(err,result)=>{
        if(err)
        {
            console.log("error in insert",err);    
        }
        else
        {
            res.send({message:"Employee Registered successfully"})
        }
    });
});

//GET REQUEST HANDLER FOR DISPLAYING COMPLETE EMPLOYEES DATA IN ADMIN DASHBOARD
employeeApiObject.get('/read',(req,res)=>{
    //get employeeCollection object
    var employeeCollection = dbConnectionObject.getDb().employeeCollection;
    employeeCollection.find().toArray((err,dataArray)=>{
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
            console.log(dataArray);
            
            res.send({message:dataArray});
        }
    });
});

//GET REQUEST HANDLER FOR DISPLAYING DATA BASED ON EMPLOYEEID IN EMPLOYEE DASHBOARD
employeeApiObject.get('/getEmployee/:employeeId',(req,res)=>{
    var employeeCollection = dbConnectionObject.getDb().employeeCollection;
    employeeCollection.findOne({employeeId:req.params.employeeId},(err,result)=>{
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

//DELETE REQUEST HANDLER FOR DELETING DATA
employeeApiObject.delete('/delete/:employeeId',(req,res)=>{
    var employeeCollection = dbConnectionObject.getDb().employeeCollection;
    employeeCollection.deleteOne({employeeId:req.params.employeeId},(err,result)=>{
        if(err)
        {
            console.log("error in inserting data");  
        }
        else
        {
            res.send({message:result});
        }
    });
});

//UPDATE REQUEST HANDLER FOR UPDATING EMPLOYEE DATA
employeeApiObject.put('/update',(req,res)=>{
    console.log(req.body);
    
    var employeeCollection = dbConnectionObject.getDb().employeeCollection;
    employeeCollection.updateOne({employeeId:req.body.employeeId},{$set:{fullName:req.body.fullName, Age:req.body.Age, JobRole:req.body.JobRole, Gender:req.body.Gender, Mobile:req.body.Mobile, email:req.body.email, address:req.body.address}},(err,result)=>{
        if(err)
        {
            console.log("error in updating data",err);
        }
        else
        {
            res.send({message:"Employee Updated Successfully"})
        }
    });
});

//Export employeeApiObject
module.exports = employeeApiObject;