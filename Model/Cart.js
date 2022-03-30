const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    products: {
        type: Array
    },
    amount: {
        type: Number
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Cart", cartSchema)