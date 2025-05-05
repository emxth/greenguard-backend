const mongoose = require("mongoose");

const schema = mongoose.Schema;
//Pickup request schema
const pickUpRequestSchma = new schema({
    PickUp_ID :{
        type: String,
        unique: true,
    },
    UserID : {
        type: Number,
        ref: 'User'
    },
    Name :{
        type: String,
        required: true
    },
    PickupDate :{
        type: String,
        required: true
    },
    wasteType :{
        required: true,
        type: String
    },
    Capacity :{
        type: String,
        required: true
    },
    PickupLocation:{
        type: String,
        required: true
    },
    Phone:{
        type: Number,
        required: true
    },
    Status:{
        type: String,
    },
    energySaved: { 
        type: Number, 
        default: 0 
    },
    co2Reduced: { 
        type: Number, 
        default: 0 
    },
    priority: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
    }
});

//send above details to specific table in DB
const PickUp_Request = mongoose.model("PickUp_Request", pickUpRequestSchma);

//Export the module
module.exports = PickUp_Request;