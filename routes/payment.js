const express = require("express");
const router = express.Router();
const Payment = require("../models/payment"); // Import the model

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

// Update Payment Info
// router.route("/updatepayment/:payId").put(async(req, res) => {

//     let payId = req.params.payId;
    
//     // Destructure method(get updatable records)
//     const {payment_method, created_at, amount, Collection_center_id, driver_id, isActive} = req.body;

//     //hold new updated records
//     const updatepayments = {
//         payment_method,
//         created_at,
//         amount,
//     }

//     const update = await payment.findOneAndUpdate({_id: payId}, updatepayments).then(() => {
//         res.status(200).send({status : "Payment updated"});
//     }).catch((err) => {
//         console.log(err);
//         // Send error to forntend
//         res.status(500).send({status : "Error with updating payment data"});
//     })
// })

module.exports = router;