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

//http://localhost:8080/FuelCost/getAllFuelCost
//Get all trucks
router.route("/getAllFuelCost").get((req, res) => {
    truckFuelCosts.find().then((truckFuelCosts) => {
        res.json(truckFuelCosts);
    }).catch((err) => {
        console.log(err);
    })
})

//http://localhost:8080/FuelCost/deleteFuelCost
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

// Update status
router.put("/updatestatus/:ID", async (req, res) => {
    try {
        let fuelID = req.params.ID;
        
        // Destructure request body
        const { Status } = req.body;

        // Update status in database
        const updatedFuel = await truckFuelCosts.findByIdAndUpdate(
            fuelID, 
            { Status },  // Update only the status field
            { new: true }  // Return the updated document
        );

        if (!updatedFuel) {
            return res.status(404).json({ status: "Error", message: "Truck Fuel Record Not Found" });
        }

        res.status(200).json({ status: "Success", message: "Truck Fuel Status Updated", data: updatedFuel });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Error updating truck fuel status" });
    }
});

module.exports = router;