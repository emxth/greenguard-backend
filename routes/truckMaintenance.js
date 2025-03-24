const router = require("express").Router();
const { error } = require("console");

// Use created model
let truckMaintainance = require("../models/truckMaintainance");

//http://Localhost:8080/Maintenance/addTruckCost

//Create operation
router.route("/addTruckCost").post((req,res) => {
    const Truck_RegNum = req.body.Truck_RegNum;
    const Maintenance_Date = req.body.Maintenance_Date;
    const maintenance_type = req.body.maintenance_type;
    const Cost = Number(req.body.Cost);
    const Description = req.body.Description;
    const Status = req.body.Status;

    const addtruckCost = new truckMaintainance({
        Truck_RegNum,
        Maintenance_Date,
        maintenance_type,
        Cost,
        Description,
        Status
    })

    addtruckCost.save().then(() => {
        res.json("Truck Cost added successfully !");
    }).catch((err) => {
        console.log(err);
    })
});

//http://localhost:8080/Maintenance/getAllCosts
//Get all trucks
router.route("/getAllCosts").get((req, res) => {
    truckMaintainance   .find().then((truckCosts) => {
        res.json(truckCosts);
    }).catch((err) => {
        console.log(err);
    })
})

//http://localhost:8080/Maintenance/deleteCost
//delete costs
router.route("/deleteCost/:ID").delete(async(req, res) =>{
    let maintainID = req.params.ID;

    await truckMaintainance.findOneAndDelete({_id: maintainID }).then(() => {
        res.status(200).send({status: "Cost deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to delete", error:err.message});
    })
})

// Update status
router.put("/updatestatus/:ID", async (req, res) => {
    try {
        let maintainID = req.params.ID;
        
        // Destructure request body
        const { Status } = req.body;

        // Update status in database
        const updatedMaintenance = await truckMaintainance.findByIdAndUpdate(
            maintainID, 
            { Status },  // Update only the status field
            { new: true }  // Return the updated document
        );

        if (!updatedMaintenance) {
            return res.status(404).json({ status: "Error", message: "Truck Maintenance Record Not Found" });
        }

        res.status(200).json({ status: "Success", message: "Truck Maintenance Status Updated", data: updatedMaintenance });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Error updating truck maintenance status" });
    }
});

module.exports = router;