const router = require("express").Router();

const { error } = require("console");
//use created model
let truckFuelCosts = require("../models/truckFuelCost");

//Create operation
router.route("/addFuelCost").post((req,res) => {
    const Truck_RegNum = req.body.Truck_RegNum;
    const Fuel_Date = req.body.Fuel_Date;
    const FuelType = req.body.FuelType;
    const FuelCost = Number(req.body.FuelCost);
    const Litres = req.body.Litres;
    const Status = req.body.Status;

    const addtruckFuelCost = new truckFuelCosts({
        Truck_RegNum,
        Fuel_Date,
        FuelType,
        FuelCost,
        Litres,
        Status
    })

    addtruckFuelCost.save().then(() => {
        res.json("Truck Fuel Cost added successfully !");
    }).catch((err) => {
        console.log(err);
    })
});

//http://localhost:8081/FuelCost/getOneFuelCost/:costID
//Get details of one truck request
router.route("/getOneFuelCost/:costID").get(async (req, res) => {
    let costID = req.params.costID;

    await truckFuelCosts.findOne({_id: costID }).then((FuelCostInfo) => {
        res.status(200).send({status: "Fuel cost fetched", FuelCostInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch cost", error: err.message});
    })
})

//http://localhost:8081/FuelCost/SearchTruckFuelCosts/:RegNum
router.get("/SearchTruckFuelCosts/:RegNum", async (req, res) => {
    const RegNum = req.params.RegNum;

    try {
        const CostList = await truckFuelCosts.find({
            Truck_RegNum: { $regex: new RegExp(RegNum, "i") }
        });

        if (CostList.length > 0) {
            res.status(200).send({ status: "Truck Fuel cost(s) found", truckFuelCosts: CostList });
        } else {
            res.status(404).send({ status: "No Fuel costs found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Server error", error: err.message });
    }
});

//http://localhost:8081/FuelCost/updateFuelCost/:costID
//Update truck Info
router.route("/updateFuelCost/:costID").put(async(req, res) => {

    let costID = req.params.costID;
    
    //Destructure method(get updatable records)
    const {Fuel_Date, FuelType, FuelCost, Litres} = req.body;

    //hold new updated records
    const updateFuelCost = {
        Fuel_Date,
        FuelType,
        FuelCost,
        Litres
    }

    const update = await truckFuelCosts.findOneAndUpdate({_id: costID}, updateFuelCost).then(() => {
        res.status(200).send({status : "Truck Fuel Cost updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating truck Fuel cost"});
    })
})

//http://localhost:8081/FuelCost/getAllFuelCost
//Get all trucks
router.route("/getAllFuelCost").get((req, res) => {
    truckFuelCosts.find().then((truckFuelCosts) => {
        res.json(truckFuelCosts);
    }).catch((err) => {
        console.log(err);
    })
})


//http://localhost:8081/FuelCost/deleteFuelCost
//delete costs
router.route("/deleteFuelCost/:ID").delete(async(req, res) =>{
    let fuelID = req.params.ID;

    await truckFuelCosts.findOneAndDelete({_id: fuelID }).then(() => {
        res.status(200).send({status: "Fuel Cost deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to delete", error:err.message});
    })
})

module.exports = router;