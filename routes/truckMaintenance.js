const router = require("express").Router();

const { error } = require("console");
//use created model
let truckMaintainance = require("../models/truckMaintainance");

//http://Localhost:8081/Maintenance/addTruckCost

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

//http://localhost:8081/Maintenance/getOneCost/:costID
//Get details of one truck request
router.route("/getOneCost/:costID").get(async (req, res) => {
    let costID = req.params.costID;

    await truckMaintainance.findOne({_id: costID }).then((CostInfo) => {
        res.status(200).send({status: "Maintenance cost fetched", CostInfo})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error in server to fetch cost", error: err.message});
    })
})

//http://localhost:8081/Maintenance/updateMaintenanceCost/:costID
//Update truck Info
router.route("/updateMaintenanceCost/:costID").put(async(req, res) => {

    let costID = req.params.costID;
    
    //Destructure method(get updatable records)
    const {Maintenance_Date, maintenance_type, Cost, Description} = req.body;

    //hold new updated records
    const updateMaintenanceCost = {
        Maintenance_Date,
        maintenance_type,
        Cost,
        Description
    }

    const update = await truckMaintainance.findOneAndUpdate({_id: costID}, updateMaintenanceCost).then(() => {
        res.status(200).send({status : "Truck Maintenance Cost updated"});
    }).catch((err) => {
        console.log(err);
        //send error to forntend
        res.status(500).send({status : "Error with updating truck Maintenance cost"});
    })
})

//http://localhost:8081/Maintenance/getAllCosts
//Get all trucks
router.route("/getAllCosts").get((req, res) => {
    truckMaintainance   .find().then((truckCosts) => {
        res.json(truckCosts);
    }).catch((err) => {
        console.log(err);
    })
})

//http://localhost:8081/Maintenance/SearchTruckCosts/:RegNum
router.get("/SearchTruckCosts/:RegNum", async (req, res) => {
    const RegNum = req.params.RegNum;

    try {
        const CostList = await truckMaintainance.find({
            Truck_RegNum: { $regex: new RegExp(RegNum, "i") }
        });

        if (CostList.length > 0) {
            res.status(200).send({ status: "Truck cost(s) found", truckMaintainance: CostList });
        } else {
            res.status(404).send({ status: "No costs found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Server error", error: err.message });
    }
});

//http://localhost:8081/Maintenance/deleteCost
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