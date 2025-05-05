const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Import the model
const bcrypt = require("bcrypt");


router.post("/createuser", async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            created_at,
            email,
            password,
            phone,
            address,
            role
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        let driverID = null;

        if (role === "driver") {
            // Find the last driver added (sorted by driverID descending)
            const lastDriver = await User.findOne({ role: "driver" })
                .sort({ driverID: -1 }) // This will work if driverID is stored as string "D01", "D02", etc.
                .exec();

            if (lastDriver && lastDriver.driverID) {
                // Extract number part and increment
                const lastIDNum = parseInt(lastDriver.driverID.substring(1)); // remove 'D'
                const newIDNum = lastIDNum + 1;
                driverID = `D${newIDNum.toString().padStart(2, "0")}`; // pad with leading zeros (D01, D02...)
            } else {
                // First driver
                driverID = "D01";
            }
        }

        const newUser = new User({
            first_name,
            last_name,
            created_at,
            email,
            password: hashedPassword,
            phone,
            address,
            role,
            driverID // only gets a value if role === 'driver'
        });

        await newUser.save();
        res.json({ message: "User added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all user information
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving user" });
    }
});

// Get all driver records
router.get("/drivers", async (req, res) => {
    try {
        const drivers = await User.find({ role: "driver" });
        res.json(drivers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving driver records" });
    }
});

// Update user info
router.put("/updateuser/:userid", async (req, res) => {
    try {
        let userid = req.params.userid;
        const { first_name, last_name, created_at, email, password, phone, address, role } = req.body;

        const updateUser = { first_name, last_name, created_at, email, phone, address, role };

        // If a new password is provided, hash it before updating
        if (password) {
            updateUser.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findOneAndUpdate({ _id: userid }, updateUser, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ status: "User not found" });
        }

        res.status(200).json({ status: "User updated", updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error updating user data" });
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

// Get details of a single user by ID
router.get("/getuser/:userid", async (req, res) => {
    try {
        let userid = req.params.userid;
        const userInfo = await User.findOne({ _id: userid });

        if (!userInfo) {
            return res.status(404).json({ status: "User not found" });
        }

        res.status(200).json({ status: "User fetched", userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving user" });
    }
});

// Search User by ID (Fixing incorrect model reference)
router.get("/usersearch/:userid", async (req, res) => {
    try {
        let userid = req.params.userid;
        const user = await User.findOne({ _id: userid });

        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        res.status(200).json({ status: "User found", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error searching for user" });
    }
});

module.exports = router;