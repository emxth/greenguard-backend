const mongoose = require("mongoose");

const schema = mongoose.Schema;

const truckSchema = new schema({
    RegNumber : {
        type: String,
        required: true,
        unique: true
    },
    Model :{
        type: String,
        required: true
    },
    Capacity :{
        type: Number,
        required: true
    },
    Insurance_Expiry:{
        type: String,
        required: true
    },
    Inspection__date:{
        type: String,
        required: true
    },
    Collection_center_id:{
        type: Number,
        required: true,
        ref: 'Collection_center'
    },
    driver_id: {
        type: Number,
        required: true,
        ref: 'user'
    },
    isActive:{
        type: Boolean,
        required: true
    }
});

//send above details to specific table in DB
const truck = mongoose.model("Truck", truckSchema);

//Export the module
module.exports = truck;