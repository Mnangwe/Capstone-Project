const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)