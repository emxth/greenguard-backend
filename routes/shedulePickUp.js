const router = require("express").Router();

const { error } = require("console");
//use created model
let schedulePickUp = require("../models/SchedulePickUp");

//http://Localhost:8081/shedulePickup/addPickUpSchedule

//Create operation
router.route("/addPickUpSchedule").post((req,res) => {
    const Schedule_ID = req.body.Schedule_ID;
    const PickUp_ID = req.body.PickUp_ID;
    const Truck_RegNumber = req.body.Truck_RegNumber;
    const driver_id = req.body.driver_id;
    const ScheduleDate = req.body.ScheduleDate;
    const Comments = req.body.Comments;
    const ScheduleStatus = req.body.ScheduleStatus;
    const ScheduleTime = req.body.ScheduleTime;

    const newTruckRequest = new schedulePickUp({
        Schedule_ID,
        PickUp_ID,
        Truck_RegNumber,
        driver_id,
        ScheduleDate,
        Comments,
        ScheduleStatus,
        ScheduleTime
    })

    newTruckRequest.save().then(() => {
        res.json("Pickup schedule created successfully !");
    }).catch((err) => {
        console.log(err);
    })  
});

//http://Localhost:8081/shedulePickup/latestScheduleID
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

//http://Localhost:8081/shedulePickup/SearchSchedule/:Date
router.get("/SearchSchedule/:Date", async (req, res) => {
    const Date = req.params.Date;

    try {
        const scheduleList = await schedulePickUp.find({
            $or: [
                { ScheduleDate: Date }
            ]
        });

        if (scheduleList.length > 0) {
            res.status(200).send({ status: "Schedule(s) found", schedules: scheduleList });
        } else {
            res.status(404).send({ status: "No schedules found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Server error", error: err.message });
    }
});


//http://Localhost:8081/shedulePickup/getAllSchedule
//Get all request information
router.route("/getAllSchedule").get((req, res) => {
    schedulePickUp.find().then((schhedule) => {
        res.json(schhedule);
    }).catch((err) => {
        console.log(err);
    })
})

//http://Localhost:8081/shedulePickup/deleteSchedule/:sheduleID
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

//http://Localhost:8081/shedulePickup/getScheduleInfo/:sheduleID
//Get details of one truck request
router.route("/getScheduleInfo/:sheduleID").get(async (req, res) => {
    let SchedId = req.params.sheduleID;

    await schedulePickUp.findOne({Schedule_ID: SchedId }).then((truckScheduleInfo) => {
        res.status(200).send({status: "PickUp schedule fetched", truckScheduleInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch schedule info", error: err.message});
    })
})

//http://Localhost:8081/shedulePickup/updateSchedule/:sheduleID
//Update Schedule Info
router.route("/updateSchedule/:sheduleID").put(async(req, res) => {

    let sheduleID = req.params.sheduleID;
    
    //Destructure method(get updatable records)
    const {ScheduleDate, Comments, ScheduleStatus, ScheduleTime} = req.body;

    //hold new updated records
    const updateSchedule = {
        ScheduleDate,
        Comments,
        ScheduleStatus,
        ScheduleTime
    }

    const UpdateSchedule = await schedulePickUp.findOneAndUpdate({Schedule_ID: sheduleID}, updateSchedule).then(() => {
        res.status(200).send({status : "PickUp Schedule Updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating PickUp Schedule"});
    })
})


module.exports = router;