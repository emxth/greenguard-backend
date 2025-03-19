const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name :{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password_hash:{
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
        enum: ["citizen", "admin", "driver", "center_manager", "worker"],
        default: "citizen",
    },
    created_at:{
        type: Date,
        default: Date.now   // Automatically sets the current date
    },
});

//send above details to specific table in DB
const User = mongoose.model('User', userSchema);

//Export the module
module.exports = User;