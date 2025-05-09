const express = require("express");
const router = express.Router();
const TempUser = require("../models/tempUser"); // Import the model

// Create new user
router.post("/createtempuser", async (req, res) => {
    try {
        const { email, otp, otpExpiry } = req.body;

        const newTempUser = new TempUser({
            email,
            otp,
            otpExpiry
        });

        await newTempUser.save();
        res.json({ message: "Temporory User added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a user by ID
router.delete("/deleteuser/:userid", async (req, res) => {
    try {
        let userid = req.params.userid; // Correcting the parameter usage
        const deleteuser = await User.findOneAndDelete({ _id: userid });

        if (!deleteuser) {
            return res.status(404).json({ status: "User not found" });
        }

        res.status(200).json({ status: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting user" });
    }
});

module.exports = router;