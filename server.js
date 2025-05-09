const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

require("dotenv").config();

// Initialize
const app = express();

// Assign port
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

// DB link
const URL = process.env.MONGODB_URL;

// MongoDB config
mongoose.connect(URL).then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Connection
mongoose.connection.once("open", ()=> {
    console.log("MongoDB connection success...!");
})

const truckRouter = require("./routes/trucks");
//truck DB
//Backend URL
//http://Localhost:8080/truck
app.use("/truck", truckRouter);

const truckMaintenanceRouter = require("./routes/truckMaintenance");
//Maintenance DB
//Backend URL
//http://Localhost:8080/Maintenance
app.use("/Maintenance", truckMaintenanceRouter);

const truckFuelCostRouter = require("./routes/truckFuelCost");
//Maintenance DB
//Backend URL
//http://Localhost:8080/FuelCost
app.use("/FuelCost", truckFuelCostRouter);

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const paymentRouter = require("./routes/payment");
app.use("/payment", paymentRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const tempUserRouter = require("./routes/tempUser");
app.use("/tempuser", tempUserRouter);

app.use("/api", require("./routes/auth"));
app.use(cors({ origin: "http://localhost:3000" }));

//load to the existing port
app.listen(PORT, ()=> {
    console.log(`server is up and running on port : ${PORT}`);
})

