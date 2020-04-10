//create express mini application to handle employee requests
const exp = require("express");
const logDetailsApiObject = exp.Router();

//inform to express object or logDetailsApiObject to use JASON parser
logDetailsApiObject.use(exp.json());

//import middleware
const logMid = require('../middlewares/logMiddleware')

//use middleware for all requests
//securityApiObject.use(mid1);

//import mongoDb client object
const dbConnectionObject = require('../db');
dbConnectionObject.initDb();

//REQUEST HANDLERS

//POST REQUEST HANDLER(LOG DETAILS REGISTRATION)
logDetailsApiObject.post('/enter',logMid,(req,res)=>{
    console.log(req.body);
    //get logDetailsCollection object
    var logDetailsCollection = dbConnectionObject.getDb().logDetailsCollection;
    logDetailsCollection.insertOne(req.body,(err,result)=>{
    if(err)
    {
        console.log("error in insert",err);    
    }
    else
    {
        res.send({message:"Log Details entered successfully"})
    }
});    
});


//GET REQUEST HANDLER FOR DISPLAYING LOG DETAILS
logDetailsApiObject.get('/get',(req,res)=>{
    var logDetailsCollection = dbConnectionObject.getDb().logDetailsCollection;
    logDetailsCollection.find().toArray((err,dataArray)=>{
        if(err)
        {
            console.log("error in reading data",err);   
        }
        else if(dataArray.length==0)
        {
            res.send({message:"NO DATA IN DATABASE TO DISPLAY"})
        }
        else
        {
            res.send({message:dataArray});
        }
    });
});

//GET REQUEST HANDLER FOR DISPLAYING DATA BASED ON DATE
logDetailsApiObject.get('/get/:date',(req,res)=>{
    // console.log(req.params);
    
    var logDetailsCollection = dbConnectionObject.getDb().logDetailsCollection;
    logDetailsCollection.find({date:req.params.date}).toArray((err,result)=>{
        if(err)
        {
            console.log("error in displaying data",err);    
        }
        else if(result.length==0)
        {
             res.send({message:"No data found on this date"})
        }
        else
        {
            res.send({message:result})
            console.log(result)
        }
    });
});

//GET REQUEST HANDLER FOR DISPLAYING LOG DETAILS TO EMPLOYEE DASHBOARD BASED ON EMPLOYEE LOGIN
logDetailsApiObject.get('/MyLogDetails/:employeeId',(req,res)=>{
    var logDetailsCollection = dbConnectionObject.getDb().logDetailsCollection
    logDetailsCollection.findOne({employeeId:req.params.employeeId},(err,result)=>{
        if(err)
        {
            console.log("error in reading employee log data");   
        }
        else
        {
            res.send({message:result})
        }
    });
});

//PUT REQUEST HANDLER FOR UPDATING LOG DETAILS
logDetailsApiObject.put('/update',(req,res)=>{
    var logDetailsCollection = dbConnectionObject.getDb().logDetailsCollection;
    logDetailsCollection.updateMany({vehicleNumber:req.body.vehicleNumber,date:req.body.date},{$set:{checkOut:req.body.checkOut}},(err,result)=>{
        if(err)
        {
            console.log("error in updating data",err);    
        }
        else
        {
            res.send({message:"CHECK OUT ADDED FOR EMPLOYEE"})
        }

        
    });
});

// //GET REQUEST HANDLER FOR DISPLAYING DATA
// employeeApiObject.get('/read',(req,res)=>{
//     //get employeeCollection object
//     var employeeCollection = dbConnectionObject.getDb().employeeCollection;
//     employeeCollection.find().toArray((err,dataArray)=>{
//         if(err)
//         {
//             console.log("error in displaying data",err);    
//         }
//         else if(dataArray.length==0)
//         {
//             res.send({message:"No data to display"})
//         }
//         else
//         {
//             console.log(dataArray);
            
//             res.send({message:dataArray});
//         }
//     });
// });

// //DELETE REQUEST HANDLER FOR DELETING DATA
// employeeApiObject.delete('/delete/:employeeId',(req,res)=>{
//     var employeeCollection = dbConnectionObject.getDb().employeeCollection;
//     employeeCollection.deleteOne({employeeId:req.params.employeeId},(err,result)=>{
//         if(err)
//         {
//             console.log("error in inserting data");  
//         }
//         else
//         {
//             res.send({message:result});
//         }
//     });
// });

// //UPDATE REQUEST HANDLER FOR UPDATING EMPLOYEE DATA
// employeeApiObject.put('/update',(req,res)=>{
//     console.log(req.body);
    
//     var employeeCollection = dbConnectionObject.getDb().employeeCollection;
//     employeeCollection.updateOne({employeeId:req.body.employeeId},{$set:{fullName:req.body.fullName, Age:req.body.Age, JobRole:req.body.JobRole, Gender:req.body.Gender, Mobile:req.body.Mobile, email:req.body.email, address:req.body.address}},(err,result)=>{
//         if(err)
//         {
//             console.log("error in updating data",err);
//         }
//         else
//         {
//             res.send({message:"Employee Updated Successfully"})
//         }
//     });
// });

//Export logDetailsApiObject
module.exports = logDetailsApiObject;