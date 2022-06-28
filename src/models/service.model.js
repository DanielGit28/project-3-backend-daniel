const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    bankAccount: {
        type: String,
        validate: {
            validator: function (number) {
                return /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(number);
            },
            message: props => `Account provided to pay for service${props.value} is not a valid IBAN!`
        },
        required: [true, "Bank account required for service"],
    },
    ammount: {
        type: Number, required: [true, "Amount for service is required"], default: 0, minlength: [1, "Ammount must be greater or equal to 1."]
    },
    serviceType: {
        type: String,
        enum: ["Electricity", "Water", "Phone","Internet", "Car insurance","Work insurance","Healt insurance", "Annual driving permit"],
        default: "Electricity",
        message: "{VALUE} for service is not supported",
        required: [true, "Service type required"]
    },
    state: {
        type: String,
        enum: ["Payed","Non-payment","Inactive"],
        default: "Non-payment",
        message: "State {VALUE} for service is not supported",
        required: [true, "State required"]
    },
    user: {
        type: String, validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
            },
            message: props => `${props.value} is not a valid user email for the service!`
        },
        required: [true, "User email required for service"]
    },
    //Debt is the amount of months of debt of the service
    debt: {
        type: Number,  default: 0
    }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;