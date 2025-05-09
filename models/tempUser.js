const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tempUserSchema = new Schema({ 
    email:{
        type: String,
        required: false,
    },
    otp: { 
        type: String, 
        default: null 
    },
    otpExpiry: { 
        type: Date, 
        default: null 
    }
});

//send above details to specific table in DB
const TempUser = mongoose.model('TempUser', tempUserSchema);

//Export the module
module.exports = TempUser;