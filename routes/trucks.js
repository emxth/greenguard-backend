const router = require("express").Router();

const { error } = require("console");
//use created model
let truck = require("../models/trucks");

//http://Localhost:8080/truck/addTruck

//Create operation
router.route("/addTruck").post((req,res) => {
    const RegNumber = req.body.RegNumber;
    const Model = req.body.Model;
    const Capacity = Number(req.body.Capacity);
    const Insurance_Expiry = req.body.Insurance_Expiry;
    const Inspection__date = req.body.Inspection__date;
    const Collection_center_id = Number(req.body.Collection_center_id);
    const driver_id = req.body.driver_id;
    const isActive = Boolean(req.body.isActive);

    const newTruck = new truck({
        RegNumber,
        Model,
        Capacity,
        Insurance_Expiry,
        Inspection__date,
        Collection_center_id,
        driver_id,
        isActive
    })

    newTruck.save().then(() => {
        res.json("Truck added successfully !");
    }).catch((err) => {
        console.log(err);
    })
});

//http://Localhost:8080/truck/
//Get Truck information
router.route("/").get((req, res) => {
    truck.find().then((trucks) => {
        res.json(trucks);
    }).catch((err) => {
        console.log(err);
    })
})

//Update truck Info
router.route("/update/:regNum").put(async(req, res) => {

    let regNum = req.params.regNum;
    
    //Destructure method(get updatable records)
    const {Capacity, Insurance_Expiry, Inspection__date, Collection_center_id, driver_id, isActive} = req.body;

    //hold new updated records
    const updatetruck = {
        Capacity,
        Insurance_Expiry,
        Inspection__date,
        Collection_center_id,
        driver_id,
        isActive
    }

    const update = await truck.findOneAndUpdate({RegNumber: regNum}, updatetruck).then(() => {
        res.status(200).send({status : "Truck updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating truck data"});
    })
})

//Delete Truck 
router.route("/delete/:regNum").delete(async(req, res) =>{
    let regNum = req.params.regNum;

    await truck.findOneAndDelete({RegNumber: regNum }).then(() => {
        res.status(200).send({status: "truck deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to delete", error:err.message});
    })
})

//Get details of one truck
router.route("/get/:regNum").get(async (req, res) => {
    let regNum = req.params.regNum;

    await truck.findOne({RegNumber: regNum }).then((TruckInfo) => {
        res.status(200).send({status: "Truck fetched", TruckInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch truck", error: err.message});
    })
})


//http://Localhost:8080/truck/search/:regNum
//Search Truck
router.route("/search/:regNum").get(async (req, res) => {
    let regNum = req.params.regNum;

    await truck.findOne({ RegNumber: regNum })
        .then((truck) => {
            if (truck) {
                res.status(200).send({ status: "Truck found", truck });
            } else {
                res.status(404).send({ status: "Truck not found" });
            }
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error in server", error: err.message });
        });
});

module.exports = router;