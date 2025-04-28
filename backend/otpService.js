const twilio = require('twilio');

const accountSid = 'ACabcdefghijk';
const authToken = 'o1t2p3';
const twilioPhone = 'YOUR_TWILIO_PHONE_NUMBER'; // Like +123456789

const client = twilio(accountSid, authToken);

const sendOtp = async (phone, otp) => {
    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhone,
        to: `+91${phone}` // Add country code
    });
};

module.exports = sendOtp;
