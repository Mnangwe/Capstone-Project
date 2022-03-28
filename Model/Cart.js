const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
                unique: true
            },
            
        }
    ]
}, { timestamps: true }
)

module.exports = mongoose.model("Cart", cartSchema)