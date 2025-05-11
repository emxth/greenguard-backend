const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Import the model
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/mailer");
const TempUser = require("../models/tempUser");

// Create new user
router.post("/createuser", async (req, res) => {
    try {

        const { first_name, last_name, created_at, email, password, phone, address, role, stripe_customer_id } = req.body;

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
            // password,
            password: hashedPassword, // Store hashed password
            phone,
            address,
            role,
            stripe_customer_id,
            driverID
        });

        

        await newUser.save();
        res.json({ message: "User added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
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

// POST /user/send-otp
router.post('/send-otp', async (req, res) => {
    const { email, purpose } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    try {
        if (purpose === "signup") {
            // Check if email already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already registered" });
            }

            let tempUser = await TempUser.findOne({ email });
            if (!tempUser) {
                tempUser = new TempUser({ email, otp, otpExpiry });
            } else {
                tempUser.otp = otp;
                tempUser.otpExpiry = otpExpiry;
            }
            await tempUser.save();

        } else if (purpose === "reset") {
            // Check if email exists before sending OTP
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: "User not found" });

            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();

        } else {
            return res.status(400).json({ message: "Invalid purpose" });
        }

        await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);
        res.json({ message: "OTP sent successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

// POST /user/send-password-notification
router.post('/send-password-notification', async (req, res) => {
    const { email, last_name, password_hint, reset_link } = req.body;

    const body = `
        Hi ${last_name},<br><br>
        Your account has been created. Your password is similar to: <b>${password_hint}</b>.
        First four characters of your first name and given last four characters. (e.g. David -> davi9876).</br>
        <br><br>
        To change your password, click the link below:<br>
        <a href="${reset_link}" target="_blank">${reset_link}</a><br><br>
        Thank you!
    `;

    await sendEmail(email, 'Account Created - Password Setup', body);
    res.json({ message: 'Password notification sent' });
});

// POST /user/verify-otp
router.post("/verify-otp", async (req, res) => {
    const { email, otp, purpose } = req.body;

    try {
        if (purpose === "signup") {
            const tempUser = await TempUser.findOne({ email });

            if (!tempUser || tempUser.otp !== otp || tempUser.otpExpiry < new Date()) {
                return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
            }

            await TempUser.deleteOne({ email }); // Clean up
            res.json({ success: true });

        } else if (purpose === "reset") {
            const user = await User.findOne({ email });

            if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
                return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
            }

            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            res.json({ success: true });

        } else {
            return res.status(400).json({ success: false, message: "Invalid purpose" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /user/reset-password
router.put("/reset-password", async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await sendEmail(
            user.email,
            "Your Password Has Been Reset",
            `<p>Hello ${user.first_name || ""},</p><p>Your password has been reset. Your new temporary password is:</p><h2>${newPassword}</h2><p>Please log in and change it immediately.</p>`
        );

        res.json({ success: true, message: "Password reset and emailed" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /user/update-password
router.put("/update-password", async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
});

module.exports = router;