const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    address: String,
    gender: String,
    amount: Number,
    paymentId: String,
    orderId: String,
    ticketId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
