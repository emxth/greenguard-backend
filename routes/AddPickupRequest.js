const router = require("express").Router();

const { error } = require("console");
//use created model
let requestPickup = require("../models/AddPickupRequest");

//http://Localhost:8070/requestPickup/addPickUpRequest

//Create operation
router.route("/addPickUpRequest").post((req, res) => {
    const PickUp_ID = req.body.PickUp_ID;
    const UserID = Number(req.body.UserID);
    const Name = req.body.Name;
    const PickupDate = req.body.PickupDate;
    const wasteType = req.body.wasteType;
    const Capacity = req.body.Capacity;
    const PickupLocation = req.body.PickupLocation;
    const Phone = Number(req.body.Phone);
    const Status = req.body.Status;

    const pickUprequest = new requestPickup({
        PickUp_ID,
        UserID,
        Name,
        PickupDate,
        wasteType,
        Capacity,
        PickupLocation,
        Phone,
        Status
    })

    pickUprequest.save().then(() => {
        res.json("Pickup created successfully !");
    }).catch((err) => {
        console.log(err);
    })
});

//http://Localhost:8070/requestPickup/count

// Route to get the total count of pickup requests
router.get("/count", async (req, res) => {
    try {
        const count = await requestPickup.countDocuments(); // Get the total count
        res.json({ totalPickups: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


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

module.exports = router;