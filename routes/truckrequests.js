const router = require("express").Router();

const { error } = require("console");
//use created model
let truckRequests = require("../models/requestTruck");


//http://Localhost:8080/truckRequest/gettruckRequests
//Get all truck request information
router.route("/gettruckRequests").get((req, res) => {
    truckRequests.find().then((truckReq) => {
        res.json(truckReq);
    }).catch((err) => {
        console.log(err);
    })
})

//http://Localhost:8080/truckRequest/getOnetruckRequests/:reqID
//Get details of one truck request
router.route("/getOnetruckRequests/:reqID").get(async (req, res) => {
    let reqID = req.params.reqID;

    await truckRequests.findOne({RequestID: reqID }).then((RequestInfo) => {
        res.status(200).send({status: "Truck request fetched", RequestInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch truck request", error: err.message});
    })
})

//http://Localhost:8080/truckRequest/updateTRequest/:reqID
//Update truck request Info
router.route("/updateTRequest/:reqID").put(async(req, res) => {

    let reqID = req.params.reqID;
    
    //Destructure method(get updatable records)
    const {Truck_RegNumber, driver_id, RequestStatus} = req.body;

    //hold new updated records
    const updatetruckRequest = {
        Truck_RegNumber,
        driver_id,
        RequestStatus
    }

    const update = await truckRequests.findOneAndUpdate({RequestID: reqID}, updatetruckRequest).then(() => {
        res.status(200).send({status : "Truck Assigned"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with Assigning truck"});
    })
})


module.exports = router;