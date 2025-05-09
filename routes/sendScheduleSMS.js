const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Replace with your actual Twilio credentials
const accountSid = 'AC90d8774b3fb384d3be739b73cb0d1fd9';
const authToken = '653e5a183e4934bf422d97759df8e9b9';
const twilioPhone = '+13512477481'; // Example: '+1234567890'

const client = twilio(accountSid, authToken);

// POST endpoint to send SMS
router.post('/send', async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: twilioPhone,
            to
        });

        res.status(200).json({ message: 'SMS sent successfully', sid: result.sid });
    } catch (error) {
        console.error('Twilio Error:', error);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
});

module.exports = router;