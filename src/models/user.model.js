const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    id: { type: Number, required: true,length: 9, unique: true },
    photoId: { type: String, required: true },
    incomeSource: {
        type: String,
        enum: ["Employed", "Business Owner", "Self-Employed", "Retired", "Investor", "Other"],
        default: 'Employed',
        required: true,
    },
    email: {type: String, required: true, unique: true},
    password: { type: String, minLength: 8 }
});

const User = mongoose.model("User", userSchema);

module.exports = User;