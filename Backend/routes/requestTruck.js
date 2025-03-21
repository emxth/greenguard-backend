const router = require("express").Router();

const { error } = require("console");
//use created model
let requestTruck = require("../models/requestTruck");

//http://Localhost:8070/requestTruck/addtruckRequest

//Create operation
router.route("/addtruckRequest").post((req,res) => {
    const RequestID = req.body.RequestID;
    const Truck_RegNumber = req.body.Truck_RegNumber;
    const driver_id = req.body.driver_id;
    const Request_Date = req.body.Request_Date;
    const TruckCapacity = Number(req.body.TruckCapacity);
    const PickupLocation = req.body.PickupLocation;
    const RequestStatus = req.body.RequestStatus;

    const newTruckRequest = new requestTruck({
        RequestID,
        Truck_RegNumber,
        driver_id,
        Request_Date,
        TruckCapacity,
        PickupLocation,
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

//http://Localhost:8070/requestTruck/update/:reqID
//Update truck Info
router.route("/update/:reqID").put(async(req, res) => {

    let reqID = req.params.reqID;
    
    //Destructure method(get updatable records)
    const {Request_Date, TruckCapacity, PickupLocation, Destination} = req.body;

    //hold new updated records
    const updatetruckRequest = {
        Request_Date,
        TruckCapacity,
        PickupLocation,
        PickupLocation,
        Destination
    }

    const updateRequest = await requestTruck.findOneAndUpdate({RequestID: reqID}, updatetruckRequest).then(() => {
        res.status(200).send({status : "Truck Request updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating truck request"});
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

    await requestTruck.findOne({RequestID: reqID }).then((RequestInfo) => {
        res.status(200).send({status: "Truck request fetched", RequestInfo})
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


module.exports = router;