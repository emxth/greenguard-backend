const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Import the model
const bcrypt = require("bcrypt");

// Create new user
router.post("/createuser", async (req, res) => {
    try {
        const { first_name, last_name, created_at, email, password, phone, address, role, stripe_customer_id } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            created_at,
            email,
            // password,
            password: hashedPassword, // Store hashed password
            phone,
            address,
            role,
            stripe_customer_id
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