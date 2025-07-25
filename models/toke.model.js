const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 

    token: {
        type: String,
        required: true,
        unique: true
    }, 

    expiresAt: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    revoked: {
        type: Boolean,
        default: false
    }
});

tokenSchema.index({ expiresAt: 1} , { expiresAfterSeconds: 0});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;