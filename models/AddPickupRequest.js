const mongoose = require("mongoose");

const schema = mongoose.Schema;

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
    }
});

//send above details to specific table in DB
const PickUp_Request = mongoose.model("PickUp_Request", pickUpRequestSchma);

//Export the module
module.exports = PickUp_Request;