const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const path = require("path");
const fs = require('fs'); // ✅ Import 'fs' for file deletion

const Booking = require("./models/Booking");
const { generateTicketPDF, generateTicketId } = require("./utils/generatePDF"); // ✅ Correct import
const sendEmailWithAttachment = require("./utils/sendEmail");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
app.get("/get-razorpay-key", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// API to create order dynamically
app.post("/create-order", async (req, res) => {
    const { name, email, mobile, address, gender } = req.body;
    let amount = 19;
    if (gender === "Female") {
        amount = 19;
    }
    
    try {
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };
        const order = await razorpay.orders.create(options);
        res.json({ order, bookingData: { name, email, mobile, address, gender, amount } });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// API to verify payment & save booking
app.post("/verify-payment", async (req, res) => {
    const { response, bookingData } = req.body;

    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(response.razorpay_order_id + "|" + response.razorpay_payment_id)
        .digest("hex");

    if (generatedSignature === response.razorpay_signature) {
        try {
            // ✅ 1. Generate the 8-digit ticket ID
            const ticketId = generateTicketId();

            // ✅ 2. Save the booking to MongoDB with the new ticketId
            const booking = new Booking({
                ...bookingData,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                ticketId
            });
            await booking.save();

            // ✅ 3. Define a temporary path for the PDF
            const pdfPath = path.join(__dirname, `temp_${ticketId}.pdf`);

            // ✅ 4. Create the PDF and wait for the stream to finish
            await new Promise(resolve => {
                generateTicketPDF(booking, pdfPath);
                resolve();
            });
            
            // ✅ 5. Send the email with the attached PDF
            await sendEmailWithAttachment(booking.email, "Your Event Ticket", "Thank you for your booking! Your ticket is attached.", pdfPath);
            
            // ✅ 6. Clean up the temporary file
            fs.unlink(pdfPath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });

            res.redirect(`/success.html?ticketId=${ticketId}`);

        } catch (err) {
            console.error("Error processing booking and sending email:", err);
            res.status(500).json({ success: false, message: "An error occurred during booking." });
        }
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
    }
});

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));