import mongoose from"mongoose";

const bankAccountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        validate: {
            validator: function (number) {
                return /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(number);
            },
            message: props => `${props.value} is not a valid IBAN number!`
        },
        required: [true, "Account number required"],
    },
    accountBalance: {
        type: Number, required: false, default: 0, minlength: [0, "Account balance must be greater or equal to 0."]
    },
    currency: {
        type: String,
        enum: ["Dolar", "Colon", "Euro"],
        default: "Colon",
        message: "{VALUE} is not supported",
        required: [true, "Currency required"]
    },
    user: {
        type: String, validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
            },
            message: props => `${props.value} is not a valid user email!`
        },
        required: [true, "User email required"]
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;