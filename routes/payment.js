const router = require("express").Router();
const { error } = require("console");

// Use created model
const Payment = require("../models/payment");

//http://Localhost:8081/payment/createpayment

// Create operation
router.post("/createpayment", async (req, res) => {
    try {
        const { user_id, payment_method, created_at, amount } = req.body;

        // Ensure `created_at` is a valid Date
        const paymentDate = created_at ? new Date(created_at) : undefined;

        const newPayment = new Payment({
            user_id,
            payment_method,
            created_at: paymentDate,
            amount
        });

        await newPayment.save();
        res.json({ message: "Payment added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all payment information
router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving payments" });
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

// Search Payment by ID (Fixing incorrect model reference)
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

module.exports = router;