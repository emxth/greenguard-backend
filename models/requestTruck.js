const mongoose = require("mongoose");

const schema = mongoose.Schema;

const requestTruckSchema = new schema({
    RequestID : {
        type: String,
        required: true,
        unique: true
    },
    Truck_RegNumber :{
        type: String,
        ref: 'trucks'
    },
    PickUp_ID :{
        type: String,
        ref: 'pickup_requests'
    },
    driver_id :{
        type: String,
        ref: 'users'
    },
    Request_Date :{
        type: String,
        required: true
    },
    TruckCapacity:{
        type: Number,
        required: true
    },
    PickupLocation:{
        type: String,
        required: true
    },
    Priority:{
        type: String,
        required: true
    },
    RequestStatus:{
        type: String,
    }
});

//send above details to specific table in DB
const RequestTruck = mongoose.model("RequestTruck", requestTruckSchema);

//Export the module
module.exports = RequestTruck;