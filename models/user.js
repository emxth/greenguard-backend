const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: Number,
        unique: true, // Auto-increment should be handled manually or by a package like mongoose-sequence
        required: true,
    },    
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
        enum: ["citizen", "admin", "driver", "request_manager", "finance_manager", "center_manager"],
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