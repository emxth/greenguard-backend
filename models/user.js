const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({ 
    first_name :{
        type: String,
        required: true,
    },
    last_name :{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum: ["citizen", "admin", "driver", "request_manager", "finance_manager", "center_manager", "truck_manager"],
        default: "citizen",
    },
    created_at:{
        type: Date,
        default: Date.now   // Automatically sets the current date
    },
    stripe_customer_id: {
        type: String,
        required: false,
        default: null,
    },
    driverID: {
        type: String,
        default: null,
    }
});

//send above details to specific table in DB
const User = mongoose.model('User', userSchema);

//Export the module
module.exports = User;