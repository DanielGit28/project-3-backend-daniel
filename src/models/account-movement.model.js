import mongoose from"mongoose";

const accountMovementSchema = new mongoose.Schema({
    originAccount: {
        type: String,
        validate: {
            validator: function (number) {
                return /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(number);
            },
            message: props => `${props.value} is not a valid origin account number!`
        },
        required: [true, "Origin account number is required for a movement"],
    },
    destinationAccount: {
        type: String,
        validate: {
            validator: function (number) {
                return /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(number);
            },
            message: props => `${props.value} is not a valid destination account number!`
        },
        required: false,
    },
    currency: {
        type: String,
        enum: ["Dollar", "Colon", "Euro"],
        default: "Colon",
        message: "{VALUE} is not supported",
        required: [true, "Currency required"]
    },
    amount: {
        type: Number, required: [true, "Movement amount required"], minlength: [0.1, "Movement amount needs to be higher than 0,1."]
    },
    movementType: {
        type: String,
        enum: ["Money transfer", "Money insertion", "Service"],
        default: "Money transfer",
        required: [true, "Movement type required."]
    },
    movementDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String, validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
            },
            message: props => `${props.value} is not a valid user email for the service!`
        },
        required: [true, "User email required for service"]
    }

});

const AccountMovement = mongoose.model("AccountMovement", accountMovementSchema);

export default AccountMovement;