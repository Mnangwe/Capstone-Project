const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    products: {
        type: Array
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Cart", cartSchema)