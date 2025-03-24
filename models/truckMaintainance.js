const mongoose = require("mongoose");

const schema = mongoose.Schema;

const truckMaintenanceSchema = new schema({
    Truck_RegNum :{
        type: String,
        ref: 'trucks',
        required: true
    },
    Maintenance_Date: {
        type: String,
        required: true
    },
    maintenance_type :{
        type: String,
        required: true
    },
    Cost:{
        type: Number,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Status:{
        type: String,
        default: "Pending"
    }
});

//send above details to specific table in DB
const TruckMaintenance = mongoose.model("TruckMaintenance", truckMaintenanceSchema);

//Export the module
module.exports = TruckMaintenance;