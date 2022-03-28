const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: Array,
    },
    desc: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)