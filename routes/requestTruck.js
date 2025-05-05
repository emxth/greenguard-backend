const router = require("express").Router();

const { error } = require("console");
//use created model
let requestTruck = require("../models/requestTruck");

//http://Localhost:8070/requestTruck/addtruckRequest

//Create operation
router.route("/addtruckRequest").post((req,res) => {
    const RequestID = req.body.RequestID;
    const Truck_RegNumber = req.body.Truck_RegNumber;
    const PickUp_ID = req.body.PickUp_ID;
    const driver_id = req.body.driver_id;
    const Request_Date = req.body.Request_Date;
    const TruckCapacity = Number(req.body.TruckCapacity);
    const PickupLocation = req.body.PickupLocation;
    const Priority = req.body.Priority;
    const RequestStatus = req.body.RequestStatus;

    const newTruckRequest = new requestTruck({
        RequestID,
        Truck_RegNumber,
        PickUp_ID,
        driver_id,
        Request_Date,
        TruckCapacity,
        PickupLocation,
        Priority,
        RequestStatus
    })

    newTruckRequest.save().then(() => {
        res.json("Truck request created successfully !");
    }).catch((err) => {
        console.log(err);
    })  
});

//http://Localhost:8070/requestTruck/
//Get all request information
router.route("/").get((req, res) => {
    requestTruck.find().then((trucks) => {
        res.json(trucks);
    }).catch((err) => {
        console.log(err);
    })
})

//http://Localhost:8070/requestTruck/deleteRequest/:reqID
//Delete Truck request 
router.route("/deleteRequest/:reqID").delete(async(req, res) =>{
    let reqID = req.params.reqID;

    await requestTruck.findOneAndDelete({RequestID: reqID }).then(() => {
        res.status(200).send({status: "truck request deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to delete", error:err.message});
    })
})

//http://Localhost:8070/requestTruck/gettruckRequest/:reqID
//Get details of one truck request
router.route("/gettruckRequest/:reqID").get(async (req, res) => {
    let reqID = req.params.reqID;

    await requestTruck.findOne({RequestID: reqID }).then((truckRequestInfo) => {
        res.status(200).send({status: "Truck request fetched", truckRequestInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch truck request", error: err.message});
    })
})

//http://Localhost:8070/requestTruck/searchRequest/:reqID

//Search Truck
router.route("/searchRequest/:reqID").get(async (req, res) => {
    let reqID = req.params.reqID;

    await requestTruck.findOne({ RequestID: reqID })
        .then((truckRequest) => {
            if (truckRequest) {
                res.status(200).send({ status: "Truck request found", truckRequest });
            } else {
                res.status(404).send({ status: "Truck request not found" });
            }
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error in server", error: err.message });
        });
});

//http://Localhost:8070/requestTruck/latestRequestID
router.get("/latestRequestID", async (req, res) => {
    try {
        const count = await requestTruck.countDocuments(); // Get total count
        let newId = count + 1; // Next Pickup ID
        let formattedId = `R${newId.toString().padStart(2, "0")}`; // Format as P01, P02, etc.

        res.json({ newRequestID: formattedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//http://Localhost:8070/requestTruck/getAssignedRequests
//Get assigned truck details
router.route("/getAssignedRequests").get(async (req, res) => {
    try {
        const assignedTruckRequest = await requestTruck.find({ RequestStatus: "Assigned" });
        res.status(200).json(assignedTruckRequest);
    } catch (err) {
        console.error("Error fetching assigned truck requests:", err);
        res.status(500).json({ status: "Error fetching assigned truck requests", error: err.message });
    }
});

//http://Localhost:8070/requestTruck/searcReqTruck/:reqID
router.get("/searcReqTruck/:reqID", async (req, res) => {
    const reqID = req.params.reqID;

    try {
        const RequestList = await requestTruck.find({
            $or: [
                { RequestID: { $regex: new RegExp(reqID, "i") } }
            ]
        });

        if (RequestList.length > 0) {
            res.status(200).send({ status: "Truck request(s) found", requests: RequestList });
        } else {
            res.status(404).send({ status: "No truck requests found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Server error", error: err.message });
    }
});

//http://Localhost:8070/requestTruck/update/:reqID
//Update truck Info
router.route("/update/:reqID").put(async(req, res) => {

    let reqID = req.params.reqID;
    
    //Destructure method(get updatable records)
    const {Request_Date, TruckCapacity, Priority} = req.body;

    //hold new updated records
    const updatetruckRequest = {
        Request_Date,
        TruckCapacity,
        Priority
    }

    const updateRequest = await requestTruck.findOneAndUpdate({RequestID: reqID}, updatetruckRequest).then(() => {
        res.status(200).send({status : "Truck Request updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating truck request"});
    })
})

//http://Localhost:8070/requestTruck/updateStatus/:reqID
// In backend (router)
router.route("/updateStatus/:reqID").put(async(req, res) => {
    const reqID = req.params.reqID;
    const { RequestStatus } = req.body; // just RequestStatus

    try {
        await requestTruck.findOneAndUpdate({ RequestID: reqID }, { RequestStatus });
        res.status(200).send({ status: "Truck request status updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error updating status", error: err.message });
    }
});

module.exports = router;