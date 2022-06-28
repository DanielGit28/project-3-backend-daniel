const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: [true, "User full name required"] },
    id: {
        type: Number, required: [true, "User id required"], minlength: [9, "Id must be 9 numbers"],
        maxlength: 9, unique: [true, "User id must be unique"]
    },
    photoId: { type: String, required: [true, "User photo url required"]},
    incomeSource: {
        type: String,
        enum: ["Employed", "Business Owner", "Self-Employed", "Retired", "Investor", "Other"],
        default: "Employed",
        required: [true, "User income source required"]
    },
    email: {
        type: String, validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, "Email required"], unique: [true, "User email must be unique"]
    },
    password: { type: String, minLength: [8, "Password must be at least 8 digits long"],required: [true, "User password required"] }
});

const User = mongoose.model("User", userSchema);

module.exports = User;