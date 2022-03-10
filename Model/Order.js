const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    product: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object, 
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)