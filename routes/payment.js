const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const User = require("../models/user");
const sendEmail = require("../utils/mailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Add new payment
router.post("/create", async (req, res) => {
    try {
        const { user_id, payment_method, amount } = req.body;

        if (!user_id || !payment_method || amount === undefined) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const parsedAmount = Number(amount);

        if (![350, 750].includes(parsedAmount)) {
            return res.status(400).json({ error: "Invalid amount. Only 350.00 or 750.00 allowed." });
        }

        const newPayment = new Payment({
            user_id,
            payment_method,
            amount: parsedAmount
        });

        await newPayment.save();
        res.status(201).json({ message: "Payment created successfully", payment: newPayment });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get all payments information
router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving payments" });
    }
});

// Delete a payment by ID
router.delete("/deletepayment/:payId", async (req, res) => {
    try {
        let payId = req.params.payId; // Correcting the parameter usage
        const deletedPayment = await Payment.findOneAndDelete({ _id: payId });

        if (!deletedPayment) {
            return res.status(404).json({ status: "Payment not found" });
        }

        res.status(200).json({ status: "Payment deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting payment" });
    }
});

// Get details of a single payment by ID
router.get("/getpayment/:payId", async (req, res) => {
    try {
        let payId = req.params.payId;
        const paymentInfo = await Payment.findOne({ _id: payId });

        if (!paymentInfo) {
            return res.status(404).json({ status: "Payment not found" });
        }

        res.status(200).json({ status: "Payment fetched", paymentInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving payment" });
    }
});

// Search Payment by ID
router.get("/paymentsearch/:payId", async (req, res) => {
    try {
        let payId = req.params.payId;
        const payment = await Payment.findOne({ _id: payId });

        if (!payment) {
            return res.status(404).json({ status: "Payment not found" });
        }

        res.status(200).json({ status: "Payment found", payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error searching for payment" });
    }
});

// Search Payments by User ID
router.get("/userpayment/:user_id", async (req, res) => {
    try {
        let user_id = req.params.user_id;
        const payment = await Payment.find({ user_id: user_id });

        if (!payment) {
            return res.status(404).json({ status: "Payments not found" });
        }

        res.status(200).json({ status: "Payments found", payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error searching for payments" });
    }
});

// POST /create-customer
router.post("/create-customer:user_id", async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // If customer already exists, return it
        if (user.stripe_customer_id) {
            return res.json({ customerId: user.stripe_customer_id });
        }

        // Create new customer on Stripe
        const customer = await stripe.customers.create({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
        });

        // Save Stripe customer ID to user document
        user.stripe_customer_id = customer.id;
        await user.save();

        res.json({ customerId: customer.id });
    } catch (error) {
        console.error("Error creating Stripe customer:", error);
        res.status(500).json({ error: "Failed to create customer" });
    }
});

// POST /payment/create-setup-intent
router.post("/create-setup-intent", async (req, res) => {
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

// GET /payment/saved-cards/:user_id
router.get("/saved-cards/:user_id", async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);

        if (!user || !user.stripe_customer_id) {
            return res.status(404).json({ error: "User not found or no Stripe customer ID" });
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripe_customer_id,
            type: "card",
        });

        res.json({ paymentMethods });
    } catch (err) {
        console.error("Error fetching saved cards:", err);
        res.status(500).json({ error: "Failed to retrieve cards" });
    }
});

// POST /charge-saved
router.post("/charge-saved", async (req, res) => {
    const { user_id, payment_method_id, amount } = req.body;

    try {
        const user = await User.findById(user_id);

        if (!user || !user.stripe_customer_id) {
            return res.status(404).json({ error: "User not found" });
        }

        // Step 1: Create a PaymentIntent using saved card
        const paymentIntent = await stripe.paymentIntents.create({
            customer: user.stripe_customer_id,
            amount: amount * 100, // convert to cents
            currency: "usd",
            payment_method: payment_method_id,
            off_session: true,
            confirm: true,
        });

        // Step 2: Save the payment to the DB
        const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
        const brand = paymentMethod.card.brand;
        const last4 = paymentMethod.card.last4;

        const newPayment = new Payment({
            user_id,
            payment_method: `${brand.toUpperCase()} - **** **** **** ${last4}`,
            amount
        });

        await newPayment.save();

        res.status(200).json({ message: "Charge successful", payment: newPayment });
    } catch (err) {
        if (err.code === 'authentication_required') {
            res.status(402).json({
                error: "Authentication required",
                payment_intent_id: err.raw.payment_intent.id,
            });
        } else {
            console.error("Charge failed:", err);
            res.status(500).json({ error: "Failed to charge saved card" });
        }
    }
});

// DELETE /remove-card
router.delete('/remove-card', async (req, res) => {
    const { user_id, payment_method_id } = req.body;

    try {
        await stripe.paymentMethods.detach(payment_method_id);
        res.send({ message: "Card removed successfully." });
    } catch (err) {
        console.error("Error removing card:", err);
        res.status(500).send({ error: "Failed to remove card." });
    }
});

// POST /send-receipt
router.post('/send-receipt', async (req, res) => {
    const { email, userId, amount, date, method } = req.body;

    const latestPayment = await Payment.findOne().sort({ created_at: -1 });
    const paymentId = latestPayment._id;
    const formattedAmount = (amount * 100 / 100).toFixed(2);
    const formattedDate = new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .receipt-container {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 30px;
                border-top: 4px solid #4CAF50;
            }
            .header {
                text-align: center;
                margin-bottom: 25px;
            }
            .logo {
                color: #4CAF50;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            h1 {
                color: #4CAF50;
                font-size: 22px;
                margin: 10px 0;
            }
            .divider {
                border-top: 1px solid #eee;
                margin: 20px 0;
            }
            .details {
                margin: 25px 0;
            }
            .detail-row {
                display: flex;
                margin-bottom: 12px;
            }
            .detail-label {
                font-weight: bold;
                width: 150px;
                color: #555;
            }
            .detail-value {
                flex: 1;
            }
            .amount {
                font-size: 20px;
                font-weight: bold;
                color: #4CAF50;
                text-align: right;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #777;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <div class="logo">GreenGuard Solutions</div>
                <h1>Payment Receipt</h1>
                <p>Thank you for your payment. Your transaction has been completed successfully.</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="details">
                <div class="detail-row">
                    <div class="detail-label">Payment ID:</div>
                    <div class="detail-value">${paymentId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">User ID:</div>
                    <div class="detail-value">${userId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">${formattedDate}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Payment Method:</div>
                    <div class="detail-value">${method}</div>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="detail-row">
                <div class="detail-label">Amount Paid:</div>
                <div class="detail-value amount">LKR. ${formattedAmount}</div>
            </div>
            
            <div class="footer">
                <p>If you have any questions about this receipt, please contact our support team.</p>
                <p>© ${new Date().getFullYear()} GreenGuard Solutions. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await sendEmail(email, `Your Payment Receipt - LKR. ${formattedAmount}`, html);
        res.status(200).json({ message: 'Receipt sent successfully' });
    } catch (err) {
        console.error('Error sending receipt:', err);
        res.status(500).json({ error: 'Failed to send receipt' });
    }
});

module.exports = router;