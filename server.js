const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

require("dotenv").config();

//Initialize
const app = express();

//Assign port
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

//DB link
const URL = process.env.MONGODB_URL;

//MongoDB config
mongoose.connect(URL).then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//Connection
mongoose.connection.once("open", ()=> {
    console.log("MongoDB connection success...!");
})

const requestPickupRouter = require("./routes/AddPickupRequest");
//Backend URL
//http://Localhost:8070/requestPickup

app.use("/requestPickup", requestPickupRouter); 

//load to the existing port
app.listen(PORT, ()=> {
    console.log(`server is up and running on port : ${PORT}`);
})

