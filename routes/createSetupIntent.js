const { Router } = require("express");
const User = require("../models/user");

// POST /payment/create-setup-intent
Router.post("/create-setup-intent", async (req, res) => {
    const { user_id } = req.body;

    try {
        const user = await User.findById(user_id);
        if (!user || !user.stripe_customer_id) {
            return res.status(400).json({ error: "User not found or missing Stripe customer ID" });
        }

        const setupIntent = await stripe.setupIntents.create({
            customer: user.stripe_customer_id,
        });

        res.json({ clientSecret: setupIntent.client_secret });
    } catch (err) {
        console.error("Error creating SetupIntent:", err);
        res.status(500).json({ error: "Failed to create SetupIntent" });
    }
});
