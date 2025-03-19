const mongoose = require("mongoose");

const schema = mongoose.Schema;

const truckFuelSchema = new schema({
    Truck_RegNum :{
        type: String,
        ref: 'trucks',
    },
    Fuel_Date: {
        type: String,
        required: true
    },
    FuelType:{
        type: String,
        required: true
    },
    FuelCost :{
        type: Number,
        required: true
    },
    Litres: {
        type: Number,
        required: true
    },
    Status:{
        type: String,
    }
});

//send above details to specific table in DB
const TruckFuelCost = mongoose.model("TruckFuelCost", truckFuelSchema);

//Export the module
module.exports = TruckFuelCost;