const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataFields = new Schema({
    label: { type: String, required: true },
    value: String,
    unit: String, 
    standards: {
        green: {
            lessThan: {
                hasEqual: Boolean,
                standard: Number,
            },
            greaterThan: {
                hasEqual: Boolean,
                standard: Number,
            },
        },
        yellow: {
            lessThan: {
                hasEqual: Boolean,
                standard: Number,
            },
            greaterThan: {
                hasEqual: Boolean,
                standard: Number,
            },
        },
        red: {
            lessThan: {
                hasEqual: Boolean,
                standard: Number,
            },
            greaterThan: {
                hasEqual: Boolean,
                standard: Number,
            },
        },
    }
});

DataFields.pre("save", function(next) {
    // Convert label to camel case for the value
    this.value = this.label
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    next();
});

module.exports = mongoose.model("dataFields", DataFields);
