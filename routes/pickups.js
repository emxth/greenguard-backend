const router = require("express").Router();
require("dotenv").config(); 
const axios = require('axios');
const { error } = require("console");
//use created model
let pickups = require("../models/AddPickupRequest");

//http://Localhost:8081/pickupRequests/
//Get all request information
router.route("/").get((req, res) => {
    pickups.find().then((pickupRequests) => {
        res.json(pickupRequests);
    }).catch((err) => {
        console.log(err);
    })
})

//http://Localhost:8081/pickupRequests/updatePickupRequest/:reqID
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

//http://Localhost:8081/pickupRequests/getPickupInfo/:pickUpID
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

//http://Localhost:8081/pickupRequests/latestPickupID
router.get("/latestPickupID", async (req, res) => {
    try {
        const count = await requestPickup.countDocuments(); // Get total count
        let newId = count + 1; // Next Pickup ID
        let formattedId = `P${newId.toString().padStart(2, "0")}`; // Format as P01, P02, etc.

        res.json({ newPickUpID: formattedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
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