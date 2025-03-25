const mongoose = require("mongoose");

const schema = mongoose.Schema;

const schedulePickUp = new schema({
    Schedule_ID : {
        type: String,
        required: true,
        unique: true
    },
    PickUp_ID :{
        type: String,
        ref: 'pickup_requests'
    },
    Truck_RegNumber :{
        type: String,
        ref: 'trucks'
    },
    driver_id :{
        type: Number,
        ref: 'Staff'
    },
    ScheduleDate :{
        type: String,
        required: true
    },
    Comments:{
        type: String,
        required: true
    },
    ScheduleStatus:{
        type: String,
        required: true
    }
});

//send above details to specific table in DB
const PickUpSchedule = mongoose.model("SchedulePickUp", schedulePickUp);

//Export the module
module.exports = PickUpSchedule;