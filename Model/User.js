const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profile: {
        type: String,
        default:'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png'
    },
    cover: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqZdPM9JLbL-jrKGbav4aU7YPbzE_JjW6EMw&usqp=CAU'
    },
}, { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)