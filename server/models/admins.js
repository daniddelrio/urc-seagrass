const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
    username: { type: String, required: true },
    password: { type: , required: true },

}, { timestamps: true }, );

module.exports = mongoose.model('admin', Admin);