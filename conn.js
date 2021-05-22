const mongoose = require("mongoose");

mongoose.connect("mongodb://mongo:27017/transaction", { useNewUrlParser: true,useUnifiedTopology: true  } ,function(err){
    if(!err){
        console.log('Success');
    }else{
        console.log('Failure');
    }
})

module.exports=mongoose.connection;