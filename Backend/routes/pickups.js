const router = require("express").Router();

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

//http://Localhost:8070/pickupRequests/getPickupInfo/:pickUpID
//Get details of one truck request
router.route("/getPickupInfo/:pickUpID").get(async (req, res) => {
    let pickUpID = req.params.pickUpID;

    await pickups.findOne({PickUp_ID: pickUpID }).then((pickUpInfo) => {
        res.status(200).send({status: "request fetched", pickUpInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch pickup request", error: err.message});
    })
})


module.exports = router;