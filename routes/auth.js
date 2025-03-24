const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use .env file in production

// Singleton class for authentication
class AuthService {
    constructor() {
        if (!AuthService.instance) {
            AuthService.instance = this;
        }
        return AuthService.instance;
    }

    generateToken(user) {
        return jwt.sign(
            { user_id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );
    }
}

const authService = new AuthService();

// **Login Route**
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Compare entered password with stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Generate JWT token
            const token = authService.generateToken(user);

            // Send response with token and role
            res.json({ token, role: user.role, user_id: user._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// **Logout Route (Optional: Token Blacklisting)**
router.post("/logout", (req, res) => {
    // In a real-world app, implement token blacklisting or let the frontend remove the token
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
