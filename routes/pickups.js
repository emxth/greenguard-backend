const router = require("express").Router();
require("dotenv").config(); 
const axios = require('axios');
const { error } = require("console");
//use created model
let pickups = require("../models/AddPickupRequest");

//http://Localhost:8070/pickupRequests/
//Get all request information
router.route("/").get((req, res) => {
    pickups.find().then((pickupRequests) => {
        res.json(pickupRequests);
    }).catch((err) => {
        console.log(err);
    })
})

//http://Localhost:8070/pickupRequests/updatePickupRequest/:reqID
//Update truck Info
router.route("/updatePickupRequest/:reqID").put(async(req, res) => {

    let reqID = req.params.reqID;
    
    //Destructure method(get updatable records)
    const {Status} = req.body;

    //hold new updated records
    const updatePickup = {
        'Status': Status
    }
    const updateRequest = await pickups.findOneAndUpdate({PickUp_ID: reqID}, updatePickup).then(() => {
        res.status(200).send({status : "PickUp status updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating pickup status"});
    })
})

//http://Localhost:8070/pickupRequests/getPickupInfo/:pickUpID
//Get details of one truck request
router.route("/getPickupInfo/:pickUpID").get(async (req, res) => {
    let pickUpID = req.params.pickUpID;

    await pickups.findOne({ PickUp_ID: pickUpID }).then((pickUpInfo) => {
        res.status(200).send({ status: "request fetched", pickUpInfo })
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({ status: "Error in server to fetch pickup request", error: err.message });
    })
})

//http://Localhost:8070/pickupRequests/calculate-sustainability/:id
// API to calculate eco-impact
// Route to calculate sustainability impact
const API_URL = process.env.SUSTAINABILITY_API_URL;

router.post("/calculate-sustainability/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the pickup request using PickUp_ID
        const pickupRequest = await pickups.findOne({ PickUp_ID: id });

        if (!pickupRequest) {
            return res.status(404).json({ message: "Pickup request not found" });
        }

        const { wasteType, Capacity } = pickupRequest;

        // Call the external API (now using .env variable)
        const apiResponse = await axios.post(`${API_URL}`, {
            wasteType,
            weight: Capacity
        });

        const { energySaved, co2Reduced } = apiResponse.data;

        // Determine priority
        let priority = "Low";
        if (co2Reduced > 50) priority = "High";
        else if (co2Reduced > 20) priority = "Medium";

        // Update the record
        pickupRequest.energySaved = energySaved;
        pickupRequest.co2Reduced = co2Reduced;
        pickupRequest.priority = priority;

        await pickupRequest.save();

        res.json({
            message: "Sustainability impact calculated successfully",
            energySaved,
            co2Reduced,
            priority
        });
    } catch (error) {
        console.error("API Call Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/SearchPickupReq/:PickName", async (req, res) => {
    const PickName = req.params.PickName;

    try {
        const pickupsList = await pickups.find({
            Name: { $regex: new RegExp(PickName, "i") }
        });

        if (pickupsList.length > 0) {
            res.status(200).send({ status: "Pickup request(s) found", pickups: pickupsList });
        } else {
            res.status(404).send({ status: "No pickup requests found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Server error", error: err.message });
    }
});



module.exports = router;