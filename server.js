const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const sendEmailRoute = require('./routes/sendServiceDueEmail');
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
mongoose.connection.once("open", () => {
    console.log("MongoDB connection success...!");
})

const truckRouter = require("./routes/trucks");
//truck DB
//Backend URL
//http://Localhost:8081/truck

app.use("/truck", truckRouter);

const truckMaintenanceRouter = require("./routes/truckMaintenance");
//Maintenance DB
//Backend URL
//http://Localhost:8081/Maintenance
app.use("/Maintenance", truckMaintenanceRouter);

const truckFuelCostRouter = require("./routes/truckFuelCost");
//Backend URL
//http://Localhost:8081/FuelCost
app.use("/FuelCost", truckFuelCostRouter);

const truckRequestRouterTM = require("./routes/truckrequests");
//Backend URL
//http://Localhost:8081/truckRequest
app.use("/truckRequest", truckRequestRouterTM);

//http://Localhost:8081/api
app.use('/api', sendEmailRoute);

const truckRequestRouter = require("./routes/requestTruck");
//truckrequest DB
//Backend URL
//http://Localhost:8081/requestTruck

app.use("/requestTruck", truckRequestRouter);

const viewPickupRouter = require("./routes/pickups");
//truckrequest DB
//Backend URL
//http://Localhost:8081/pickupRequests

app.use("/pickupRequests", viewPickupRouter);

const shedulePickupRouter = require("./routes/shedulePickUp");
//Backend URL
//http://Localhost:8081/shedulePickup

app.use("/shedulePickup", shedulePickupRouter);

const sendSMSRouter = require("./routes/sendScheduleSMS");
//Backend URL
//http://Localhost:8081/shedulePickup

app.use("/sms", sendSMSRouter);

const requestPickupRouter = require("./routes/AddPickupRequest");
//Backend URL
//http://Localhost:8081/requestPickup

app.use("/requestPickup", requestPickupRouter);

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const paymentRouter = require("./routes/payment");
app.use("/payment", paymentRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const tempUserRouter = require("./routes/tempUser");
app.use("/tempuser", tempUserRouter);

app.get("/", (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome To Recycling Centers MERN Project");
});

const recyclingRoutes = require("./routes/recyclingRoutes");
app.use("/recycling", recyclingRoutes); // Updated route prefix

app.use("/api", require("./routes/auth"));
app.use(cors({ origin: "http://localhost:3000" }));

//load to the existing port
app.listen(PORT, () => {
    console.log(`server is up and running on port : ${PORT}`);
})

