const router = require("express").Router();

const { error } = require("console");
//use created model
let schedulePickUp = require("../models/SchedulePickUp");

//http://Localhost:8070/shedulePickup/addPickUpSchedule

//Create operation
router.route("/addPickUpSchedule").post((req,res) => {
    const Schedule_ID = req.body.Schedule_ID;
    const PickUp_ID = req.body.PickUp_ID;
    const Truck_RegNumber = req.body.Truck_RegNumber;
    const driver_id = Number(req.body.driver_id);
    const ScheduleDate = req.body.ScheduleDate;
    const Comments = req.body.Comments;
    const ScheduleStatus = req.body.ScheduleStatus;

    const newTruckRequest = new schedulePickUp({
        Schedule_ID,
        PickUp_ID,
        Truck_RegNumber,
        driver_id,
        ScheduleDate,
        Comments,
        ScheduleStatus
    })

    newTruckRequest.save().then(() => {
        res.json("Pickup schedule created successfully !");
    }).catch((err) => {
        console.log(err);
    })  
});

//http://Localhost:8070/shedulePickup/latestScheduleID
router.get("/latestScheduleID", async (req, res) => {
    try {
        const count = await schedulePickUp.countDocuments(); // Get total count
        let newId = count + 1; // Next Pickup ID
        let formattedId = `S${newId.toString().padStart(2, "0")}`; // Format as S01, S02, etc.

        res.json({ newSchedule_ID: formattedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//http://Localhost:8070/shedulePickup/getAllSchedule
//Get all request information
router.route("/getAllSchedule").get((req, res) => {
    schedulePickUp.find().then((schhedule) => {
        res.json(schhedule);
    }).catch((err) => {
        console.log(err);
    })
})

//http://Localhost:8070/shedulePickup/deleteSchedule/:sheduleID
//Delete schedule 
router.route("/deleteSchedule/:sheduleID").delete(async(req, res) =>{
    let sheduleID = req.params.sheduleID;

    await schedulePickUp.findOneAndDelete({Schedule_ID: sheduleID }).then(() => {
        res.status(200).send({status: "truck schedule deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to delete schedule", error:err.message});
    })
})


module.exports = router;