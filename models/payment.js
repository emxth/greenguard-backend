const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    payment_method: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now // Automatically sets the current date
    },
    amount: {
        type: Number,
        required: true,
        enum: [350.00, 750.00], // Only allows these two values
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
